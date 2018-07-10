var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function(req, res){
  var pathname = url.parse(req.url).pathname;
  if(pathname == '/x') {
    var data = fs.readFileSync('./index.html').toString();
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(data);
  } else {
    console.log(pathname)
    console.log("hello world!");
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end("hello world!");
  }
})
.listen(8877)
