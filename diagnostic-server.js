const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`📥 Received ${req.method} ${req.url} from ${req.socket.remoteAddress}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  }));
});

server.on('listening', () => {
  console.log('✅ Server is listening on port 3333');
  console.log('🌐 Try: http://localhost:3333');
});

server.on('connection', (socket) => {
  console.log(`🔗 New connection from ${socket.remoteAddress}:${socket.remotePort}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT - shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM - shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Start server
server.listen(3333, '127.0.0.1');
console.log('🚀 Starting server on 127.0.0.1:3333...');