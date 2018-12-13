/*
*Restful API Design
By Dellan Muchengapadare
*/





//Dependencies
var http = require('http');
var https = require('https');
var url =  require('url');

// Defining StringDecoder constructor from the string_decoder module
var StringDecoder  = require('string_decoder').StringDecoder;
var config = require('./config.js');
var fs = require('fs');






// instantiate HTTP server 

var httpServer = http.createServer(function(req,res){

    // invoking the Unified server to form an http server
    unifiedServer(req,res);
  


});


// starting HTTP server
var httpPort = config.httpPort;
var envName = config.envName;
httpServer.listen(httpPort,function(){
    console.log(`HTTP server listening a port ${httpPort} in ${envName} mode`);
});


// instaniate  HTTPS server
var httpsSeverveOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert':fs.readFileSync('./https/cert.pem')
};


var httpsServer = https.createServer(httpsSeverveOptions,function(req,res){

});




// Starting HTTPS server
var httpsPort = config.httpsPort;
var envName = config.envName;
httpsServer.listen(httpsPort,function(){
    console.log(`HTTPS server listening a port ${httpsPort} in ${envName} mode`);
});






// the handlers of respective routers

handlers = {};

//pinging handler
handlers.ping = (data,callback)=>{
    callback(200)
};

//notFound handler
handlers.notFound = (data,callback)=>{
    callback(404)
};


handlers.forbidden = (data,callback)=> {
    var errorMessage = {
        'error':'bad request'
    };
    callback(403,errorMessage)
}

//hello handler
handlers.hello = (data,callback)=>{
    var messageObj = {
        'message':'Hi!, how are you... you are recieving this message from DELLAN server'
    }
    callback(406,messageObj)
}; 

//the router
router = {
    'ping':handlers.ping,
    'hello':handlers.hello
}




//Unified server function

var unifiedServer = function(req,res){

    var parsedUrl = url.parse(req.url,true);


    //get pathname and trim
    var path = parsedUrl.pathname;
    var trimmedUrl = path.replace(/^\/+|\/+$/g,'');

    //get method
    var method = req.method.toLowerCase();

    //get headers
    var header = req.headers;
    //get query object
    var queryStringObject = parsedUrl.query;



    //get payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);

    });

    req.on('end',function(){
        buffer+= decoder.end();


        //choosing a route.. if the provided path doesnt match a path in the router then a notFound handler is chosen
        var chosenHander = (trimmedUrl === 'hello' && method === 'post') ? handlers.hello : (trimmedUrl==='hello'&&method !=='post')? handlers.forbidden:handlers.notFound;



        //construct the  data object and senf it to the handler
        data = {
            'trimmedUrl':trimmedUrl,
            'method':method,
            'headers':header,
            'queryStringObject':queryStringObject,
            'payload':buffer
        };



        chosenHander(data,function(statusCode,payload){
            //checking the statusCode.. if its not a number then use the default 200
            statusCode = typeof(statusCode) == 'number'?statusCode:200;

            //check the payload... if its not a object then use the default payload {}
            payload = typeof(payload) == 'object'? payload:{};


            // convert the payload object to a string
            var payloadString = JSON.stringify(payload);




            

            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);    
            res.end(payloadString);    

            //print it to the console
            console.log('Returning a response',statusCode,payload);

            

            
        })


    });






};

