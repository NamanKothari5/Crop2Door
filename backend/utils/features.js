const mongoose = require("mongoose");

module.exports.connectDB = (uri) => {
    
    mongoose.connect(uri, {
        dbName: "crop2door"
    }).then(c => {
        console.log(`DB Connected to ${c.connection.host}`);
    }).catch((e) => console.log(e));
};

