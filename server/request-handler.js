var fs = require('fs');

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var obj = {results: []};

var requestHandler = function(request, response) {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  if(request.method === 'POST') {
    var body = [];
    request.on('error', function(err) {
      console.error(err);
    }).on('data', function(chunk) {
     // console.log("this is the chunk ----->",chunk);
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
      console.log("thisis the body --->",body);
      obj.results.push(body);
      //console.log('object before stringify', obj);     
    })
  response.writeHead(201, headers);  
  response.end(JSON.stringify(obj));
  }

  if (request.method === 'GET') {
    // var code;
      //console.log('Serving request type ' + request.method + ' for url ' + request.url);
    // request.on('error', function(err) {
    //   console.error(err);
    // })

    fs.readFile(__dirname + '/classes/messages','utf-8', function(err,data) {
      if (err) {
        console.log(err)
        response.statusCode(400);
        response.end();
      } else {
        data = JSON.parse('[' + data + ']');
      }
    });
    if(request.url !== '/classes/messages' && request.url !== '/classes/room') {
      //console.log('URL LOG: --> ', response);
      response.writeHead(404, headers); 
      response.end(JSON.stringify(obj));
    } else {
      response.writeHead(200, headers); 
      // console.log('object', JSON.parse("'" + obj.results[0] + "'")); 
      console.log('object in get',JSON.parse(JSON.stringify(obj)).results[0]);
      response.end(JSON.stringify(obj));
  }
}


  //console.log(request);
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.


  // The outgoing status.
  //var statusCode = 404;

  // See the note below about CORS headers.


  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  //response.writeHead(statusCode, headers); 


  // response.setHeader('Content-Type', 'application/json')

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //   if(request.method === 'GET') {
  //   request.on('request', function(request, response) {
  //     // response.statusCode = 200;
  //     console.log('hi')
  //   });
  // }
  //var obj = {results: []};
  // obj.results.push(request._postData)
  //response.end(JSON.stringify(obj));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;
