var http = require('http');
const { request } = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;


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

        res.end('Hello World\n');

        console.log("Request headers are: ", bufffer);
        
    });

});

server.listen(3000, function(){
    console.log("The server is running on port 3000 now");
})