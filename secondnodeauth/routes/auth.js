const router = require('express').Router()
const User = require('../model/User') //a defined model
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {registerValidation, loginValidation} = require('../validation')


router.post('/register', async (req, res) => { //'we need time before we submit things to the DB' ? why
    //VALIDATE THE DATA BEFORE MAKING A USER
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    //OLD: const {error} = schema.validate(req.body) //returns object with value object and (if not valid), error object
    //OLD: if(error) return res.status(400).send(error.details[0].message)  //400 just means it is a bad request

    //Checking if user is already in the database
    const emailExist = await User.findOne({email: req.body.email}) //.findOne is a method in mongoose package!!
    if(emailExist) return res.status(400).send('Email already exists') //if returns and sends, the next lines will not run (b/c it's a return!)

    //Hash passwords
    const hashedPassword = await bcrypt.hash(req.body.password, 10) //10 is "saltRounds", or the complexity of string that will be created
    //the first part of the hashedPassword is the "salt" - what is that? (46:25)

    //Create new user
    const user = new User({ //make the new user from the request body
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save() //save the user into this variable... why do we need to 'save' it if we already have the var 'user'?
        //is ^^ the line that creates the user in MongoDB?
        res.send({user: user._id}) //respond with the new saved user's id only. no need to return the hashed password too. let's see it in Postman!
        //also here, after doing Postman, we see a "users" sub in CLuster0. how/where was this title created?
    }catch(err){
        res.status(400).send(err)
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE MAKING A USER
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    //Checking if user is already in the database
    const user = await User.findOne({email: req.body.email}) //.findOne is a method in mongoose package!!
    if(!user) return res.status(400).send('Email is not found') //if returns and sends, the next lines will not run (b/c it's a return!)
    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password) //user.password comes from DB. where is user defined?
    if(!validPass) return res.status(400).send('Invalid password or email')
    // res.send('Logged in!')

    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET) //this is like "assign", right?
    res.header('auth-token', token).send(token) //this is sent when a user logs in
    
})

router.post('/login')

module.exports = router
