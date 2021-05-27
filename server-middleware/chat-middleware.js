import express from 'express'
const app = express()
app.use(express.json())

var globalVersion = 0
var messages = []

app.post("/chat/message", (req, res) => {
    console.log('messsages', req, res)
    messages.push(req.body)
    globalVersion++
    res.status(200).json({"message": req.body})
})

// ##############################
app.get("/sse", (req, res) => {
var localVersion = 0
res.set("Content-Type", "text/event-stream")
res.set("Connection", "keep-alive")
res.set("Cache-Control", "no-cache")
res.set("Access-Control-Allow-Origin", "*")
console.log("client connected to sse")
    setInterval(function(){
        if(localVersion < globalVersion){
        res.status(200).write(`data: ${JSON.stringify(messages)}\n\n`)
        localVersion = globalVersion
        }
    }, 100)
})

export default { path: '/', handler: app }