**PickPack**

_Click. Pack. Pickup._

**Product Requirements Document (PRD)**

Version 1.0 | March 2026

| **Project Name** | PickPack - Order & Pickup Management System |
| --- | --- |
| **Document Type** | Product Requirements Document (PRD) |
| **Version** | 1.0 |
| **Date** | March 2026 |
| **Status** | Draft - Ready for Review |
| **Tech Stack** | FastAPI (Backend) · React (Frontend) · MongoDB (Database) |
| **Target Users** | Store Owners (Admins) · Customers |

# **1\. Executive Summary**

PickPack is a full-stack web application designed to streamline the process of order placement, packing, and customer pickup for retail stores, grocery shops, and specialty vendors. The platform bridges the gap between customers who want to pre-select and order items online and store owners who need an efficient system to manage, pack, and fulfill those orders.

The application eliminates phone-based ordering friction, reduces errors in packing, provides transparent payment calculation, and gives store owners a clean dashboard to manage their entire catalog and order pipeline from a single interface.

# **2\. Problem Statement**

### **Current Pain Points**

- Customers place orders via phone calls or text messages - prone to miscommunication and errors
- Store owners manually track orders on paper or spreadsheets - inefficient and error-prone
- No clear visibility of item availability until the customer arrives at the store
- Payment totals are computed manually, increasing billing mistakes
- No digital record of order history for either the owner or the customer
- No ability for customers to browse items categorically before visiting the store

### **Opportunity**

By digitizing the end-to-end order and fulfillment process, PickPack can save significant time for both parties, reduce errors, and improve the overall customer experience - all without requiring third-party delivery infrastructure.

# **3\. Goals & Objectives**

### **Business Goals**

- Enable store owners to fully digitize their catalog and order management
- Reduce time spent on manual order tracking by at least 60%
- Increase order accuracy to 99%+ via structured item selection
- Provide a clear audit trail of all orders and payments

### **User Goals - Customers**

- Browse all available items by category from any device
- Add items to a cart and submit orders with a single click
- Receive a clear breakdown of costs before confirming
- Know when their order is ready for pickup

### **User Goals - Store Owners**

- Manage product catalog (add, edit, delete items and categories) with ease
- View all incoming orders in real-time
- Mark orders as packed and notify customers
- Track revenue and order history via a dashboard

# **4\. Scope**

### **In Scope - Phase 1 (MVP)**

- User registration, login, and role-based access (Owner / Customer)
- Product catalog management (CRUD) with category support
- Customer-facing category-wise item browsing and cart
- Order placement with automatic payment calculation
- Owner packing dashboard with order status management
- Order status notifications (in-app)
- Order history for both roles

### **Out of Scope - Phase 1**

- Third-party delivery or shipping integration
- Native mobile application (iOS / Android)
- Multi-store / multi-branch support
- Inventory quantity tracking below zero / backorder logic
- Loyalty points or discount coupon system (planned for Phase 2)

# **5\. Stakeholders & User Personas**

| **Persona** | **Role** | **Goals** | **Pain Points** |
| --- | --- | --- | --- |
| Ravi - Store Owner | Admin | Manage catalog, view & pack orders, track revenue | Manual order tracking, billing errors, no digital record |
| Priya - Regular Customer | Customer | Browse items, place order, pickup conveniently | Unclear item availability, phone ordering errors |
| Dev Team | Builder | Clear specs, stable APIs, testable modules | Ambiguous requirements, scope creep |

# **6\. System Architecture**

### **Tech Stack**

| **Layer** | **Technology** | **Purpose** |
| --- | --- | --- |
| Frontend | React 18 + Vite + TailwindCSS | Responsive SPA for both customer and owner views |
| Backend | FastAPI (Python 3.11+) | REST API server - authentication, business logic, data access |
| Database | MongoDB (via Motor async driver) | Document store for flexible product, order, and user data |
| Auth | JWT (JSON Web Tokens) | Stateless authentication with role-based access control |
| State Management | React Context + React Query | Client-side state and server data synchronization |
| File Storage | Local filesystem / AWS S3 (Phase 2) | Product image uploads |
| Notifications | WebSocket (FastAPI) | Real-time order status updates |

### **High-Level Data Flow**

- Customer logs in and browses categorized product catalog
- Customer adds items to cart - cart stored in React state / localStorage
- Customer places order - POST /orders - saved to MongoDB
- Owner sees new order on dashboard (WebSocket push or polling)
- Owner packs items and marks order as 'Packed'
- Customer receives in-app notification that order is ready
- Customer arrives and picks up - Owner marks order 'Completed'

# **7\. Functional Requirements**

## **7.1 Authentication & Authorization**

### **FR-AUTH-01: User Registration**

- Any visitor can register as a Customer by providing: Full Name, Email, Phone Number, Password
- Owner accounts are created by a Super Admin OR via an invite-only link (configurable)
- Passwords must be hashed using bcrypt before storage
- Email must be unique per user

### **FR-AUTH-02: Login**

- Users login with email + password
- On success, server returns a signed JWT access token (expires in 24h) and a refresh token (expires in 7 days)
- Role field in JWT payload controls which UI views and API routes are accessible

### **FR-AUTH-03: Role-Based Access Control (RBAC)**

| **Feature** | **Customer** | **Owner / Admin** |
| --- | --- | --- |
| View Product Catalog | Yes | Yes |
| Add / Edit / Delete Products | No  | Yes |
| Add / Edit / Delete Categories | No  | Yes |
| Place Orders | Yes | No  |
| View Own Orders | Yes | Yes (all orders) |
| Mark Orders as Packed / Completed | No  | Yes |
| View Revenue Dashboard | No  | Yes |
| Manage Users | No  | Yes (Owner only) |

## **7.2 Product Catalog Management (Owner CRUD)**

### **FR-CAT-01: Category Management**

- Owner can create a category with: Name, Description (optional), Display Icon/Color
- Categories are ordered by a sort_order field; owner can drag-and-drop to reorder
- Soft delete - deleting a category hides it but retains historical order data

### **FR-CAT-02: Product Management**

- Owner can add a product with: Name, Description, Price (INR), Category (select), Stock Status (Available / Out of Stock), Product Image (optional upload), Unit (e.g., kg, piece, dozen)
- Owner can edit any field of an existing product
- Owner can toggle product availability without deleting it
- Bulk operations: Owner can mark multiple products as Available / Unavailable at once
- Product search with live filtering by name in the admin panel

## **7.3 Customer - Browsing & Cart**

### **FR-BROWSE-01: Category-wise Browsing**

- Homepage shows all active categories as visual tiles
- Clicking a category shows all available products within it
- Products show: image, name, unit, price - with an 'Add to Cart' button
- Search bar to find products across all categories

### **FR-CART-01: Cart Management**

- Customer can add, remove, and adjust quantity for any item in the cart
- Cart persists in localStorage so it survives page refresh (before login)
- Cart syncs to server after login
- Cart icon in header shows live item count badge

## **7.4 Order Placement & Payment Calculation**

### **FR-ORDER-01: Order Summary & Review**

- Before confirming, customer sees a full order summary: item list, quantities, unit prices, subtotals
- System auto-calculates: Subtotal (sum of all item line totals), Tax (configurable GST %, set by owner), Grand Total
- Customer can add an optional order note / pickup time preference

### **FR-ORDER-02: Order Placement**

- POST /api/orders creates the order with status = 'Pending'
- Order document stored in MongoDB with: customer_id, items (snapshot of name + price at order time), subtotal, tax, grand_total, status, timestamps, notes
- Price snapshot is taken at order time to prevent price-change inconsistencies
- Customer receives on-screen confirmation with Order ID

### **FR-PAY-01: Payment Modes**

- Phase 1: Cash on Pickup - no online payment gateway required
- Phase 2 (planned): UPI / Razorpay integration for prepayment

## **7.5 Owner - Packing Dashboard**

### **FR-PACK-01: Order Queue**

- Owner dashboard shows all orders in real-time, grouped by status: Pending, Being Packed, Packed (Ready), Completed, Cancelled
- Each order card shows: Order ID, Customer Name, Item Count, Grand Total, Time Placed, Order Note
- Owner can click an order to see full item list with quantities

### **FR-PACK-02: Order Status Transitions**

| **Status** | **Triggered By** | **Next Status** |
| --- | --- | --- |
| Pending | Customer places order | Being Packed |
| Being Packed | Owner clicks 'Start Packing' | Packed (Ready) |
| Packed (Ready) | Owner clicks 'Mark as Ready' | Completed |
| Completed | Owner clicks 'Picked Up' after customer collects | -   |
| Cancelled | Customer or Owner cancels before packing starts | -   |

### **FR-PACK-03: Packing Checklist**

- When owner opens an order, each item appears as a checklist row
- Owner checks off items as they place them - visual progress bar shows packing completion
- Order can only be marked as 'Packed' when all items are checked

## **7.6 Notifications**

### **FR-NOTIFY-01: In-App Notifications**

- Customer receives notifications when: Order is confirmed (Pending), Owner starts packing, Order is Ready for Pickup
- Owner receives notifications when: New order is placed
- Notification bell icon with unread count badge in header

### **FR-NOTIFY-02: WebSocket Real-Time Updates**

- FastAPI WebSocket endpoint pushes order status changes to connected clients
- Fallback to 30-second polling if WebSocket is unavailable

## **7.7 Order History**

- Customers can view all their past orders with status, items, and total
- Owner can view all orders with filters: date range, status, customer name
- Orders are sortable by: Date (desc/asc), Total Amount, Status

# **8\. Non-Functional Requirements**

| **Category** | **Requirement** |
| --- | --- |
| Performance | API responses must be under 300ms for 95% of requests under normal load |
| Availability | System uptime target: 99.5% monthly |
| Scalability | Architecture must support up to 1,000 concurrent users in Phase 1 |
| Security | All passwords hashed with bcrypt. JWTs signed with RS256. HTTPS enforced. Input validation on all endpoints. |
| Data Integrity | All financial figures (price, tax, total) stored as precise decimal values (2 d.p.), never floating-point |
| Responsiveness | Frontend must be fully usable on mobile (375px min width) and desktop |
| Browser Support | Latest 2 versions of Chrome, Firefox, Safari, Edge |
| Accessibility | WCAG 2.1 AA compliance for customer-facing pages |
| Backup | MongoDB daily automated backups retained for 30 days |

# **9\. Database Schema (MongoDB Collections)**

### **9.1 users**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| \_id | ObjectId | Auto-generated primary key |
| full_name | String | User's full name |
| email | String (unique) | Login identifier |
| phone | String | Contact number |
| password_hash | String | bcrypt hash |
| role | Enum: customer \| owner | Access control role |
| is_active | Boolean | Soft-disable account |
| created_at | DateTime | Registration timestamp |

### **9.2 categories**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| \_id | ObjectId | Primary key |
| name | String | Category display name |
| description | String | Optional description |
| icon | String | Emoji or icon identifier |
| color | String | Hex color for tile background |
| sort_order | Integer | Display order |
| is_active | Boolean | Soft delete flag |

### **9.3 products**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| \_id | ObjectId | Primary key |
| name | String | Product name |
| description | String | Optional details |
| price | Decimal128 | Price in INR (2 d.p.) |
| unit | String | e.g., kg, piece, dozen |
| category_id | ObjectId (ref) | Linked category |
| image_url | String | Path to product image |
| is_available | Boolean | Shown to customers only if true |
| created_at / updated_at | DateTime | Audit timestamps |

### **9.4 orders**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| \_id | ObjectId | Primary key |
| order_number | String | Human-readable ID (e.g., ORD-20260301-001) |
| customer_id | ObjectId (ref) | Linked user |
| items | Array of OrderItem | Snapshot: product_id, name, price, quantity, subtotal |
| subtotal | Decimal128 | Sum before tax |
| tax_rate | Decimal | GST % applied at order time |
| tax_amount | Decimal128 | Computed tax |
| grand_total | Decimal128 | Final payable amount |
| status | Enum | pending \| being_packed \| packed \| completed \| cancelled |
| payment_mode | Enum | cash_on_pickup (Phase 1) \| upi (Phase 2) |
| notes | String | Customer order note |
| pickup_time | DateTime | Requested pickup time (optional) |
| created_at / updated_at | DateTime | Audit timestamps |

### **9.5 notifications**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| \_id | ObjectId | Primary key |
| user_id | ObjectId (ref) | Recipient user |
| title | String | Notification headline |
| message | String | Full notification text |
| order_id | ObjectId (ref) | Related order |
| is_read | Boolean | Read receipt flag |
| created_at | DateTime | Timestamp |

# **10\. API Endpoint Reference**

### **Authentication**

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/auth/register | Public | Register new customer account |
| POST | /api/auth/login | Public | Login; returns JWT tokens |
| POST | /api/auth/refresh | Authenticated | Refresh access token |
| POST | /api/auth/logout | Authenticated | Invalidate refresh token |

### **Categories**

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| GET | /api/categories | Public | List all active categories |
| POST | /api/categories | Owner | Create new category |
| PUT | /api/categories/{id} | Owner | Update category |
| DELETE | /api/categories/{id} | Owner | Soft-delete category |
| PATCH | /api/categories/reorder | Owner | Update sort order |

### **Products**

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| GET | /api/products | Public | List products (filter by category, search) |
| GET | /api/products/{id} | Public | Get single product details |
| POST | /api/products | Owner | Create product |
| PUT | /api/products/{id} | Owner | Update product |
| PATCH | /api/products/{id}/availability | Owner | Toggle availability |
| DELETE | /api/products/{id} | Owner | Soft-delete product |
| POST | /api/products/bulk-availability | Owner | Bulk toggle availability |

### **Orders**

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| POST | /api/orders | Customer | Place new order |
| GET | /api/orders | Owner | List all orders (with filters) |
| GET | /api/orders/my | Customer | List own orders |
| GET | /api/orders/{id} | Both | Get order detail |
| PATCH | /api/orders/{id}/status | Owner | Update order status |
| DELETE | /api/orders/{id} | Customer/Owner | Cancel order (if pending) |

### **Dashboard & Analytics**

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| GET | /api/dashboard/summary | Owner | Today's orders count, revenue, pending count |
| GET | /api/dashboard/revenue | Owner | Revenue by date range |
| GET | /api/dashboard/top-products | Owner | Most ordered products |

### **Notifications**

| **Method** | **Endpoint** | **Access** | **Description** |
| --- | --- | --- | --- |
| GET | /api/notifications | Authenticated | List own notifications |
| PATCH | /api/notifications/{id}/read | Authenticated | Mark notification as read |
| PATCH | /api/notifications/read-all | Authenticated | Mark all as read |
| WS  | /ws/notifications | Authenticated | WebSocket for real-time push |

# **11\. UI / UX Requirements**

## **11.1 Customer-Facing Pages**

| **Page** | **Key Components** |
| --- | --- |
| Home / Catalog | Category grid tiles, featured products, search bar, cart icon with badge |
| Category Detail | Product cards (image, name, unit, price, 'Add to Cart'), filter/sort options |
| Cart | Item list with qty controls, price breakdown, order note field, 'Place Order' CTA |
| Order Confirmation | Success animation, order number, estimated pickup, 'View Orders' link |
| Order History | List of past orders with status chips, expandable item detail |
| Profile | Edit name, phone, password change |
| Notifications | Bell icon with dropdown list of unread/read notifications |

## **11.2 Owner-Facing Pages**

| **Page** | **Key Components** |
| --- | --- |
| Owner Dashboard | KPI cards (today's revenue, orders, pending), order status chart, recent orders table |
| Order Queue | Kanban-style columns by status, real-time update, click to open packing checklist |
| Packing Checklist | Order detail modal, per-item checkboxes, progress bar, 'Mark as Packed' CTA |
| Product Management | Searchable data table, add/edit/delete product drawer, bulk availability toggle |
| Category Management | Drag-and-drop sortable list, inline edit, add/delete category |
| Analytics | Revenue line chart, top 10 products bar chart, date range picker |
| Settings | Store name, GST %, notification preferences, owner account details |

## **11.3 Design System**

- Primary Color: Deep Navy (#1E3A5F) - trust and professionalism
- Accent Color: Sky Blue (#2E6DA4) - CTAs and interactive elements
- Success / Packed: Green (#16A34A)
- Warning / Pending: Amber (#D97706)
- Error / Cancelled: Red (#DC2626)
- Font: Inter (clean, highly legible at all sizes)
- Responsive breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop)

# **12\. Additional Recommended Features**

### **12.1 Owner Analytics Dashboard**

- Daily / weekly / monthly revenue graphs
- Most popular products and categories
- Average order value over time
- Peak ordering hours heatmap

### **12.2 Inventory / Stock Awareness**

- Owner can set a stock quantity per product
- System warns owner when a product drops below a defined threshold
- Automatically marks a product as 'Out of Stock' when quantity reaches zero

### **12.3 Customer Loyalty Points (Phase 2)**

- Customers earn 1 point per INR 100 spent
- Points can be redeemed for discounts on future orders
- Owner can configure points-to-rupee conversion rate in Settings

### **12.4 Discount & Promo Codes (Phase 2)**

- Owner can create time-limited promo codes with flat or percentage discount
- Customer enters promo code at checkout; system validates and applies discount

### **12.5 Pickup Slot Scheduling**

- Owner defines available pickup time slots (e.g., 10am-12pm, 2pm-4pm)
- Customer selects a preferred slot at checkout
- Owner packing dashboard shows orders grouped by pickup slot

### **12.6 WhatsApp / SMS Notifications (Phase 2)**

- Owner enters WhatsApp Business API credentials in Settings
- System sends order status updates to customer's phone number via WhatsApp
- Fallback to SMS via Twilio if WhatsApp fails

### **12.7 Guest Checkout**

- Customers can browse and add to cart without logging in
- At checkout, guest is prompted to register / login to complete order
- Cart is preserved during the registration flow

### **12.8 Multi-Language Support**

- Phase 1: English
- Phase 2: Kannada, Hindi - using i18n (react-i18next library)

### **12.9 Dark Mode**

- Toggle in user profile / app header
- Full Tailwind dark: class implementation across all pages

### **12.10 UPI / Online Payment (Phase 2)**

- Integration with Razorpay for prepaid orders
- Owner receives payment confirmation before packing starts
- Refund workflow for cancelled orders

# **13\. Security Requirements**

- All API routes require JWT validation except /auth/register and /auth/login
- Role middleware on all owner-only routes - returns 403 if role != owner
- Passwords hashed with bcrypt (cost factor 12)
- JWT signed with RS256 asymmetric keys; access token TTL: 24h; refresh TTL: 7 days
- Refresh tokens stored in database; revocable on logout
- Rate limiting: 5 failed login attempts per IP per 15 minutes → temporary block
- All inputs validated with Pydantic (backend) and Zod (frontend)
- MongoDB queries use parameterized inputs - no raw string interpolation
- CORS restricted to known frontend origin(s)
- HTTPS enforced in production (HSTS header)
- Product image uploads: file type whitelist (jpg, png, webp), max 5MB, virus scan in Phase 2

# **14\. Development Phases & Milestones**

| **Phase** | **Duration** | **Deliverables** |
| --- | --- | --- |
| Phase 0 - Setup | Week 1 | Project scaffolding, MongoDB Atlas setup, CI/CD pipeline, environment configs |
| Phase 1 - Auth | Week 1-2 | User registration, login, JWT, RBAC middleware, auth pages in React |
| Phase 2 - Catalog | Week 2-3 | Category + Product CRUD APIs, Owner management UI, Customer browse UI |
| Phase 3 - Cart & Orders | Week 3-4 | Cart logic, Order placement API, payment calculation, order confirmation |
| Phase 4 - Packing | Week 4-5 | Owner packing dashboard, checklist, status transitions, WebSocket notifications |
| Phase 5 - Polish | Week 5-6 | Analytics dashboard, order history, notification center, testing, bug fixes |
| Phase 6 - Launch | Week 7 | UAT, performance testing, production deployment, documentation |

# **15\. Testing Requirements**

### **Backend**

- Unit tests for all service layer functions (pytest)
- Integration tests for all API endpoints using httpx AsyncClient
- Test coverage target: 80%+
- Payment calculation unit tests with edge cases (zero items, max items, tax = 0%)

### **Frontend**

- Component unit tests with React Testing Library
- End-to-end (E2E) tests for critical flows: register → browse → add to cart → place order → owner packs → complete
- E2E tooling: Playwright

### **Manual / UAT**

- Owner persona test: complete product CRUD, receive and pack 5 orders
- Customer persona test: register, browse, cart, order, receive pickup notification
- Cross-browser testing on Chrome, Firefox, Safari
- Mobile responsiveness on iPhone 14 and Samsung Galaxy S22

# **16\. Deployment Architecture**

| **Component** | **Option** | **Notes** |
| --- | --- | --- |
| Backend | Railway / Render / AWS EC2 | Docker container; auto-deploy on main branch push |
| Frontend | Vercel / Netlify / Cloudflare Pages | Static build; automatic preview deployments per PR |
| Database | MongoDB Atlas (M10 cluster) | Cloud-hosted; VPC peering for security |
| File Storage | Local (Phase 1) / AWS S3 (Phase 2) | Signed URLs for secure image access |
| Reverse Proxy | Nginx | SSL termination, static file serving, API proxying |
| CI/CD | GitHub Actions | Lint → Test → Build → Deploy pipeline |
| Monitoring | Sentry (errors) + UptimeRobot (availability) | Alert on error spike or downtime |

# **17\. Glossary**

| **Term** | **Definition** |
| --- | --- |
| Owner | The store proprietor who manages the product catalog and fulfills orders |
| Customer | A registered user who browses, orders, and picks up items |
| Cart | A temporary collection of selected products before order confirmation |
| Order | A confirmed cart submission with payment calculation, status tracking, and audit trail |
| Packing | The physical process of gathering ordered items, tracked digitally via checklist |
| SKU | Stock Keeping Unit - a unique identifier for each product variant |
| JWT | JSON Web Token - stateless authentication credential |
| RBAC | Role-Based Access Control - permission system based on user role |
| GST | Goods and Services Tax - configurable tax percentage applied to orders |
| WebSocket | Persistent bidirectional connection for real-time server-to-client updates |

# **18\. Appendix - Revision History**

| **Version** | **Date** | **Author** | **Changes** |
| --- | --- | --- | --- |
| 1.0 | March 2026 | Product Team | Initial PRD draft - full feature scope, schema, API reference, phases |

_- End of Document -_

PickPack PRD v1.0 | Confidential