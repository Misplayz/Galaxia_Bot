const http = require('http');
const axios = require('axios');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write("Now I'm alive");
  res.end();
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function keepAlive() {
  setInterval(() => {
    http.get(`http://localhost:${PORT}`, (response) => {
      console.log('Keep alive request sent');
    }).on('error', (error) => {
      console.error('Error:', error);
    });
  }, 2 * 60 * 1000); // 2 minutes interval
}

keepAlive();

setInterval(() => {
  console.log("Server is still running...");
}, 60 * 1000);

// เมื่อมีคำขอ GET มาที่ /sendRequest
server.on('request', async (req, res) => {
  if (req.method === 'GET' && req.url === '/sendRequest') {
    try {
      // ส่งคำขอ GET ไปยังเซิร์ฟเวอร์อื่น
      const response = await axios.get('http://example.com/api/data');
      // ส่งข้อมูลกลับไปยังผู้ใช้
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response.data));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
});
