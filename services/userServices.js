var jwt = require("jsonwebtoken");
var fs = require("fs");
var shortid = require('shortid');
var validator = require('validator');
var nodemailer=require("nodemailer");

var users = require("../models/user");

var methods = {};

var secretKey = "salon";

var sendPasswordLink = function(email,id){
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'reactGroupKhu@gmail.com', // my mail
            pass: 'sharabesadsale'
        }
    });

    var mailOptions = {
        from: 'reactGroupKhu@gmail.com', // sender address
        to: `${email}`, // list of receivers
        subject: 'changing password', // Subject line
        text: `the new password is : ${id}`// plain text body
    };

    transport.sendMail(mailOptions, function (err, info) {
        if(err)
            console.error(err)
    });
}

methods.register = function (name, familyName, username, email, password, repeatPass, phoneNumber, callback) {

    users.findOne({$or: [{username: username},{email: email}]}, function (err, user) {
        if (err) {
            callback(500, err);
        }
        else if (user) {
            if (user.email == email) {
                callback(400, "ایمیل وارد شده تکراری است");
            }
            else if (user.username == username) {
                callback(400, "یوزر وارد شده تکراری است");
            }
        }
        else {
            if (username && password && phoneNumber && name && familyName && email && repeatPass) {
                if (validator.isEmail(email)) {
                    if (password == repeatPass) {
                        if (password.length >= 8) {
                            var newUser = new users({
                                phoneNumber: phoneNumber,
                                name: name,
                                familyName: familyName,
                                username: username,
                                password: password,
                                email : email
                            });

                            newUser.save(function (err) {
                                if (err) {
                                    callback(500, err)
                                }
                                else {
                                    callback(null, null, newUser._id);
                                }
                            })
                        }
                        else {
                            callback(400, "پسورد ضعیف است", null)
                        }
                    }
                    else{
                        callback(400, "پسورد با تکرار آن تطابق ندارد", null)
                    }
                }
                else{
                    callback(400, "ادرس ایمیل وارد شده صحیح نمی باشد", null)
                }
            }
            else {
                callback(400, "موارد درخواست شده را پر کنید", null)
            }

        }
    })
}

methods.login = function (input, password, callback) {
    var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/gm

         if (emailRegex.test(input)) {
            users.findOne({email: input}, function (err, user) {
                if (err) {
                    callback(500, err, null);
                }
                else if (!user) {
                    callback(400, "ایمیل یا پسورد صحیح نمیباشد", null);
                }
                else {
                    if (user.password == password) {
                        var token = jwt.sign({
                            id: user._id
                        }, secretKey, {
                            expiresIn: 24 * 3600
                        });
                        callback(null, null, token);
                    }
                    else{
                        callback(400, "پسورد صحیح نمیباشد")
                    }
                }
            })
        }
        else {
            callback(400, "ایمیل صحیح نمیباشد")
        }
}

methods.showProfile = function(user, callback){
    users.findOne({_id : user._id},{verifCode:0, active:0, goldUser:0}
        ,function (err, user) {
            if(err){
                callback(500,err)
            }
            else if(!user){
                callback(404,"کاربری یافت نشد")
            }
            else{
                callback(null,null,user)
            }
        })
}

methods.editProfile = function (user, name, familyName, username, password, phoneNumber, email, callback) {

    users.findOne({_id : user._id},function (err, existUser) {
        if(err){
            callback(500,err);
        }
        if(existUser == ""){

            callback(400,"کاربر موجود نیست")
        }
        else {
            user.name = name
            user.familyName = familyName
            user.email = email
            user.password = password
            user.username = username
            user.phoneNumber = phoneNumber

            user.save((err)=>{
                if(err){
                    callback(500,err)
                }
                else{
                    callback(null,null)
                }
            })
        }
    })
}

methods.forgetPassword = (email, callback) => {
    users.findOne({ email : email} , (err, user) => {
        if (err) {
            callback(500, err)
        }
        else {

            user.code = code

            var transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'reactGroupKhu@gmail.com', // my mail
                    pass: 'sharabesadsale'
                }
            });

            var mailOptions = {
                from: 'reactGroupKhu@gmail.com', // sender address
                to: `${email}`, // list of receivers
                subject: 'changing password', // Subject line
                text: `your code is : ${code}`// plain text body
            };

            transport.sendMail(mailOptions, function (err, info) {
                if(err)
                    console.error(err)
                else
                    console.log(info)
            });

            user.save((err)=>{
                if(err){
                    callback(500,err)
                }
                else{
                    callback(null,null)
                }
            })

        }
    })
}


module.exports = methods;
