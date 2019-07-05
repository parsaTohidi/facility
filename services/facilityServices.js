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

            Reservation.findOne({facilityId : facilityId}, (err, reserved) => {
                if (err) {
                    callback(500, err)
                }
                else {

                    callback(null, null, facil, reserved)

                }
            })

        }
    })
}


methods.addToFavorite = (facilityId, callback) => {
    facility.findOne({_id : facilityId}, (err, facil) => {
        if (err) {
            callback(500, err)
        }
        else {

            users.findOne({}, (err, user) => {
                if (err) {

                }
                else {
                    user.favorites.push({facilityId})

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
    })
}

methods.getFavorites = (callback) => {
    users.findOne({}, (err, user) => {
        if (err) {
            callback(500, err)
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

module.exports = methods;
