const mongoose = require('mongoose');


// db connection start

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
        .then((response) => {
            console.log("database connected successfully......");
        })
        .catch((err) => {
            console.log(err);
        })
}

// db connection end 

module.exports = connectDB;