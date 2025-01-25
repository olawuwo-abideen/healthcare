Backend to an Healthcare App 

Installation

- clone the repository


`git clone git@github.com:olawuwo-abideen/healthcare.git`

npm i @types/express @nestjs/platform-express multer @types/multer cloudinary --legacy-peer-deps

npm install @nestjs-modules/mailer nodemailer @types/nodemailer --legacy-peer-deps




- navigate to the folder


`cd healthcare-main.git`

To run the app in development mode

Open a terminal and enter the following command to install all the  modules needed to run the app:

`npm install`


Create a `.env` file with

`DB_HOST=localhost`

`DB_PORT=3306`

`DB_USERNAME=root`

`DB_PASSWORD=password`

`DB_NAME=datingapp`

`PORT=3000`

`JWT_SECRET=secret`

`JWT_EXPIRATION_TIME=216000`

`JWT_RESET_PASSWORD_EXPIRATION_TIME=30000`


Enter the following `npm start` command to Command Line Interface to Start the app

This will start the app and set it up to listen for incoming connections on port 3000. 

Use Postman to test the endpoint

API Endpoints

The following API endpoints are available:

- BaseUrl https://localhost:3000/

**Admin and Moderation Endpoints**

- **DELETE /admin/user/:id**: Delete a user.
- **GET /admin/users**: Get all users.
- **GET /admin/users/patients**: Get list of all patients.
- **GET /admin/users/patient/:id**: Get specific patient details.
- **GET /admin/dashboard/overview**: Delete a user.
- **PUT /admin/activate/{userId}**: Get list of all patients.
- **PUT /admin/deactivate/{userId}**: Get specific patient details.
- **GET /admin/payments**: Delete a user.
- **GET /admin/appointments/all**: Get all users.


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

**Doctor Endpoint**

- **POST /availability/set/**: Set availability slots (Doctor only).
- **POST /availability/get/:id**: Get doctor availability.
- **PUT /availability/update/{availabilityId}**: Update availability slot.
- **DELETE /availability/remove/{availabilityId}**: Remove availability slot.

**Appointments Endpoint**

- **POST /appointments/book/**: Book an appointment.
- **GET /appointments/patient/{patientId}**: Get all appointments of a patient.
- **GET /appointments/doctor/{doctorId}**: Get all appointments of a doctor.
- **GET /appointments/details/{appointmentId}**: Get details of a specific appointment.
- **PUT /appointments/reschedule/{appointmentId}**:	Reschedule an appointment.
- **DELETE /appointments/cancel/{appointmentId}**: Cancel an appointment.


**Medical Records Management Endpoints**

- **POST /medical-records/upload**: Upload a medical record (PDF, images, etc.).
- **GET /medical-records/list/:id**: Get medical records for a patient.
- **GET /medical-records/view/{recordId}**: View a specific medical record.
- **DELETE /medical-records/delete/{recordId}**: Delete a medical record.


**Prescription Management Endpoints**

- **POST /create/discover**: Add a new prescription.
- **GET /patient/{patientId}**: Get prescriptions for a patient.
- **GET /doctor/{doctorId}**: Get prescriptions written by a doctor.
- **PUT /update/{prescriptionId}**: Update an existing prescription.
- **DELETE /delete/{prescriptionId}**: Delete a prescription.



**Reviews & Ratings Endpoints**

- **POST /reviews/add**: Add a review for a doctor.
- **GET /reviews/doctor/{doctorId}**: Get reviews for a doctor.
- **PUT /reviews/update/{reviewId}**: Update an existing review.
- **DELETE /reviews/delete/{reviewId}**: Delete a review.