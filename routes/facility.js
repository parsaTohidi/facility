var express = require('express');
var jwt = require("jsonwebtoken");
var path = require('path');
var router = express.Router();


var facillityService = require("../services/facilityServices")

var secretKey = "salon";
var User = require("../models/user");

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
    facillityService.facilityDetails(req.params.facilityId,  (errCode,errTxt,facil, reserved) => {
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
                fasil : fasil,
                reserved : reserved
            })
        }
    })
})

router.post("/add/favorites" , function (req, res, next) {
    facillityService.facilityDetails(req.params.facilityId,  (errCode,errTxt,facil, reserved) => {
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
                fasil : fasil,
                reserved : reserved
            })
        }
    })
})

router.get("/favorites/:type" , function (req, res, next) {
    facillityService.getFacility(req.params.type,  (errCode,errTxt,facilities) => {
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
