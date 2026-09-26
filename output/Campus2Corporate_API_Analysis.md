# Campus2Corporate - Complete API Analysis

Analysis date: 26 September 2026. Static source audit; runtime unverified.

## Summary

- Current backend mounted paths: 295
- Legacy server mounted paths: 8
- Current paths with page caller: 41
- Current paths without page caller: 254
- Alternate path variants: 146
- Unmatched frontend service requests: 20; page-referenced: 12
- External SDK integrations: Clerk and Google Gemini

## Exact mounted endpoint inventory and trace

### 1. POST /api/admin/login (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:62
- Controller: backend/src/controllers/adminController.js:83 `loginAdmin`
- Frontend caller: direct axios.AdminLogin (src/pages/admin/AdminLogin.tsx:30)
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (admin.js); external calls: none
- Flow: direct axios.AdminLogin -> POST /api/admin/login -> loginAdmin -> Admin (admin.js)

### 2. POST /api/v1/admin/login (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:62
- Controller: backend/src/controllers/adminController.js:83 `loginAdmin`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (admin.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/login -> loginAdmin -> Admin (admin.js)

### 3. POST /api/admin/auth/login (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:63
- Controller: backend/src/controllers/adminController.js:83 `loginAdmin`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (admin.js); external calls: none
- Flow: No frontend caller found -> POST /api/admin/auth/login -> loginAdmin -> Admin (admin.js)

### 4. POST /api/v1/admin/auth/login (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:63
- Controller: backend/src/controllers/adminController.js:83 `loginAdmin`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (admin.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/auth/login -> loginAdmin -> Admin (admin.js)

### 5. GET /api/admin/profile (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:68
- Controller: backend/src/controllers/adminController.js:152 `getAdminProfile`
- Frontend caller: adminApi.getProfile (src/components/dashboard/admin/views/SettingsView.tsx:39), direct axios.ProtectedAdminRoute (src/components/auth/ProtectedAdminRoute.tsx:21)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: No direct model call found; external calls: none
- Flow: adminApi.getProfile -> GET /api/admin/profile -> getAdminProfile -> No direct model call found

### 6. GET /api/v1/admin/profile (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:68
- Controller: backend/src/controllers/adminController.js:152 `getAdminProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: No direct model call found; external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/profile -> getAdminProfile -> No direct model call found

### 7. PUT /api/admin/profile (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:69
- Controller: backend/src/controllers/adminController.js:166 `updateAdminProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: name, phone, profileImage
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (admin.js); external calls: none
- Flow: No frontend caller found -> PUT /api/admin/profile -> updateAdminProfile -> Admin (admin.js)

### 8. PUT /api/v1/admin/profile (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:69
- Controller: backend/src/controllers/adminController.js:166 `updateAdminProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: name, phone, profileImage
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (admin.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/profile -> updateAdminProfile -> Admin (admin.js)

### 9. PATCH /api/admin/profile (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:70
- Controller: backend/src/controllers/adminController.js:166 `updateAdminProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: name, phone, profileImage
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (admin.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/admin/profile -> updateAdminProfile -> Admin (admin.js)

### 10. PATCH /api/v1/admin/profile (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:70
- Controller: backend/src/controllers/adminController.js:166 `updateAdminProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: name, phone, profileImage
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (admin.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/v1/admin/profile -> updateAdminProfile -> Admin (admin.js)

### 11. POST /api/admin/register (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:71
- Controller: backend/src/controllers/adminController.js:28 `registerAdmin`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Super Admin; middleware: adminAuth, requireSuperAdmin
- Request path parameters: none; query: none; direct body fields: email, name, password, phone, role
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (admin.js); external calls: none
- Flow: No frontend caller found -> POST /api/admin/register -> registerAdmin -> Admin (admin.js)

### 12. POST /api/v1/admin/register (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:71
- Controller: backend/src/controllers/adminController.js:28 `registerAdmin`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Super Admin; middleware: adminAuth, requireSuperAdmin
- Request path parameters: none; query: none; direct body fields: email, name, password, phone, role
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (admin.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/register -> registerAdmin -> Admin (admin.js)

### 13. GET /api/admin/dashboard (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:76
- Controller: backend/src/controllers/adminController.js:203 `getDashboardAnalytics`
- Frontend caller: adminApi.getDashboardAnalytics (src/components/dashboard/admin/views/AdminOverview.tsx:61)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), Broadcast (broadcast.js), College (college.js), Company (company.js), PlacementDrive (placementDrive.js), Project (project.js), Recruiter (recruiter.js), Student (student.js), SupportTicket (supportTicket.js); external calls: none
- Flow: adminApi.getDashboardAnalytics -> GET /api/admin/dashboard -> getDashboardAnalytics -> Application (application.js), Broadcast (broadcast.js), College (college.js), Company (company.js), PlacementDrive (placementDrive.js), Project (project.js), Recruiter (recruiter.js), Student (student.js), SupportTicket (supportTicket.js)

### 14. GET /api/v1/admin/dashboard (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:76
- Controller: backend/src/controllers/adminController.js:203 `getDashboardAnalytics`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), Broadcast (broadcast.js), College (college.js), Company (company.js), PlacementDrive (placementDrive.js), Project (project.js), Recruiter (recruiter.js), Student (student.js), SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/dashboard -> getDashboardAnalytics -> Application (application.js), Broadcast (broadcast.js), College (college.js), Company (company.js), PlacementDrive (placementDrive.js), Project (project.js), Recruiter (recruiter.js), Student (student.js), SupportTicket (supportTicket.js)

### 15. GET /api/admin/students (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:81
- Controller: backend/src/controllers/adminController.js:274 `getAllStudents`
- Frontend caller: adminApi.getStudents (src/components/dashboard/admin/views/UserManagement.tsx:44)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: branch, college, limit = 20, page = 1, q, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: adminApi.getStudents -> GET /api/admin/students -> getAllStudents -> Student (student.js)

### 16. GET /api/v1/admin/students (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:81
- Controller: backend/src/controllers/adminController.js:274 `getAllStudents`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: branch, college, limit = 20, page = 1, q, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/students -> getAllStudents -> Student (student.js)

### 17. GET /api/admin/students/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:82
- Controller: backend/src/controllers/adminController.js:328 `getStudentById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/students/:id -> getStudentById -> Student (student.js)

### 18. GET /api/v1/admin/students/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:82
- Controller: backend/src/controllers/adminController.js:328 `getStudentById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/students/:id -> getStudentById -> Student (student.js)

### 19. PATCH /api/admin/students/:id/status (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:83
- Controller: backend/src/controllers/adminController.js:387 `updateStudentStatus`
- Frontend caller: adminApi.updateStudentStatus (src/components/dashboard/admin/views/UserManagement.tsx:104)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: adminApi.updateStudentStatus -> PATCH /api/admin/students/:id/status -> updateStudentStatus -> Student (student.js)

### 20. PATCH /api/v1/admin/students/:id/status (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:83
- Controller: backend/src/controllers/adminController.js:387 `updateStudentStatus`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/v1/admin/students/:id/status -> updateStudentStatus -> Student (student.js)

### 21. PUT /api/admin/students/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:84
- Controller: backend/src/controllers/adminController.js:348 `updateStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> PUT /api/admin/students/:id -> updateStudent -> Student (student.js)

### 22. PUT /api/v1/admin/students/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:84
- Controller: backend/src/controllers/adminController.js:348 `updateStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/students/:id -> updateStudent -> Student (student.js)

### 23. DELETE /api/admin/students/:id (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:85
- Controller: backend/src/controllers/adminController.js:423 `deleteStudent`
- Frontend caller: adminApi.deleteStudent (src/components/dashboard/admin/views/UserManagement.tsx:125)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), Student (student.js); external calls: none
- Flow: adminApi.deleteStudent -> DELETE /api/admin/students/:id -> deleteStudent -> Application (application.js), Student (student.js)

### 24. DELETE /api/v1/admin/students/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:85
- Controller: backend/src/controllers/adminController.js:423 `deleteStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), Student (student.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/v1/admin/students/:id -> deleteStudent -> Application (application.js), Student (student.js)

### 25. GET /api/admin/colleges (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:90
- Controller: backend/src/controllers/adminController.js:502 `getAllColleges`
- Frontend caller: adminApi.getColleges (src/components/dashboard/admin/views/UserManagement.tsx:56)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: limit = 20, page = 1, q, status, verificationStatus; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: adminApi.getColleges -> GET /api/admin/colleges -> getAllColleges -> College (college.js)

### 26. GET /api/v1/admin/colleges (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:90
- Controller: backend/src/controllers/adminController.js:502 `getAllColleges`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: limit = 20, page = 1, q, status, verificationStatus; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/colleges -> getAllColleges -> College (college.js)

### 27. POST /api/admin/colleges (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:91
- Controller: backend/src/controllers/adminController.js:457 `createCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: address, city, code, email, name, password, phone, state, university, website
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> POST /api/admin/colleges -> createCollege -> College (college.js)

### 28. POST /api/v1/admin/colleges (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:91
- Controller: backend/src/controllers/adminController.js:457 `createCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: address, city, code, email, name, password, phone, state, university, website
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/colleges -> createCollege -> College (college.js)

### 29. GET /api/admin/colleges/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:92
- Controller: backend/src/controllers/adminController.js:552 `getCollegeById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/colleges/:id -> getCollegeById -> College (college.js)

### 30. GET /api/v1/admin/colleges/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:92
- Controller: backend/src/controllers/adminController.js:552 `getCollegeById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/colleges/:id -> getCollegeById -> College (college.js)

### 31. PATCH /api/admin/colleges/:id/status (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:93
- Controller: backend/src/controllers/adminController.js:611 `updateCollegeStatus`
- Frontend caller: adminApi.updateCollegeStatus (src/components/dashboard/admin/views/UserManagement.tsx:106)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: adminApi.updateCollegeStatus -> PATCH /api/admin/colleges/:id/status -> updateCollegeStatus -> College (college.js)

### 32. PATCH /api/v1/admin/colleges/:id/status (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:93
- Controller: backend/src/controllers/adminController.js:611 `updateCollegeStatus`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/v1/admin/colleges/:id/status -> updateCollegeStatus -> College (college.js)

### 33. PUT /api/admin/colleges/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:94
- Controller: backend/src/controllers/adminController.js:573 `updateCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> PUT /api/admin/colleges/:id -> updateCollege -> College (college.js)

### 34. PUT /api/v1/admin/colleges/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:94
- Controller: backend/src/controllers/adminController.js:573 `updateCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/colleges/:id -> updateCollege -> College (college.js)

### 35. DELETE /api/admin/colleges/:id (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:95
- Controller: backend/src/controllers/adminController.js:647 `deleteCollege`
- Frontend caller: adminApi.deleteCollege (src/components/dashboard/admin/views/UserManagement.tsx:127)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: adminApi.deleteCollege -> DELETE /api/admin/colleges/:id -> deleteCollege -> College (college.js)

### 36. DELETE /api/v1/admin/colleges/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:95
- Controller: backend/src/controllers/adminController.js:647 `deleteCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/v1/admin/colleges/:id -> deleteCollege -> College (college.js)

### 37. GET /api/admin/recruiters (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:100
- Controller: backend/src/controllers/adminController.js:726 `getAllRecruiters`
- Frontend caller: adminApi.getRecruiters (src/components/dashboard/admin/views/UserManagement.tsx:68)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: limit = 20, page = 1, q, status, verificationStatus; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: adminApi.getRecruiters -> GET /api/admin/recruiters -> getAllRecruiters -> Recruiter (recruiter.js)

### 38. GET /api/v1/admin/recruiters (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:100
- Controller: backend/src/controllers/adminController.js:726 `getAllRecruiters`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: limit = 20, page = 1, q, status, verificationStatus; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/recruiters -> getAllRecruiters -> Recruiter (recruiter.js)

### 39. POST /api/admin/recruiters (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:101
- Controller: backend/src/controllers/adminController.js:678 `createRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: company, designation, email, name, phone
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> POST /api/admin/recruiters -> createRecruiter -> Recruiter (recruiter.js)

### 40. POST /api/v1/admin/recruiters (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:101
- Controller: backend/src/controllers/adminController.js:678 `createRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: company, designation, email, name, phone
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/recruiters -> createRecruiter -> Recruiter (recruiter.js)

### 41. GET /api/admin/recruiters/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:102
- Controller: backend/src/controllers/adminController.js:776 `getRecruiterById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/recruiters/:id -> getRecruiterById -> Recruiter (recruiter.js)

### 42. GET /api/v1/admin/recruiters/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:102
- Controller: backend/src/controllers/adminController.js:776 `getRecruiterById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/recruiters/:id -> getRecruiterById -> Recruiter (recruiter.js)

### 43. PATCH /api/admin/recruiters/:id/status (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:103
- Controller: backend/src/controllers/adminController.js:830 `updateRecruiterStatus`
- Frontend caller: adminApi.updateRecruiterStatus (src/components/dashboard/admin/views/UserManagement.tsx:108)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: adminApi.updateRecruiterStatus -> PATCH /api/admin/recruiters/:id/status -> updateRecruiterStatus -> Recruiter (recruiter.js)

### 44. PATCH /api/v1/admin/recruiters/:id/status (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:103
- Controller: backend/src/controllers/adminController.js:830 `updateRecruiterStatus`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/v1/admin/recruiters/:id/status -> updateRecruiterStatus -> Recruiter (recruiter.js)

### 45. PUT /api/admin/recruiters/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:104
- Controller: backend/src/controllers/adminController.js:796 `updateRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> PUT /api/admin/recruiters/:id -> updateRecruiter -> Recruiter (recruiter.js)

### 46. PUT /api/v1/admin/recruiters/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:104
- Controller: backend/src/controllers/adminController.js:796 `updateRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/recruiters/:id -> updateRecruiter -> Recruiter (recruiter.js)

### 47. DELETE /api/admin/recruiters/:id (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:105
- Controller: backend/src/controllers/adminController.js:866 `deleteRecruiter`
- Frontend caller: adminApi.deleteRecruiter (src/components/dashboard/admin/views/UserManagement.tsx:129)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: adminApi.deleteRecruiter -> DELETE /api/admin/recruiters/:id -> deleteRecruiter -> Recruiter (recruiter.js)

### 48. DELETE /api/v1/admin/recruiters/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:105
- Controller: backend/src/controllers/adminController.js:866 `deleteRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/v1/admin/recruiters/:id -> deleteRecruiter -> Recruiter (recruiter.js)

### 49. GET /api/admin/companies (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:106
- Controller: backend/src/controllers/adminController.js:893 `getAllCompanies`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Company (company.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/companies -> getAllCompanies -> Company (company.js)

### 50. GET /api/v1/admin/companies (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:106
- Controller: backend/src/controllers/adminController.js:893 `getAllCompanies`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Company (company.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/companies -> getAllCompanies -> Company (company.js)

### 51. GET /api/admin/projects (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:111
- Controller: backend/src/controllers/adminController.js:928 `getAllProjects`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: approvalStatus, limit = 20, page = 1, q, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/projects -> getAllProjects -> Project (project.js)

### 52. GET /api/v1/admin/projects (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:111
- Controller: backend/src/controllers/adminController.js:928 `getAllProjects`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: approvalStatus, limit = 20, page = 1, q, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/projects -> getAllProjects -> Project (project.js)

### 53. POST /api/admin/projects (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:112
- Controller: backend/src/controllers/adminController.js:906 `createProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> POST /api/admin/projects -> createProject -> Project (project.js)

### 54. POST /api/v1/admin/projects (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:112
- Controller: backend/src/controllers/adminController.js:906 `createProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/projects -> createProject -> Project (project.js)

### 55. PUT /api/admin/projects/:id/approve (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:113
- Controller: backend/src/controllers/adminController.js:1037 `approveProject`
- Frontend caller: adminApi.approveProject (src/components/dashboard/admin/views/VerificationQueue.tsx:104)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: adminApi.approveProject -> PUT /api/admin/projects/:id/approve -> approveProject -> Project (project.js)

### 56. PUT /api/v1/admin/projects/:id/approve (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:113
- Controller: backend/src/controllers/adminController.js:1037 `approveProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/projects/:id/approve -> approveProject -> Project (project.js)

### 57. PATCH /api/admin/projects/:id/approve (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:114
- Controller: backend/src/controllers/adminController.js:1037 `approveProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/admin/projects/:id/approve -> approveProject -> Project (project.js)

### 58. PATCH /api/v1/admin/projects/:id/approve (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:114
- Controller: backend/src/controllers/adminController.js:1037 `approveProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/v1/admin/projects/:id/approve -> approveProject -> Project (project.js)

### 59. PUT /api/admin/projects/:id/approval (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:115
- Controller: backend/src/controllers/adminController.js:1037 `approveProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PUT /api/admin/projects/:id/approval -> approveProject -> Project (project.js)

### 60. PUT /api/v1/admin/projects/:id/approval (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:115
- Controller: backend/src/controllers/adminController.js:1037 `approveProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/projects/:id/approval -> approveProject -> Project (project.js)

### 61. PATCH /api/admin/projects/:id/approval (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:116
- Controller: backend/src/controllers/adminController.js:1037 `approveProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/admin/projects/:id/approval -> approveProject -> Project (project.js)

### 62. PATCH /api/v1/admin/projects/:id/approval (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:116
- Controller: backend/src/controllers/adminController.js:1037 `approveProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/v1/admin/projects/:id/approval -> approveProject -> Project (project.js)

### 63. PUT /api/admin/projects/:id/reject (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:117
- Controller: backend/src/controllers/adminController.js:1074 `rejectProject`
- Frontend caller: adminApi.rejectProject (src/components/dashboard/admin/views/VerificationQueue.tsx:114)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: adminApi.rejectProject -> PUT /api/admin/projects/:id/reject -> rejectProject -> Project (project.js)

### 64. PUT /api/v1/admin/projects/:id/reject (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:117
- Controller: backend/src/controllers/adminController.js:1074 `rejectProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/projects/:id/reject -> rejectProject -> Project (project.js)

### 65. PATCH /api/admin/projects/:id/reject (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:118
- Controller: backend/src/controllers/adminController.js:1074 `rejectProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/admin/projects/:id/reject -> rejectProject -> Project (project.js)

### 66. PATCH /api/v1/admin/projects/:id/reject (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:118
- Controller: backend/src/controllers/adminController.js:1074 `rejectProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/v1/admin/projects/:id/reject -> rejectProject -> Project (project.js)

### 67. GET /api/admin/projects/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:119
- Controller: backend/src/controllers/adminController.js:980 `getProjectById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/projects/:id -> getProjectById -> Project (project.js)

### 68. GET /api/v1/admin/projects/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:119
- Controller: backend/src/controllers/adminController.js:980 `getProjectById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/projects/:id -> getProjectById -> Project (project.js)

### 69. PUT /api/admin/projects/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:120
- Controller: backend/src/controllers/adminController.js:1002 `updateProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PUT /api/admin/projects/:id -> updateProject -> Project (project.js)

### 70. PUT /api/v1/admin/projects/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:120
- Controller: backend/src/controllers/adminController.js:1002 `updateProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/projects/:id -> updateProject -> Project (project.js)

### 71. DELETE /api/admin/projects/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:121
- Controller: backend/src/controllers/adminController.js:1110 `deleteProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), Project (project.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/admin/projects/:id -> deleteProject -> Application (application.js), Project (project.js)

### 72. DELETE /api/v1/admin/projects/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:121
- Controller: backend/src/controllers/adminController.js:1110 `deleteProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), Project (project.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/v1/admin/projects/:id -> deleteProject -> Application (application.js), Project (project.js)

### 73. GET /api/admin/verifications (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:126
- Controller: backend/src/controllers/adminController.js:1144 `getVerificationQueue`
- Frontend caller: adminApi.getVerificationQueue (src/components/dashboard/admin/views/VerificationQueue.tsx:37)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js), Project (project.js), Recruiter (recruiter.js); external calls: none
- Flow: adminApi.getVerificationQueue -> GET /api/admin/verifications -> getVerificationQueue -> College (college.js), Project (project.js), Recruiter (recruiter.js)

### 74. GET /api/v1/admin/verifications (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:126
- Controller: backend/src/controllers/adminController.js:1144 `getVerificationQueue`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js), Project (project.js), Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/verifications -> getVerificationQueue -> College (college.js), Project (project.js), Recruiter (recruiter.js)

### 75. GET /api/admin/verification-queue (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:127
- Controller: backend/src/controllers/adminController.js:1144 `getVerificationQueue`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js), Project (project.js), Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/verification-queue -> getVerificationQueue -> College (college.js), Project (project.js), Recruiter (recruiter.js)

### 76. GET /api/v1/admin/verification-queue (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:127
- Controller: backend/src/controllers/adminController.js:1144 `getVerificationQueue`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js), Project (project.js), Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/verification-queue -> getVerificationQueue -> College (college.js), Project (project.js), Recruiter (recruiter.js)

### 77. PUT /api/admin/verifications/colleges/:id (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:128
- Controller: backend/src/controllers/adminController.js:1182 `verifyCollege`
- Frontend caller: adminApi.verifyCollege (src/components/dashboard/admin/views/VerificationQueue.tsx:58, src/components/dashboard/admin/views/VerificationQueue.tsx:71)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: adminApi.verifyCollege -> PUT /api/admin/verifications/colleges/:id -> verifyCollege -> College (college.js)

### 78. PUT /api/v1/admin/verifications/colleges/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:128
- Controller: backend/src/controllers/adminController.js:1182 `verifyCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/verifications/colleges/:id -> verifyCollege -> College (college.js)

### 79. PATCH /api/admin/verifications/colleges/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:129
- Controller: backend/src/controllers/adminController.js:1182 `verifyCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/admin/verifications/colleges/:id -> verifyCollege -> College (college.js)

### 80. PATCH /api/v1/admin/verifications/colleges/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:129
- Controller: backend/src/controllers/adminController.js:1182 `verifyCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/v1/admin/verifications/colleges/:id -> verifyCollege -> College (college.js)

### 81. PUT /api/admin/colleges/:id/verify (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:130
- Controller: backend/src/controllers/adminController.js:1182 `verifyCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> PUT /api/admin/colleges/:id/verify -> verifyCollege -> College (college.js)

### 82. PUT /api/v1/admin/colleges/:id/verify (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:130
- Controller: backend/src/controllers/adminController.js:1182 `verifyCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/colleges/:id/verify -> verifyCollege -> College (college.js)

### 83. PATCH /api/admin/colleges/:id/verify (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:131
- Controller: backend/src/controllers/adminController.js:1182 `verifyCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/admin/colleges/:id/verify -> verifyCollege -> College (college.js)

### 84. PATCH /api/v1/admin/colleges/:id/verify (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:131
- Controller: backend/src/controllers/adminController.js:1182 `verifyCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/v1/admin/colleges/:id/verify -> verifyCollege -> College (college.js)

### 85. PUT /api/admin/verifications/recruiters/:id (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:132
- Controller: backend/src/controllers/adminController.js:1227 `verifyRecruiter`
- Frontend caller: adminApi.verifyRecruiter (src/components/dashboard/admin/views/VerificationQueue.tsx:81, src/components/dashboard/admin/views/VerificationQueue.tsx:94)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: adminApi.verifyRecruiter -> PUT /api/admin/verifications/recruiters/:id -> verifyRecruiter -> Recruiter (recruiter.js)

### 86. PUT /api/v1/admin/verifications/recruiters/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:132
- Controller: backend/src/controllers/adminController.js:1227 `verifyRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/verifications/recruiters/:id -> verifyRecruiter -> Recruiter (recruiter.js)

### 87. PATCH /api/admin/verifications/recruiters/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:133
- Controller: backend/src/controllers/adminController.js:1227 `verifyRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/admin/verifications/recruiters/:id -> verifyRecruiter -> Recruiter (recruiter.js)

### 88. PATCH /api/v1/admin/verifications/recruiters/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:133
- Controller: backend/src/controllers/adminController.js:1227 `verifyRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/v1/admin/verifications/recruiters/:id -> verifyRecruiter -> Recruiter (recruiter.js)

### 89. PUT /api/admin/recruiters/:id/verify (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:134
- Controller: backend/src/controllers/adminController.js:1227 `verifyRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> PUT /api/admin/recruiters/:id/verify -> verifyRecruiter -> Recruiter (recruiter.js)

### 90. PUT /api/v1/admin/recruiters/:id/verify (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:134
- Controller: backend/src/controllers/adminController.js:1227 `verifyRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/recruiters/:id/verify -> verifyRecruiter -> Recruiter (recruiter.js)

### 91. PATCH /api/admin/recruiters/:id/verify (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:135
- Controller: backend/src/controllers/adminController.js:1227 `verifyRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/admin/recruiters/:id/verify -> verifyRecruiter -> Recruiter (recruiter.js)

### 92. PATCH /api/v1/admin/recruiters/:id/verify (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:135
- Controller: backend/src/controllers/adminController.js:1227 `verifyRecruiter`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: note, status, verificationNote, verificationStatus
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/v1/admin/recruiters/:id/verify -> verifyRecruiter -> Recruiter (recruiter.js)

### 93. GET /api/admin/placements/overview (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:140
- Controller: backend/src/controllers/adminController.js:1276 `getPlacementOversight`
- Frontend caller: adminApi.getPlacementOversight (src/components/dashboard/admin/views/PlacementOversight.tsx:30)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), College (college.js), PlacementDrive (placementDrive.js), Project (project.js); external calls: none
- Flow: adminApi.getPlacementOversight -> GET /api/admin/placements/overview -> getPlacementOversight -> Application (application.js), College (college.js), PlacementDrive (placementDrive.js), Project (project.js)

### 94. GET /api/v1/admin/placements/overview (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:140
- Controller: backend/src/controllers/adminController.js:1276 `getPlacementOversight`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), College (college.js), PlacementDrive (placementDrive.js), Project (project.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/placements/overview -> getPlacementOversight -> Application (application.js), College (college.js), PlacementDrive (placementDrive.js), Project (project.js)

### 95. GET /api/admin/placement-oversight (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:141
- Controller: backend/src/controllers/adminController.js:1276 `getPlacementOversight`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), College (college.js), PlacementDrive (placementDrive.js), Project (project.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/placement-oversight -> getPlacementOversight -> Application (application.js), College (college.js), PlacementDrive (placementDrive.js), Project (project.js)

### 96. GET /api/v1/admin/placement-oversight (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:141
- Controller: backend/src/controllers/adminController.js:1276 `getPlacementOversight`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), College (college.js), PlacementDrive (placementDrive.js), Project (project.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/placement-oversight -> getPlacementOversight -> Application (application.js), College (college.js), PlacementDrive (placementDrive.js), Project (project.js)

### 97. GET /api/admin/broadcasts (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:146
- Controller: backend/src/controllers/adminController.js:1383 `getBroadcasts`
- Frontend caller: adminApi.getBroadcasts (src/components/dashboard/admin/views/BroadcastControl.tsx:32)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: limit = 20, page = 1; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Broadcast (broadcast.js); external calls: none
- Flow: adminApi.getBroadcasts -> GET /api/admin/broadcasts -> getBroadcasts -> Broadcast (broadcast.js)

### 98. GET /api/v1/admin/broadcasts (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:146
- Controller: backend/src/controllers/adminController.js:1383 `getBroadcasts`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: limit = 20, page = 1; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Broadcast (broadcast.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/broadcasts -> getBroadcasts -> Broadcast (broadcast.js)

### 99. POST /api/admin/broadcasts (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:147
- Controller: backend/src/controllers/adminController.js:1418 `createBroadcast`
- Frontend caller: adminApi.createBroadcast (src/components/dashboard/admin/views/AdminOverview.tsx:106, src/components/dashboard/admin/views/BroadcastControl.tsx:53)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: message, priority, status, targetAudience, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Broadcast (broadcast.js); external calls: none
- Flow: adminApi.createBroadcast -> POST /api/admin/broadcasts -> createBroadcast -> Broadcast (broadcast.js)

### 100. POST /api/v1/admin/broadcasts (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:147
- Controller: backend/src/controllers/adminController.js:1418 `createBroadcast`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: message, priority, status, targetAudience, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Broadcast (broadcast.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/broadcasts -> createBroadcast -> Broadcast (broadcast.js)

### 101. DELETE /api/admin/broadcasts/:id (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:148
- Controller: backend/src/controllers/adminController.js:1453 `deleteBroadcast`
- Frontend caller: adminApi.deleteBroadcast (src/components/dashboard/admin/views/BroadcastControl.tsx:74)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Broadcast (broadcast.js); external calls: none
- Flow: adminApi.deleteBroadcast -> DELETE /api/admin/broadcasts/:id -> deleteBroadcast -> Broadcast (broadcast.js)

### 102. DELETE /api/v1/admin/broadcasts/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:148
- Controller: backend/src/controllers/adminController.js:1453 `deleteBroadcast`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Broadcast (broadcast.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/v1/admin/broadcasts/:id -> deleteBroadcast -> Broadcast (broadcast.js)

### 103. GET /api/admin/content/roadmaps (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:153
- Controller: backend/src/controllers/adminController.js:1474 `getContentRoadmaps`
- Frontend caller: adminApi.getContentRoadmaps (src/components/dashboard/admin/views/ContentHub.tsx:35)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: category, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: adminApi.getContentRoadmaps -> GET /api/admin/content/roadmaps -> getContentRoadmaps -> ContentRoadmap (contentRoadmap.js)

### 104. GET /api/v1/admin/content/roadmaps (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:153
- Controller: backend/src/controllers/adminController.js:1474 `getContentRoadmaps`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: category, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/content/roadmaps -> getContentRoadmaps -> ContentRoadmap (contentRoadmap.js)

### 105. GET /api/admin/content-roadmaps (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:154
- Controller: backend/src/controllers/adminController.js:1474 `getContentRoadmaps`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: category, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/content-roadmaps -> getContentRoadmaps -> ContentRoadmap (contentRoadmap.js)

### 106. GET /api/v1/admin/content-roadmaps (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:154
- Controller: backend/src/controllers/adminController.js:1474 `getContentRoadmaps`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: category, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/content-roadmaps -> getContentRoadmaps -> ContentRoadmap (contentRoadmap.js)

### 107. POST /api/admin/content/roadmaps (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:155
- Controller: backend/src/controllers/adminController.js:1494 `createContentRoadmap`
- Frontend caller: adminApi.createContentRoadmap (src/components/dashboard/admin/views/ContentHub.tsx:59)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: category, description, status, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: adminApi.createContentRoadmap -> POST /api/admin/content/roadmaps -> createContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 108. POST /api/v1/admin/content/roadmaps (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:155
- Controller: backend/src/controllers/adminController.js:1494 `createContentRoadmap`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: category, description, status, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/content/roadmaps -> createContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 109. POST /api/admin/content-roadmaps (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:156
- Controller: backend/src/controllers/adminController.js:1494 `createContentRoadmap`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: category, description, status, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> POST /api/admin/content-roadmaps -> createContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 110. POST /api/v1/admin/content-roadmaps (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:156
- Controller: backend/src/controllers/adminController.js:1494 `createContentRoadmap`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: category, description, status, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/content-roadmaps -> createContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 111. PUT /api/admin/content/roadmaps/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:157
- Controller: backend/src/controllers/adminController.js:1527 `updateContentRoadmap`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> PUT /api/admin/content/roadmaps/:id -> updateContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 112. PUT /api/v1/admin/content/roadmaps/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:157
- Controller: backend/src/controllers/adminController.js:1527 `updateContentRoadmap`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/content/roadmaps/:id -> updateContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 113. PUT /api/admin/content-roadmaps/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:158
- Controller: backend/src/controllers/adminController.js:1527 `updateContentRoadmap`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> PUT /api/admin/content-roadmaps/:id -> updateContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 114. PUT /api/v1/admin/content-roadmaps/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:158
- Controller: backend/src/controllers/adminController.js:1527 `updateContentRoadmap`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/content-roadmaps/:id -> updateContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 115. DELETE /api/admin/content/roadmaps/:id (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:159
- Controller: backend/src/controllers/adminController.js:1549 `deleteContentRoadmap`
- Frontend caller: adminApi.deleteContentRoadmap (src/components/dashboard/admin/views/ContentHub.tsx:78)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: adminApi.deleteContentRoadmap -> DELETE /api/admin/content/roadmaps/:id -> deleteContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 116. DELETE /api/v1/admin/content/roadmaps/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:159
- Controller: backend/src/controllers/adminController.js:1549 `deleteContentRoadmap`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/v1/admin/content/roadmaps/:id -> deleteContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 117. DELETE /api/admin/content-roadmaps/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:160
- Controller: backend/src/controllers/adminController.js:1549 `deleteContentRoadmap`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/admin/content-roadmaps/:id -> deleteContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 118. DELETE /api/v1/admin/content-roadmaps/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:160
- Controller: backend/src/controllers/adminController.js:1549 `deleteContentRoadmap`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: ContentRoadmap (contentRoadmap.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/v1/admin/content-roadmaps/:id -> deleteContentRoadmap -> ContentRoadmap (contentRoadmap.js)

### 119. GET /api/admin/support/tickets (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:165
- Controller: backend/src/controllers/adminController.js:1570 `getSupportTickets`
- Frontend caller: adminApi.getSupportTickets (src/components/dashboard/admin/views/SupportCenter.tsx:49)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: priority, q, status, type; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: adminApi.getSupportTickets -> GET /api/admin/support/tickets -> getSupportTickets -> SupportTicket (supportTicket.js)

### 120. GET /api/v1/admin/support/tickets (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:165
- Controller: backend/src/controllers/adminController.js:1570 `getSupportTickets`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: priority, q, status, type; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/support/tickets -> getSupportTickets -> SupportTicket (supportTicket.js)

### 121. GET /api/admin/support-tickets (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:166
- Controller: backend/src/controllers/adminController.js:1570 `getSupportTickets`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: priority, q, status, type; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/support-tickets -> getSupportTickets -> SupportTicket (supportTicket.js)

### 122. GET /api/v1/admin/support-tickets (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:166
- Controller: backend/src/controllers/adminController.js:1570 `getSupportTickets`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: priority, q, status, type; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/support-tickets -> getSupportTickets -> SupportTicket (supportTicket.js)

### 123. POST /api/admin/support/tickets (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:167
- Controller: backend/src/controllers/adminController.js:1634 `createSupportTicket`
- Frontend caller: adminApi.createSupportTicket (src/components/dashboard/admin/views/SupportCenter.tsx:118)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: description, message, priority, requesterEmail, requesterName, requesterRole, subject, title, type
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: adminApi.createSupportTicket -> POST /api/admin/support/tickets -> createSupportTicket -> SupportTicket (supportTicket.js)

### 124. POST /api/v1/admin/support/tickets (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:167
- Controller: backend/src/controllers/adminController.js:1634 `createSupportTicket`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: description, message, priority, requesterEmail, requesterName, requesterRole, subject, title, type
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/support/tickets -> createSupportTicket -> SupportTicket (supportTicket.js)

### 125. POST /api/admin/support-tickets (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:168
- Controller: backend/src/controllers/adminController.js:1634 `createSupportTicket`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: description, message, priority, requesterEmail, requesterName, requesterRole, subject, title, type
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> POST /api/admin/support-tickets -> createSupportTicket -> SupportTicket (supportTicket.js)

### 126. POST /api/v1/admin/support-tickets (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:168
- Controller: backend/src/controllers/adminController.js:1634 `createSupportTicket`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: description, message, priority, requesterEmail, requesterName, requesterRole, subject, title, type
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/support-tickets -> createSupportTicket -> SupportTicket (supportTicket.js)

### 127. POST /api/admin/support/tickets/:id/reply (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:169
- Controller: backend/src/controllers/adminController.js:1684 `replySupportTicket`
- Frontend caller: adminApi.replySupportTicket (src/components/dashboard/admin/views/SupportCenter.tsx:89)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: isInternalNote, message, text
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: adminApi.replySupportTicket -> POST /api/admin/support/tickets/:id/reply -> replySupportTicket -> SupportTicket (supportTicket.js)

### 128. POST /api/v1/admin/support/tickets/:id/reply (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:169
- Controller: backend/src/controllers/adminController.js:1684 `replySupportTicket`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: isInternalNote, message, text
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/support/tickets/:id/reply -> replySupportTicket -> SupportTicket (supportTicket.js)

### 129. POST /api/admin/support-tickets/:id/reply (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:170
- Controller: backend/src/controllers/adminController.js:1684 `replySupportTicket`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: isInternalNote, message, text
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> POST /api/admin/support-tickets/:id/reply -> replySupportTicket -> SupportTicket (supportTicket.js)

### 130. POST /api/v1/admin/support-tickets/:id/reply (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:170
- Controller: backend/src/controllers/adminController.js:1684 `replySupportTicket`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: isInternalNote, message, text
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/support-tickets/:id/reply -> replySupportTicket -> SupportTicket (supportTicket.js)

### 131. PUT /api/admin/support/tickets/:id/status (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:171
- Controller: backend/src/controllers/adminController.js:1731 `updateSupportTicketStatus`
- Frontend caller: adminApi.updateSupportTicketStatus (src/components/dashboard/admin/views/SupportCenter.tsx:104)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: adminApi.updateSupportTicketStatus -> PUT /api/admin/support/tickets/:id/status -> updateSupportTicketStatus -> SupportTicket (supportTicket.js)

### 132. PUT /api/v1/admin/support/tickets/:id/status (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:171
- Controller: backend/src/controllers/adminController.js:1731 `updateSupportTicketStatus`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/support/tickets/:id/status -> updateSupportTicketStatus -> SupportTicket (supportTicket.js)

### 133. PUT /api/admin/support-tickets/:id/status (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:172
- Controller: backend/src/controllers/adminController.js:1731 `updateSupportTicketStatus`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> PUT /api/admin/support-tickets/:id/status -> updateSupportTicketStatus -> SupportTicket (supportTicket.js)

### 134. PUT /api/v1/admin/support-tickets/:id/status (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:172
- Controller: backend/src/controllers/adminController.js:1731 `updateSupportTicketStatus`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/support-tickets/:id/status -> updateSupportTicketStatus -> SupportTicket (supportTicket.js)

### 135. GET /api/admin/support/tickets/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:173
- Controller: backend/src/controllers/adminController.js:1614 `getSupportTicketById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/support/tickets/:id -> getSupportTicketById -> SupportTicket (supportTicket.js)

### 136. GET /api/v1/admin/support/tickets/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:173
- Controller: backend/src/controllers/adminController.js:1614 `getSupportTicketById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/support/tickets/:id -> getSupportTicketById -> SupportTicket (supportTicket.js)

### 137. GET /api/admin/support-tickets/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:174
- Controller: backend/src/controllers/adminController.js:1614 `getSupportTicketById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/support-tickets/:id -> getSupportTicketById -> SupportTicket (supportTicket.js)

### 138. GET /api/v1/admin/support-tickets/:id (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:174
- Controller: backend/src/controllers/adminController.js:1614 `getSupportTicketById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: SupportTicket (supportTicket.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/support-tickets/:id -> getSupportTicketById -> SupportTicket (supportTicket.js)

### 139. GET /api/admin/analytics (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:179
- Controller: backend/src/controllers/adminController.js:1771 `getPlatformAnalytics`
- Frontend caller: adminApi.getPlatformAnalytics (src/components/dashboard/admin/views/AnalyticsView.tsx:28)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), College (college.js), Recruiter (recruiter.js), Student (student.js); external calls: none
- Flow: adminApi.getPlatformAnalytics -> GET /api/admin/analytics -> getPlatformAnalytics -> Application (application.js), College (college.js), Recruiter (recruiter.js), Student (student.js)

### 140. GET /api/v1/admin/analytics (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:179
- Controller: backend/src/controllers/adminController.js:1771 `getPlatformAnalytics`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), College (college.js), Recruiter (recruiter.js), Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/analytics -> getPlatformAnalytics -> Application (application.js), College (college.js), Recruiter (recruiter.js), Student (student.js)

### 141. GET /api/admin/settings (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:184
- Controller: backend/src/controllers/adminController.js:1826 `getSystemSettings`
- Frontend caller: adminApi.getSystemSettings (src/components/dashboard/admin/views/SettingsView.tsx:47)
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SystemSetting (systemSetting.js); external calls: none
- Flow: adminApi.getSystemSettings -> GET /api/admin/settings -> getSystemSettings -> SystemSetting (systemSetting.js)

### 142. GET /api/v1/admin/settings (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:184
- Controller: backend/src/controllers/adminController.js:1826 `getSystemSettings`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SystemSetting (systemSetting.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/settings -> getSystemSettings -> SystemSetting (systemSetting.js)

### 143. PUT /api/admin/settings (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/adminRoutes.js:185
- Controller: backend/src/controllers/adminController.js:1856 `updateSystemSettings`
- Frontend caller: adminApi.updateSystemSettings (src/components/dashboard/admin/views/SettingsView.tsx:87)
- Auth / role: Bearer JWT; Super Admin; middleware: adminAuth, requireSuperAdmin
- Request path parameters: none; query: none; direct body fields: aiReadinessWeights, apiIntegrations, maintenanceMode
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SystemSetting (systemSetting.js); external calls: none
- Flow: adminApi.updateSystemSettings -> PUT /api/admin/settings -> updateSystemSettings -> SystemSetting (systemSetting.js)

### 144. PUT /api/v1/admin/settings (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:185
- Controller: backend/src/controllers/adminController.js:1856 `updateSystemSettings`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Super Admin; middleware: adminAuth, requireSuperAdmin
- Request path parameters: none; query: none; direct body fields: aiReadinessWeights, apiIntegrations, maintenanceMode
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: SystemSetting (systemSetting.js); external calls: none
- Flow: No frontend caller found -> PUT /api/v1/admin/settings -> updateSystemSettings -> SystemSetting (systemSetting.js)

### 145. GET /api/admin/activity (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/adminRoutes.js:190
- Controller: backend/src/controllers/adminController.js:1908 `getAdminActivities`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: action, limit = 20, page = 1, targetModel; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: AdminActivity (adminActivity.js); external calls: none
- Flow: No frontend caller found -> GET /api/admin/activity -> getAdminActivities -> AdminActivity (adminActivity.js)

### 146. GET /api/v1/admin/activity (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/adminRoutes.js:190
- Controller: backend/src/controllers/adminController.js:1908 `getAdminActivities`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: action, limit = 20, page = 1, targetModel; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: AdminActivity (adminActivity.js); external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/activity -> getAdminActivities -> AdminActivity (adminActivity.js)

### 147. POST /api/college/register (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:73
- Controller: backend/src/controllers/collegeController.js:23 `registerCollege`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: address, email, name, password, phone, university, website
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> POST /api/college/register -> registerCollege -> College (college.js)

### 148. POST /api/college/auth/register (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:74
- Controller: backend/src/controllers/collegeController.js:23 `registerCollege`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: address, email, name, password, phone, university, website
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> POST /api/college/auth/register -> registerCollege -> College (college.js)

### 149. POST /api/college/login (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:75
- Controller: backend/src/controllers/collegeController.js:94 `loginCollege`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> POST /api/college/login -> loginCollege -> College (college.js)

### 150. POST /api/college/auth/login (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:76
- Controller: backend/src/controllers/collegeController.js:94 `loginCollege`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js); external calls: none
- Flow: No frontend caller found -> POST /api/college/auth/login -> loginCollege -> College (college.js)

### 151. GET /api/college/profile (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:81
- Controller: backend/src/controllers/collegeController.js:146 `getCollegeProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: No direct model call found; external calls: none
- Flow: No frontend caller found -> GET /api/college/profile -> getCollegeProfile -> No direct model call found

### 152. PUT /api/college/profile (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:82
- Controller: backend/src/controllers/collegeController.js:161 `updateCollegeProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: address, city, code, description, name, phone, placementOfficerEmail, placementOfficerName, placementOfficerPhone, state, university, website
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: No direct model call found; external calls: none
- Flow: No frontend caller found -> PUT /api/college/profile -> updateCollegeProfile -> No direct model call found

### 153. PATCH /api/college/profile (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:83
- Controller: backend/src/controllers/collegeController.js:161 `updateCollegeProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: address, city, code, description, name, phone, placementOfficerEmail, placementOfficerName, placementOfficerPhone, state, university, website
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: No direct model call found; external calls: none
- Flow: No frontend caller found -> PATCH /api/college/profile -> updateCollegeProfile -> No direct model call found

### 154. GET /api/college/dashboard (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:84
- Controller: backend/src/controllers/collegeController.js:219 `getCollegeDashboardStats`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), Project (project.js), Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/dashboard -> getCollegeDashboardStats -> Application (application.js), Project (project.js), Student (student.js)

### 155. POST /api/college/students/bulk-import (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:89
- Controller: backend/src/controllers/collegeController.js:272 `bulkImportStudents`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: csvData, students, trim
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js), Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/college/students/bulk-import -> bulkImportStudents -> College (college.js), Student (student.js)

### 156. GET /api/college/students/export (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:90
- Controller: backend/src/controllers/collegeController.js:445 `exportStudentsCSV`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: branch, minPercentage, search, semester, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/students/export -> exportStudentsCSV -> Student (student.js)

### 157. PATCH /api/college/students/bulk (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:91
- Controller: backend/src/controllers/collegeController.js:514 `bulkUpdateStudents`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: studentIds, updates
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/college/students/bulk -> bulkUpdateStudents -> Student (student.js)

### 158. POST /api/college/students (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:92
- Controller: backend/src/controllers/collegeController.js:693 `createStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: College (college.js), Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/college/students -> createStudent -> College (college.js), Student (student.js)

### 159. GET /api/college/students (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:93
- Controller: backend/src/controllers/collegeController.js:718 `getAllStudents`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: branch, limit, page, search, semester, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/students -> getAllStudents -> Student (student.js)

### 160. GET /api/college/students/eligible (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:94
- Controller: backend/src/controllers/collegeController.js:1527 `getEligibleStudents`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/students/eligible -> getEligibleStudents -> Student (student.js)

### 161. GET /api/college/students/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:95
- Controller: backend/src/controllers/collegeController.js:777 `getStudentById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/students/:id -> getStudentById -> Student (student.js)

### 162. PUT /api/college/students/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:96
- Controller: backend/src/controllers/collegeController.js:800 `updateStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> PUT /api/college/students/:id -> updateStudent -> Student (student.js)

### 163. PATCH /api/college/students/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:97
- Controller: backend/src/controllers/collegeController.js:800 `updateStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/college/students/:id -> updateStudent -> Student (student.js)

### 164. DELETE /api/college/students/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:98
- Controller: backend/src/controllers/collegeController.js:830 `deleteStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/college/students/:id -> deleteStudent -> Student (student.js)

### 165. GET /api/college/applications/summary (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:103
- Controller: backend/src/controllers/collegeController.js:856 `getApplicationSummary`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/applications/summary -> getApplicationSummary -> Application (application.js), Student (student.js)

### 166. GET /api/college/applications/:id/history (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:104
- Controller: backend/src/controllers/collegeController.js:966 `getApplicationStatusHistory`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), ApplicationStatusHistory (applicationStatusHistory.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/applications/:id/history -> getApplicationStatusHistory -> Application (application.js), ApplicationStatusHistory (applicationStatusHistory.js)

### 167. POST /api/college/applications (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:105
- Controller: backend/src/controllers/collegeController.js:1006 `createApplication`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: remarks
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), ApplicationStatusHistory (applicationStatusHistory.js); external calls: none
- Flow: No frontend caller found -> POST /api/college/applications -> createApplication -> Application (application.js), ApplicationStatusHistory (applicationStatusHistory.js)

### 168. GET /api/college/applications (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:106
- Controller: backend/src/controllers/collegeController.js:1038 `getAllApplications`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: companyId, endDate, limit, page, projectId, startDate, status, studentId; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/applications -> getAllApplications -> Application (application.js), Student (student.js)

### 169. GET /api/college/applications/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:107
- Controller: backend/src/controllers/collegeController.js:1199 `getApplicationById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/applications/:id -> getApplicationById -> Application (application.js)

### 170. PUT /api/college/applications/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:108
- Controller: backend/src/controllers/collegeController.js:1232 `updateApplication`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: remarks, status, student
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), ApplicationStatusHistory (applicationStatusHistory.js); external calls: none
- Flow: No frontend caller found -> PUT /api/college/applications/:id -> updateApplication -> Application (application.js), ApplicationStatusHistory (applicationStatusHistory.js)

### 171. PATCH /api/college/applications/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:109
- Controller: backend/src/controllers/collegeController.js:1232 `updateApplication`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: remarks, status, student
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), ApplicationStatusHistory (applicationStatusHistory.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/college/applications/:id -> updateApplication -> Application (application.js), ApplicationStatusHistory (applicationStatusHistory.js)

### 172. DELETE /api/college/applications/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:110
- Controller: backend/src/controllers/collegeController.js:1294 `deleteApplication`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), ApplicationStatusHistory (applicationStatusHistory.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/college/applications/:id -> deleteApplication -> Application (application.js), ApplicationStatusHistory (applicationStatusHistory.js)

### 173. POST /api/college/projects (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:115
- Controller: backend/src/controllers/collegeController.js:1331 `createCollegeProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: applicationDeadline, description, duration, location, mode, openings, requiredSkills, skills, status, stipend, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> POST /api/college/projects -> createCollegeProject -> Project (project.js)

### 174. GET /api/college/projects (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:116
- Controller: backend/src/controllers/collegeController.js:1385 `getCollegeProjects`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: mode, search, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/projects -> getCollegeProjects -> Project (project.js)

### 175. GET /api/college/projects/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:117
- Controller: backend/src/controllers/collegeController.js:1419 `getCollegeProjectById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/projects/:id -> getCollegeProjectById -> Project (project.js)

### 176. PUT /api/college/projects/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:118
- Controller: backend/src/controllers/collegeController.js:1449 `updateCollegeProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> PUT /api/college/projects/:id -> updateCollegeProject -> Project (project.js)

### 177. DELETE /api/college/projects/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:119
- Controller: backend/src/controllers/collegeController.js:1488 `deleteCollegeProject`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Project (project.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/college/projects/:id -> deleteCollegeProject -> Project (project.js)

### 178. POST /api/college/drives (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:124
- Controller: backend/src/controllers/collegeController.js:1548 `createPlacementDrive`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: capacityLimit, company, companyName, deadline, deadlineDate, description, driveDate, eligibility, eligibilityCriteria, eligibleBranches, jobRole, location, mode, packageLPA, stageStatus, status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: PlacementDrive (placementDrive.js); external calls: none
- Flow: No frontend caller found -> POST /api/college/drives -> createPlacementDrive -> PlacementDrive (placementDrive.js)

### 179. GET /api/college/drives (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:125
- Controller: backend/src/controllers/collegeController.js:1623 `getPlacementDrives`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: mode, search, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: PlacementDrive (placementDrive.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/drives -> getPlacementDrives -> PlacementDrive (placementDrive.js)

### 180. GET /api/college/drives/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:126
- Controller: backend/src/controllers/collegeController.js:1663 `getPlacementDriveById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: PlacementDrive (placementDrive.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/drives/:id -> getPlacementDriveById -> PlacementDrive (placementDrive.js)

### 181. PUT /api/college/drives/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:127
- Controller: backend/src/controllers/collegeController.js:1697 `updatePlacementDrive`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404 (code-observed or middleware; not exhaustive)
- Model/service: PlacementDrive (placementDrive.js); external calls: none
- Flow: No frontend caller found -> PUT /api/college/drives/:id -> updatePlacementDrive -> PlacementDrive (placementDrive.js)

### 182. DELETE /api/college/drives/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:128
- Controller: backend/src/controllers/collegeController.js:1740 `deletePlacementDrive`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: PlacementDrive (placementDrive.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/college/drives/:id -> deletePlacementDrive -> PlacementDrive (placementDrive.js)

### 183. GET /api/college/drives/:driveId/participants (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:129
- Controller: backend/src/controllers/collegeController.js:2361 `getDriveParticipants`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: driveId; query: stage, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), PlacementDrive (placementDrive.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/drives/:driveId/participants -> getDriveParticipants -> Application (application.js), PlacementDrive (placementDrive.js)

### 184. PATCH /api/college/drives/:driveId/participants/:participantId (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:130
- Controller: backend/src/controllers/collegeController.js:2413 `updateParticipantStatus`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: driveId, participantId; query: none; direct body fields: stage, stageStatus, status
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), PlacementDrive (placementDrive.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/college/drives/:driveId/participants/:participantId -> updateParticipantStatus -> Application (application.js), PlacementDrive (placementDrive.js)

### 185. GET /api/college/drives/:driveId/eligible-students (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:135
- Controller: backend/src/controllers/collegeController.js:2508 `evaluateDriveEligibleStudents`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: driveId; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: PlacementDrive (placementDrive.js), Student (student.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/drives/:driveId/eligible-students -> evaluateDriveEligibleStudents -> PlacementDrive (placementDrive.js), Student (student.js)

### 186. POST /api/college/broadcasts (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:144
- Controller: backend/src/controllers/collegeController.js:1778 `createBroadcast`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: body, category, content, expiresAt, isUrgent, message, priority, readCount, snippet, status, targetAudience, title, totalCount, type
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Broadcast (broadcast.js); external calls: none
- Flow: No frontend caller found -> POST /api/college/broadcasts -> createBroadcast -> Broadcast (broadcast.js)

### 187. GET /api/college/broadcasts (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:145
- Controller: backend/src/controllers/collegeController.js:1860 `getBroadcasts`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: priority, search, status; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Broadcast (broadcast.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/broadcasts -> getBroadcasts -> Broadcast (broadcast.js)

### 188. GET /api/college/broadcasts/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:146
- Controller: backend/src/controllers/collegeController.js:1898 `getBroadcastById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Broadcast (broadcast.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/broadcasts/:id -> getBroadcastById -> Broadcast (broadcast.js)

### 189. PUT /api/college/broadcasts/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:147
- Controller: backend/src/controllers/collegeController.js:1932 `updateBroadcast`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404 (code-observed or middleware; not exhaustive)
- Model/service: Broadcast (broadcast.js); external calls: none
- Flow: No frontend caller found -> PUT /api/college/broadcasts/:id -> updateBroadcast -> Broadcast (broadcast.js)

### 190. DELETE /api/college/broadcasts/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:148
- Controller: backend/src/controllers/collegeController.js:1975 `deleteBroadcast`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Broadcast (broadcast.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/college/broadcasts/:id -> deleteBroadcast -> Broadcast (broadcast.js)

### 191. GET /api/college/companies (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:153
- Controller: backend/src/controllers/collegeController.js:2013 `getCoordinatingCompanies`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: industry, search; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Company (company.js), PlacementDrive (placementDrive.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/companies -> getCoordinatingCompanies -> Company (company.js), PlacementDrive (placementDrive.js)

### 192. GET /api/college/companies/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:154
- Controller: backend/src/controllers/collegeController.js:2074 `getCompanyDetailsForCollege`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Company (company.js), PlacementDrive (placementDrive.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/companies/:id -> getCompanyDetailsForCollege -> Company (company.js), PlacementDrive (placementDrive.js)

### 193. GET /api/college/recruiters (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:155
- Controller: backend/src/controllers/collegeController.js:2116 `getCoordinatingRecruiters`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: search; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/recruiters -> getCoordinatingRecruiters -> Recruiter (recruiter.js)

### 194. GET /api/college/coordination/visits (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:156
- Controller: backend/src/controllers/collegeController.js:2850 `getCampusVisits`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: search, timeline; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: PlacementDrive (placementDrive.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/coordination/visits -> getCampusVisits -> PlacementDrive (placementDrive.js)

### 195. GET /api/college/coordination/company-summary (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:157
- Controller: backend/src/controllers/collegeController.js:2903 `getCompanyPlacementSummary`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Application (application.js), Company (company.js), PlacementDrive (placementDrive.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/coordination/company-summary -> getCompanyPlacementSummary -> Application (application.js), Company (company.js), PlacementDrive (placementDrive.js)

### 196. GET /api/college/coordination/recruiter-summary (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:162
- Controller: backend/src/controllers/collegeController.js:3001 `getRecruiterPlacementSummary`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: PlacementDrive (placementDrive.js), Recruiter (recruiter.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/coordination/recruiter-summary -> getRecruiterPlacementSummary -> PlacementDrive (placementDrive.js), Recruiter (recruiter.js)

### 197. POST /api/college/eligibility-presets (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:171
- Controller: backend/src/controllers/collegeController.js:2151 `createEligibilityPreset`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: allowedPassingYears, description, eligibleBranches, maxActiveBacklogs, minCgpa, name
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: EligibilityPreset (eligibilityPreset.js); external calls: none
- Flow: No frontend caller found -> POST /api/college/eligibility-presets -> createEligibilityPreset -> EligibilityPreset (eligibilityPreset.js)

### 198. GET /api/college/eligibility-presets (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:172
- Controller: backend/src/controllers/collegeController.js:2203 `getEligibilityPresets`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: search; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: EligibilityPreset (eligibilityPreset.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/eligibility-presets -> getEligibilityPresets -> EligibilityPreset (eligibilityPreset.js)

### 199. GET /api/college/eligibility-presets/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:173
- Controller: backend/src/controllers/collegeController.js:2234 `getEligibilityPresetById`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: EligibilityPreset (eligibilityPreset.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/eligibility-presets/:id -> getEligibilityPresetById -> EligibilityPreset (eligibilityPreset.js)

### 200. PUT /api/college/eligibility-presets/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:178
- Controller: backend/src/controllers/collegeController.js:2272 `updateEligibilityPreset`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404 (code-observed or middleware; not exhaustive)
- Model/service: EligibilityPreset (eligibilityPreset.js); external calls: none
- Flow: No frontend caller found -> PUT /api/college/eligibility-presets/:id -> updateEligibilityPreset -> EligibilityPreset (eligibilityPreset.js)

### 201. DELETE /api/college/eligibility-presets/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:183
- Controller: backend/src/controllers/collegeController.js:2319 `deleteEligibilityPreset`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: EligibilityPreset (eligibilityPreset.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/college/eligibility-presets/:id -> deleteEligibilityPreset -> EligibilityPreset (eligibilityPreset.js)

### 202. GET /api/college/notifications (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:192
- Controller: backend/src/controllers/collegeController.js:2598 `getCollegeNotifications`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: category, isRead, limit, page, type; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: CollegeNotification (collegeNotification.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/notifications -> getCollegeNotifications -> CollegeNotification (collegeNotification.js)

### 203. PATCH /api/college/notifications/read-all (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:193
- Controller: backend/src/controllers/collegeController.js:2697 `markAllNotificationsAsRead`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: CollegeNotification (collegeNotification.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/college/notifications/read-all -> markAllNotificationsAsRead -> CollegeNotification (collegeNotification.js)

### 204. PATCH /api/college/notifications/:id/read (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:198
- Controller: backend/src/controllers/collegeController.js:2653 `markNotificationAsRead`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: CollegeNotification (collegeNotification.js); external calls: none
- Flow: No frontend caller found -> PATCH /api/college/notifications/:id/read -> markNotificationAsRead -> CollegeNotification (collegeNotification.js)

### 205. DELETE /api/college/notifications/:id (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:203
- Controller: backend/src/controllers/collegeController.js:2722 `deleteCollegeNotification`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: id; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: CollegeNotification (collegeNotification.js); external calls: none
- Flow: No frontend caller found -> DELETE /api/college/notifications/:id -> deleteCollegeNotification -> CollegeNotification (collegeNotification.js)

### 206. GET /api/college/activity-logs (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/collegeRoutes.js:212
- Controller: backend/src/controllers/collegeController.js:2793 `getCollegeActivityLogs`
- Frontend caller: none detected
- Auth / role: Bearer JWT; college; middleware: collegeAuth
- Request path parameters: none; query: action, endDate, limit, module, page, startDate; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: CollegeActivityLog (collegeActivityLog.js); external calls: none
- Flow: No frontend caller found -> GET /api/college/activity-logs -> getCollegeActivityLogs -> CollegeActivityLog (collegeActivityLog.js)

### 207. POST /api/student/register (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:27
- Controller: backend/src/controllers/studentController.js:220 `registerStudent`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: branch, college, email, fullName, name, password, phone, role, semester
- Response: JSON {success, message, token, student, user, data:{token, student}}; 201 registration or 200 login on success. Codes: 200, 400, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/student/register -> registerStudent -> Student (student.js)

### 208. POST /api/students/register (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:27
- Controller: backend/src/controllers/studentController.js:220 `registerStudent`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: branch, college, email, fullName, name, password, phone, role, semester
- Response: JSON {success, message, token, student, user, data:{token, student}}; 201 registration or 200 login on success. Codes: 200, 400, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/students/register -> registerStudent -> Student (student.js)

### 209. POST /api/student/login (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:28
- Controller: backend/src/controllers/studentController.js:282 `loginStudent`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password, role
- Response: JSON {success, message, token, student, user, data:{token, student}}; 201 registration or 200 login on success. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/student/login -> loginStudent -> Student (student.js)

### 210. POST /api/students/login (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:28
- Controller: backend/src/controllers/studentController.js:282 `loginStudent`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password, role
- Response: JSON {success, message, token, student, user, data:{token, student}}; 201 registration or 200 login on success. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/students/login -> loginStudent -> Student (student.js)

### 211. POST /api/student/logout (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:29
- Controller: backend/src/controllers/studentController.js:311 `logoutStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/student/logout -> logoutStudent -> Student (student.js), via auth middleware

### 212. POST /api/students/logout (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:29
- Controller: backend/src/controllers/studentController.js:311 `logoutStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/students/logout -> logoutStudent -> Student (student.js), via auth middleware

### 213. POST /api/student/auth/register (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:31
- Controller: backend/src/controllers/studentController.js:220 `registerStudent`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: branch, college, email, fullName, name, password, phone, role, semester
- Response: JSON {success, message, token, student, user, data:{token, student}}; 201 registration or 200 login on success. Codes: 200, 400, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/student/auth/register -> registerStudent -> Student (student.js)

### 214. POST /api/students/auth/register (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:31
- Controller: backend/src/controllers/studentController.js:220 `registerStudent`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: branch, college, email, fullName, name, password, phone, role, semester
- Response: JSON {success, message, token, student, user, data:{token, student}}; 201 registration or 200 login on success. Codes: 200, 400, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/students/auth/register -> registerStudent -> Student (student.js)

### 215. POST /api/student/auth/login (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:32
- Controller: backend/src/controllers/studentController.js:282 `loginStudent`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password, role
- Response: JSON {success, message, token, student, user, data:{token, student}}; 201 registration or 200 login on success. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/student/auth/login -> loginStudent -> Student (student.js)

### 216. POST /api/students/auth/login (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:32
- Controller: backend/src/controllers/studentController.js:282 `loginStudent`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password, role
- Response: JSON {success, message, token, student, user, data:{token, student}}; 201 registration or 200 login on success. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/students/auth/login -> loginStudent -> Student (student.js)

### 217. POST /api/student/auth/logout (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:33
- Controller: backend/src/controllers/studentController.js:311 `logoutStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/student/auth/logout -> logoutStudent -> Student (student.js), via auth middleware

### 218. POST /api/students/auth/logout (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:33
- Controller: backend/src/controllers/studentController.js:311 `logoutStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/students/auth/logout -> logoutStudent -> Student (student.js), via auth middleware

### 219. GET /api/student/auth/me (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:34
- Controller: backend/src/controllers/studentController.js:314 `getStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/student/auth/me -> getStudentProfile -> Student (student.js), via auth middleware

### 220. GET /api/students/auth/me (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:34
- Controller: backend/src/controllers/studentController.js:314 `getStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/students/auth/me -> getStudentProfile -> Student (student.js), via auth middleware

### 221. GET /api/student/me (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:35
- Controller: backend/src/controllers/studentController.js:314 `getStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/student/me -> getStudentProfile -> Student (student.js), via auth middleware

### 222. GET /api/students/me (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:35
- Controller: backend/src/controllers/studentController.js:314 `getStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/students/me -> getStudentProfile -> Student (student.js), via auth middleware

### 223. GET /api/student/profile (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/studentRoutes.js:37
- Controller: backend/src/controllers/studentController.js:314 `getStudentProfile`
- Frontend caller: studentApi.getProfile (src/pages/student/Profile.tsx:260)
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: studentApi.getProfile -> GET /api/student/profile -> getStudentProfile -> Student (student.js), via auth middleware

### 224. GET /api/students/profile (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:37
- Controller: backend/src/controllers/studentController.js:314 `getStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/students/profile -> getStudentProfile -> Student (student.js), via auth middleware

### 225. PUT /api/student/profile (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/studentRoutes.js:38
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: studentApi.updateProfile (src/pages/student/Profile.tsx:330)
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: studentApi.updateProfile -> PUT /api/student/profile -> updateStudentProfile -> Student (student.js), via auth middleware

### 226. PUT /api/students/profile (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:38
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PUT /api/students/profile -> updateStudentProfile -> Student (student.js), via auth middleware

### 227. PATCH /api/student/profile (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:39
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PATCH /api/student/profile -> updateStudentProfile -> Student (student.js), via auth middleware

### 228. PATCH /api/students/profile (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:39
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PATCH /api/students/profile -> updateStudentProfile -> Student (student.js), via auth middleware

### 229. PUT /api/student/profile/details (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:40
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PUT /api/student/profile/details -> updateStudentProfile -> Student (student.js), via auth middleware

### 230. PUT /api/students/profile/details (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:40
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PUT /api/students/profile/details -> updateStudentProfile -> Student (student.js), via auth middleware

### 231. PATCH /api/student/profile/details (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:41
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PATCH /api/student/profile/details -> updateStudentProfile -> Student (student.js), via auth middleware

### 232. PATCH /api/students/profile/details (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:41
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PATCH /api/students/profile/details -> updateStudentProfile -> Student (student.js), via auth middleware

### 233. PUT /api/student/profile/education (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:42
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PUT /api/student/profile/education -> updateStudentProfile -> Student (student.js), via auth middleware

### 234. PUT /api/students/profile/education (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:42
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PUT /api/students/profile/education -> updateStudentProfile -> Student (student.js), via auth middleware

### 235. PATCH /api/student/profile/education (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:43
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PATCH /api/student/profile/education -> updateStudentProfile -> Student (student.js), via auth middleware

### 236. PATCH /api/students/profile/education (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:43
- Controller: backend/src/controllers/studentController.js:324 `updateStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: education, interests, skills
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PATCH /api/students/profile/education -> updateStudentProfile -> Student (student.js), via auth middleware

### 237. GET /api/student/skills (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:45
- Controller: backend/src/controllers/studentController.js:395 `getStudentSkills`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/student/skills -> getStudentSkills -> Student (student.js), via auth middleware

### 238. GET /api/students/skills (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:45
- Controller: backend/src/controllers/studentController.js:395 `getStudentSkills`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/students/skills -> getStudentSkills -> Student (student.js), via auth middleware

### 239. POST /api/student/skills (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:46
- Controller: backend/src/controllers/studentController.js:405 `addStudentSkill`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: category, name, proficiency, skill, yearsOfExperience
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/student/skills -> addStudentSkill -> Student (student.js), via auth middleware

### 240. POST /api/students/skills (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:46
- Controller: backend/src/controllers/studentController.js:405 `addStudentSkill`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: category, name, proficiency, skill, yearsOfExperience
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/students/skills -> addStudentSkill -> Student (student.js), via auth middleware

### 241. PUT /api/student/skills/:skillId (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:47
- Controller: backend/src/controllers/studentController.js:445 `updateStudentSkill`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: skillId; query: none; direct body fields: category, name, proficiency, skillId, yearsOfExperience
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PUT /api/student/skills/:skillId -> updateStudentSkill -> Student (student.js), via auth middleware

### 242. PUT /api/students/skills/:skillId (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:47
- Controller: backend/src/controllers/studentController.js:445 `updateStudentSkill`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: skillId; query: none; direct body fields: category, name, proficiency, skillId, yearsOfExperience
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PUT /api/students/skills/:skillId -> updateStudentSkill -> Student (student.js), via auth middleware

### 243. PATCH /api/student/skills/:skillId (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:48
- Controller: backend/src/controllers/studentController.js:445 `updateStudentSkill`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: skillId; query: none; direct body fields: category, name, proficiency, skillId, yearsOfExperience
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PATCH /api/student/skills/:skillId -> updateStudentSkill -> Student (student.js), via auth middleware

### 244. PATCH /api/students/skills/:skillId (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:48
- Controller: backend/src/controllers/studentController.js:445 `updateStudentSkill`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: skillId; query: none; direct body fields: category, name, proficiency, skillId, yearsOfExperience
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PATCH /api/students/skills/:skillId -> updateStudentSkill -> Student (student.js), via auth middleware

### 245. DELETE /api/student/skills/:skillId (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:49
- Controller: backend/src/controllers/studentController.js:512 `deleteStudentSkill`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: skillId; query: none; direct body fields: name, skillId
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> DELETE /api/student/skills/:skillId -> deleteStudentSkill -> Student (student.js), via auth middleware

### 246. DELETE /api/students/skills/:skillId (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:49
- Controller: backend/src/controllers/studentController.js:512 `deleteStudentSkill`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: skillId; query: none; direct body fields: name, skillId
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 404, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> DELETE /api/students/skills/:skillId -> deleteStudentSkill -> Student (student.js), via auth middleware

### 247. GET /api/student/learning/modules (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:51
- Controller: backend/src/controllers/studentController.js:548 `getLearningModules`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/student/learning/modules -> getLearningModules -> Student (student.js), via auth middleware

### 248. GET /api/students/learning/modules (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:51
- Controller: backend/src/controllers/studentController.js:548 `getLearningModules`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/students/learning/modules -> getLearningModules -> Student (student.js), via auth middleware

### 249. GET /api/student/learning/progress/history (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:52
- Controller: backend/src/controllers/studentController.js:614 `getLearningProgressHistory`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: moduleId; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/student/learning/progress/history -> getLearningProgressHistory -> Student (student.js), via auth middleware

### 250. GET /api/students/learning/progress/history (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:52
- Controller: backend/src/controllers/studentController.js:614 `getLearningProgressHistory`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: moduleId; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/students/learning/progress/history -> getLearningProgressHistory -> Student (student.js), via auth middleware

### 251. GET /api/student/learning/modules/:moduleId/history (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:53
- Controller: backend/src/controllers/studentController.js:614 `getLearningProgressHistory`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: moduleId; query: moduleId; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/student/learning/modules/:moduleId/history -> getLearningProgressHistory -> Student (student.js), via auth middleware

### 252. GET /api/students/learning/modules/:moduleId/history (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:53
- Controller: backend/src/controllers/studentController.js:614 `getLearningProgressHistory`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: moduleId; query: moduleId; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/students/learning/modules/:moduleId/history -> getLearningProgressHistory -> Student (student.js), via auth middleware

### 253. PUT /api/student/learning/modules/:moduleId/progress (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:54
- Controller: backend/src/controllers/studentController.js:553 `updateLearningProgress`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: moduleId; query: none; direct body fields: description, moduleId, moduleTitle, note, progressPercentage, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PUT /api/student/learning/modules/:moduleId/progress -> updateLearningProgress -> Student (student.js), via auth middleware

### 254. PUT /api/students/learning/modules/:moduleId/progress (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:54
- Controller: backend/src/controllers/studentController.js:553 `updateLearningProgress`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: moduleId; query: none; direct body fields: description, moduleId, moduleTitle, note, progressPercentage, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PUT /api/students/learning/modules/:moduleId/progress -> updateLearningProgress -> Student (student.js), via auth middleware

### 255. PATCH /api/student/learning/modules/:moduleId/progress (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:55
- Controller: backend/src/controllers/studentController.js:553 `updateLearningProgress`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: moduleId; query: none; direct body fields: description, moduleId, moduleTitle, note, progressPercentage, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PATCH /api/student/learning/modules/:moduleId/progress -> updateLearningProgress -> Student (student.js), via auth middleware

### 256. PATCH /api/students/learning/modules/:moduleId/progress (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:55
- Controller: backend/src/controllers/studentController.js:553 `updateLearningProgress`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: moduleId; query: none; direct body fields: description, moduleId, moduleTitle, note, progressPercentage, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> PATCH /api/students/learning/modules/:moduleId/progress -> updateLearningProgress -> Student (student.js), via auth middleware

### 257. POST /api/student/learning/progress (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:56
- Controller: backend/src/controllers/studentController.js:553 `updateLearningProgress`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: description, moduleId, moduleTitle, note, progressPercentage, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/student/learning/progress -> updateLearningProgress -> Student (student.js), via auth middleware

### 258. POST /api/students/learning/progress (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:56
- Controller: backend/src/controllers/studentController.js:553 `updateLearningProgress`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: description, moduleId, moduleTitle, note, progressPercentage, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/students/learning/progress -> updateLearningProgress -> Student (student.js), via auth middleware

### 259. POST /api/student/learning/modules/:moduleId/complete (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:57
- Controller: backend/src/controllers/studentController.js:608 `markModuleComplete`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: moduleId; query: none; direct body fields: progressPercentage
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/student/learning/modules/:moduleId/complete -> markModuleComplete -> Student (student.js), via auth middleware

### 260. POST /api/students/learning/modules/:moduleId/complete (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:57
- Controller: backend/src/controllers/studentController.js:608 `markModuleComplete`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: moduleId; query: none; direct body fields: progressPercentage
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/students/learning/modules/:moduleId/complete -> markModuleComplete -> Student (student.js), via auth middleware

### 261. GET /api/student/assignments (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:59
- Controller: backend/src/controllers/studentController.js:635 `getAssignments`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/student/assignments -> getAssignments -> Student (student.js), via auth middleware

### 262. GET /api/students/assignments (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:59
- Controller: backend/src/controllers/studentController.js:635 `getAssignments`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/students/assignments -> getAssignments -> Student (student.js), via auth middleware

### 263. POST /api/student/assignments/submit (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:60
- Controller: backend/src/controllers/studentController.js:640 `submitAssignment`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: allowResubmit, answers, assignmentId, content, feedback, score, submissionUrl, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/student/assignments/submit -> submitAssignment -> Student (student.js), via auth middleware

### 264. POST /api/students/assignments/submit (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:60
- Controller: backend/src/controllers/studentController.js:640 `submitAssignment`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: allowResubmit, answers, assignmentId, content, feedback, score, submissionUrl, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/students/assignments/submit -> submitAssignment -> Student (student.js), via auth middleware

### 265. POST /api/student/assignments/:assignmentId/submit (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:61
- Controller: backend/src/controllers/studentController.js:640 `submitAssignment`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: assignmentId; query: none; direct body fields: allowResubmit, answers, assignmentId, content, feedback, score, submissionUrl, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/student/assignments/:assignmentId/submit -> submitAssignment -> Student (student.js), via auth middleware

### 266. POST /api/students/assignments/:assignmentId/submit (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:61
- Controller: backend/src/controllers/studentController.js:640 `submitAssignment`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: assignmentId; query: none; direct body fields: allowResubmit, answers, assignmentId, content, feedback, score, submissionUrl, title
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/students/assignments/:assignmentId/submit -> submitAssignment -> Student (student.js), via auth middleware

### 267. GET /api/student/quizzes (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:63
- Controller: backend/src/controllers/studentController.js:692 `getQuizzes`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/student/quizzes -> getQuizzes -> Student (student.js), via auth middleware

### 268. GET /api/students/quizzes (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:63
- Controller: backend/src/controllers/studentController.js:692 `getQuizzes`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/students/quizzes -> getQuizzes -> Student (student.js), via auth middleware

### 269. POST /api/student/quizzes/submit (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:64
- Controller: backend/src/controllers/studentController.js:697 `submitQuiz`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: allowResubmit, answers, correctAnswers, quizId, score, title, totalQuestions
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/student/quizzes/submit -> submitQuiz -> Student (student.js), via auth middleware

### 270. POST /api/students/quizzes/submit (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:64
- Controller: backend/src/controllers/studentController.js:697 `submitQuiz`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: allowResubmit, answers, correctAnswers, quizId, score, title, totalQuestions
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/students/quizzes/submit -> submitQuiz -> Student (student.js), via auth middleware

### 271. POST /api/student/quizzes/:quizId/submit (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:65
- Controller: backend/src/controllers/studentController.js:697 `submitQuiz`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: quizId; query: none; direct body fields: allowResubmit, answers, correctAnswers, quizId, score, title, totalQuestions
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/student/quizzes/:quizId/submit -> submitQuiz -> Student (student.js), via auth middleware

### 272. POST /api/students/quizzes/:quizId/submit (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:65
- Controller: backend/src/controllers/studentController.js:697 `submitQuiz`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: quizId; query: none; direct body fields: allowResubmit, answers, correctAnswers, quizId, score, title, totalQuestions
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/students/quizzes/:quizId/submit -> submitQuiz -> Student (student.js), via auth middleware

### 273. GET /api/student/skill-score (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:67
- Controller: backend/src/controllers/studentController.js:754 `getSkillScore`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/student/skill-score -> getSkillScore -> Student (student.js), via auth middleware

### 274. GET /api/students/skill-score (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:67
- Controller: backend/src/controllers/studentController.js:754 `getSkillScore`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/students/skill-score -> getSkillScore -> Student (student.js), via auth middleware

### 275. GET /api/student/score (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:68
- Controller: backend/src/controllers/studentController.js:754 `getSkillScore`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/student/score -> getSkillScore -> Student (student.js), via auth middleware

### 276. GET /api/students/score (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:68
- Controller: backend/src/controllers/studentController.js:754 `getSkillScore`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/students/score -> getSkillScore -> Student (student.js), via auth middleware

### 277. POST /api/student/skill-score/calculate (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentRoutes.js:69
- Controller: backend/src/controllers/studentController.js:764 `calculateAndStoreSkillScore`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/student/skill-score/calculate -> calculateAndStoreSkillScore -> Student (student.js), via auth middleware

### 278. POST /api/students/skill-score/calculate (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentRoutes.js:69
- Controller: backend/src/controllers/studentController.js:764 `calculateAndStoreSkillScore`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/students/skill-score/calculate -> calculateAndStoreSkillScore -> Student (student.js), via auth middleware

### 279. POST /api/auth/register (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentAuthRoutes.js:12
- Controller: backend/src/controllers/studentController.js:220 `registerStudent`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: branch, college, email, fullName, name, password, phone, role, semester
- Response: JSON {success, message, token, student, user, data:{token, student}}; 201 registration or 200 login on success. Codes: 200, 400, 409, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/auth/register -> registerStudent -> Student (student.js)

### 280. POST /api/auth/login (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentAuthRoutes.js:13
- Controller: backend/src/controllers/studentController.js:282 `loginStudent`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password, role
- Response: JSON {success, message, token, student, user, data:{token, student}}; 201 registration or 200 login on success. Codes: 200, 400, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js); external calls: none
- Flow: No frontend caller found -> POST /api/auth/login -> loginStudent -> Student (student.js)

### 281. POST /api/auth/logout (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/studentAuthRoutes.js:14
- Controller: backend/src/controllers/studentController.js:311 `logoutStudent`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> POST /api/auth/logout -> logoutStudent -> Student (student.js), via auth middleware

### 282. GET /api/auth/me (backend)

- Status: Alternate path; no frontend call found
- Route: backend/src/routes/studentAuthRoutes.js:15
- Controller: backend/src/controllers/studentController.js:314 `getStudentProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Usually JSON {success, message, data} via apiResponse helper; handler-specific fields are returned in data. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: none
- Flow: No frontend caller found -> GET /api/auth/me -> getStudentProfile -> Student (student.js), via auth middleware

### 283. POST /api/ai/study-plan (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/aiRoutes.js:9
- Controller: backend/src/controllers/aiController.js:30 `studyPlan`
- Frontend caller: studentApi.generateStudyPlan (src/pages/student/StudentDashboard.tsx:721)
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: studentContext
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: generateStudyPlan
- Flow: studentApi.generateStudyPlan -> POST /api/ai/study-plan -> studyPlan -> generateStudyPlan via Google Gemini

### 284. POST /api/ai/placement-analysis (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/aiRoutes.js:10
- Controller: backend/src/controllers/aiController.js:53 `placementAnalysis`
- Frontend caller: studentApi.placementAnalysis (src/pages/student/StudentDashboard.tsx:828)
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: studentContext
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: analyzePlacement
- Flow: studentApi.placementAnalysis -> POST /api/ai/placement-analysis -> placementAnalysis -> analyzePlacement via Google Gemini

### 285. POST /api/ai/ats-score (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/aiRoutes.js:11
- Controller: backend/src/controllers/aiController.js:80 `atsScore`
- Frontend caller: studentApi.atsScore (src/pages/student/StudentDashboard.tsx:1022)
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: resumeText
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: analyzeResume
- Flow: studentApi.atsScore -> POST /api/ai/ats-score -> atsScore -> analyzeResume via Google Gemini

### 286. POST /api/ai/skill-gap (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/aiRoutes.js:12
- Controller: backend/src/controllers/aiController.js:103 `skillGap`
- Frontend caller: studentApi.skillGap (src/pages/student/StudentDashboard.tsx:1294)
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: role, studentContext
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: analyzeSkillGap
- Flow: studentApi.skillGap -> POST /api/ai/skill-gap -> skillGap -> analyzeSkillGap via Google Gemini

### 287. POST /api/ai/career-coach (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/aiRoutes.js:13
- Controller: backend/src/controllers/aiController.js:133 `careerCoach`
- Frontend caller: studentApi.careerCoach (src/pages/student/StudentDashboard.tsx:1693)
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: question, studentContext
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: careerCoach
- Flow: studentApi.careerCoach -> POST /api/ai/career-coach -> careerCoach -> careerCoach via Google Gemini

### 288. POST /api/ai/resume/summary (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/aiRoutes.js:14
- Controller: backend/src/controllers/aiController.js:158 `resumeSummary`
- Frontend caller: studentApi.generateResumeSummary (src/pages/student/AIResume.tsx:594)
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: resume
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: generateResumeSummary
- Flow: studentApi.generateResumeSummary -> POST /api/ai/resume/summary -> resumeSummary -> generateResumeSummary via Google Gemini

### 289. POST /api/ai/resume/experience (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/aiRoutes.js:15
- Controller: backend/src/controllers/aiController.js:167 `resumeExperience`
- Frontend caller: studentApi.enhanceResumeExperience (src/pages/student/AIResume.tsx:629)
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: experience
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: enhanceResumeExperience
- Flow: studentApi.enhanceResumeExperience -> POST /api/ai/resume/experience -> resumeExperience -> enhanceResumeExperience via Google Gemini

### 290. POST /api/ai/resume/note (backend)

- Status: Active / in use (source call found)
- Route: backend/src/routes/aiRoutes.js:16
- Controller: backend/src/controllers/aiController.js:176 `resumeNote`
- Frontend caller: studentApi.classifyResumeNote (src/pages/student/AIResume.tsx:659)
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: note
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: classifyResumeNote
- Flow: studentApi.classifyResumeNote -> POST /api/ai/resume/note -> resumeNote -> classifyResumeNote via Google Gemini

### 291. POST /api/ai/hiring/interview (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/aiRoutes.js:17
- Controller: backend/src/controllers/aiController.js:192 `hiringInterview`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: generateHiringInterview
- Flow: No frontend caller found -> POST /api/ai/hiring/interview -> hiringInterview -> generateHiringInterview via Google Gemini

### 292. POST /api/ai/hiring/questions (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/aiRoutes.js:18
- Controller: backend/src/controllers/aiController.js:201 `hiringQuestions`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: generateHiringQuestions
- Flow: No frontend caller found -> POST /api/ai/hiring/questions -> hiringQuestions -> generateHiringQuestions via Google Gemini

### 293. POST /api/ai/hiring/evaluate (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/aiRoutes.js:19
- Controller: backend/src/controllers/aiController.js:210 `hiringEvaluate`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: evaluateHiringAnswer
- Flow: No frontend caller found -> POST /api/ai/hiring/evaluate -> hiringEvaluate -> evaluateHiringAnswer via Google Gemini

### 294. POST /api/ai/hiring/feedback (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/routes/aiRoutes.js:20
- Controller: backend/src/controllers/aiController.js:219 `hiringFeedback`
- Frontend caller: none detected
- Auth / role: Bearer JWT; student; middleware: studentAuthMiddleware
- Request path parameters: none; query: none; direct body fields: none detected
- Response: 200 JSON {success, message, data}; data comes from Gemini JSON parsing. 400 for required input on selected operations; 500 on service or parse error. Response structure could not be completely determined from the available code. Codes: 200, 401, 403 (code-observed or middleware; not exhaustive)
- Model/service: Student (student.js), via auth middleware; external calls: generateHiringFeedback
- Flow: No frontend caller found -> POST /api/ai/hiring/feedback -> hiringFeedback -> generateHiringFeedback via Google Gemini

### 295. POST /api/auth/register (legacy server)

- Status: Legacy alternate server; runtime unverified
- Route: server/routes/authRoutes.js:12
- Controller: server/controllers/authController.js:11 `registerUser`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, fullName, password, phone, role
- Response: Direct JSON from legacy controller; inspect cited handler for exact fields. Response structure could not be completely determined from the available code. Codes: 200, 201, 400, 500 (code-observed or middleware; not exhaustive)
- Model/service: User (User.js); external calls: none
- Flow: No frontend caller found -> POST /api/auth/register -> registerUser -> User (User.js)

### 296. POST /api/auth/login (legacy server)

- Status: Legacy alternate server; runtime unverified
- Route: server/routes/authRoutes.js:13
- Controller: server/controllers/authController.js:132 `loginUser`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password
- Response: Direct JSON from legacy controller; inspect cited handler for exact fields. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 500 (code-observed or middleware; not exhaustive)
- Model/service: User (User.js); external calls: none
- Flow: No frontend caller found -> POST /api/auth/login -> loginUser -> User (User.js)

### 297. GET /api/auth/me (legacy server)

- Status: Legacy alternate server; runtime unverified
- Route: server/routes/authRoutes.js:16
- Controller: server/controllers/authController.js:218 `getMe`
- Frontend caller: none detected
- Auth / role: Bearer JWT; legacy user token; middleware: protect
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Direct JSON from legacy controller; inspect cited handler for exact fields. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: No direct model call found; external calls: none
- Flow: No frontend caller found -> GET /api/auth/me -> getMe -> No direct model call found

### 298. POST /api/admin/login (legacy server)

- Status: Legacy alternate server; runtime unverified
- Route: server/routes/adminAuthRoutes.js:8
- Controller: server/controllers/adminAuthController.js:9 `adminLogin`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password
- Response: Direct JSON from legacy controller; inspect cited handler for exact fields. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (Admin.js); external calls: none
- Flow: No frontend caller found -> POST /api/admin/login -> adminLogin -> Admin (Admin.js)

### 299. POST /api/v1/admin/login (legacy server)

- Status: Legacy alternate server; runtime unverified
- Route: server/routes/adminAuthRoutes.js:8
- Controller: server/controllers/adminAuthController.js:9 `adminLogin`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: email, password
- Response: Direct JSON from legacy controller; inspect cited handler for exact fields. Response structure could not be completely determined from the available code. Codes: 200, 400, 401, 500 (code-observed or middleware; not exhaustive)
- Model/service: Admin (Admin.js); external calls: none
- Flow: No frontend caller found -> POST /api/v1/admin/login -> adminLogin -> Admin (Admin.js)

### 300. GET /api/admin/me (legacy server)

- Status: Legacy alternate server; runtime unverified
- Route: server/routes/adminAuthRoutes.js:11
- Controller: server/controllers/adminAuthController.js:105 `getAdminProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Direct JSON from legacy controller; inspect cited handler for exact fields. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: No direct model call found; external calls: none
- Flow: No frontend caller found -> GET /api/admin/me -> getAdminProfile -> No direct model call found

### 301. GET /api/v1/admin/me (legacy server)

- Status: Legacy alternate server; runtime unverified
- Route: server/routes/adminAuthRoutes.js:11
- Controller: server/controllers/adminAuthController.js:105 `getAdminProfile`
- Frontend caller: none detected
- Auth / role: Bearer JWT; Admin or Super Admin; middleware: adminAuth
- Request path parameters: none; query: none; direct body fields: none detected
- Response: Direct JSON from legacy controller; inspect cited handler for exact fields. Response structure could not be completely determined from the available code. Codes: 200, 401, 403, 500 (code-observed or middleware; not exhaustive)
- Model/service: No direct model call found; external calls: none
- Flow: No frontend caller found -> GET /api/v1/admin/me -> getAdminProfile -> No direct model call found

### 302. GET / (backend)

- Status: Implemented; no frontend call found
- Route: backend/src/app.js:17
- Controller: backend/src/app.js:17 `inline health handler`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: none detected
- Response: 200 JSON health message; exact shape differs between server entry points. Codes: 200 (code-observed or middleware; not exhaustive)
- Model/service: No direct model call found; external calls: none
- Flow: No frontend caller found -> GET / -> inline health handler -> No direct model call found

### 303. GET / (legacy server)

- Status: Legacy alternate server; runtime unverified
- Route: server/server.js:40
- Controller: server/server.js:40 `inline health handler`
- Frontend caller: none detected
- Auth / role: No route auth middleware; middleware: none
- Request path parameters: none; query: none; direct body fields: none detected
- Response: 200 JSON health message; exact shape differs between server entry points. Codes: 200 (code-observed or middleware; not exhaustive)
- Model/service: No direct model call found; external calls: none
- Flow: No frontend caller found -> GET / -> inline health handler -> No direct model call found

## Frontend calls without matching current backend paths

- `GET /api/student/dashboard` - `src/services/studentApi.ts:129`; page callers: src/pages/student/StudentDashboard.tsx:1830
- `GET /api/student/projects` - `src/services/studentApi.ts:154`; page callers: none
- `POST /api/student/projects/:projectId/apply` - `src/services/studentApi.ts:156`; page callers: none
- `GET /api/student/applications` - `src/services/studentApi.ts:159`; page callers: src/pages/student/Applications.tsx:246
- `GET /api/student/applications/:applicationId` - `src/services/studentApi.ts:162`; page callers: none
- `DELETE /api/student/applications/:applicationId` - `src/services/studentApi.ts:165`; page callers: none
- `GET /api/student/notifications` - `src/services/studentApi.ts:174`; page callers: src/pages/student/Notifications.tsx:669
- `PATCH /api/student/notifications/:id/read` - `src/services/studentApi.ts:176`; page callers: src/pages/student/Notifications.tsx:738
- `PATCH /api/student/notifications/all/read` - `src/services/studentApi.ts:179`; page callers: src/pages/student/Notifications.tsx:757
- `DELETE /api/student/notifications/:id` - `src/services/studentApi.ts:182`; page callers: src/pages/student/Notifications.tsx:774
- `GET /api/student/certificates` - `src/services/studentApi.ts:191`; page callers: src/pages/student/Certificates.tsx:213
- `POST /api/student/certificates` - `src/services/studentApi.ts:194`; page callers: none
- `PUT /api/student/certificates/:id` - `src/services/studentApi.ts:197`; page callers: none
- `DELETE /api/student/certificates/:id` - `src/services/studentApi.ts:200`; page callers: none
- `GET /api/student/settings` - `src/services/studentApi.ts:209`; page callers: src/pages/student/Settings.tsx:299
- `PUT /api/student/settings` - `src/services/studentApi.ts:212`; page callers: src/pages/student/Notifications.tsx:800, src/pages/student/Notifications.tsx:834, src/pages/student/Settings.tsx:340
- `GET /api/student/resume-builder` - `src/services/studentApi.ts:221`; page callers: src/pages/student/AIResume.tsx:501
- `PUT /api/student/resume-builder` - `src/services/studentApi.ts:224`; page callers: src/pages/student/AIResume.tsx:531
- `GET /api/student/hiring/drives` - `src/services/studentApi.ts:233`; page callers: none
- `POST /api/student/hiring/drives/:projectId/start` - `src/services/studentApi.ts:236`; page callers: src/pages/student/PlacementPrep.tsx:563

## Issues

### Critical: Student/AI protected routes

- Source: src/context/AuthContext.tsx:48,105 and src/services/studentApi.ts:8,19
- Evidence: Clerk/local sessions do not populate c2c_student_token; studentApi attaches only that key.
- Impact: Authenticated UI flows can receive 401 from student and AI APIs.
- Recommendation: Unify sign-in with backend JWT or exchange Clerk identity for a backend token; test protected flows.

### High: 20 student service requests

- Source: src/services/studentApi.ts:130-239; backend/src/routes/studentRoutes.js:27-69
- Evidence: No matching backend/src method/path for 20 requests; 12 have page callers.
- Impact: Dashboard, applications, notifications, certificates, settings, resume and hiring functions can fail.
- Recommendation: Implement routes/controllers or remove/repoint the calls; prioritize the 12 page-referenced requests.

### High: Legacy authentication server

- Source: server/controllers/adminAuthController.js:22-23,66; server/utils/generateToken.js:4
- Evidence: Default admin credentials and JWT secret fallbacks exist in the separate server.
- Impact: Launching that server can expose predictable authentication secrets.
- Recommendation: Remove fallbacks and require environment secrets, or retire the legacy server.

### High: Local admin demo login

- Source: src/context/AuthContext.tsx:106-122; src/routes/ProtectedRoute.tsx:17-30
- Evidence: An admin-like email with a short password creates a local admin role for the alternate /admin-dashboard path.
- Impact: UI role protection is bypassable even though backend JWT routes still enforce server-side auth.
- Recommendation: Remove demo acceptance from production builds and gate all admin UI with verified backend/Clerk authorization.

### Medium: Gemini key logging

- Source: backend/src/services/aiServices.js:3-5
- Evidence: The first ten characters of GEMINI_API_KEY are logged at module load.
- Impact: Logs disclose part of a secret.
- Recommendation: Remove key-prefix logging.

### Medium: Two competing server entry points

- Source: backend/src/server.js:8 and server/server.js:54
- Evidence: Both default to port 5000 and overlap six method/path pairs, with different behavior.
- Impact: Wrong process selection changes auth contracts and available endpoints.
- Recommendation: Document a single production entry point and retire or isolate the older server.

### Medium: Stale architecture guide

- Source: backend_architecture_guide.md:26-70; backend/src/app.js:22-38
- Evidence: Guide describes server/ models/routes absent from executable source.
- Impact: Readers can mistake planned endpoints for current APIs.
- Recommendation: Update guide from the mounted route inventory.

### Low: Hardcoded local API fallback

- Source: src/services/api.ts:5 and src/services/studentApi.ts:4
- Evidence: Default base URL targets localhost:5000; the generic API instance has no detected callers.
- Impact: A deployed frontend needs an explicit API origin or relative proxy.
- Recommendation: Set VITE_API_URL by environment and remove unused client after review.
