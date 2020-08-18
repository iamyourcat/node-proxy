var http = require('http');

const config = require("./config.json");
const port = process.env.PORT || config.defaultPort;

http.createServer(onRequest).listen(port);
console.log("Proxy server is running. Using port: "+port+".");

function getHostname(url){
  res = url;
  if(res.startsWith("https://"))res=res.slice(8);
  if(res.startsWith("http://"))res=res.slice(7);
  return res.split("/")[0];
}

function onRequest(client_req, client_res) {
  var options = {
    hostname: getHostname(client_req.url),
    port: 80,
    path: client_req.url,
    method: client_req.method,
    headers: client_req.headers
  };
  var proxy = http.request(options, function (res) {
    client_res.writeHead(res.statusCode, res.headers)
    res.pipe(client_res, {
      end: true
    });
  });
  client_req.pipe(proxy, {
    end: true
  });
}
