var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/notes.json', function(req, res) {
  fs.readFile('notes.json', function(err, data) {
    res.setHeader('Content-Type', 'application/json');
    if(!data || data.length == 0) {
      data = '[]';
    }
    res.send(data);
  });
});

app.post('/notes.json', function(req, res) {
  fs.readFile('notes.json', function(err, data) {
    if(!data || data.length == 0) {
      data = '[]';
    }
    var notes = JSON.parse(data);
    notes.push(req.body);
    fs.writeFile('notes.json', JSON.stringify(notes, null, 4), function(err) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(JSON.stringify(notes));
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
