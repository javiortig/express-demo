
function log(req, res, next){
    console.log("Logging...");
    next();
}

function auth(req, res, next){
    console.log("Authenticating...");
    next();
}

exports.log = log;
exports.auth = auth;