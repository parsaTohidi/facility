var jwt = require("jsonwebtoken");
var fs = require("fs");
var shortid = require('shortid');
var validator = require('validator');

var users = require("../models/user");
var facility = require("../models/sportFacility");
var Reservation = require("../models/reservation");

var methods = {};

methods.getFacility = (type, callback) => {
    facility.find({type : type}, (err, facilities) => {
        if (err) {
            callback(500, err)
        }
        else {
            callback(null, null, facilities)
        }
    })
}

methods.facilityDetails = (facilityId, callback) => {
    facility.findOne({_id : facilityId}, (err, facil) => {
        if (err) {
            callback(500, err)
        }
        else {

            if (!facil) {
                callback(404, 'مکان ورزشی یافت نشد')
            }
            else {
                callback(null, null, facil)
            }

        }
    })
}


methods.addToFavorite = (userId, facilityId, callback) => {
    facility.findOne({_id : facilityId}, (err, facil) => {
        if (err) {
            callback(500, err)
        }
        else {
            if (!facil) {
                callback(404, 'مکان ورزشی یافت نشد')
            }
            else {
                users.findOne({_id : userId}, (err, user) => {
                    if (err) {

                    }
                    else {
                        user.favorites.push({
                            _id : facil._id
                        })

                        user.save((err => {
                            if (err) {
                                callback(500, err)
                            }
                            else {
                                callback(null, null)
                            }
                        }))
                    }
                })
            }

        }
    })
}

methods.getFavorites = (userId, callback) => {
    users.findOne({_id : userId}, (err, user) => {
        if (err) {
            callback(500, err)
        }
        else {

            if (!user) {
                callback(404, 'کاربری یافت نشد')
            }
            else {
                facility.find({ _id : {$in : user.favorites}}, ( err, facilities) => {
                    if (err) {
                        callback(500, err)
                    }
                    else {
                        callback(null, null, facilities)
                    }
                })
            }

        }
    })
}

methods.addFacility = (name, description, phoneNumber, type, address, callback) => {

    var newFacil = new facility({
        name : name,
        description : description,
        phoneNumber : phoneNumber,
        type : type,
        address : address
    })

    newFacil.save((err, facil) => {
        if (err) {
            callback(500, err)
        }
        else {
            callback(null, null, facil)
        }
    })

}

methods.getReservedTimesOfDay = (facilityId, day, callback) => {
    Reservation.find({facilityId : facilityId, day : day}, (err, reserved) => {
        if (err) {
            callback(500, err)
        }
        else {
            callback(null, null, reserved)
        }
    })
}

methods.reserveTime = (userId, facilityId, day, time, callback) => {
    Reservation.find({facilityId : facilityId, day : day, time : time}, (err, reserved) => {
        if (err) {
            callback(500, err)
        }
        else {
            if (reserved) {
                callback(400, 'سانس انتخاب شده رزرو شده است')
            }
            else {
                facility.findOne({_id : facilityId}, (err, facility) => {
                    if (err) {
                        callback(500, err)
                    }
                    else {
                        if (!facility) {
                            callback(404, 'مکان ورزشی مورد نظر یافت نشد')
                        }
                        else {
                            newReserve = new Reservation({
                                userId : userId,
                                facilityId: facilityId,
                                time : time,
                                day : day
                            })

                            newReserve.save((err) => {
                               if (err) {
                                   callback(500, err)
                               }
                               else {
                                   callback(null, null)
                               }
                            })
                        }
                    }
                })
            }
        }
    })
}



module.exports = methods;
