const authorController = require('../controllers/authorController')

// const validator = function (author) {
//     // /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
//     let rdata = "" ;

//     if(/[`!@#$%^&*()_+-*\[\]{};':"\\|,.<>\/?~]/.test(author.fname) || /[`!@#$%^&*()_+-*\[\]{};':"\\|,.<>\/?~]/.test(author.lname)){
//         const spclchar = "Can't use special charatecs in this Feild"
//         rdata =rdata+spclchar ;
//     }
//     return rdata
// }


// let val = validationchecker.validator(author)
// if (val) {
//     res.status(400).send({ invalid: val })
// }
// if (!val) {
// let authorCreated = await AuthorModel.create(author)
// res.status(201).send({ data: authorCreated })
// }
// module.exports.validator =validator


// if (filters.tags) {
//         let tagArray
//         if (filters.tags.includes(",")) {
//             tagArray = filters.tags.split(",").map(String).map(x => x.trim())
//             filters.tags = { $all: tagArray }
//         } else {
//             tagArray = filters.tags.trim().split(" ").map(String).map(x => x.trim())
//             filters.tags = { $all: tagArray }
//         }
//     }


  //   if (userData.tags||userData.subcategory) {
  //     userData.$push = {}
  //     if(userData.tags){
  //         userData.$push.tags =  userData.tags.split(",") 
  //         delete userData.tags
  //     }
  //     if (userData.subcategory) {
  //         userData.$push.subcategory = userData.subcategory.split(",")
  //         delete userData.subcategory
  //     }
  // }
