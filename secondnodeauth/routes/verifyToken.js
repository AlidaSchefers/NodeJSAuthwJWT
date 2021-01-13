const jwt = require('jsonwebtoken')
const { registerValidation } = require('../validation')

module.exports = function(req,res,next){
    const token = req.header('auth-token') //a header required in the request with JWT token
    if(!token) return res.status(401).send('Access Denied')

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified //req.user gives us the payload and iat
        next()
    }catch(err){
        res.status(400).send('Invalid Token')
    }
}
