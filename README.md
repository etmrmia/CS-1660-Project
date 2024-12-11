# Application Explanation
Our application, GitItDone, functions as a QR scanner to track student attendance in course sections at the University of Pittsburgh. Professors can prompt
their students to scan the qr code in order to register their attendance for the day. Students will then be prompted by their camera to scan the QR code. Upon
scanning, a student's attendance for that course and section will be recorded. Professors are able to track the attendance of students in their course sections and
students are able to track their own individual attendance. 
We used postgreSQL for our database, node.js for our backend, and angular for our frontend. 

# Architecture Explanation
We decided to use three different GCP services for our application: Google Cloud Sql, Google Cloud Build, and Google Cloud Run.
### Google Cloud Sql
We chose Google Cloud Sql because it allows ease of integration with node js which is what our backend is written in. We configured a Google Cloud Sql instance 
and uploaded both our schema design as well as sample data. Communication with the database is configured through the Cloud SQL Node.js Connector which is a 
Cloud Sql Connector. The connection pool is established through IAM authentication specifically with credentials of a built-in user's access to the database. 
By default, these users have cloudsqlsuperuser role within the instance. Ultiamtely, this mannner of connecting to the instance is not ideal. This is due to the 
fact that user credentials are readily availabe within our server file. Ideally, we would have utilized Automatic IAM Database Authentication in which the password 
is not readily available and configured a service account with a lesser role (such as Cloud SQL Editor) as opposed to a built-in user. However, we ran out of time 
and were not able to implement these precautions with regards to connecting to our cloud sql instance. Regardless, through the establishment of a connection pool, 
we are able to query and update the database with ease due to the cloudsqlsuperuser role.

Additionally, our Cloud Sql Instance is configured using Enterprise and single zone. This was chosen due to the limitations of GCP credits available. However,
in an enterprise setting, choosing multiple zones and configuring with Enterprise Plus would have allowed for both higher performance as well as higher 
reliability. As seen below. 

#### Cloud Sql Instance Configuration: 

<img width="453" alt="Database Configuration" src="https://github.com/user-attachments/assets/9a53d58e-a697-47ae-9973-dd2c0c4627b9" />


#### Cloud Sql Studio View:

<img width="1229" alt="View of Cloud SQL Studio" src="https://github.com/user-attachments/assets/57d30f1e-6721-40fc-abac-48bb5f3c5e73" />


### Google Cloud Build

### Google Cloud Run

### Architectural Diagram 
