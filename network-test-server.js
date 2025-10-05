const http = require('http');

// Test different binding addresses
const testServers = [
  { name: 'localhost', host: 'localhost', port: 3001 },
  { name: '127.0.0.1', host: '127.0.0.1', port: 3002 },
  { name: '0.0.0.0', host: '0.0.0.0', port: 3003 }
];

testServers.forEach(config => {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello from ${config.name} server on port ${config.port}!`);
  });

  server.listen(config.port, config.host, () => {
    console.log(`✅ ${config.name} server listening on ${config.host}:${config.port}`);
  });

  server.on('error', (err) => {
    console.log(`❌ ${config.name} server error:`, err.message);
  });

  server.on('connection', (socket) => {
    console.log(`🔗 ${config.name} server received connection from ${socket.remoteAddress}:${socket.remotePort}`);
  });
});

console.log('Starting test servers...');
console.log('Press Ctrl+C to stop');

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down test servers...');
  process.exit(0);
});