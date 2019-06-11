var mongoose = require ("mongoose");

var adminSchema = new mongoose.Schema ({

    name : {
        type : String
    },
    description : {
        type : String
    },
    email: {
        type : String
    },
    type :{
        type : String,
        enum : ["futsal","football","billiard","pool"]
    }
});


module.exports = mongoose.model("admin",adminSchema);