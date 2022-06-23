const AuthorModel = require("../models/authorModel")

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        if (!author.fname || !author.lname || !author.title || !author.email || !author.password) {
            res.status(400).send({ status: false, msg: 'Mandatory Feilds required' })
        }

        //  if(!author.fname){
        //     return res.status(400).send({status: false,msg:'fname is required'})
        //  }
        //  if(!author.lname){
        //     return  res.status(400).send({status: false , msg : 'lname is required'})
        //  }
        //  if(!author.tittle){
        //     return res.status(400).send({status: false , msg : 'tittle is required'})
        //  }
        //  if(!author.email){
        //     return res.status(400).send({status: false ,msg : 'email is required'})
        //  }
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

module.exports.createAuthor = createAuthor
// module.exports.getAuthorsData= getAuthorsData
