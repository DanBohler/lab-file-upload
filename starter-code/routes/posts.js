const express = require('express');
const router = express.Router();
const postModel = require('../models/post');
const cloudinary = require('../options/cloudinary');
const {ensureLoggedIn, ensureLoggedOut} = require ('connect-ensure-login');

router.get('/', (req, res, next) => {
  postModel
    .find({}, {_id: 0})
    .then((posts) => res.render('post/list-post', { posts }))
    .catch((err) => console.log('An error ocurred finding post', err));
});

router.get('/add', ensureLoggedIn('/login'), (req, res, next) => {
  res.render('post/add-post');
});

router.post('/add', cloudinary.single('photo'), (req, res, next) => {
  const newPost = new postModel({
    content: req.body.content,
    creatorId: req.user._id,
    picPath: req.file.secure_url,
    picName: req.file.originalname,
  });
  newPost.save().then(() => {
    res.redirect('/posts/').catch((err) => {
      console.log('An error was ocurred');
    });
  });
});

module.exports = router;
