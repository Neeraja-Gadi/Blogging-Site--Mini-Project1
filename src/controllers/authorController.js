const AuthorModel= require("../models/authorModel")
var validator = require("email-validator");
const validationchecker = require('../validators/validator')
const authorModel = require("../models/authorModel");
 const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        let namevalid = /^[A-Za-z ]+$/

        // if (!author.fname || !author.lname || !author.title || !author.email || !author.password) {
        //     res.status(400).send({ status: false, msg: 'Mandatory Feilds required' })
        // }
         if(namevalid.test(author.fname)) {
            return res.status(200).send({status : true , msg :"valid"})
         }else{
            return res.send('bye')
         }

         if(!author.fname === '' || typeof(author.fname !== "string")){
             return res.status(400).send({status: false,msg:'Valid fname is required'})
         }
         if(!author.lname){
            return  res.status(400).send({status: false , msg : 'lname is required'})
         }
        //  if(!author.title){
        //     return res.status(400).send({status: false , msg : 'tittle is required'})
        //  }
          if(!author.email){
            return res.status(400).send({status: false ,msg : 'email is required'})
         }
        //  if(!author.password) {
        //     return  res.status(400).send({status: false, msg : 'password is required'})
        //  }
        else {
            let authorCreated = await AuthorModel.create(author)
               
         authorSchema.path('email').vaildate(()=>{
          return false
        },'email is exists')
            res.status(201).send({ data: authorCreated })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}


const login = async function (req,res){
    try{
        let userName = req.body.email;
        let password = req.body.password;
        let logIn = await authorModel.findOne({email: userName, password: password});
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
    res.status(500).send({status: false, msh: err.message})
  }
}

module.exports.createAuthor= createAuthor
module.exports.login= login
