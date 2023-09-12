const mongoose = require('mongoose');


// db connection start

const connectDB = () => {
    console.log('MONGO_DA')
    mongoose.connect(process.env.MONGODB_URI)
        .then((response) => {
            console.log("database connected successfully......");
        })
        .catch((err) => {
            console.log(err);
        })
}

// db connection end 

module.exports = connectDB;