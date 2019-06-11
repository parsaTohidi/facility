var dbUser = ""
var dbPassword = ""
var config

if(dbUser) {
    config = {
        dbUrl: 'mongodb://' + dbUser + ':' + dbPassword + '@localhost:27017/salon'
    }
}
else{
    config = {
        dbUrl: 'mongodb://127.0.0.1:27017/salon'
    }
}
module.exports = config