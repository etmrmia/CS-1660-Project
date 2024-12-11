import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;
import qrCode from 'qrcode';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist/cs-1660-project/browser')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/cs-1660-project/browser/index.html'));
});

app.get('/', (req, res) => {
  res.send('Hello World from Node.js server!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// // DB CONNECTION:  you MUST authenticate to google cli before using this 
// // Additionally, I will need to assign IAM roles to your google accounts so that you are able to authenticate
// Note: may need to do npm install pg & npm install @google-cloud/cloud-sql-connector to use these
import pg from 'pg';
import {Connector} from '@google-cloud/cloud-sql-connector';
const {Pool} = pg;
const connector = new Connector();

const clientOpts = await connector.getOptions({
  instanceConnectionName: 'cs1660-finalproject:us-central1:cs1660-finalproject',
  ipType: 'PUBLIC',
});

const pool = new Pool({
  ...clientOpts,
  user: 'connect',
  password: 'connectpassword',
  database: 'postgres',
  max: 5,
});

// Both pools and connectors should be closed after done with them
async function closeDB(pool) {
  await pool.end();
  connector.close();
}

// ALL tables will need to be prefixed by gititdonedb to query
// const {rows} = await pool.query('SELECT * FROM gititdonedb.student');
// console.table(rows); // prints all records in student table 

app.post("/authuser", async function (req, res) {
  const studentQuery = `SELECT firstName, lastName FROM gititdonedb.student 
    WHERE email = '${req.body["email"]}' AND password = '${req.body["password"]}';`;
  const profQuery = `SELECT firstName, lastName FROM gititdonedb.professor 
    WHERE email = '${req.body["email"]}' AND password = '${req.body["password"]}';`;
  var userType = '';
  // Runs query for student information
  var rows = await pool.query(studentQuery);
  // If no rows found, runs professor query
  if (rows.rowCount < 1) {
    rows = await pool.query(profQuery);
  }
  else {
    userType = 'Student';
  }
  // If user does not exist in either query, returns exists as false
  if (rows.rowCount < 1) {
    res.send(JSON.stringify({ exists : false }));
    return;
  }
  else {
    userType = 'Professor';
  }

  // Sends user information back and returns exists as true
  res.setHeader('Content-Type', 'application/json');
  // closeDB(pool);
  res.send(JSON.stringify({ exists : true, message : 'Query executed', type : userType }));
});

// Endpoint encodes qr code as Base64 string and sends this information
app.post('/qrcode', async (req, res) => {
  
  let data = {
    sectionNo : 101,
    courseID : "TEST1",
    profID : 0
  }

  qrCode.toDataURL(JSON.stringify(data), {type:'terminal'},
  function(err, base64url) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(base64url);
    res.setHeader('Content-Type', 'application/json');
    res.send({qrCode:base64url});
  }
)

});

// TODO: Create endpoint that will store DB elements after QR code has been scanned 
// The Front End will call this API after the QR code has been scanned, and pass 
// to it the sectionNo, courseID, studentID and timestamp of when QR was scanned 
// This information will then be stored in the DB to officially mark the student present 
// Endpoint to insert data
// Below is WIP 
// app.post('/recordAttendance', async (req, res) => {
//   try {
//   } catch (error) {
//     console.error(error);
//   }
// });