var http = require('http');
var fs = require('fs');
var express = require('express')
var app = express();

app.use(express.static(__dirname));

app.post('/', function(request, response){
  message = "";
  request.on('data', function(chunk){
    console.log(chunk);
    message+=chunk;
  })
  request.on('end', function(){
    console.log(message.toString());
    console.log('request has ended');
    message = JSON.parse(message);
    console.log(message.contents[0].questionSet);
    response.end();
  })
})


app.listen(8080);