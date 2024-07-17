# Jewelry Sales System App Mobile _ React Native, NodeJs

## Contributors

- **Tô Thái Sơn (Backend Developer)**:
  - GitHub: [yebpls](https://github.com/yebpls)

- **Vũ Thị Bích Phương (Frontend Developer)**:
  - GitHub: [phuong1304](https://github.com/phuong1304)

- **Lưu Chí Bảo (Frontend Developer)**:
  - GitHub: [ChiBaoo](https://github.com/ChiBaoo)

- **Châu Ngọc Trâm (Frontend Developer)**:
  - GitHub: [ChauNgocTram](https://github.com/ChauNgocTram)

## Technology Stack

- **Backend**: NodeJS, TypeScript
- **Frontend**: React Native, JavaScript, Nativewind, React Native Paper

## Screenshots

### Some Admin Screenshots
<div style="display: flex; flex-direction: row; flex-wrap: wrap;">
  <img src="https://github.com/Jewelry-Sales-System-Mobile/jewelry/blob/main/ScreenShot/Admin_ScreenShot/Admin_Dashboard-Admin.jpg" alt="Admin Dashboard" style="width: 32%; margin: 1%;">
  <img src="https://github.com/Jewelry-Sales-System-Mobile/jewelry/blob/main/ScreenShot/Admin_ScreenShot/Admin_Product-Management.jpg" alt="Product Management" style="width: 32%; margin: 1%;">
  <img src="https://github.com/Jewelry-Sales-System-Mobile/jewelry/blob/main/ScreenShot/Admin_ScreenShot/Admin_Account-Management.jpg" alt="Account Management" style="width: 32%; margin: 1%;">
</div>

<p>For more screenshots, visit: <a href="https://drive.google.com/drive/folders/1pO8LbYoiennZ7wELxR-ej0_AFfPYm_fJ?usp=drive_link">All Screenshot Role Admin Images</a></p>

### Some Staff Screenshots
<div style="display: flex; flex-direction: row; flex-wrap: wrap;">
  <img src="https://github.com/Jewelry-Sales-System-Mobile/jewelry/blob/main/ScreenShot/Staff_ScreenShot/Staff_Order-List-Management3.jpg" alt="Order List Management" style="width: 32%; margin: 1%;">
  <img src="https://github.com/Jewelry-Sales-System-Mobile/jewelry/blob/main/ScreenShot/Staff_ScreenShot/Staff_Customer-Management.jpg" alt="Customer Management" style="width: 32%; margin: 1%;">
  <img src="https://github.com/Jewelry-Sales-System-Mobile/jewelry/blob/main/ScreenShot/Staff_ScreenShot/Staff_Create_Order.jpg" alt="Create Order" style="width: 32%; margin: 1%;">
</div>

<p>For more screenshots, visit: <a href="https://drive.google.com/drive/folders/1x9-3nv3aWkHOWIN9j8VEkGi_n7pt7goy?usp=drive_link">All Screenshot Role Staff Images</a></p>

## Roles and Permissions

### Manager

#### Description
Managers have extensive control over the system, enabling them to manage products, counters, employees, and customers.



#### Permissions

- **Gold Price Management**: Managers can update both selling and buying prices of gold (currently, only selling price is implemented).
  
- **Product Management**:
  - **Create Product**:
    - Request Body: `{ gemCost, name, weight }`
    - System calculates additional parameters:
      - `goldPrice = await goldPricesServices.getGoldPrices();`
      - `goldPricePerTeil = goldPrice?.sell_price;` (price per "cây vàng")
      - `teil = weight / ONE_TEIL_GOLD;` ("1 cây vàng" = 37.5 grams)
      - `laborCost = teil * LABOR_COST * (goldPricePerTeil as number);`
      - `basePrice = (goldPricePerTeil * teil) + laborCost + gemCost;`
  - **Update Gold Price**: When the selling price is updated, `laborCost` and `basePrice` of products are automatically recalculated.
  - **Edit Product**: Similar request body as creation.
  - **Activate/Deactivate Product**: Toggle product status.

- **Counter Management**:
  - **Create Counter**: Enter the counter name, the system fills in other details.
  - **View Counters**: Retrieve all counters or a specific counter by ID.
  - **Delete Counter**: Remove a counter.
  - **Edit Counter**: Update counter name.
  - **Assign/Unassign Staff**: Add or remove staff from a counter.

- **Employee Management**:
  - **Create Employee Account**:
    - Request Body: `{ name, email, password, confirm_password }`
  - **Activate/Deactivate Employee**: Toggle employee account status.
  - **Assign/Unassign Staff**: Add or remove staff from a counter.

- **Customer Management**:
  - **View Customer Details**: Retrieve customer information.
  - **Edit Customer Details**: Update customer information.

### Staff

- **Order Management**:
  - **Create New Order**: Initiate a new order.
  - **Change Order Status**: Update order status to paid or cancelled.

- **Customer Management**:
  - **View Customer Details**: Retrieve customer information.
  - **Create/Update Customer**: If the customer is not found (searched by phone number), create a new customer or update existing details.

## Setup and Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **React Native CLI** or **Expo CLI**

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/backend.git
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file and add your environment-specific variables:
   ```env
   PORT=your_port
   DATABASE_URL=your_database_url
   ```

4. **Run the server**:
   ```bash
   npm start
   ```

### Frontend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/frontend.git
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file and add your environment-specific variables:
   ```env
   API_URL=your_api_url
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

## Usage

### Manager Role

1. **Login** as a Manager to access full system functionalities.
2. **Navigate** to the respective sections (Products, Counters, Employees, Customers) using the navigation menu.
3. **Manage Gold Prices**: Update the gold prices to reflect current market rates.
4. **Manage Products**: Create, edit, activate, deactivate products as needed.
5. **Manage Counters**: Create new counters, update or delete existing counters, and manage staff assignments.
6. **Manage Employees**: Create new employee accounts, activate/deactivate accounts, and assign/unassign them to counters.
7. **Manage Customers**: View and update customer details.

### Staff Role

1. **Login** as a Staff to access order and customer management functionalities.
2. **Order Management**: Create new orders, update order statuses to paid or cancelled.
3. **Customer Management**: View customer details, create or update customer information during the order creation process.

## Features

### Dashboard
- **Overview of System Metrics**: Displays key metrics such as total sales, active products, and staff performance.
- **Gold Price Management**: Update and view current gold prices.
- **Revenue Charts**: Visual representation of weekly or monthly revenue.

### Product Management
- **CRUD Operations**: Create, read, update, and delete products.
- **Price Calculation**: Automated calculation of product prices based on current gold prices, labor costs, and gem costs.
- **Status Management**: Activate or deactivate products as needed.

### Counter Management
- **CRUD Operations**: Create, read, update, and delete counters.
- **Staff Assignment**: Assign or unassign staff to specific counters.

### Employee Management
- **Account Management**: Create, read, update, and deactivate employee accounts.
- **Counter Assignment**: Assign or unassign staff to specific counters.

### Customer Management
- **View and Edit**: Retrieve and update customer information.
- **Order Association**: Link orders to specific customers and update their details.

### Order Management (Staff Role)
- **Create Orders**: Initiate new orders and link them to customers.
- **Update Order Status**: Mark orders as paid or cancelled.
- **Customer Management**: Create or update customer details during order creation.

