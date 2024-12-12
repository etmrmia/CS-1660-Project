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

// ALL tables will need to be prefixed by gititdonedb to query
// const {rows} = await pool.query('SELECT * FROM gititdonedb.student');
// console.table(rows); // prints all records in student table 

/**
 * Endpoint returning user information and boolean with existence status.
*/
app.post("/authuser", async function (req, res) {
  const studentQuery = `SELECT firstName, lastName, studentID FROM gititdonedb.student 
    WHERE email = '${req.body["email"]}' AND password = '${req.body["password"]}';`;
  const profQuery = `SELECT firstName, lastName, professorID FROM gititdonedb.professor 
    WHERE email = '${req.body["email"]}' AND password = '${req.body["password"]}';`;
  var isStudent = false, idData = 0;
  // Runs query for student information
  try {
    var rows = await pool.query(studentQuery);
  }
  catch (studentErr) {
    console.log(studentErr);
    return;
  }
  // If no rows found, runs professor query
  if (rows.rowCount < 1) {
    try {
      rows = await pool.query(profQuery);
    }
    catch (profError) {
      console.log(profError);

      return;
    }
  }
  else {
    isStudent = true;
    idData = rows['rows'][0]['studentid'];
  }
  // If user does not exist in either query, returns exists as false
  if (rows.rowCount < 1) {
    res.send(JSON.stringify({ exists : false }));
    return;
  }
  else if (!isStudent) {
    idData = rows['rows'][0]["professorid"];
  }

  console.log(JSON.stringify({ exists : true, 
    firstName : rows.rows[0]["firstname"],
    lastName : rows.rows[0]["lastname"],
    id : idData,
    isStudentValue : isStudent }));
  // Sends user information back and returns exists as true
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ exists : true, 
                            firstName : rows.rows[0]["firstname"],
                            lastName : rows.rows[0]["lastname"],
                            id : idData,
                            isStudentValue : isStudent }));
});

/**
 * Endpoint that queries user attendance based on given user ID and grouped by course.
*/
app.post('/userattendance', async function (req, res) {
  // Queries for number of attendances a student per class
  const query = `SELECT a.attendanceDate AS attendanceDate, c.courseid AS courseId, s.sectionNo AS sectionNo, a.studentid AS studentId
                  FROM gititdonedb.ATTENDANCE AS a JOIN gititdonedb.COURSE AS c ON a.courseID=c.courseID
                  JOIN gititdonedb.SECTIONS s on c.courseid = s.courseID
                  WHERE a.studentID = ${req.body["studentId"]}
                  ORDER BY c.courseName;`;
  
  try {
    var rows = await pool.query(query);
  }
  catch (e) {
    console.log(e);
    return;
  } 
  
  // Sends user information back as a json object
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ attendanceRows : rows }));
});

/**
 * Endpoint that queries all student attendance based on given course ID grouped by student ID.
*/
app.post('/courseattendance', async function (req, res) {
    try {
  // Queries for number of attendances a student per class
  const query = `SELECT COUNT(a.attendanceDate) AS attendance, a.studentID AS sid FROM gititdonedb.ATTENDANCE a
WHERE a.courseID = '${req.body["courseId"]}' AND a.sectionNo = ${req.body["sectionNo"]}
    GROUP BY studentID;`;
  
    var rows = await pool.query(query);
  
  // Sends user information back as a json object
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ courseAttendanceRows : rows }));
  }
  catch (e) {
    console.log(e);
    return;
  } 
});

/**
 * Endpoint accepting a user id and returning list of courses user attends.
*/
app.post('/studentcourses', async function (req, res) {
  // Queries for course numbers and names where student is listed on roster
  const query = `SELECT s.sectionNo, c.courseID, c.courseName, p.professorID, p.firstName, p.lastName
                  FROM gititdonedb.ROSTER AS r JOIN gititdonedb.COURSE AS c ON r.courseID=c.courseID
                  JOIN gititdonedb.SECTIONS AS s ON s.courseID = r.courseID
                  JOIN gititdonedb.PROFESSOR p on s.professorID = p.professorID
                  WHERE r.studentID = ${req.body["studentId"]}
                  ORDER BY c.courseID;`;
  try {
    var rows = await pool.query(query);

    // Sends course information for user back as json object
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ courseRows : rows }));
  }
  catch (e) {
    console.log(e);
    return;
  }
});

/**
 * Endpoint accepting a user id and returning list of courses and sections user attends.
*/
app.post('/professorsections', async function (req, res) {
  // Queries for course numbers and names where student is listed on roster
  const query = `SELECT s.sectionNo, c.courseID, c.courseName, p.professorID, p.firstName, p.lastName
                  FROM gititdonedb.SECTIONS AS s JOIN gititdonedb.COURSE AS c ON s.courseID=c.courseID
                  JOIN gititdonedb.PROFESSOR p on s.professorID = p.professorID
                  WHERE s.professorID = ${req.body["professorID"]}
                  ORDER BY c.courseID;`;
  try {
    var rows = await pool.query(query);

    // Sends course information for user back as json object
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ courseRows : rows }));
  }
  catch (e) {
    console.log(e);
    return;
  }
});

/**
 * Endpoint taking a course id and returning list of students attending course.
*/
app.post('/usersincourse', async function (req, res) {
  // Queries for student's first and last names in given course
  const query = `SELECT s.firstName, s.lastName, s.studentID
                  FROM gititdonedb.ROSTER AS r JOIN gititdonedb.STUDENT AS s ON r.studentID=s.studentID
                  WHERE r.courseID = '${req.body["courseID"]}'
                  ORDER BY s.lastName, s.firstName, s.studentID;`;
  console.log(`In usersincourse => ${query}`);
  try {
    var rows = await pool.query(query);
    // Sends student list back as json object
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ studentList : rows }));
  }
  catch (e) {
    console.log(e);
    return;
  }
});

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
  console.log("Getting student attendance");
  console.log(req.body);
  console.log(req.body["studentID"]);
  console.log(req.body["courseID"]);
  console.log(req.body["sectionNo"]);

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
