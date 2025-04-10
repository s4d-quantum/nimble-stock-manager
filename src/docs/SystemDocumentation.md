
# Inventory Management System Documentation

## System Overview

This inventory management system is designed to track cellular devices, manage sales orders, purchase orders, and handle inventory operations for a telecommunications business. The application uses React for the frontend and Supabase as the backend database.

## Database Structure

The system uses a PostgreSQL database hosted on Supabase with the following key tables:

- **cellular_devices**: Stores information about mobile devices including IMEI, model, storage, color, and status
- **customers**: Contains customer information for sales orders
- **suppliers**: Stores supplier information for purchase orders
- **sales_orders**: Tracks customer orders with shipping and tracking information
- **purchase_orders**: Records stock acquisitions from suppliers
- **sales_order_devices**: Junction table linking devices to sales orders
- **purchase_order_devices**: Junction table linking devices to purchase orders
- **product_grades**: Quality classifications for devices
- **tac_codes**: TAC (Type Allocation Code) information that identifies device models

## Key Relationships

- Devices are linked to suppliers who provided them
- Devices can be associated with sales orders when sold
- Orders are linked to customers (sales) or suppliers (purchases)
- Device transactions track status changes and history

## Page Functionality

### Dashboard (Index)

**Path: /**

The dashboard provides a high-level overview of the inventory system with:

- Key statistics: Current stock levels, booked out/in devices, pending QC, returns
- Inventory status visualizations showing in-stock, low stock, and out-of-stock proportions
- Recent activity feed showing the latest transactions
- Quick action buttons for common tasks
- Pending tasks section highlighting work that needs attention

### Products

**Path: /products**

The Products page provides a comprehensive view of all cellular devices in inventory:

- Displays a filterable, sortable table of all devices
- Shows key device information: IMEI, manufacturer, model, storage, color, status
- Allows searching and filtering by various attributes
- Links to detailed device views
- Provides status indicators for device condition (in stock, sold, etc.)

### Device Detail

**Path: /device/:id**

The Device Detail page shows comprehensive information about a specific device:

- Displays all device attributes (IMEI, model, storage, etc.)
- Shows current status and history
- Tracks quality control and repair information if applicable
- Displays supplier information
- Shows sales order information if the device has been sold

### Customers

**Path: /customers**

The Customers page manages customer information:

- Lists all customers with search and filter capabilities
- Displays customer information including contact details
- Provides access to customer order history
- Allows creating new customers
- Links to sales order creation

### Suppliers

**Path: /suppliers**

The Suppliers page manages supplier relationships:

- Lists all suppliers with search and filter functionality
- Displays supplier contact information and details
- Provides access to purchase order history
- Allows creating new suppliers
- Links to purchase order creation

### Orders (Sales Orders)

**Path: /orders**

The Orders page manages sales orders:

- Displays a list of all sales orders with status indicators
- Provides filtering by customer, date, and status
- Shows order summary information
- Allows creating new sales orders
- Links to detailed order views

### Sales Order Detail

**Path: /sales/:id**

The Sales Order Detail page shows comprehensive information about a specific sales order:

- Displays customer and order information
- Lists all devices included in the order
- Shows shipping and tracking information
- Provides status updates and history
- Allows adding or removing devices from the order
- Supports updating order status

### Purchase Orders

**Path: /purchase-orders**

The Purchase Orders page manages inventory acquisitions:

- Lists all purchase orders with status indicators
- Provides filtering by supplier, date, and status
- Shows order summary information
- Allows creating new purchase orders
- Links to detailed order views
- Supports bulk operations for receiving inventory

### Goods Out

**Path: /goods-out**

The Goods Out page manages the shipping process for outgoing orders:

- Lists orders that are ready for shipping
- Provides workflow for packaging and shipping preparation
- Allows entry of tracking information
- Supports printing of shipping labels and documentation
- Updates order status when shipped

## Database Integration

The application interacts with the Supabase database through:

1. **Direct Table Operations**: Using Supabase client for CRUD operations on tables
2. **RPC Functions**: Calling database functions for complex operations like:
   - `fn_search_models_by_manufacturer` - Finds device models from a manufacturer
   - `add_devices_to_sales_order` - Adds devices to a sales order with transaction handling
   - `get_cellular_device_details` - Retrieves detailed information about devices

3. **Transaction Tracking**: The database includes tables to track all device transactions:
   - `cellular_device_transactions`
   - `serial_device_transactions`
   - These record status changes, sales, returns, etc.

## Key Features

### Device Status Management

Devices can have the following statuses:
- `in_stock`: Available for sale
- `sold`: Sold to a customer
- `allocated`: Reserved for a sales order but not yet shipped
- `returned`: Returned by a customer
- `repair`: Currently being repaired
- `qc_required`: Needs quality control inspection
- `qc_failed`: Failed quality control
- `quarantine`: Set aside due to issues

### Order Status Workflow

Orders follow this general workflow:
1. `draft`: Initial creation
2. `pending`: Confirmed but not yet processed
3. `processing`: Currently being prepared
4. `confirmed`: Approved and ready
5. `complete`: Fulfilled and closed
6. `cancelled`: Cancelled and not fulfilled

### Quality Control Process

The system supports quality control workflows:
- Devices can be marked for QC
- QC results can be recorded
- Repair tracking is supported
- Device history maintains all QC and repair records

## Technical Architecture

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state
- **Routing**: React Router for navigation
- **API Integration**: Supabase JS client
- **Authentication**: Supabase Auth (if implemented)
- **Database**: PostgreSQL via Supabase

## Database Functions

The system uses several database functions for complex operations:

- `add_devices_to_sales_order`: Handles the transaction logic when adding devices to a sales order
- `fn_search_models_by_manufacturer`: Searches for device models from a specific manufacturer
- `get_cellular_device_details`: Retrieves detailed information about cellular devices
- `fn_book_device_with_supplier`: Associates a device with a supplier
- Transaction management functions for consistent state

## Future Enhancements

Potential areas for future development:

- User authentication and role-based permissions
- Enhanced reporting and analytics
- Barcode/QR code scanning support
- Integration with shipping providers
- Advanced inventory forecasting
- Mobile application for warehouse operations
- Customer portal for order tracking

## Maintenance Guidelines

When maintaining the system:

1. Always use transactions when modifying device status to ensure consistency
2. Update the transaction history tables when changing device states
3. Consider the impact of schema changes on existing functionality
4. Test thoroughly after modifying database functions
5. Maintain separation of concerns between UI and data operations
6. Follow the existing patterns for new features

## Troubleshooting

Common issues and solutions:

- If device status isn't updating correctly, check the transaction logs
- For performance issues with large datasets, review query optimization
- When adding new device types, ensure proper TAC code configuration
- If orders aren't processing correctly, verify the status workflow
