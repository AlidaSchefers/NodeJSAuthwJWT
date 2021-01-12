const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    })
})

//btw: the server needs a database to see which users have which access, right? or is that imbedded in the JWT too? so the server really does only need the secret key to authrorize.
//generally imbed it in JWT. could have JWT not store number but booleans. like "accessToXData": true.
//set when token is assigned. its secure b/c can't be 
//when lots of stuff in JWT, gets kinda big. can have like 100 items tjo.

//have 2 servers with their own author with one regular user and 
//nest admin level in JWT itself. when check if user admin or not, just decode JWT and check if it contains a piece of data. 
//JWT cannot be modified by end-user. no way for someone to change their auth level. could just be a number! 0 for regular 1 basic admin, etc.

//make route want to protect
app.post('/api/posts', verifyToken, (req, res) => { //is this a post and not a get because of the auth needed?
    //rule of thumb: if need to send info in the body, make it something other than a get request
    //put is overriding data, but patch only changes stuff that isn't defined. 
    jwt.verify(req.token, 'secretkey', (err, authData) => { //how is authData defined? in Postman, it shows payload (user data and iat)
        //authData not necessary
        //audData come from jsonwebtoken package
        //Gabe uses try-catch
        if(err) {
            res.sendStatus(403)
        }else{
            res.json({
                message: 'Post request sent/ Post created...',
                authData
            })
        }
    }) //we got req.token from the verifyToken middleware
})

//get the token
app.post('/api/login', (req, res) => { //what is the difference between synronous and asynronous here? like the effects it has. I'm not super clear on it. JWT documentation mentions ie: https://github.com/auth0/node-jsonwebtoken //can use callback to do async.
    //Mock user. 
    //usually make req to login, send in user, and pass auth with database, and get user back.
    const user = {
        id: 1,
        username: "brad",
        email: "brad@gmail.com"
    }
    jwt.sign({user}, 'secretkey', {expiresIn: '30s'}, (err, token) => { //callback function happens after token sign occurs
        res.json({token}) //why is {token: token} same as {token}? won't the key be missing..
    }) //now when we do post req at localhost:5000/api/login, get the token back as json with key "token"
})

//FORMAT OF TOKEN
//Authorization: Bearer <access_token>

//verify token
//this should be in its file so multiple routes could use it
function verifyToken(req, res, next) { //do we need to specify next here if we write it later in line 56?
    //need next in param, because next() is a reference to 
    //Get auth header value
    const bearerHeader = req.headers['authorization'] //where does req.headers come from exactly? (I may be having a lapse of thinking.)
    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //split at the space and get just the token
        const bearerToken = bearerHeader.split(' ')[1]
        //Set the token
        req.token = bearerToken //now we have the token by itself //not good to set properties in response function, so put it on the request
        //next middleware
        next() //we declared what next is before using it here. express magic know what the next middleware it.
    }else{
        //Forbidden
        res.sendStatus(403)
    }
}

app.listen(5000, () => console.log('Server started on port 5000'))