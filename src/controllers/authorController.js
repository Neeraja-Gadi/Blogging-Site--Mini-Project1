const AuthorModel= require("../models/authorModel")
var validator = require("email-validator");
const validationchecker = require('../validators/validator')
const authorModel = require("../models/authorModel");
 const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        let validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/
        let validName = /^[A-Za-z ]+$/
        //  if(!validPassword.test(author.password)){
        //    return res.send("pass not valid")
        //  }
               if(!author.fname || typeof(author.fname) !== 'string' || !validName.test(author.fname)){
                  return res.status(400).send({status: false,msg:'Enter valid FirstName'})
               }

               if(!author.lname || typeof(author.lname) !== 'string' || !validName.test(author.lname)){
                  return  res.status(400).send({status: false , msg : 'Enter valid LastName'})
               }
              //  if(!author.title || typeof(author.title) !== 'string'){
              //     return res.status(400).send({status: false , msg : 'Enter valid Title'})
              //  }
              //  let titleEnum = Object.values(data.title);
              //  console.log(titleEnum)
              //  if(!author.email || typeof(author.email) !== 'string'){
              //     return res.status(400).send({status: false ,msg : 'Enter valid EmailId'})
              //  }
                 if(!author.password || typeof(author.password) !== 'string' || !validPassword.test(author.password)){ 
                     return res.status(400).send({status: false, msg : 'Enter valid Password'})
                 }
                 if(author.password.length<8){
                  return res.status(400).send({status: false, msg: 'Length Of password should be atleast 8'})
                }
              // console.log(String(author.fname).trim())
              // if(!author.fname.trim()){
              //   return res.status(400).send({status: false, msg: 'Valid FirstName is required!!'})
              // }
              // if(!author.lname.trim()){
              //   return res.status(400).send({status: false, msg: 'Valid FirstName is required!!'})
              // }
               
       let isEmailValid = validator.validate(author.email);
        if(!isEmailValid){
         return res.status(400).send({status: false,msg: 'Please enter valid Email Id'})
        }
        else{
          let authorsData = await authorModel.find();
          authorsData.map(el=>{
            if(el.email === author.email){
             return res.send("Email Id already exists")
            }
            })
        }
        let authorCreated = await AuthorModel.create(author)
           res.status(201).send({data: authorCreated})
           }
    catch(err) {
            res.status(500).send({msg : err.message})
    }
}


const login = async function (req,res){
    try{
        let userName = req.body.email;
        let password = req.body.password;
        let logIn = await authorModel.findOne({email: userName, password: password});
        // console.log(logIn)
        if(!logIn)
        return res.status(400).send({
                           status: false,
                           msg: 'username and password is not correct'
        })
        //Generating Token
         const token = jwt.sign({
                       authorId: logIn._id.toString()
         },'SECRET-OF-GROUP28')
         res.setHeader('x-api-key', token);
          res.status(200).send({
                     status: true,
                     msg: 'You are Logged in!!'
         })
    }
 
  catch(err){
    res.status(500).send({status: false, msg: err.message})
  }
}

module.exports.createAuthor= createAuthor
module.exports.login= login
