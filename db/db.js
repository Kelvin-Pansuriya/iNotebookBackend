const mongoose = require('mongoose');
const mongoUrl = "mongodb://0.0.0.0:27017/inotebookdb"

const connectToMongo = async ()=>{
    await mongoose.connect(mongoUrl)
    console.log(`Connect To MongoDB :- ${mongoUrl}`);
}

module.exports = connectToMongo;