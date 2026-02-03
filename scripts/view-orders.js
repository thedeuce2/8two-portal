const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.sqlite');

function viewOrders() {
  const db = new sqlite3.Database(DB_PATH);

  console.log('\n=== Recent Orders ===\n');

  const query = `
    SELECT 
      o.id as order_id,
      o.created_at,
      o.status,
      o.total_amount,
      u.email,
      u.name as user_name,
      org.name as organization_name,
      COUNT(oi.id) as item_count
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN organizations org ON o.organization_id = org.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT 20
  `;

  db.all(query, [], (err, orders) => {
    if (err) {
      console.error('Error fetching orders:', err.message);
      db.close();
      process.exit(1);
    }

    if (orders.length === 0) {
      console.log('No orders found.\n');
      db.close();
      process.exit(0);
    }

    orders.forEach(order => {
      console.log(`Order #${order.order_id}`);
      console.log(`  Date: ${new Date(order.created_at).toLocaleString()}`);
      console.log(`  Customer: ${order.user_name || order.email}`);
      console.log(`  Organization: ${order.organization_name}`);
      console.log(`  Status: ${order.status}`);
      console.log(`  Items: ${order.item_count}`);
      console.log(`  Total: $${parseFloat(order.total_amount).toFixed(2)}`);
      console.log('');
    });

    console.log(`Showing ${orders.length} most recent orders.\n`);
    db.close();
  });
}

// View order details by ID
function viewOrderDetails(orderId) {
  const db = new sqlite3.Database(DB_PATH);

  console.log(`\n=== Order #${orderId} Details ===\n`);

  // Get order info
  db.get(
    `SELECT 
      o.id as order_id,
      o.created_at,
      o.status,
      o.total_amount,
      u.email,
      u.name as user_name,
      org.name as organization_name
     FROM orders o
     JOIN users u ON o.user_id = u.id
     JOIN organizations org ON o.organization_id = org.id
     WHERE o.id = ?`,
    [orderId],
    (err, order) => {
      if (err || !order) {
        console.error('Order not found.\n');
        db.close();
        process.exit(1);
      }

      console.log(`Order #${order.order_id}`);
      console.log(`Date: ${new Date(order.created_at).toLocaleString()}`);
      console.log(`Customer: ${order.user_name || order.email}`);
      console.log(`Organization: ${order.organization_name}`);
      console.log(`Status: ${order.status}`);
      console.log('');

      // Get order items
      db.all(
        `SELECT 
          i.name as item_name,
          v.size,
          v.color,
          oi.qty,
          oi.custom_name,
          oi.custom_number,
          oi.unit_price,
          oi.line_total
         FROM order_items oi
         JOIN items i ON oi.item_id = i.id
         JOIN item_variants v ON oi.item_variant_id = v.id
         WHERE oi.order_id = ?`,
        [orderId],
        (err, items) => {
          if (err) {
            console.error('Error fetching order items:', err.message);
            db.close();
            process.exit(1);
          }

          console.log('Items:');
          items.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.item_name}`);
            console.log(`     Size: ${item.size}${item.color ? ' - ' + item.color : ''}`);
            console.log(`     Quantity: ${item.qty}`);
            if (item.custom_name) console.log(`     Custom Name: ${item.custom_name}`);
            if (item.custom_number) console.log(`     Custom Number: ${item.custom_number}`);
            console.log(`     Price: $${parseFloat(item.unit_price).toFixed(2)} each`);
            console.log(`     Line Total: $${parseFloat(item.line_total).toFixed(2)}`);
            console.log('');
          });

          console.log(`Order Total: $${parseFloat(order.total_amount).toFixed(2)}\n`);
          db.close();
        }
      );
    }
  );
}

// Run if executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length > 0 && !isNaN(parseInt(args[0]))) {
    viewOrderDetails(parseInt(args[0]));
  } else {
    viewOrders();
  }
}

module.exports = { viewOrders, viewOrderDetails };