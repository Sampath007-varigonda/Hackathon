# Certification Request & Approval Workflow

## Overview

The application now includes a **request/approval workflow** where:
- **Users** submit certification requests that require admin approval
- **Admins** review and approve/reject requests
- Each request has a **unique request ID** for tracking

---

## How It Works

### For Regular Users

1. **Submit Request**
   - Click "Submit Request" or "Submit New Request"
   - Fill in certification details (name, issuer, dates, file, notes)
   - Click "Submit Request"
   - Request is created with status: **Pending**

2. **Track Your Requests**
   - Go to "My Requests" page
   - See all your requests with their status:
     - 🟡 **Pending** - Waiting for admin approval
     - 🟢 **Approved** - Request approved, certification created
     - 🔴 **Rejected** - Request rejected (with reason)

3. **Request Details**
   - Each request has a **unique Request ID** (e.g., `REQ-1234567890-ABC123XYZ`)
   - View certificate file if uploaded
   - See approval/rejection details when processed

### For Admin Users

1. **View All Requests**
   - Go to "Requests" page
   - See all requests from all users
   - Pending requests are highlighted

2. **Approve Requests**
   - Click "✓ Approve" button on a pending request
   - System automatically:
     - Creates the certification
     - Links it to the original request ID
     - Updates request status to "Approved"

3. **Reject Requests**
   - Click "✗ Reject" button on a pending request
   - Enter rejection reason (optional)
   - Request status changes to "Rejected"
   - User can see the rejection reason

4. **Direct Certification Creation**
   - Admins can still create certifications directly (bypassing approval)
   - Use "Add New Certification" button
   - Creates certification immediately without request

---

## Unique Request Identification

### Request ID Format
- Format: `REQ-{timestamp}-{random}`
- Example: `REQ-1703123456789-ABC123XYZ`
- **Unique** - Each request gets a unique ID
- **Trackable** - Can be used to reference specific requests

### Request ID Usage
- Displayed on each request card
- Stored in database for tracking
- Linked to certification when approved
- Helps with audit trail and support

---

## Database Schema

### New Table: `certification_requests`
- `id` - Primary key
- `request_id` - Unique request identifier (REQ-xxx-xxx)
- `user_id` - User who submitted the request
- `name`, `issuer`, `issue_date`, `expiration_date` - Certification details
- `certificate_file` - Uploaded certificate file path
- `notes` - Additional notes
- `approval_status` - pending/approved/rejected
- `approved_by` - Admin who approved/rejected
- `approved_at` - Timestamp of approval/rejection
- `rejection_reason` - Reason if rejected
- `created_at`, `updated_at` - Timestamps

### Updated Table: `certifications`
- Added `request_id` field
- Links approved certifications to their original request

---

## API Endpoints

### Request Endpoints

- `POST /api/requests` - Submit new certification request (User)
- `GET /api/requests` - Get all requests (User sees own, Admin sees all)
- `GET /api/requests/pending` - Get pending requests (Admin only)
- `GET /api/requests/:id` - Get specific request
- `POST /api/requests/:id/approve` - Approve request (Admin only)
- `POST /api/requests/:id/reject` - Reject request (Admin only)
- `DELETE /api/requests/:id` - Delete request (User can delete own pending, Admin can delete any)

### Certification Endpoints

- `POST /api/certifications` - Create certification directly (Admin only)
  - Regular users get error message directing them to use requests

---

## User Interface Changes

### Navigation
- Added "My Requests" link for users
- Added "Requests" link for admins
- Shows pending request count on dashboard

### Dashboard
- Shows pending requests count
- Different quick actions based on role:
  - Users: "Submit Request"
  - Admins: "Add Certification" and "Approve Requests"

### Request List Page
- Shows all requests with status badges
- Admin sees approval/rejection buttons
- Users see their own requests with status
- Displays unique Request ID for each request

### Form Changes
- Form title changes based on role:
  - Users: "Submit Certification Request"
  - Admins: "Add New Certification"
- Submit button text changes:
  - Users: "Submit Request"
  - Admins: "Create Certification"

---

## Workflow Diagram

```
User Submits Request
        ↓
Request Created (Status: Pending)
        ↓
Admin Reviews Request
        ↓
    ┌───┴───┐
    ↓       ↓
Approve   Reject
    ↓       ↓
Certification   Request Status:
Created         Rejected
(Status: Active) (with reason)
```

---

## Benefits

1. **Control** - Admins control which certifications are added
2. **Audit Trail** - All requests tracked with unique IDs
3. **Transparency** - Users can see request status and reasons
4. **Flexibility** - Admins can still create certifications directly
5. **Accountability** - Records who approved/rejected and when

---

## Example Scenarios

### Scenario 1: User Submits Request
1. User fills form and clicks "Submit Request"
2. Request created with ID: `REQ-1703123456789-ABC123XYZ`
3. Status: Pending
4. User sees request in "My Requests" page

### Scenario 2: Admin Approves
1. Admin goes to "Requests" page
2. Sees pending request from user
3. Reviews details and certificate file
4. Clicks "✓ Approve"
5. Certification automatically created
6. Request status changes to "Approved"
7. User can now see certification in "My Certifications"

### Scenario 3: Admin Rejects
1. Admin reviews request
2. Finds issue or missing information
3. Clicks "✗ Reject"
4. Enters reason: "Certificate file is unclear"
5. Request status changes to "Rejected"
6. User sees rejection with reason
7. User can submit new request with corrections

---

## Notes

- Users cannot create certifications directly - must use requests
- Admins can create certifications directly or approve requests
- Pending requests can be deleted by users
- Approved/rejected requests cannot be deleted (for audit trail)
- Request IDs are unique and permanent
- Certificate files are preserved even if request is rejected

