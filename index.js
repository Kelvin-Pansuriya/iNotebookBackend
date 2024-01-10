const express = require("express")
const connectToMongo = require("./db/db")
const app = express()
connectToMongo()
var cors = require("cors")
const port = 5000;

// Middleware For Using req.body
app.use(express.json())
app.use(cors())

// All The Routes....
app.use("/api/auth",require("./routes/auth"))
app.use("/api/notes",require("./routes/note"))

app.listen(port,()=>{
    console.log(`Server Is Running On ${port} Port No.`);
})