const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URI || '';

async function connect() {    
    console.log("url: "+url)       
    await mongoose.connect(url);     
    console.log('Connected successfully to server');
}

async function close() {
    await client.close();
}


module.exports = {
    connect,
    close
};