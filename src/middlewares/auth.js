const jwt = require('jsonwebtoken');
const authorModel = require('../models/authorModel');
const blogModel = require('../models/blogModel');

const authentication = async function(req,res,next){
    try{
        let authorId;
        let authorIdToBeModified;
        const token = req.headers['x-api-key'];
        if(!token){
            res.status(401).send({status: false, msg: 'Token does not exist'})
        }
        const decodeToken = jwt.verify(token,'SECRET-OF-GROUP28');
        // console.log(decodeToken)
        if(!decodeToken){
            res.status(401).send({status: false, msg: 'Token is invalid'})
        }
        const blogId = req.params.blogId;
        if(blogId){
             authorId = await blogModel.findOne({_id: blogId}).select({author_id: 1});
        }
        else{
            authorId = req.query.author_id
        }
        
        // console.log(author);
       // const author = await authorModel.findById({_id: authorId.author_id})
        //const authorIdToBeModified = authorId.author_id.toString();
      if(!authorId)
      res.status(400).send({status: false, msg: 'Author does not exist!!!'})
      next();
    }
    catch(err){
        res.status(500).send({status: false, msg: err.message})
    }
}

const authorisation = async function(req,res,next){
    try{
        const token = req.headers['x-api-key'];
        const decodeToken = jwt.verify(token,'SECRET-OF-GROUP28');
        const loggedInAuthorId = decodeToken.authorId;
        //authorIdToBeModified = req.params.authorId; // authorId of the user whose data we want to change
        const blogId = req.params.blogId;
        if(blogId){
            authorId = await blogModel.findOne({_id: blogId}).select({author_id: 1});
             authorIdToBeModified = authorId.author_id.toString();
       }
       else{
           authorId = req.query.author_id,
           authorIdToBeModified = authorId
       }
        //const authorId = await blogModel.findOne({_id: blogId}).select({author_id: 1});
        // console.log(author);
        
        // console.log(authorIdToBeModified)
        if(loggedInAuthorId !== authorIdToBeModified){
        return res.status(403).send({
            status: false,
            msg: 'Author has no permission to change other author\'s blog'
        })
        }
        next();
    }
    catch(err){
        return res.status(500).send({
                     status: false,
                     msg: err.message
         })
    }
}
module.exports.authentication = authentication;
module.exports.authorisation = authorisation;