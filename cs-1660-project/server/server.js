const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static('dist/cs-1660-project'))

// app.use(express.static(path.join(__dirname, '../dist/cs-1660-project/browser')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../src/index.html'));
// });

// app.get('/browser', function(req, res) {
    
// });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});