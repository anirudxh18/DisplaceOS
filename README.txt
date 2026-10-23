DISPLACEOS - VIBEATHON STARTER PROJECT
=====================================

FILES
- index.html : page structure and library links
- style.css  : dashboard design and responsive layout
- data.js    : sample demo incidents and inventory
- app.js     : interactions, map, request form, stock controls, export

HOW TO RUN
1. Extract this folder.
2. Open the DisplaceOS folder in VS Code.
3. Install the VS Code extension "Live Server" (by Ritwick Dey), if you do not already have it.
4. Right-click index.html -> Open with Live Server.
5. Keep an internet connection for Leaflet, map tiles, and Google Fonts.

NO BUILD STEP REQUIRED.
You can also open index.html directly, but Live Server is recommended.

IMPORTANT
- This version is a frontend prototype. Changes are stored in localStorage in the same browser.
- The map pins, incidents, people counts, and stock quantities are illustrative sample data.
- It has no real multi-user sync, verified emergency feed, secure login, or dispatch messaging yet.
- Never use this prototype to make real emergency decisions.
- Do not put Supabase service-role keys, passwords, or secrets in frontend JavaScript.

NEXT MILESTONES
1. Test all interactions locally.
2. Connect Supabase database and authentication with row-level security.
3. Add role-based access for administrators, agencies, rescue teams, and camps.
4. Add reliable request assignment and stock reservation logic.
5. Add validation, audit logs, accessibility checks, and demo/presentation rehearsal.
