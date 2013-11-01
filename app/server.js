var http = require('http');
var fs = require('fs');
var express = require('express')
var app = express();

app.use(express.static(__dirname));


//add in /:user/:assignmentName
app.post('/', function(request, response){
  message = "";
  request.on('data', function(chunk){
    message+=chunk;
  })
  request.on('end', function(){
    message = JSON.parse(message);
    console.log(message);
    response.end();
  })
})


app.listen(8080);