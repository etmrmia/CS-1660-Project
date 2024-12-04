const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const qrCode = require('qrcode');

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
//     const query = 'INSERT INTO ATTENDANCE (attendanceDate, sectionNo, courseID, studentID) VALUES ($1, $2, $3, $4) RETURNING *';
//   } catch (error) {
//     console.error(error);
//   }
// });