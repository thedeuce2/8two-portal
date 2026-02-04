const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Use DATA_DIR if provided (e.g., /data on Render), otherwise current directory
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DB_PATH = path.join(DATA_DIR, 'db.sqlite');

// Ensure DATA_DIR exists (should exist already for Render disk, but safe)
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database at', DB_PATH);
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: '8two-apparel-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,            // same behavior locally and on Render
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Logged-in check
function requireAuth(req, res, next) {
  if (req.session.userId) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// File upload storage config (under DATA_DIR/uploads)
const uploadDir = path.join(DATA_DIR, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, Date.now() + '-' + safeName);
  }
});

const upload = multer({ storage });

// Serve uploaded images
app.use('/uploads', express.static(uploadDir));

/* ======================
   AUTH ROUTES
====================== */

// Login
app.post('/api/login', (req, res) => {
  let { email, password } = req.body;
  email = (email || '').trim();
  password = (password || '').trim();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get(
    'SELECT id, email, password_hash, name FROM users WHERE email = ?',
    [email],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!user) return res.status(401).json({ error: 'Invalid email or password' });

      bcrypt.compare(password, user.password_hash, (err, isValid) => {
        if (err) return res.status(500).json({ error: 'Authentication error' });
        if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });

        req.session.userId = user.id;
        req.session.userName = user.name;
        req.session.userEmail = user.email;

        res.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        });
      });
    }
  );
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ success: true });
  });
});

// Auth check INCLUDING is_admin from DB
app.get('/api/check-auth', (req, res) => {
  if (!req.session.userId) {
    return res.json({ authenticated: false });
  }

  db.get(
    'SELECT is_admin FROM users WHERE id = ?',
    [req.session.userId],
    (err, row) => {
      if (err || !row) {
        return res.json({ authenticated: false });
      }
      res.json({
        authenticated: true,
        user: {
          id: req.session.userId,
          email: req.session.userEmail,
          name: req.session.userName,
          is_admin: row.is_admin === 1
        }
      });
    }
  );
});

/* ======================
   CUSTOMER API
====================== */

app.get('/api/organizations', requireAuth, (req, res) => {
  db.all(
    'SELECT id, name, description FROM organizations ORDER BY name',
    [],
    (err, organizations) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(organizations);
    }
  );
});

app.get('/api/organizations/:id/items', requireAuth, (req, res) => {
  const orgId = req.params.id;

  db.all(
    `SELECT 
      i.id, 
      i.organization_id, 
      i.name, 
      i.description, 
      i.base_price, 
      i.image_url, 
      i.allow_name, 
      i.allow_number
     FROM items i
     WHERE i.organization_id = ?
     ORDER BY i.name`,
    [orgId],
    (err, items) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      let itemsProcessed = 0;
      const itemsWithVariants = items.map(item => ({
        ...item,
        allow_name: item.allow_name === 1,
        allow_number: item.allow_number === 1,
        variants: []
      }));

      if (items.length === 0) {
        return res.json(itemsWithVariants);
      }

      itemsWithVariants.forEach(item => {
        db.all(
          'SELECT id, size, color, additional_price FROM item_variants WHERE item_id = ? ORDER BY size',
          [item.id],
          (err, variants) => {
            if (err) {
              console.error(`Error fetching variants for item ${item.id}:`, err);
            } else {
              item.variants = variants;
            }

            itemsProcessed++;
            if (itemsProcessed === items.length) {
              res.json(itemsWithVariants);
            }
          }
        );
      });
    }
  );
});

app.post('/api/orders', requireAuth, (req, res) => {
  const { organization_id, items: cartItems } = req.body;
  const userId = req.session.userId;

  if (!organization_id || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  for (const item of cartItems) {
    if (!item.item_id || !item.variant_id || !item.qty || item.qty < 1) {
      return res.status(400).json({ error: 'Invalid item data in cart' });
    }
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.get(
      'SELECT id FROM organizations WHERE id = ?',
      [organization_id],
      (err, org) => {
        if (err || !org) {
          db.run('ROLLBACK');
          return res.status(400).json({ error: 'Invalid organization' });
        }

        let totalAmount = 0;
        let itemsValidated = 0;
        const validatedItems = [];

        cartItems.forEach((cartItem, index) => {
          db.get(
            `SELECT 
              i.base_price, 
              v.additional_price,
              i.allow_name,
              i.allow_number
             FROM items i
             JOIN item_variants v ON i.id = v.item_id
             WHERE i.id = ? AND v.id = ?`,
            [cartItem.item_id, cartItem.variant_id],
            (err, itemData) => {
              if (err || !itemData) {
                db.run('ROLLBACK');
                return res.status(400).json({ error: `Invalid item or variant at position ${index + 1}` });
              }

              if (cartItem.custom_name && !itemData.allow_name) {
                db.run('ROLLBACK');
                return res.status(400).json({ error: `Custom name not allowed for item at position ${index + 1}` });
              }

              if (cartItem.custom_number && !itemData.allow_number) {
                db.run('ROLLBACK');
                return res.status(400).json({ error: `Custom number not allowed for item at position ${index + 1}` });
              }

              const unitPrice = parseFloat(itemData.base_price) + parseFloat(itemData.additional_price);
              const lineTotal = unitPrice * parseInt(cartItem.qty);
              totalAmount += lineTotal;

              validatedItems.push({
                ...cartItem,
                unit_price: unitPrice,
                line_total: lineTotal
              });

              itemsValidated++;
              
              if (itemsValidated === cartItems.length) {
                db.run(
                  `INSERT INTO orders (user_id, organization_id, status, total_amount) 
                   VALUES (?, ?, 'pending', ?)`,
                  [userId, organization_id, totalAmount.toFixed(2)],
                  function(err) {
                    if (err) {
                      db.run('ROLLBACK');
                      return res.status(500).json({ error: 'Failed to create order' });
                    }

                    const orderId = this.lastID;
                    let orderItemsInserted = 0;

                    validatedItems.forEach(validatedItem => {
                      db.run(
                        `INSERT INTO order_items 
                         (order_id, item_id, item_variant_id, qty, custom_name, custom_number, unit_price, line_total)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                          orderId,
                          validatedItem.item_id,
                          validatedItem.variant_id,
                          validatedItem.qty,
                          validatedItem.custom_name || null,
                          validatedItem.custom_number || null,
                          validatedItem.unit_price.toFixed(2),
                          validatedItem.line_total.toFixed(2)
                        ],
                        (err) => {
                          if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Failed to create order items' });
                          }

                          orderItemsInserted++;
                          if (orderItemsInserted === validatedItems.length) {
                            db.run('COMMIT');
                            res.json({
                              success: true,
                              order_id: orderId,
                              total_amount: totalAmount.toFixed(2)
                            });
                          }
                        }
                      );
                    });
                  }
                );
              }
            }
          );
        });
      }
    );
  });
});

/* ======================
   ADMIN API (any logged-in user)
====================== */

app.get('/api/admin/organizations', requireAuth, (req, res) => {
  db.all(
    'SELECT id, name FROM organizations ORDER BY name',
    [],
    (err, orgs) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(orgs);
    }
  );
});

app.get('/api/admin/items', requireAuth, (req, res) => {
  const sql = `
    SELECT i.id, i.name, i.description, i.base_price, i.image_url,
           i.allow_name, i.allow_number,
           o.id AS organization_id, o.name AS organization_name
    FROM items i
    JOIN organizations o ON i.organization_id = o.id
    ORDER BY o.name, i.name
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Upload item image
app.post('/api/admin/upload-image', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, image_url: imageUrl });
});

// Create new org
app.post('/api/admin/organizations', requireAuth, (req, res) => {
  const { name, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Organization name is required' });
  }

  db.run(
    'INSERT INTO organizations (name, description) VALUES (?, ?)',
    [name.trim(), description || ''],
    function (err) {
      if (err) {
        if (err.message && err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'An organization with that name already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Create item
app.post('/api/admin/items', requireAuth, (req, res) => {
  const {
    organization_id,
    name,
    description,
    base_price,
    image_url,
    allow_name,
    allow_number
  } = req.body;

  if (!organization_id || !name || !base_price) {
    return res.status(400).json({ error: 'organization_id, name, and base_price are required' });
  }

  db.run(
    `INSERT INTO items 
     (organization_id, name, description, base_price, image_url, allow_name, allow_number)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      organization_id,
      name,
      description || '',
      base_price,
      image_url || '',
      allow_name ? 1 : 0,
      allow_number ? 1 : 0
    ],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Update item
app.put('/api/admin/items/:id', requireAuth, (req, res) => {
  const itemId = req.params.id;
  const {
    organization_id,
    name,
    description,
    base_price,
    image_url,
    allow_name,
    allow_number
  } = req.body;

  if (!organization_id || !name || !base_price) {
    return res.status(400).json({ error: 'organization_id, name, and base_price are required' });
  }

  db.run(
    `UPDATE items
     SET organization_id = ?, name = ?, description = ?, base_price = ?, image_url = ?, allow_name = ?, allow_number = ?
     WHERE id = ?`,
    [
      organization_id,
      name,
      description || '',
      base_price,
      image_url || '',
      allow_name ? 1 : 0,
      allow_number ? 1 : 0,
      itemId
    ],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json({ success: true });
    }
  );
});

// Delete item (and its variants)
app.delete('/api/admin/items/:id', requireAuth, (req, res) => {
  const itemId = req.params.id;

  db.serialize(() => {
    // Delete variants for this item
    db.run('DELETE FROM item_variants WHERE item_id = ?', [itemId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete variants' });
      }

      // Delete the item itself
      db.run('DELETE FROM items WHERE id = ?', [itemId], function (err2) {
        if (err2) {
          return res.status(500).json({ error: 'Failed to delete item' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ success: true });
      });
    });
  });
});

// Delete organization (and all its items + variants)
app.delete('/api/admin/organizations/:id', requireAuth, (req, res) => {
  const orgId = req.params.id;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Find items for this org
    db.all('SELECT id FROM items WHERE organization_id = ?', [orgId], (err, items) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to fetch items for organization' });
      }

      const itemIds = items.map(i => i.id);

      // Delete variants for all items
      if (itemIds.length > 0) {
        const placeholders = itemIds.map(() => '?').join(',');
        db.run(
          `DELETE FROM item_variants WHERE item_id IN (${placeholders})`,
          itemIds,
          (errVar) => {
            if (errVar) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Failed to delete item variants' });
            }

            // Delete items
            db.run(
              `DELETE FROM items WHERE id IN (${placeholders})`,
              itemIds,
              (errItems) => {
                if (errItems) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: 'Failed to delete items' });
                }

                // Finally delete org
                db.run(
                  'DELETE FROM organizations WHERE id = ?',
                  [orgId],
                  function (errOrg) {
                    if (errOrg) {
                      db.run('ROLLBACK');
                      return res.status(500).json({ error: 'Failed to delete organization' });
                    }
                    if (this.changes === 0) {
                      db.run('ROLLBACK');
                      return res.status(404).json({ error: 'Organization not found' });
                    }
                    db.run('COMMIT');
                    res.json({ success: true });
                  }
                );
              }
            );
          }
        );
      } else {
        // No items; just delete org
        db.run(
          'DELETE FROM organizations WHERE id = ?',
          [orgId],
          function (errOrg) {
            if (errOrg) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Failed to delete organization' });
            }
            if (this.changes === 0) {
              db.run('ROLLBACK');
              return res.status(404).json({ error: 'Organization not found' });
            }
            db.run('COMMIT');
            res.json({ success: true });
          }
        );
      }
    });
  });
});

/* ======================
   PAGE ROUTES
====================== */

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/profile.html', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/order.html', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'order.html'));
});

app.get('/admin.html', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

/* ======================
   ERROR HANDLING
====================== */

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

/* ======================
   START SERVER
====================== */

app.listen(PORT, () => {
  console.log('\n=================================');
  console.log('8two Apparel Ordering Portal');
  console.log('=================================');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`DB at ${DB_PATH}`);
  console.log(`Uploads at ${uploadDir}`);
  console.log('Press Ctrl+C to stop');
  console.log('=================================\n');
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    process.exit(0);
  });
});
