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



// let socketId = [];
let videos = {};
// let willReload = {};
// let namedDevices = {};

let devices = {};



app.get("/", function (req, res) {
  res.sendFile(__dirname + "/html/index.html");
});


app.use('/static', express.static('static'));




app.get("/video/:randomizer", function (req, res) {

    console.log(req.params.randomizer)

    // Listing 3.
    const options = {};

    let start;
    let end;

    const range = req.headers.range;
    if (range) {
        const bytesPrefix = "bytes=";
        if (range.startsWith(bytesPrefix)) {
            const bytesRange = range.substring(bytesPrefix.length);
            const parts = bytesRange.split("-");
            if (parts.length === 2) {
                const rangeStart = parts[0] && parts[0].trim();
                if (rangeStart && rangeStart.length > 0) {
                    options.start = start = parseInt(rangeStart);
                }
                const rangeEnd = parts[1] && parts[1].trim();
                if (rangeEnd && rangeEnd.length > 0) {
                    options.end = end = parseInt(rangeEnd);
                }
            }
        }
    }

    res.setHeader("content-type", "video/mp4");

    const filePath = "./videos/"+devices[req.cookies.id]["videos"][0];

    fs.stat(filePath, (err, stat) => {
        if (err) {
            console.error(`File stat error for ${filePath}.`);
            console.error(err);
            res.sendStatus(500);
            return;
        }

        let contentLength = stat.size;

        // Listing 4.
        if (req.method === "HEAD") {
            res.statusCode = 200;
            res.setHeader("accept-ranges", "bytes");
            res.setHeader("content-length", contentLength);
            res.end();
        }
        else {       
            // Listing 5.
            let retrievedLength;
            if (start !== undefined && end !== undefined) {
                retrievedLength = (end+1) - start;
            }
            else if (start !== undefined) {
                retrievedLength = contentLength - start;
            }
            else if (end !== undefined) {
                retrievedLength = (end+1);
            }
            else {
                retrievedLength = contentLength;
            }

            // Listing 6.
            res.statusCode = start !== undefined || end !== undefined ? 206 : 200;

            res.setHeader("content-length", retrievedLength);

            if (range !== undefined) {  
                res.setHeader("content-range", `bytes ${start || 0}-${end || (contentLength-1)}/${contentLength}`);
                res.setHeader("accept-ranges", "bytes");
            }

            // Listing 7.
            const fileStream = fs.createReadStream(filePath, options);
            fileStream.on("error", error => {
                console.log(`Error reading file ${filePath}.`);
                console.log(error);
                res.sendStatus(500);
            });


            fileStream.pipe(res);
        }
    });
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

app.get("/getid",(req,res)=>{
    const id = makeid(32);
    devices[id] = {name:id, named:false, videos:["bigbuck.mp4"],isPlaying:true,isMuted:true,setTime:false,time:0,checked:Math.floor(Date.now() / 1000)}
    res.send(id);
})


app.get("/deviceinfo/:id",(req,res)=>{
    res.send(JSON.stringify(devices[req.params.id]));
    devices[req.params.id]["setTime"]=false;
    devices[req.params.id]["checked"]=Math.floor(Date.now() / 1000);
})



app.get('/setsound/:id',(req,res)=>{
    devices[req.params.id]["isMuted"]=true?req.query.setsound=="mute":false;
    res.send(`sound was set to ${req.setsound}`)
})

app.get('/settime/:id',(req,res)=>{
    devices[req.params.id]["setTime"]=true;
    devices[req.params.id]["time"]=req.query.settime;
    res.send(`time was set to ${req.query.settime}`)
})

app.get('/pause/:id',(req,res)=>{
    devices[req.params.id]["isPlaying"]=false;
    res.send(`video was paused`)
})

app.get('/play/:id',(req,res)=>{
    devices[req.params.id]["isPlaying"]=true;
    res.send(`video was played`)
})

app.get("/alldevices",(req,res)=>{
    res.send(JSON.stringify(devices));
})

app.get("/allvideos",(req,res)=>{
    fs.readdir("videos", (err, files) => {
        res.send(files)
    })
})

app.get("/setvideo/:id",(req,res)=>{

    res.send(`video was set for the device (${req.params.id})`);
})


app.get("/setname/:id",(req,res)=>{
    if(req.query.name==""){
        devices[req.params.id]["named"]=false;
        devices[req.params.id]["name"]=req.params.id;
    }else{
        devices[req.params.id]["named"]=true;
        devices[req.params.id]["name"]=req.query.name;
    }
    res.send(`device name was set to (${req.params.id})`);
})



app.get("/getnamed",(req,res)=>{
    // object of named devices {"id":"name"}
    const namedDevices = {};
    for(device in devices){
        if(devices[device]["named"]){
            namedDevices[device]=devices[device]["name"];
        }
    }
    res.send(JSON.stringify(namedDevices));
})

app.get("/getunnamed",(req,res)=>{
    let unnamed = [];
    // array of unnamed devices [ids]
    for(device in devices){
        console.log(devices[device]["named"])
        if(!devices[device]["named"]){
            unnamed.push(devices[device]["name"]);
        }
    }
    res.send(JSON.stringify(unnamed));
})





// dibricated by alifaleh: socket.io not working on mart tv

// app.get('/setsound/:id',(req,res)=>{
//     io.to(req.params.id).emit('setsound',req.query.setsound);
//     res.send(`sound was set to ${req.setsound}`)
// })

// app.get('/settime/:id',(req,res)=>{
//     io.to(req.params.id).emit('settime',req.query.settime);
//     res.send(`time was set to ${req.query.settime}`)
// })

// app.get('/pause/:id',(req,res)=>{
//     io.to(req.params.id).emit('pause');
//     res.send(`video was paused`)
// })

// app.get('/play/:id',(req,res)=>{
//     io.to(req.params.id).emit('play');
//     res.send(`video was played`)
// })

// app.get("/alldevices",(req,res)=>{
//     res.send(socketId)
// })

// app.get("/allvideos",(req,res)=>{
//     fs.readdir("videos", (err, files) => {
//         res.send(files)
//     })
// })

// app.get("/setvideo/:id",(req,res)=>{
//     videos[req.params.id] = req.query.video;
//     io.to(req.params.id).emit('setvideo',"setvideo");
//     res.send(`video was set for the device (${req.params.id})`);
// })


// app.get("/setname/:id",(req,res)=>{
//     delete namedDevices[req.params.id]
//     io.to(req.params.id).emit('setname',req.query.name);
//     res.send(`device name was set to (${req.params.id})`);
// })



// app.get("/getnamed",(req,res)=>{
//     res.send(JSON.stringify(namedDevices));
// })

// app.get("/getunnamed",(req,res)=>{
//     let unnamed = [];
//     for(let c=0;c<socketId.length;c++){
//         if(!namedDevices[socketId[c]]){
//             unnamed.push(socketId[c])
//         }
//     }
//     res.send(JSON.stringify(unnamed));
// })




// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socketId.push(socket.id);
//     videos[socket.id] = "bigbuck.mp4";
//     console.log(socketId);

//     socket.emit('setid', socket.id);

//     socket.on('setwillreload', async (data)=>{
//         willReload[socket.id]=videos[socket.id]
//     })

//     socket.on('migratetoid', async (data)=>{
//         videos[socket.id] = willReload[data]
//         delete willReload[data];
//         delete namedDevices[data];
//     })

//     socket.on("named",async (data)=>{
//         delete namedDevices[socket.id]
//         namedDevices[socket.id] = data
//         console.log(namedDevices)
//     })


//     socket.on('disconnect', () => {
//         console.log('disconnected')
//         socketId.splice(socketId.indexOf(socket.id),1)
//         delete videos[socket.id];
//         delete namedDevices[socket.id];
//         console.log(socketId)
//     })

// });





//////////////////////////////////////////////////
//views:
//////////////////////////////////////////////////



app.get("/admin-devices",(req,res)=>{
    res.sendFile(__dirname+"/html/admin.html");
})


app.get("/admin-new",(req,res)=>{
    res.sendFile(__dirname+"/html/new_devices.html");
})







server.listen(port, ()=>{
    console.log(`Server is up at port ${port}`)
    console.log('Started at : '+new Date(Date.now()));
})