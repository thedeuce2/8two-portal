const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.sqlite');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Drop existing tables (for clean initialization)
    db.run('DROP TABLE IF EXISTS order_items');
    db.run('DROP TABLE IF EXISTS orders');
    db.run('DROP TABLE IF EXISTS item_variants');
    db.run('DROP TABLE IF EXISTS items');
    db.run('DROP TABLE IF EXISTS organizations');
    db.run('DROP TABLE IF EXISTS users');

    // Create users table
db.run(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error creating users table:', err.message);
  } else {
    console.log('✓ Users table created');
  }
});

    // Create organizations table
    db.run(`
      CREATE TABLE organizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating organizations table:', err.message);
      } else {
        console.log('✓ Organizations table created');
      }
    });

    // Create items table
    db.run(`
      CREATE TABLE items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        organization_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        base_price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        allow_name BOOLEAN DEFAULT 0,
        allow_number BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organizations(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating items table:', err.message);
      } else {
        console.log('✓ Items table created');
      }
    });

    // Create item_variants table
    db.run(`
      CREATE TABLE item_variants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        size TEXT NOT NULL,
        color TEXT,
        additional_price DECIMAL(10,2) DEFAULT 0.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES items(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating item_variants table:', err.message);
      } else {
        console.log('✓ Item variants table created');
      }
    });

    // Create orders table
    db.run(`
      CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        organization_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        total_amount DECIMAL(10,2),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (organization_id) REFERENCES organizations(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating orders table:', err.message);
      } else {
        console.log('✓ Orders table created');
      }
    });

    // Create order_items table
    db.run(`
      CREATE TABLE order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        item_variant_id INTEGER NOT NULL,
        qty INTEGER NOT NULL,
        custom_name TEXT,
        custom_number TEXT,
        unit_price DECIMAL(10,2),
        line_total DECIMAL(10,2),
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (item_id) REFERENCES items(id),
        FOREIGN KEY (item_variant_id) REFERENCES item_variants(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating order_items table:', err.message);
      } else {
        console.log('✓ Order items table created');
      }
    });
  });
}

// Seed sample data
function seedData() {
  setTimeout(() => {
    db.serialize(() => {
      // Insert test user
      bcrypt.hash('password123', 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err.message);
          return;
        }
          db.run(
    `INSERT INTO users (email, password_hash, name, is_admin) VALUES (?, ?, ?, 1)`,
    ['test@8two.com', hash, 'Test User'],
          (err) => {
            if (err) {
              console.error('Error inserting test user:', err.message);
            } else {
              console.log('✓ Test user created (test@8two.com / password123)');
            }
          }
        );
      });

      // Insert sample organization
      db.run(
        `INSERT INTO organizations (name, description) VALUES (?, ?)`,
        ['Eastview Soccer Club', 'Youth soccer club serving Eastview community since 2010'],
        function(err) {
          if (err) {
            console.error('Error inserting organization:', err.message);
          } else {
            console.log('✓ Sample organization created: Eastview Soccer Club');
            
            const orgId = this.lastID;

            // Insert sample items
            const items = [
              {
                name: 'Home Jersey',
                description: 'Official home game jersey with team colors',
                base_price: 45.00,
                allow_name: true,
                allow_number: true,
                variants: ['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL']
              },
              {
                name: 'Away Jersey',
                description: 'Official away game jersey',
                base_price: 45.00,
                allow_name: true,
                allow_number: true,
                variants: ['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL']
              },
              {
                name: 'Training Tee',
                description: 'Lightweight training t-shirt',
                base_price: 25.00,
                allow_name: false,
                allow_number: false,
                variants: ['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2XL']
              },
              {
                name: 'Hoodie',
                description: 'Warm hoodie for practices and games',
                base_price: 55.00,
                allow_name: true,
                allow_number: false,
                variants: ['S', 'M', 'L', 'XL', '2XL']
              }
            ];

            items.forEach((item, index) => {
              db.run(
                `INSERT INTO items (organization_id, name, description, base_price, allow_name, allow_number) VALUES (?, ?, ?, ?, ?, ?)`,
                [orgId, item.name, item.description, item.base_price, item.allow_name ? 1 : 0, item.allow_number ? 1 : 0],
                function(err) {
                  if (err) {
                    console.error(`Error inserting item ${item.name}:`, err.message);
                  } else {
                    console.log(`✓ Item created: ${item.name}`);
                    const itemId = this.lastID;

                    // Insert variants for this item
                    item.variants.forEach(size => {
                      db.run(
                        `INSERT INTO item_variants (item_id, size, additional_price) VALUES (?, ?, 0.00)`,
                        [itemId, size],
                        (err) => {
                          if (err) {
                            console.error(`Error inserting variant ${size} for ${item.name}:`, err.message);
                          }
                        }
                      );
                    });
                    console.log(`  ✓ ${item.variants.length} size variants added`);
                  }
                }
              );
            });
          }
        }
      );
    });
  }, 1000); // Wait for tables to be created
}

// Run initialization
initializeDatabase();
seedData();

// Close database connection after seeding
setTimeout(() => {
  console.log('\n✓ Database initialization complete!');
  console.log('✓ Database file created at:', DB_PATH);
  console.log('\nYou can now start the server with: node server.js');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
  });
}, 3000);