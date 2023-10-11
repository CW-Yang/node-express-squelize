const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getSignin = (req, res, next) => {
  res.render('auth/sign-in', {
    pageTitle: 'Sign In',
    path: '/signin',
    isAuthenticated: false
  });
};

exports.postSignin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: {
    email: email
  } })
    .then(user => {
      if (!user) {
        return res.redirect('/signup');
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (!doMatch) {
            return res.redirect('/signup');
          }
          req.session.isLogin = true;
          req.session.user = user;
          req.session.save(() => {
            return res.redirect('/');
          });
        })
        .catch(err => {
          console.log(err);
        })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/sign-up', {
    pageTitle: 'Sign Up',
    path: '/signup',
    isAuthenticated: false
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword; 
  User.findOne({
    where: {
      email: email
    }
  })
    .then(user => {
      if (user) {
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12);
    })
    .then(hashCode => {
      return User.create({
        email: email,
        password: hashCode
      });
    })
    .then(result => {
      return res.redirect('/signin');
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postSignout = (req, res, next) => {
  req.session.destroy(() => {
    return res.redirect('/');
  });
};