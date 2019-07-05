var express = require('express');
var jwt = require("jsonwebtoken");
var path = require('path');
var router = express.Router();


var facillityService = require("../services/facilityServices")

var secretKey = "salon";
var User = require("../models/user");

var Auth = function (req, res, next) {
    var token = req.headers.token;
    if(token){
        jwt.verify(token, secretKey, function(err, decoded) {
            if (err) {

                res.status(500).send({
                    "error": err
                });
            }
            else {
                User.findOne({
                    _id: decoded.id
                }, function(err, user) {
                    if (err) res.status(500).send({
                        "error": err
                    });
                    else if (!user) {
                        res.status(404).send({
                            error : 'کاربری برای استفاده از محتویات یافت نشد'
                        })
                    } else {
                        req.user = user;
                        next();
                    }
                })
            }
        });
    }
    else{
        res.status(400).send({
            error : 'توکن برای اهراط هویت ارایه نشده است'
        })
    }
}

router.get("/list/:type" , function (req, res, next) {
    facillityService.getFacility(req.params.type,  (errCode,errTxt,facilities) => {
        if(errCode){
            console.log(errTxt)
            res.status(errCode).send({
                success : false ,
                error : errTxt
            })
        }
        else {
            res.status(200).send({
                success : true,
                facilities : facilities
            })
        }
    })
})


router.get("/details/:facilityId" , function (req, res, next) {
    facillityService.facilityDetails(req.params.facilityId,  (errCode,errTxt,facil) => {
        if(errCode){
            console.log(errTxt)
            res.status(errCode).send({
                success : false,
                error : errTxt
            })
        }
        else {
            res.status(200).send({
                success : true,
                facil : facil
            })
        }
    })
})

router.post("/add/favorites" , Auth, function (req, res, next) {
    let userId = req.user ? req.user._id : ''

    facillityService.addToFavorite(userId, req.body.facilityId,  (errCode,errTxt) => {
        if(errCode){
            console.log(errTxt)
            res.status(errCode).send({
                success : false,
                error : errTxt
            })
        }
        else {
            res.status(200).send({
                success : true
            })
        }
    })
})

router.get("/favorites" , Auth, function (req, res, next) {
    let userId = req.user ? req.user._id : ''
    facillityService.getFavorites(userId,  (errCode,errTxt,facilities) => {
        if(errCode){
            console.log(errTxt)
            res.status(errCode).send({
                success : false,
                error : errTxt
            })
        }
        else {
            res.status(200).send({
                success : true,
                facilities : facilities
            })
        }
    })
})

router.post("/reserved" , Auth, function (req, res, next) {
    let userId = req.user ? req.user._id : ''
    facillityService.getReservedTimesOfDay(req.body.facilityId, JSON.parse(req.body.day),  (errCode,errTxt,reserved) => {
        if(errCode){
            console.log(errTxt)
            res.status(errCode).send({
                success : false,
                error : errTxt
            })
        }
        else {
            res.status(200).send({
                success : true,
                reserved : reserved
            })
        }
    })
})

router.post("/reserve/time" , Auth, function (req, res, next) {
    let userId = req.user ? req.user._id : ''
    facillityService.reserveTime(userId, req.body.facilityId, JSON.parse(req.body.day), JSON.parse(req.body.time),  (errCode,errTxt,reserved) => {
        if(errCode){
            console.log(errTxt)
            res.status(errCode).send({
                success : false,
                error : errTxt
            })
        }
        else {
            res.status(200).send({
                success : true,
                reserved : reserved
            })
        }
    })
})

router.post("/add" , function (req, res, next) {
    facillityService.addFacility(
        req.body.name,
        req.body.description,
        req.body.phoneNumber,
        req.body.type,
        req.body.address,
        (errCode,errTxt,facility) => {
        if(errCode){
            console.log(errTxt)
            res.status(errCode).send({
                success : false,
                error : errTxt
            })
        }
        else {
            res.status(200).send({
                success : true,
                facility : facility
            })
        }
    })
})

module.exports = router;
