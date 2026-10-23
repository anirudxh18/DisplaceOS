# DisplaceOS — Smart Disaster Response & Resource Management Platform

**Vibeathon 2026 | Prayukti | AWS Club**

DisplaceOS is a disaster-response and displacement-management platform designed to help emergency coordinators monitor incidents, manage relief resources, process assistance requests, and coordinate response activities through a centralized dashboard.

The project combines a responsive web frontend with a Supabase-based backend integration layer, with the goal of improving visibility, resource allocation, and coordination during disaster-relief operations.

## 1. Problem Statement

During disasters, information about affected locations, displaced people, available supplies, and pending assistance requests can become fragmented across multiple organizations.

This can lead to delayed responses, inefficient resource distribution, shortages of essential supplies, and difficulty tracking ongoing relief operations.

DisplaceOS aims to bring these activities into one platform, helping authorized stakeholders understand the situation, organize requests, monitor resources, and coordinate relief efforts.

## 2. Key Features

### Disaster Monitoring Dashboard
- Centralized dashboard for viewing disaster incidents and response information.
- Incident status and priority tracking.
- Overview of affected locations and illustrative incident data.
- Activity tracking for important dashboard operations.

### Interactive Disaster Map
- Interactive map powered by Leaflet and OpenStreetMap.
- Map markers for incident locations.
- Geographic visualization of affected sites.
- Latitude and longitude coordinates can be used to identify incident locations.
- Map-based situational awareness for disaster-response planning.

### Assistance Request Management
- Form-based submission of relief and assistance requests.
- Request information organized for easier monitoring.
- Request status and priority management.
- Foundation for tracking requests from submission through fulfillment.

### Relief Inventory Management
- Inventory dashboard for tracking relief supplies.
- Quantity updates for available stock.
- Visibility into resource availability.
- Foundation for reducing shortages and coordinating resource distribution.

### Data Export and Activity Tracking
- JSON export for supported dashboard data.
- Activity log for tracking relevant operations.
- Browser-based persistence for prototype data where implemented.

### Responsive User Interface
- Dashboard designed for desktop and smaller screens.
- Structured HTML, CSS, and JavaScript architecture.
- Visual interface for organizing disaster information and relief operations.

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Maps | Leaflet.js, OpenStreetMap |
| Backend integration | Supabase JavaScript client |
| Database | Supabase PostgreSQL, when configured |
| Authentication | Supabase Auth integration, when configured |
| Local development | Visual Studio Code, Live Server |
| Version control | Git and GitHub |
| Fonts | Google Fonts |

## 4. Project Architecture

The project separates the user interface, application logic, sample data, authentication code, and backend configuration.

```text
DisplaceOS/
│
├── index.html       # Main application structure
├── style.css        # Styling and responsive layout
├── app.js           # Dashboard logic and interactions
├── auth.js          # Authentication-related logic
├── data.js          # Sample incidents and inventory data
├── supabase.js      # Supabase client/configuration
└── README.md        # Project documentation
```

**Frontend:** Displays the dashboard, map, incident information, assistance forms, inventory controls, and other supported interactions.

**Backend integration:** The Supabase module provides the integration point for connecting the application to authentication and a PostgreSQL database. Actual functionality depends on valid project configuration, database tables, security policies, and implemented queries.

**Data layer:** Sample data and browser storage support the prototype where applicable. These do not automatically provide shared, persistent data across multiple users.

## 5. Backend and Database Integration

DisplaceOS is structured to support a Supabase-backed architecture.

The intended backend responsibilities include:

- User authentication and session management.
- Persistent storage of disaster incidents.
- Storage and tracking of relief requests.
- Inventory and stock records.
- User roles and access permissions.
- Shared data across authorized users.
- Database-level security through Row Level Security (RLS).

### Backend Setup

1. Create a project in the Supabase dashboard.
2. Configure the Supabase project URL and publishable key in the appropriate frontend configuration.
3. Create the required database tables and relationships.
4. Configure authentication providers and user registration.
5. Implement and test database queries for incidents, requests, and inventory.
6. Enable and verify Row Level Security policies.
7. Test each operation using authorized and unauthorized accounts.

**Security:** Never expose a Supabase service-role key, database password, or other privileged secret in frontend JavaScript or a public GitHub repository.

The presence of `auth.js` and `supabase.js` alone does not establish that authentication, database synchronization, or authorization is fully operational.

## 6. Intended User Roles

The platform is designed to support differentiated workflows for:

- **Administrators:** Manage platform information and authorized users.
- **Relief Agencies:** Review assistance needs and coordinate resources.
- **Rescue Teams:** Access assigned response information.
- **Relief Camps:** Report requirements and monitor relevant supplies.

Role-specific access must be enforced by the backend, not merely by hiding frontend interface elements.

## 7. Running the Project Locally

### Prerequisites
- A computer with Windows, macOS, or Linux.
- Visual Studio Code.
- The Live Server extension by Ritwick Dey.
- An internet connection for external map tiles, libraries, and Google Fonts.

### Steps

1. Clone or download the repository.
2. Open the project folder in VS Code.
3. Install the Live Server extension if necessary.
4. Open `index.html`.
5. Right-click the file and select **Open with Live Server**.
6. Test the dashboard, map, forms, and other available interactions.

No build step is required for the current static frontend.

If Supabase integration is configured, test its authentication and database functionality separately.

## 8. Data and Operational Limitations

The prototype must not be treated as a production emergency-management system until the following have been implemented and validated:

- Verified real-world incident feeds.
- Persistent and synchronized multi-user data.
- Secure authentication and role-based authorization.
- Reliable request assignment and fulfillment workflows.
- Validated resource-allocation rules.
- Error handling, audit trails, and operational monitoring.
- Appropriate testing, privacy safeguards, and security controls.

Sample incident locations, affected-person counts, and inventory quantities must not be interpreted as verified real-world information.

**DisplaceOS is a development project and must not be used to make real emergency decisions.**

## 9. Development Roadmap

### Phase 1 — Frontend Foundation
- Build the dashboard and responsive interface.
- Integrate the interactive map.
- Add incident, request, and inventory interactions.
- Support relevant data exports.

### Phase 2 — Backend Integration
- Configure Supabase authentication.
- Design the PostgreSQL database schema.
- Implement persistent incident, request, and inventory operations.
- Add and test Row Level Security policies.

### Phase 3 — Intelligent Resource Coordination
- Develop explainable request prioritization.
- Introduce inventory-aware allocation recommendations.
- Track request assignment and fulfillment states.
- Handle unavailable resources and failed deliveries.

### Phase 4 — Advanced Disaster Operations
- Add verified external data sources where available.
- Improve location-based incident analysis.
- Introduce shortage simulation and resource-planning tools.
- Improve auditability, error recovery, and operational reliability.

## 10. Project Objective

The long-term objective of DisplaceOS is to provide a unified, transparent, and extensible platform for disaster-response coordination, helping relief stakeholders organize information, identify urgent needs, and make better-informed resource-management decisions.

## 11. Repository

**Project:** DisplaceOS  
**Event:** Vibeathon 2026 — Prayukti  
**Organization:** AWS Club  
**Repository:** https://github.com/anirudxh18/DisplaceOS

---

*Built as a student innovation project focused on disaster response, displacement management, and relief-resource coordination.*
