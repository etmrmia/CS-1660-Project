# Git It Done QR Attendance Tracker: Building a GCP Cloud Service
The following project code can be found at [this Github link](https://github.com/etmrmia/CS-1660-Project). This project was authored by Madeleine Lasky, Emma Tristano, and Alexandra Butler with the intention of combining the creation of a Angular application with Google Cloud GCP services to support and automate project deployment.

## Application Explanation
Our application, GitItDone, functions as a QR scanner to track student attendance in course sections at the University of Pittsburgh. Professors can prompt
their students to scan the qr code in order to register their attendance for the day. Students will then be prompted by their camera to scan the QR code. Upon
scanning, a student's attendance for that course and section will be recorded. Professors are able to track the attendance of students in their course sections and
students are able to track their own individual attendance. 
We used postgreSQL for our database, node.js for our backend, and angular for our frontend. 

## Instructions to Use Application
The Git It Done QR Attendance Tracker application can be found at [this link](https://git-it-done-1085175978926.us-central1.run.app/). After following the link, it is recommended the user use the following test profiles to use the application but other profiles are available in the [SQL Sample Data file](https://github.com/etmrmia/CS-1660-Project/blob/main/sample-data.sql) within the attached repository:
> | User              | Email            | Password |
> |:-----------------:|:----------------:|:--------:|
> |Test Student User  |test1@pitt.edu    |11111111  |
> |Test Professor User|superuser@pitt.edu|11111111  |
Attempts to log in with emails outside of the sample data will not allow access to the service. Once inside of the service, the user will see a home screen with courses currently attending or courses currentlly taught. The user can navigate to the courses by clicking on the tile listing the course. Within the course detail page, the user has the open to view the scannable QR code or gradebook which lists attendance for the student or ability to see attendance of students for the professor. Once the user is done using the application, they may logout or simply close the tab.

## GCP Service Explanation
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
We chose to use Google's Cloud Build to automate and streamline our deployment process. Our use of Cloud Build combines the building of a Docker file, pushing the container to our Artifact Registry, deploying to Cloud Run, and pushing the final project to our repository. This is outlined in our [Cloud Build YAML file](https://github.com/etmrmia/CS-1660-Project/blob/main/cloudbuild.yaml) implementing the steps outlined above.

The main advantage found when using Google Build was the seamless steps that allowed for our project to continue to remain accurate and ability to run on Cloud Build without interrupting the use of the application. We found this especially helpful after merging development branches to our production result as we could keep our code up to date as new features were rolled out without interrupting any testing or building occurring parrallel to the updates. Using the logging feature, we were also able to debug errors that would come with using Cloud Build without having check the numerous services involved with the building process.

### Google Cloud Run
We chose to use Google's Cloud Run to deploy containers and host our web application. Cloud Run is especially helpful to handle the rendering of unique pages based on data stored in the Cloud SQL database and accessing requests from the database to retrieve or add data for student attendance measures.

The Cloud Run functionality allowed us to link our code base stored within the GitHub repository and automatically update to the website whenever we pushed to our production (main) branch. We also had many asynchronous requests due to the need for database data about courses, the current user, and attendance records. In our latest version of the project, we use client and server side communication to call the database via a Pool connection within the server side. Given more time, we would begin to transfer common data transfers, such as the attendance measures at a start of the class or attendance report creation for professors, to the Cloud Run jobs feature in order to ensure tasks are managed in the most efficient manner possible.

## Architectural Diagram 
![Software Architecture Diagram](https://github.com/etmrmia/CS-1660-Project/blob/main/CS1660%20Architecture%20Diagram.png)
