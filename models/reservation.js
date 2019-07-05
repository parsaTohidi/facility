var mongoose = require ("mongoose");

var reserveSchema = new mongoose.Schema ({

    day : {
        type : Number
    },
    time : {
        type : Number
    },
    facilityId: {
        type : String
    },
    userId : {
        type : String
    }

});


module.exports = mongoose.model("Reservation",reserveSchema);