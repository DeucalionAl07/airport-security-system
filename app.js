var express = require('express');
var mysql = require("mysql");
var port = Number(process.env.PORT || 3000);
var path = require('path');
var bodyParser = require('body-parser');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var con = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: ""
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');

});


io.on('connection', function (socket) {
      io.sockets.on('connection', function (socket) {
        setInterval(function(){
          con.query("SELECT * FROM AIRLINES, AIRLINE_CONTACTS WHERE AIRLINES.AID=AIRLINE_CONTACTS.AID;",function(err,rows){
            if(err) throw err;
            socket.emit('airlinesdetails', rows);
          }
        )}, 1000);
      
      }); 

      io.sockets.on('connection', function (socket) {
        setInterval (()=> {
          con.query("SELECT * FROM AIRLINES,ARRIVALS WHERE AIRLINES.AID=ARRIVALS.AID;",function(err,rows){
            if(err) throw err;
            socket.emit('arrival', rows);
          }
        )}, 1000);
      });
      
      io.sockets.on('connection', function (socket) {
        setInterval (()=> {
          con.query("SELECT * FROM AIRLINES,FLIGHT WHERE AIRLINES.AID=FLIGHT.AID AND FLIGHT.ORIGIN='NEW DELHI'",function(err,rows){
            if(err) throw err;
            socket.emit('departures', rows);
          }
        )}, 1000);
      });

      io.sockets.on('connection', function (socket) {
        setInterval(() => {
          con.query("SELECT * FROM AIRLINES,FLIGHT WHERE AIRLINES.AID=FLIGHT.AID AND FLIGHT.ORIGIN!='NEW DELHI' AND FLIGHT.DEST!='NEW DELHI'",function(err,rows){
            if(err) throw err;
            socket.emit('transit', rows);
          }
        )}, 1000);
      });

      io.sockets.on('connection', function (socket) {
        setInterval(()=> {
          con.query("SELECT * FROM PASSENGER_MANAGEMENT",function(err,rows){
            if(err) throw err;
            socket.emit('passengerdetails', rows);
          }
        )}, 1000);
    });
});