var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ECT = require('ect');
var path = require('path');

var ectRenderer = ECT({ watch: true, root: __dirname , ext : '.html' });
app.engine('html', ectRenderer.render);
app.set('views', path.join(__dirname));
app.set('view engine', 'html');


var Status = "???"


app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/sync',function(req, res){
  var statusText = {
    "0" : "open",
    "1" : "close",
  }[req.query.status];
  Status = statusText; // 手抜き
  io.emit('status_changed', statusText);
  res.send("done");
})
app.get('/door', function(req, res){
  res.render('door',{status: Status});
  //res.sendfile('door.html');
});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});


var port = Number(process.env.PORT || 3000);
http.listen(port, function(){
  console.log('listening on *:3000');
});
