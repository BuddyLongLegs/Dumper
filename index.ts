import express from "express"
import fs from "fs"
const fse = require("fs-extra");
import {networkInterfaces} from "os"
import path from "path";
const ip = require("ip")
const sendRanges = require("send-ranges");
const app = express()

const port = 8080;

const nets:Object = networkInterfaces();
const results = [];

for (const [k, v] of Object.entries(nets)) {
    for (const net of v) {
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            results.push(net.address);
        }
    }
}
console.log(results);
let hostname = results[results.length -1];
// let hostname = "0.0.0.0";
const file_location = "D:/Media/Screen Recording/2022-05-06_09-45-33.mp4"

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
})

app.get("/getfile", (req, res)=>{
    let file = fs.statSync(file_location);
    console.log(file.size)
    res.send(file_location)
})

async function getfile(request : any){
const getStream = (range:any) => fs.createReadStream(file_location, range)
  const type = null;
  const stats = await fse.stat(file_location)

  return {getStream, type, size: stats.size}
}

app.get("/download", sendRanges(getfile), (req, res) => {
    // If we got here, this was not a range request, or the `retrieveFile` handler
    // returned a falsey value
    res.set({"Access-Control-Allow-Origin":"*"})
    res.sendFile(file_location);
}
)

app.listen(port, hostname, ()=>{
    console.log(`Started Server: http://${hostname}:${port}/`)
})