const express = require('express');
const  router = express.Router();
const Post = require('../models/Post');

router.get('', async (req, res) => {
 try {
    const locals = {
    name: "Portfolio Platform",
    discription: "Text"
    }

    let perPage = 5;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1} } ]).skip(perPage * page - perPage).limit(perPage).exec();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);


    res.render("index", {
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null
    });
    } catch (error) {
        console.log(error);
    }
});

router.get('/post/:id', async(req, res) => {
    try{
        
    let slug = req.params.id;

    const data = await Post.findById({_id: slug});

    const locals = {
        name: data.name,
        discription: "discription"
    }
    res.render('post', {locals, data});
} catch (error) {
    console.log(error);
}
    
});

router.post('/search', async(req, res) => {
    try{
        const locals = {
            title: "Search",
            discription: "None"
        } 
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        const data = await Post.find({
            $or: [
                {name: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {discription: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        });

    res.render("search", {
        data,
        locals
    });
} catch (error) {
    console.log(error);
}
});

/*function insertPostData () {
    Post.insertMany([
        {
            name: "Dauren",
            information: "Play Dota2, CS2, HL2"
        },
    ])
}
insertPostData();*/











router.get('/about', (req, res) => {
    res.render("about");
});

module.exports = router;