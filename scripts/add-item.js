const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const readline = require('readline');

const DB_PATH = path.join(__dirname, '..', 'db.sqlite');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function listOrganizations(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, name FROM organizations ORDER BY name', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function addItem() {
  console.log('\n=== Add New Item ===\n');

  const db = new sqlite3.Database(DB_PATH);

  try {
    // List organizations
    const orgs = await listOrganizations(db);
    if (orgs.length === 0) {
      console.error('\n✗ No organizations found. Please add an organization first.\n');
      db.close();
      rl.close();
      process.exit(1);
    }

    console.log('Available organizations:');
    orgs.forEach(org => {
      console.log(`  ${org.id}. ${org.name}`);
    });

    const orgIdAnswer = await question('\nSelect organization ID: ');
    const orgId = parseInt(orgIdAnswer);

    const selectedOrg = orgs.find(o => o.id === orgId);
    if (!selectedOrg) {
      console.error('\n✗ Invalid organization ID\n');
      db.close();
      rl.close();
      process.exit(1);
    }

    const name = await question('Enter item name: ');
    const description = await question('Enter description (optional): ');
    const priceAnswer = await question('Enter base price (e.g., 45.00): ');
    const allowNameAnswer = await question('Allow custom name? (y/n): ');
    const allowNumberAnswer = await question('Allow custom number? (y/n): ');

    if (!name || !priceAnswer) {
      console.error('\n✗ Item name and price are required\n');
      db.close();
      rl.close();
      process.exit(1);
    }

    const basePrice = parseFloat(priceAnswer);
    if (isNaN(basePrice) || basePrice <= 0) {
      console.error('\n✗ Invalid price\n');
      db.close();
      rl.close();
      process.exit(1);
    }

    const allowName = allowNameAnswer.toLowerCase() === 'y' || allowNameAnswer.toLowerCase() === 'yes';
    const allowNumber = allowNumberAnswer.toLowerCase() === 'y' || allowNumberAnswer.toLowerCase() === 'yes';

    console.log('\nCommon sizes: YS, YM, YL, S, M, L, XL, 2XL');
    const sizesAnswer = await question('Enter sizes (comma-separated, e.g., S,M,L,XL): ');
    
    if (!sizesAnswer) {
      console.error('\n✗ At least one size is required\n');
      db.close();
      rl.close();
      process.exit(1);
    }

    const sizes = sizesAnswer.split(',').map(s => s.trim().toUpperCase()).filter(s => s);

    // Insert item
    db.run(
      `INSERT INTO items (organization_id, name, description, base_price, allow_name, allow_number) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orgId, name, description || null, basePrice.toFixed(2), allowName ? 1 : 0, allowNumber ? 1 : 0],
      function(err) {
        if (err) {
          console.error('\n✗ Error adding item:', err.message, '\n');
          db.close();
          rl.close();
          process.exit(1);
        }

        const itemId = this.lastID;

        // Insert variants
        let variantsAdded = 0;
        sizes.forEach(size => {
          db.run(
            `INSERT INTO item_variants (item_id, size, additional_price) VALUES (?, ?, 0.00)`,
            [itemId, size],
            (err) => {
              if (err) {
                console.error(`\n✗ Error adding variant ${size}:`, err.message);
              } else {
                variantsAdded++;
              }

              if (variantsAdded === sizes.length) {
                console.log(`\n✓ Item added successfully!`);
                console.log(`  ID: ${itemId}`);
                console.log(`  Organization: ${selectedOrg.name}`);
                console.log(`  Name: ${name}`);
                console.log(`  Description: ${description || 'Not specified'}`);
                console.log(`  Base Price: $${basePrice.toFixed(2)}`);
                console.log(`  Allow Name: ${allowName ? 'Yes' : 'No'}`);
                console.log(`  Allow Number: ${allowNumber ? 'Yes' : 'No'}`);
                console.log(`  Sizes: ${sizes.join(', ')}\n`);
                
                db.close();
                rl.close();
              }
            }
          );
        });
      }
    );
  } catch (error) {
    console.error('\n✗ Error:', error.message, '\n');
    db.close();
    rl.close();
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  addItem();
}

module.exports = { addItem };