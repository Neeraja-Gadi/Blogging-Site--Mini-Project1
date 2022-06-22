const AuthorModel= require("../models/authorModel")
var validator = require("email-validator");
 

const createAuthor= async function (req, res) {
    try{
        let author = req.body
        if (!author.fname || !author.lname || !author.title || !author.email || !author.password)
         res.status(400).send({status: false,msg:'Mandatory Feilds required'})
         
        let authorCreated = await AuthorModel.create(author) 
         res.status(201).send({data: authorCreated})
        
       let isEmailValid = validator.validate(author.email);
        if(!isEmailValid){
         return res.status(400).send({status: false,msg: 'Please enter valid Id'})
        }
   }
    catch(err) {
           return res.status(500).send({msg : err.message})
    }
}


module.exports.createAuthor= createAuthor

