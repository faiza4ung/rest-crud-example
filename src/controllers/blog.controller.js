const {validationResult} = require('express-validator');
const path = require('path')
const fs = require('fs')
const BlogPost = require('../models/blog.models')

exports.createBlogPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error('Invalid Value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;    
    }

    if(!req.file){
        const err = new Error('Image Harus Diunggah');
        err.errorStatus = 422;
        throw err;  
    }

    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;

    const Posting = new BlogPost({
        title: title,
        body: body,
        image: image,
        author:{uid: 1, name: 'UngguhF'}
    });

    Posting.save()
    .then(result =>{
        res.status(201).json({
            message: 'Create Blog Post Success',
            data: result
        }); 
    }).catch(err => {
        console.log('err: ', err);
    });

    /* 
    Check ketika belum konek ke database, masih dummy
    const result = {
         message: 'Create Blog Post Success',
         data: {
             post_id: 1,
             title: title,
             image: "image.jpeg",
             body: body,
             created_at: "23/06/2021",
             author: {
                 uid: 1,
                 name: "test"
             }
         }
     }
     res.status(201).json(result); 
    */
}

exports.getAllBlogPost = (req, res, next) =>{
    BlogPost.find()
    .then(result => {
        res.status(200).json({
            message: 'Data Post Berhasil dipanggil',
            data: result
        })
    })
    .catch(err => {
        next(err);
    });
}

exports.getBlogPostById = (req, res, next) => {
    const postId = req.params.postId
    BlogPost.findById(postId)
    .then(result => {
        if(!result){
            const error = new Error('Blog Post tidak ditemukan')
            error.errorStatus = 404
            throw error
        }
        res.status(200).json({
            message: 'Data Blog Post Berhasil Dipanggil',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}

exports.updateBlogPost = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new Error('Invalid Value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;    
    }

    if(!req.file){
        const err = new Error('Image Harus Diunggah');
        err.errorStatus = 422;
        throw err;  
    }

    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;
    const postId = req.params.postId;
    
    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const err = new Error('Blog Post tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }

        post.title = title;
        post.body = body;
        post.image = image;

        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Update selesai',
            data: result,
        })
    })
    .catch(err => {
        next(err);
    })
}

exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then(post => {
        if(!post) {
            const err = new Error('Blog Post tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }

        removeImage(post.image);
        return BlogPost.findByIdAndRemove(postId)
    })
    .then(result => {
        res.status(200).json({
            message: 'Hapus Berhasil',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
}

const removeImage = (filePath) => {
    console.log('filePath', filePath)
    console.log('dir name', __dirname )

    //mencari letak posisi filepath
    filePath = path.join(__dirname, '../..', filePath)
    //meremove filepath
    fs.unlink(filePath, err => console.log(err))
} 