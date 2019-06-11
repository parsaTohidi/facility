var express = require('express');
var jwt = require("jsonwebtoken");
var path = require('path');
var router = express.Router();


var userServices = require("../services/userServices")

var secretKey = "salon";
var User = require("../models/user");

var Auth = function (req, res, next) {
    var token = req.cookies.token;
    if(token){
        jwt.verify(token, secretKey, function(err, decoded) {
            if (err) {
                res.clearCookie('token')
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
                        res.status(404).sendFile(path.join(__dirname , "/../public/home/login.html"))
                    } else {
                        req.user = user;
                        next();
                    }
                })
            }
        });
    }
    else{
        res.status(401).sendFile(path.join(__dirname , "/../public/home/login.html"))
    }
}

router.post("/logout" , Auth , function (req, res, next) {
    if(req.user._id) {
        res.clearCookie('token')
        res.status(200).send({
            success : true
        })
    }
    else{
        res.status(500).send({
            success : false
        })
    }
})

router.post("/login",function (req, res, next) {
    userServices.login(req.body.email,req.body.password, (errCode,errTxt,token)=>{
        if(errCode){
            console.log(errTxt)
            res.status(errCode).send({
                success : false,                              // /login
                error : errTxt
            })
        }
        else{
            res.cookie('token', token, {
                expires: new Date(Date.now() + 3600 * 24 * 30 * 1000)
            });
            res.status(200).send({                         // /home
                success : true,
                token : token

            })
        }
    })

})

router.post("/register",function (req, res, next) {
    userServices.register(req.body.name, req.body.familyName, req.body.username, req.body.email.toLowerCase(), req.body.password, req.body.passwordRepeat, req.body.phoneNumber, (errCode,errTxt,id)=>{
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
                id : id
            })
        }

    });
});

router.post("/forget/password", function (req, res, next) {
    userServices.forgetPassword(req.body.email.toLowerCase(), (errCode,errTxt,token)=>{
        if(errCode){
            console.log(errTxt)
            res.status(errCode).send({
                success : false,
                error : errTxt
            })
        }
        else{
            res.status(200).send({
                success : true,
                token : token
            })
        }
    })
})

router.get("/show/profile", Auth , function (req, res, next) {
    userServices.showProfile(req.user,(errTxt,errCode,user)=>{
        if(errCode){
            res.status(errCode).send({
                error : errTxt
            })
        }
        else{
            res.status(200).send({
                success : true,
                user
            })
        }
    })
})

router.post("/edit", Auth ,function (req, res, next) {

    userServices.editProfile(req.user, req.body.name, req.body.familyName, req.body.username, req.body.password, req.body.phoneNumber, req.body.email, (errCode,errTxt)=>{
        if(errCode){
            res.status(errCode).send({
                error : errTxt
            })
        }
        else{
            res.status(200).send({
                success : true
            })
        }
    })
})



module.exports =router;