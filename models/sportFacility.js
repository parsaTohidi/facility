var mongoose = require ("mongoose");

var adminSchema = new mongoose.Schema ({

    name : {
        type : String
    },
    description : {
        type : String
    },
    phoneNumber: {
        type : String
    },
    type :{
        type : String,
        enum : ["futsal","football","billiard","pool"]
    },
    address : {
        type : String
    }

});


module.exports = mongoose.model("admin",adminSchema);