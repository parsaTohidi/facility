var mongoose = require ("mongoose");

var userSchema = new mongoose.Schema ({

    name : {
        type : String
    },
    familyName : {
        type : String
    },
    username :{
        type : String,
        required : true
    },
    email: {
        type : String
    },
    password : {
        type : String,
        required: true
    },
    phoneNumber :{
        type : String,
        required : true
    },
    code : {
        type : String
    },
    favorites : [
        {
            type : String
        }
    ]
});


module.exports = mongoose.model("user",userSchema);