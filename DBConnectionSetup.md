## To Connect To Google Cloud SQL Instance
1. I must add your google account to the users who are able to access the database and assign IAM role Cloud SQL Client. 
2. Install Google CLI locally. Instructions on installation: https://cloud.google.com/sdk/docs/install
3. Configure ADC with a google account using Google CLI. Instructions on installation: https://cloud.google.com/docs/authentication/provide-credentials-adc#local-dev
- Note: located under Local development environment -> Configure ADC with your Google Account -> follow the 2 steps
- Should be the same Google account which will have IAM role assigned to them
4. Now, run node server.js as normal. To test if it is configured correctly, it should print all records in the students table.


## More Information on Connection Pooling
- Information on How the Connection Pooling is configured can be found here: https://github.com/GoogleCloudPlatform/cloud-sql-nodejs-connector?tab=readme-ov-file
