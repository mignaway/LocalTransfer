const express = require('express');
const zip = require('express-zip');
const fileUpload = require('express-fileupload')
const socketIo = require('socket.io')
const fs = require('fs')
const os = require('os');
const path = require('path')
const cors = require('cors');
const { exec } = require('child_process');


const DEFAULT_UPLOAD_PATH = path.join(__dirname,'uploads')

function createExpressApp(app,port) {
    // Configure CORS to allow requests from "192.168.1.32:3000"
    const machine_ip = findNetworkIp()
    const allowedOrigins = ['http://localhost:3000', `http://${machine_ip}:3000`, 'http://127.0.0.1:3000'];

    app.use(express.json())
    app.use(
        cors({ origin: allowedOrigins})
    );

    let shareLinks = {}
    let oldShareLinks = {}
   
    // --------------------------------------------
    // ENDPOINTS

    app.get('/api/getServerIp', (req, res) => {
        const networkIp = findNetworkIp();
        if (networkIp !== null) {
            res.json({ hostAddress: networkIp });
        } else {
            res.status(500).json({ error: 'No network IP address found' });
        }
    }); 

    // server to devices
    app.post('/api/createShareLink', (req, res) => {
        const files = req.body.files
        if (files && files.length > 0) {
            const uid = generateUID()
            shareLinks[uid] = files
            res.json({ uid })
            // broadcast new link
            io.emit('shareLinks', shareLinks);
        }
    })
    // devices to server
    app.post('/api/uploadAndCreateShareLink', fileUpload( { createParentPath: true, uriDecodeFileNames: true }), (req, res) => {
        const req_files = req.files
        if (req_files == null) {
            return res.status(400).json({ msg: 'No file received'}) 
        }
        let files = [] 
        Object.keys(req_files).forEach(key => {
            const file = req_files[key]
            const pathname = path.join(__dirname,'uploads',file.name)
            files.push({path: pathname, name: file.name, size: file.size, date: req.body.date })
            file.mv(pathname, (err) => {
                if (err) return res.status(500)
            })
        })
        const uid = generateUID()
        shareLinks[uid] = files
        res.json({ uid })
        // broadcast new link
        io.emit('shareLinks', shareLinks);
    })

    app.get('/api/download/:uid', (req, res) => {
        const uid = req.params.uid
        if (Object.keys(shareLinks).includes(uid)) {
            res.zip(shareLinks[uid].map((file) => { return { path: file.path, name: file.name } }))
            oldShareLinks[uid] = shareLinks[uid]
            delete shareLinks[uid];
            io.emit('shareLinks', shareLinks) 
        }
    })
    app.post('/api/downloadSingle/:uid', (req, res) => {
        const uid = req.params.uid;
        const filename = req.body.filename;

        if (Object.keys(shareLinks).includes(uid)) {
            const fileToDownload = shareLinks[uid].find(file => file.name === filename);

            if (fileToDownload) {
                const filePath = fileToDownload.path;
                res.download(filePath, fileToDownload.name, (err) => {
                    if (err) {
                        console.error('Error downloading file:', err);
                        res.status(500).json({ error: 'Error downloading file' });
                        return
                    }
                });
            } else {
                res.status(404).json({ error: 'File not found' });
            }
        } else {
            res.status(404).json({ error: 'Share link not found' });
        }
    });


    app.get('/api/getMetadata/:uid', (req, res) => {
        const uid = req.params.uid
        if (Object.keys(shareLinks).includes(uid)) {
            res.json(shareLinks[uid])
        } else {
            res.sendStatus(404) 
        }
    })

    app.get('/api/removeShareLink/:uid', (req, res) => {
        // for now reset shareLinks (single upload max at time)
        const uid = req.params.uid
        if (Object.keys(shareLinks).includes(uid)) {
            const paths = shareLinks[uid].map(item => path.join(DEFAULT_UPLOAD_PATH, item.name))
            paths.forEach(path => {
                try{
                    fs.unlinkSync(path)
                } catch(e) {
                    console.log("Error Deleting File: Not found")
                }
            })
            res.sendStatus(200)
            delete shareLinks[uid];
            io.emit('shareLinks', shareLinks) 
        } else {
            return res.sendStatus(404)
        }
    })

    app.get('/api/checkShareLink/:uid', (req, res) => {
        const uid = req.params.uid
        if (Object.keys(shareLinks).includes(uid)) {
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    })


    app.post('/api/shutdown', (req, res) => {
        io.emit('shutdown')
        // Execute the 'stop' script from package.json
        exec('npm run stop', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return res.status(500).send('Error stopping scripts');
            }
        });
    })

    // --------------------------------------------
    // SERVER and SOCKET CONFIGURATION 

    const httpServer = app.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });
    // Initialize WebSocket server
    const io = socketIo(httpServer, { cors: allowedOrigins});

    io.on('connection', (socket) => {
        console.log("connected to socket:", socket.id)
        // Send the current shareLinks value to the connected client
        socket.emit('shareLinks', shareLinks);
        socket.emit('oldShareLinks', oldShareLinks);
    });
}

function findNetworkIp() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const networkInterface = interfaces[interfaceName];
        for (const network of networkInterface) {
            if (network.family === 'IPv4' && !network.internal && network.address.match(/^192\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
                return network.address;
            }
        }
    }
    return null;
}

function generateUID() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}

module.exports = { createExpressApp };
