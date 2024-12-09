import path from 'path';
import express from 'express';
const app = express();
const port = 3000;
import qrCode from 'qrcode';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory


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

app.post("/data", function (req, res) {
  console.log("Testing 1 2 3...");
  // Will eventually receive data from post request or pull from database
  // But for now here's a const to represent data to encode in QR Code
  let data = {
    sectionNo : 101,
    courseID : "TEST1",
    profID : 0
  }
  // If sent from client side - reference as req.body.[property name]
  qrCode.toString(JSON.stringify(data), {type:'terminal'},
    function(err, code) {
      if (err) {
        console.log(err);
        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({qrCode : code}));
    }
  )
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

// ALL tables will need to be prefixed by gititdonedb to query
const {rows} = await pool.query('SELECT * FROM gititdonedb.student');
console.table(rows); // prints all records in student table 

// Both pools and connectors should be closed after done with them
await pool.end();
connector.close();
