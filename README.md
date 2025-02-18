Healthcare Application

The Healthcare App is a robust backend system designed to manage Admin, Doctor, and Patient roles with secure authentication and role-based access control. It enables patient record management, appointment scheduling, doctor review and medical history tracking while ensuring data privacy.

Installation

- clone the repository


`git clone git@github.com:olawuwo-abideen/healthcare.git`



- navigate to the folder


`cd healthcare-main.git`

To run the app in development mode

Open a terminal and enter the following command to install all the  modules needed to run the app:

`npm install`


Create a `.env` file with

`POSTGRES_HOST=127.0.0.1`


`POSTGRES_PORT=5432`


`POSTGRES_USER=postgres`


`POSTGRES_PASSWORD=password`


`POSTGRES_DATABASE=healthcare`


`PORT=3000`


`JWT_SECRET=secret`


`JWT_EXPIRATION_TIME=90d`


`NODE_ENV=development'`


Enter the following `npm start` command to Command Line Interface to Start the app

This will start the app and set it up to listen for incoming connections on port 3000. 

Use Postman or open api to test the endpoint

Open API endpoints = http://localhost:3000/api/docs

API Endpoints

The following API endpoints are available:

- BaseUrl https://localhost:3000/

**Admin and Moderation Endpoints**

- **DELETE /admin/user/:id**: Delete a user.
- **GET /admin/users**: Get all users.
- **GET /admin/users/patients**: Get list of all patients.
- **GET /admin/users/patient/:id**: Get specific patient details.
- **GET /admin/dashboard/overview**: Get overall system statistics.
- **GET /admin/delete/:id**: Delete a user.
- **GET /admin/appointments/all**: 	Get all appointments.


**Authentication Endpoint**

- **POST /auth/signup**: User signup.
- **POST /auth/login**: User login.
- **POST /auth/logout**: User logout.
- **POST /auth/forgot-password**: User forget password.
- **POST /auth/reset-password**: User reset password.

**User Endpoint**

- **GET /user/**: Retrieve the currently authenticated user’s profile.
- **POST user/change-password**: User change password.
- **PUT /user/**: Update the user’s profile.
- **GET /user/doctor**: Get all doctors.
- **GET /user/doctor/:id**: Get a doctor.

**Availability Slot Endpoint**

- **POST availabilityslot**: Set availability slots.
- **GET availabilityslot**: Get doctor availability.
- **PUT /availabilityslot/:id**: Update availability slot.
- **DELETE /availabilityslot/:id**: Delete availability slot.

**Appointments Endpoint**

- **POST /appointments/book/**: Book an appointment.
- **GET /appointments/patient/:id**: Get all appointments of a patient.
- **GET /appointments/doctor/:id**: Get all appointments of a doctor.
- **GET /appointments/details/:id**: Get details of a specific appointment.
- **PUT /appointments/reschedule/:id**:	Reschedule an appointment.
- **DELETE /appointments/cancel/:id**: Cancel an appointment.


**Medical Records Management Endpoints**

- **POST /medical-records/upload**: Upload a medical record (PDF, images, etc.).
- **GET /medical-records/list/:id**: Get medical records for a patient.
- **GET /medical-records/view/:id**: View a specific medical record.

**Prescription Management Endpoints**

- **POST /create/discover**: Add a new prescription.
- **GET /patient/:id**: Get prescriptions for a patient.
- **PUT /update/:id**: Update an existing prescription.
- **DELETE /delete/:id**: Delete a prescription.



**Reviews & Ratings Endpoints**

- **POST /reviews/doctor/:id**: Add a review for a doctor.
- **GET /reviews/doctor/:id**: Get reviews for a doctor.
- **PUT /reviews/update/:id**: Update an existing review.
- **DELETE /reviews/delete/:id**: Delete a review.