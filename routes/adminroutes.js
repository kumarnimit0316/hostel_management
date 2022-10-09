const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Express Validator middleware
const { check, validationResult } = require('express-validator');


//Bring in user model
let { User } = require('../models/admin');

//register form
router.get('/register', (req, res) => {
    res.render('register');
});

//registering process
router.post('/register', [check('name', 'Name is required').notEmpty(),
check('email', 'email is required').notEmpty(),
check('email', 'Enter correct email').isEmail(),
check('password', 'password is required').notEmpty(),
check('password2', 'passwords do not match').custom((value, { req }) => (value == req.body.password))],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = errors.array();
            res.render('register', {
                err
            });
        } else {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const numberOfRoom=req.body.numberOfRooms;
            let newuser = new User({
                username: name,
                email: email,
                password: password,
                numberOfRoom: numberOfRoom
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newuser.password, salt, (err, hash) => {
                    if (err) {
                        req.flash('danger', 'error in registering please try again');
                        return;
                    }
                    newuser.password = hash;
                    newuser.save((err) => {
                        if (err) {
                            req.flash('danger', 'error in registering please try again');
                            return;
                        } else {
                            req.flash('success', 'Your are now register and can login');
                            res.redirect('/');
                        }
                    });
                });
            });
        }
    });


//logout process

router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
        req.flash('success', 'your are logged out successfully');
        res.redirect("/");
      });
});


module.exports = router;