const router = require('express').Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
    registerValidation,
    loginValidation
} = require('./validation');

//register
router.post('/register', async (req, res) => {

    //Validating data before creating user
    const {
        error
    } = registerValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    //checking if user is already in database
    const emailExist = await User.findOne({
        email: req.body.email
    });
    if (emailExist) return res.status(400).send('Email already exists');

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);

    } catch (err) {
        res.status(400).send(err);
    }

});

//login
router.post('/login', async (req, res) => {
    //validating data
    const {
        error
    } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //checking to see if the email exists
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) return res.status(400).send('Email is not found');
    //password check
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Incorrect password')

    //create and assign a token
    const token = jwt.sign({
        _id: user._id
    }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;