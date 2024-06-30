const { exec } = require('child_process');
const os = require('os');

if (os.platform() === 'win32') {
  // Windows
  exec('taskkill /f /im electron.exe', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log('Electron process terminated.');
  });

  exec('taskkill /f /im node.exe', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log('Node.js process terminated.');
  });

  exec('taskkill /f /im nodemon.exe', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log('Nodemon process terminated.');
  });
} else {
  // Linux (and Unix-like)
  exec('pkill -f "electron ."', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log('Electron process terminated.');
  });

  exec('pkill -f "vite --host --port 3000"', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log('Vite process terminated.');
  });

  exec('pkill -f "nodemon ./server/server.js"', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log('Node.js process terminated.');
  });
}
