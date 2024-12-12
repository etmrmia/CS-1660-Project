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

/**
 * Both pools and connectors should be closed after done with them.
*/
async function closeDB(pool) {
  await pool.end();
  connector.close();
}


// Endpoint encodes qr code as Base64 string and sends this information
app.post('/qrcode',  async (req, res) => {

  console.log("Getting qr code");
  console.log(req.body);

  qrCode.toDataURL(JSON.stringify(req.body), {type:'terminal'},
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

// Endpoint to send back if a student attended 
app.post('/getAttendance', express.json(), async (req, res) => {
 
  //Testing
  // console.log("Getting student attendance");
  // console.log(req.body);
  // console.log(req.body["studentID"]);
  // console.log(req.body["courseID"]);
  // console.log(req.body["sectionNo"]);

  // Query to see if student has already attended
  const query = `SELECT *
                FROM gititdonedb.ATTENDANCE 
                WHERE studentid = ${req.body["studentID"]} AND courseid ='${req.body["courseID"]}' AND sectionno = ${req.body["sectionNo"]} AND attendancedate > CURRENT_TIMESTAMP - interval'1 day';`;
  var rows = await pool.query(query);
  // Testing: 
  // console.log(rows.rowCount);

  // If no rows found, then return false, student has not attended, else true 
  res.setHeader('Content-Type', 'application/json');
  if (rows.rowCount == 0) 
    res.send({attended:"False"});
  else
    res.send({attended:"True"});

});

app.post('/recordAttendance', express.json(), async (req, res) => {
  console.log("Recording student attendance");
  console.log(req.body);
  // INSERT INTO DB HERE
  const query = `INSERT INTO gititdonedb.attendance(attendancedate, sectionno, courseid, studentid) VALUES
                (CURRENT_TIMESTAMP, ${req.body["sectionNo"]},'${req.body["courseID"]}', ${req.body["studentID"]});`;
   await pool.query(query);
  // TESTING: 
  // const {rows} = await pool.query('SELECT * FROM gititdonedb.attendance');
  // console.table(rows);
});
