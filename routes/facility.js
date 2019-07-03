var express = require('express');
var jwt = require("jsonwebtoken");
var path = require('path');
var router = express.Router();


var facillityService = require("../services/facilityServices")

var secretKey = "salon";
var User = require("../models/user");

router.get("/list" , function (req, res, next) {
    facillityService.getFacility(req.body.type,  (errCode,errTxt,facilities) => {
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
    facillityService.facilityDetails(req.params.facilityId,  (errCode,errTxt,details) => {
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
                details : details
            })
        }
    })
})


module.exports = router;
