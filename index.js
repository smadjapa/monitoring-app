//Declare dependancy
var fs = require('fs');
var url = require('url');
var http = require('http');
var https = require('https');
var config = require('./config');
var StringDecoder = require('string_decoder').StringDecoder;

// Instantiating the http server
var httpserver = http.createServer(function(req,res){
    unifiedServer(req, res);
});

//Start the http server
httpserver.listen(config.httpPort, function(){
    console.log("The server is running on port " + config.httpPort);
});

// Instantiating the https server
var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req, res);
});

//Start the https server
httpsServer.listen(config.httpsPort, function(){
    console.log("The server is running on port " + config.httpsPort);
});

//All the server logics for both the http and https
var unifiedServer = function(req, res){
     //Geting the path
     var parsedUrl = url.parse(req.url, true);
     var path = parsedUrl.pathname;
     var trimmedPath = path.replace(/^\/+|\/+$/g, '');
 
     //Get the query strings
     var queryObj = parsedUrl.query;
 
     //Get the method
     var method = req.method.toLowerCase();
 
     //Get the headers
     var headers = req.headers;
 
     //Get body
     var bufffer = '';
     var decoder = new StringDecoder('utf-8');
     
     req.on('data', function(data){
         bufffer += decoder.write(data);
     });
 
     req.on('end', function(){
         bufffer += decoder.end();
 
         var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
 
         var data  = {
             'trimmedPath' : trimmedPath,
             'queryStringObject' : queryObj,
             'method' : method,
             'headers' : headers,
             'payload' : bufffer
         };
 
         choosenHandler(data,function(statusCode, payload){
 
             statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
             payload = typeof(payload) == 'object' ? payload : {};
 
             var payladString = JSON.stringify(payload);
 
             res.setHeader('Content-Type', 'application/json');
             res.writeHead(statusCode);
             res.end(payladString);
 
             console.log("We are returning this response", statusCode, payladString);
         });
     });
}

//Define the handlers
var handlers = {};

//Ping handler
handlers.ping = function(data,callback){
    callback(200);
}

//Not found handler
handlers.notFound = function(data, callback){
    callback(404);
};

//Define a request router
var router = {
    'ping' : handlers.ping
}