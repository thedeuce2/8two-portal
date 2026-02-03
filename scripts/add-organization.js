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

async function addOrganization() {
  console.log('\n=== Add New Organization ===\n');

  try {
    const name = await question('Enter organization name: ');
    const description = await question('Enter description (optional): ');

    if (!name) {
      console.error('\n✗ Organization name is required\n');
      rl.close();
      process.exit(1);
    }

    const db = new sqlite3.Database(DB_PATH);

    // Insert organization
    db.run(
      `INSERT INTO organizations (name, description) VALUES (?, ?)`,
      [name, description || null],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            console.error('\n✗ Organization with this name already exists\n');
          } else {
            console.error('\n✗ Error adding organization:', err.message, '\n');
          }
        } else {
          console.log(`\n✓ Organization added successfully!`);
          console.log(`  ID: ${this.lastID}`);
          console.log(`  Name: ${name}`);
          console.log(`  Description: ${description || 'Not specified'}\n`);
          console.log(`You can now add items to this organization.\n`);
        }

        db.close();
        rl.close();
      }
    );
  } catch (error) {
    console.error('\n✗ Error:', error.message, '\n');
    rl.close();
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  addOrganization();
}

module.exports = { addOrganization };