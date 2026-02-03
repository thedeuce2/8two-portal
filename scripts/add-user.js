const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
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

async function addUser() {
  console.log('\n=== Add New User ===\n');

  try {
    const email = await question('Enter email: ');
    const password = await question('Enter password: ');
    const name = await question('Enter full name (optional): ');

    if (!email || !password) {
      console.error('\n✗ Email and password are required\n');
      rl.close();
      process.exit(1);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('\n✗ Invalid email format\n');
      rl.close();
      process.exit(1);
    }

    const db = new sqlite3.Database(DB_PATH);

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert user
    db.run(
      `INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`,
      [email, hash, name || null],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            console.error('\n✗ User with this email already exists\n');
          } else {
            console.error('\n✗ Error adding user:', err.message, '\n');
          }
        } else {
          console.log(`\n✓ User added successfully!`);
          console.log(`  ID: ${this.lastID}`);
          console.log(`  Email: ${email}`);
          console.log(`  Name: ${name || 'Not specified'}\n`);
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
  addUser();
}

module.exports = { addUser };