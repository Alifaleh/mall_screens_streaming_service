const fs = require("fs");
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const { Server } = require("socket.io");
const io = new Server(server);

const port = 3000;



let socketId = [];
let videos = {};
let willReload = {};



// io.to(id).emit('setLocation', lastLocation);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/html/index.html");
});


app.use('/static', express.static('static'));




app.get("/video", function (req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    console.log(req.cookies.id + " => "+ videos[req.cookies.id])

    const videoPath = "./videos/"+videos[req.cookies.id];
    const videoSize = fs.statSync("./videos/"+videos[req.cookies.id]).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});


app.get('/setsound/:id',(req,res)=>{
    io.to(req.params.id).emit('setsound',req.query.setsound);
    res.send(`sound was set to ${req.setsound}`)
})

app.get('/settime/:id',(req,res)=>{
    io.to(req.params.id).emit('settime',req.query.settime);
    res.send(`time was set to ${req.query.settime}`)
})

app.get('/pause/:id',(req,res)=>{
    io.to(req.params.id).emit('pause');
    res.send(`video was paused`)
})

app.get('/play/:id',(req,res)=>{
    io.to(req.params.id).emit('play');
    res.send(`video was played`)
})

app.get("/alldevices",(req,res)=>{
    res.send(socketId)
})

app.get("/allvideos",(req,res)=>{
    fs.readdir("videos", (err, files) => {
        res.send(files)
    })
})

app.get("/setvideo/:id",(req,res)=>{
    videos[req.params.id] = req.query.video;
    io.to(req.params.id).emit('setvideo',"setvideo");
    res.send(`video was set for the device (${req.params.id})`);
})


io.on('connection', (socket) => {
    console.log('a user connected');
    socketId.push(socket.id);
    videos[socket.id] = "bigbuck.mp4";
    console.log(socketId);

    socket.emit('setid', socket.id);

    socket.on('setwillreload', async (data)=>{
        willReload[socket.id]=videos[socket.id]
    })

    socket.on('migratetoid', async (data)=>{
        videos[socket.id] = willReload[data]
        delete willReload[data];
    })


    socket.on('disconnect', () => {
        console.log('disconnected')
        socketId.splice(socketId.indexOf(socket.id),1)
        delete videos[socket.id];
        console.log(socketId)
    })

});










server.listen(port, ()=>{
    console.log(`Server is up at port ${port}`)
    console.log('Started at : '+new Date(Date.now()));
})