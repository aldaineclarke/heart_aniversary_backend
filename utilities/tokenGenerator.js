const jwt = require("jsonwebtoken");

/**
 * ### Description
 * Generates a JWT token with the data passed in as the payload.
 * @param {Object} data data to use as the payload of the token
 * @param {string} expiryDate string representation of time, in seconds
 * */ 
exports.generateJWTToken = (data, expiryDate)=>{
    let expireIn = expiryDate + "s"
    return jwt.sign(data,process.env.JWT_SECRET_KEY, {expiresIn: expireIn})
}