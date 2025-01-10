const mongoose = require("mongoose");
const env = require('../utils/config');

const mongoURL = env.MONGO_URL;
const dbConn = async() => {
   
    try {
        const uri = `${mongoURL}`;
        // process.env.DB_CNN
        mongoose.set("strictQuery", false);
    
        await mongoose.connect(uri);
        console.log('Connection BistroDB');
        
    } catch (error) {
        console.log(error);
        throw new Error('error connecting to database');
    }

};

module.exports = {
    dbConn
};