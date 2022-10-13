var http = require('http');
var config = require('./config');
const { request } = require('https');
var StringDecoder = require('string_decoder').StringDecoder;

// Defining the server
var server = http.createServer(function(req,res){
    
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

});

//Start the server, and have it listen to port 3000
server.listen(config.port, function(){
    console.log("The server is running on port " + config.port + " in "+config.envName+" mode");
});

//Define the handlers
var handlers = {};

//Sample handler
handlers.sample = function(data, callback){
    callback(406, {'name': 'sample handler'});
};

//Not found handler
handlers.notFound = function(data, callback){
    callback(404);
};

//Define a request router
var router = {
    'sample' : handlers.sample
}