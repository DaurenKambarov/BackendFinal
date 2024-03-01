const express = require('express');
const  router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;
const storage = multer.memoryStorage(); // Store images in memory as buffers
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed.'));
    }
  },
}).array('images', 3);



const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json( { message: 'Unauthorized'  });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error) {
        res.status(401).json( { message: 'Unauthorized'  });
    }
} 

router.get('/admin', async (req, res) => {
    
    try {
        const locals = {
        name: "Admin",
        discription: "discription"
    }
        res.render('admin/index', {locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

router.post('/admin', async (req, res) => {
    
    try {
        const {username, password} = req.body;

        const user =  await User.findOne({ username });

        if(!user) {
            return res.status(401).json( {message: 'Invalid credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json( {message: 'Invalid credentials'});
        }

        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

router.get('/dashboard', authMiddleware, async(req, res) => {

    try {
        const locals = {
            title: 'dashboard',
            discription: '',
        }
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals, 
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});


router.get('/add-post', authMiddleware, async(req, res) => {

    try {
        const locals = {
            title: 'Add post',
            discription: '',
        }
        const data = await Post.find();
        res.render('admin/add-post', {
            locals, 
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});

router.post('/add-post', authMiddleware, async(req, res) => {

    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error(err.message);
                // Handle error, for example, send an error response
                return res.status(400).send('Error uploading images.');
            }
            
            const images = req.files && Array.isArray(req.files) ? req.files : [];

        try {
            const newPost = new Post({
            name: req.body.name,
            information: req.body.information,
            images: images.map((file) => ({ data: file.buffer, contentType: file.mimetype })),
            });

            await newPost.save();
            res.redirect('/dashboard');
            
        } catch (error) {
            console.log(error);
        }
    });

    } catch (error) {
        console.log(error);
    }

});
/*router.post('/admin', async (req, res) => {
    
    try {
        const {username, password} = req.body;

        if(req.body.username === 'admin' & req.body.password === 'password') {
            res.redirect('/');
        }


        res.redirect('/admin');
    } catch (error) {
        console.log(error);
    }
}); */

router.post('/register', async (req, res) => {
    
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try{
            const user = await User.create({username, password:hashedPassword});
            res.status(201).json({message: 'User created', user});
        } catch (error) {
            if(error.code ==- 11000){
                res.status(409).json({message: 'User already in use'});
            }
            res.status(500).json({message: 'Internal server error'});
        }
        

    } catch (error) {
        console.log(error);
    }
});






module.exports = router;