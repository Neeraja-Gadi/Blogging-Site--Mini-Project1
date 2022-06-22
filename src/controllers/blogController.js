const { response } = require('express');
const blogModel = require('../models/blogModel')

const createBlog = async function (req, res) {
    try {
        let newBlogEntry = req.body;
        if (!newBlogEntry.title || !newBlogEntry.body || !newBlogEntry.author_id || !newBlogEntry.tags) {
            return res.status(404).send({ status: false, msg: "Mandatory Feilds is required!" });
        }
        // let authorDetails = await blogModel.find().populate('author_id')
        // return res.status(200).send({})
        // console.log(authorDetails)
        // if (!newBlogEntry.author_id) {
        //     return res.status(404).send("Author id is required!");
        // }
        let newBlog = await blogModel.create(newBlogEntry);
        return res.status(201).send({ msg: newBlog });
    }
    catch (err) {
        return res.status(500).send({ Error: err.message })
    }
}

// const getblog= async function(req,res){
//     try{
//         const {author_id , category , tags , subcategory} = req.query
//         console.log(author_id , category ,tags , subcategory)

//         let allblog= await blogModel.find({isDeleted: false,isPublished: true});
//         if(author_id)
//         if(!allblog){
//           return  res.status(404).send({msg:'No blog is found!!'})
//         }
//          return res.status(200).send({msg: allblog})
const getBlog = async function (req, res) {
    //if(!author_id)res.status(404).send("authors not found")
    try {
        let data = req.query;
        filter = {
            isDeleted : false ,
            isPublished :true 
        };
        // if(data.author_id!==null)
        // filter.author_id = data.author_id;
        if (data.category) {
            filter.category = data.category;
        }
        if (data.author_id) {
            filter.author_id = data.author_id;
        }
        if (data.tags) {
            filter.tags = data.tags;
        }
        if (data.subcategory) {
            filter.subcategory = data.subcategory;
        }
        // let keyray = Object.keys(filter) ;
        let filteredBlog = await blogModel.find(filter)
        console.log(filteredBlog)

        if (filteredBlog.length < 1){
            return  res.status(404).send({status: false ,msg : 'No Blog Found'})
        }
        res.status(200).send({status: true, filteredBlog })
       // if (!data.author_id || !data.category || !data.tags || !data.subcategory) {
       //     return res.status(404).send("Data not found")
    }
       catch (err) {
           return res.status(500).send({ Error: err.message })
       }
   }
        // console.log(filter)
        // if (data.author_id && data.category) {
        //     filter.author_id = data.author_id;
        //     filter.category = data.category;
        // }
        // if (data.author_id && data.subcategory) {
        //     filter.author_id = data.author_id;
        //     filter.subcategory = data.subcategory;
        // }
        // if (data.author_id && data.tags) {
        //     filter.author_id = data.author_id;
        //     filter.tags = data.tags;
        // }
        // if (data.category && data.subcategory) {
        //     filter.author_id = data.author_id;
        //     filter.tags = data.tags;
        // }
        // if (data.category && data.tags) {
        //     filter.author_id = data.author_id;
        //     filter.tags = data.tags;
        // }
        // if (data.tags && data.subcategory) {
        //     filter.author_id = data.author_id;
        //     filter.tags = data.tags;
        // }
        // if (data.author_id && data.category && data.tags && data.subcategory) {
        //     filter.author_id = data.author_id;
        //     filter.category = data.category;
        //     filter.tags = data.tags;
        //     filter.subcategory = data.subcategory;
        // }
        // let allblog= await blogModel.find({isDeleted: false,isPublished: true});
        // if(!allblog){
        //     res.status(404).send({msg:'No blog is found!!'})
        // }
    

    // if(_id === data.author_id){
    //     let allblog = await blogModel.findById(data.author_id);
    //     res.status(200).send({msg: allblog})
    // }
    // if(category === data.query.category){
    //     let allblog = await blogModel.find(data.query.category);
    //     res.status(200).send({msg: allblog})
    // }
    //res.status(200).send({msg: allblog})


    
// ************************************************************
const updateBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId;
        const blogDocument = req.body;
        let isBlogIdExists = await blogModel.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] }).select({ _id: 1 });
        if (!isBlogIdExists) {
            return res.status(404).send('Blog Id is required!!')
        }
        const updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, blogDocument, { new: true })
        if (!updatedBlog.isPublished) {
            let timeStamps = new Date(); //getting the current timeStamps
            let updateData = await blogModel.findOneAndUpdate(
                { _id: blogId }, //finding the blogId in the database to update the publishedAt
                { publishedAt: timeStamps }, //updating the publishedAt
                { new: true } //returning the updated data
            )
            return res.status(200).send({ status: true, data: updateData });
        }
        //return res.status(200).send({msg: updateBlog})
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}
const deleteBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId;
        const getblogId = await blogModel.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] }).select({ _id: 1 });
        if (getblogId) {
            let deletedBlog = await blogModel.findOneAndUpdate(
                { _id: getblogId },
                { $set: { isDeleted: true } },
                { new: true })
            return res.status(200).send({ msg: deletedBlog })
        }
        return res.status(404).send({
            status: false,
            msg: "Blog not found"
        })
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}
//  const deleteBlogsBySelection = async function(req,res){
//     const document = req.query;
//     let deleteBlog = await blogModel.updateMany({
//                                     document,
//                                     isDeleted: true,
//                                     new: true
//     })
//     res.status(200).send({deleteBlog})
//  }

const deleteBlogsBySelection = async function (req, res) {
    try {
        const document = req.query;
        filter = {};
        // if(data.author_id!==null)
        // filter.author_id = data.author_id;
        if (document.category) {
            filter.category = document.category;

        }
        if (document.author_id) {
            filter.author_id = document.author_id;
        }
        if (document.tags) {
            filter.tags = document.tags;
        }
        if (document.subcategory) {
            filter.subcategory = document.subcategory;
        }
        if (document.author_id && document.category) {
            filter.author_id = document.author_id;
            filter.category = document.category;
        }
        if (document.author_id && document.subcategory) {
            filter.author_id = document.author_id;
            filter.subcategory = document.subcategory;
        }
        if (document.author_id && document.tags) {
            filter.author_id = document.author_id;
            filter.tags = document.tags;
        }
        if (document.tags && document.subcategory) {
            filter.author_id = document.author_id;
            filter.tags = document.tags;
        }
        if (document.author_id && document.category && document.tags && document.subcategory) {
            filter.author_id = document.author_id;
            filter.category = document.category;
            filter.tags = document.tags;
            filter.subcategory = document.subcategory;
        }

        // let deleteBlog = await blogModel.find({ isPublished: false }).updateMany({
        //     document,
        //     isDeleted: true,
        //     new: true
        // })

        // res.status(200).send({ deleteBlog })
        let deleteBlog = await blogModel.find({isPublished:false}).update({isDeleted:false},{$set:{isDeleted: true}},{ new: true})
        res.status(200).send({deleteBlog})

    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}







    module.exports.createBlog = createBlog;
    module.exports.getBlog = getBlog
    module.exports.updateBlog = updateBlog
    module.exports.deleteBlog = deleteBlog
    module.exports.deleteBlogsBySelection = deleteBlogsBySelection
