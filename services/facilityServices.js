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


module.exports = methods;
