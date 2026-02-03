# 8two Apparel Ordering Portal

A simple, production-ready private ordering portal for 8two Apparel customers. This application allows customers to browse pre-designed items, select sizes and quantities, add custom names/numbers (where applicable), and submit orders.

## Features

- **Secure Login**: Email/password authentication with session management
- **Organization-Based Ordering**: Customers select their organization to view available items
- **Product Catalog**: Browse items with descriptions, prices, and size variants
- **Customization Support**: Add custom names and numbers to items when allowed
- **Shopping Cart**: Add items, review order, and calculate totals
- **Order Submission**: Submit orders for manual processing and invoicing
- **Admin Tools**: Easy command-line scripts to manage users, organizations, and items

## Technology Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (file-based, simple and portable)
- **Frontend**: Plain HTML, CSS, and JavaScript (no frameworks)
- **Security**: bcrypt for password hashing, express-session for session management

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone or download this repository** to your local machine

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize the database**:
   ```bash
   npm run init-db
   ```
   
   This will create a `db.sqlite` file with all necessary tables and seed data including:
   - Test user: `test@8two.com` / `password123`
   - Sample organization: Eastview Soccer Club
   - Sample items with multiple size variants

## Running the Application

### Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### Access the Application

1. Open your web browser and go to `http://localhost:3000`
2. Log in with the test account:
   - Email: `test@8two.com`
   - Password: `password123`

### Place a Test Order

1. After logging in, select "Eastview Soccer Club" from the dropdown
2. Browse the available items (Home Jersey, Away Jersey, Training Tee, Hoodie)
3. For an item:
   - Select a size from the dropdown
   - Enter quantity
   - Optionally add custom name/number (if the item allows it)
   - Click "Add to Order"
4. Review your cart in the Order Summary panel on the right
5. Click "Submit Order" when ready
6. You'll see a confirmation with your Order ID

## Managing Data

### Adding New Users

Use the provided script to add new users:

```bash
node scripts/add-user.js
```

You'll be prompted for:
- Email (required)
- Password (required)
- Full name (optional)

Example:
```
Enter email: customer@example.com
Enter password: SecurePassword123
Enter full name (optional): John Smith
```

### Adding New Organizations

Add organizations that will have their own product catalogs:

```bash
node scripts/add-organization.js
```

You'll be prompted for:
- Organization name (required)
- Description (optional)

Example:
```
Enter organization name: Westside High School
Enter description (optional): Varsity sports teams
```

### Adding New Items

Add items to an existing organization with size variants:

```bash
node scripts/add-item.js
```

You'll be prompted for:
- Organization ID (select from list)
- Item name (required)
- Description (optional)
- Base price (required, e.g., 45.00)
- Allow custom name? (y/n)
- Allow custom number? (y/n)
- Sizes (comma-separated, e.g., S,M,L,XL)

Example:
```
Available organizations:
  1. Eastview Soccer Club
  2. Westside High School

Select organization ID: 2
Enter item name: Varsity Jacket
Enter description (optional): Official varsity letter jacket
Enter base price (e.g., 45.00): 120.00
Allow custom name? (y/n): y
Allow custom number? (y/n): y
Enter sizes (comma-separated, e.g., S,M,L,XL): S,M,L,XL,2XL
```

### Viewing Orders

View recent orders:

```bash
node scripts/view-orders.js
```

View details of a specific order:

```bash
node scripts/view-orders.js <order_id>
```

Example:
```bash
node scripts/view-orders.js 1
```

## Project Structure

```
8two-apparel-ordering-portal/
├── server.js              # Main Express server
├── init-db.js            # Database initialization script
├── package.json          # Project dependencies
├── db.sqlite             # SQLite database (created after init)
├── public/               # Frontend files
│   ├── index.html        # Login page
│   ├── order.html        # Ordering page
│   ├── style.css         # Styles
│   ├── app.js            # Frontend JavaScript
│   └── logo.jpg          # Company logo
├── scripts/              # Admin management scripts
│   ├── add-user.js       # Add new users
│   ├── add-organization.js  # Add new organizations
│   ├── add-item.js       # Add items with variants
│   └── view-orders.js    # View order history
└── README.md             # This file
```

## Deployment

### Deploying to Render (Recommended)

Render is a simple, affordable platform for hosting Node.js applications.

#### Prerequisites

- A [Render](https://render.com) account (free tier available)
- Git installed on your computer

#### Steps

1. **Prepare your code for deployment**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to GitHub.com and create a new repository
   - Push your code to GitHub:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/8two-apparel-portal.git
     git branch -M main
     git push -u origin main
     ```

3. **Create a new Render Web Service**:
   - Log in to Render
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `8two-apparel-portal` (or your preferred name)
     - **Region**: Choose the nearest region
     - **Branch**: `main`
     - **Runtime**: `Node`
     - **Build Command**: `npm install && npm run init-db`
     - **Start Command**: `npm start`
     - **Instance Type**: Free (for testing) or Standard ($7/month)
   
4. **Set up persistent storage** (IMPORTANT for SQLite):
   - Render's free tier doesn't include persistent storage
   - For production, you should use a PostgreSQL database instead
   - To switch to PostgreSQL, modify the database configuration in `server.js`
   
   **Alternative**: Keep SQLite but understand that:
   - The database will be reset each time the service restarts (free tier)
   - For persistence, you'll need Render's Disk add-on ($5/month)
   - Add a disk in Render and set the `DATA_DIR` environment variable

5. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy your application
   - Wait for the deployment to complete (usually 2-5 minutes)

6. **Access your application**:
   - Render will provide a URL like `https://8two-apparel-portal.onrender.com`
   - Open this URL in your browser to access your ordering portal

#### Environment Variables (Optional)

You can set these in Render's dashboard under "Environment":

- `PORT`: Port number (default: 3000, Render sets this automatically)
- `NODE_ENV`: Set to `production` for production deployment
- `SESSION_SECRET`: Change the default session secret for better security

### Alternative: Railway

Railway is another simple option for deployment:

1. Create a Railway account at [railway.app](https://railway.app)
2. Install Railway CLI: `npm install -g @railway/cli`
3. Login: `railway login`
4. Initialize project: `railway init`
5. Add PostgreSQL database: `railway add postgresql`
6. Deploy: `railway up`

### Alternative: VPS (DigitalOcean, Linode, etc.)

If you prefer more control and a traditional VPS:

1. Get a VPS (DigitalOcean Droplets start at $4/month)
2. Install Node.js and npm
3. Upload your files via FTP or Git
4. Install dependencies: `npm install`
5. Initialize database: `npm run init-db`
6. Run the server: `npm start`
7. Set up a process manager like PM2 to keep it running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "8two-portal"
   pm2 startup
   pm2 save
   ```
8. Set up Nginx as a reverse proxy (optional but recommended)
9. Configure SSL with Let's Encrypt (free SSL certificates)

## Security Notes

- **Passwords**: All passwords are hashed using bcrypt before storage
- **Sessions**: User sessions are managed with express-session
- **Session Secret**: Change the secret in `server.js` for production
- **HTTPS**: Always use HTTPS in production (Render provides this automatically)
- **Input Validation**: All inputs are validated on both frontend and backend
- **SQL Injection**: Parameterized queries are used throughout

## Customization

### Changing the Logo

Replace `public/logo.jpg` with your own logo file. The current logo is your provided 8two Apparel logo.

### Modifying Colors

Edit the CSS variables in `public/style.css`:

```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #34495e;
  --accent-color: #e74c3c;
  /* ... etc */
}
```

### Adding Custom Fields

To add additional fields to items, orders, or users:

1. Modify the database schema in `init-db.js`
2. Update the API endpoints in `server.js`
3. Update the frontend in `public/order.html` and `public/app.js`

## Troubleshooting

### Database Issues

If you encounter database errors:

```bash
# Delete and reinitialize the database
rm db.sqlite
npm run init-db
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
PORT=3001 npm start
```

### Dependencies Not Installing

If npm install fails:

```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

## Future Enhancements

Potential features for future versions:

- Email notifications when orders are submitted
- Admin dashboard for managing orders online
- CSV export of orders
- Payment integration (Stripe, PayPal)
- Order status tracking
- Customer order history
- Image uploads for products
- Multiple color variants for items
- Bulk order discounts
- Inventory management

## Support

For issues or questions:

1. Check this README first
2. Review the code comments in the relevant files
3. Check Render's/Railway's documentation for deployment issues

## License

This project is proprietary software for 8two Apparel.

---

**Built with ❤️ for 8two Apparel**