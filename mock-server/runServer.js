const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('users.json')
var fs = require('fs');
var stream = fs.createWriteStream("mock.logs", {flags:'a'});
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Send response and print logs
server.use((req, res,next) => {
  let ts = Date.now();
  stream.write(ts.toString());
  stream.write("|This is a "+req.method+" request|");
  stream.write(req.originalUrl);
  stream.write("\n");
  next()
});

// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running')
});
