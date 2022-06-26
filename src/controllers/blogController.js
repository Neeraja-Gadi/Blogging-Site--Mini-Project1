const { response } = require('express');
const blogModel = require('../models/blogModel')

const createBlog = async function (req, res) {
    try {
        let newBlogEntry = req.body;
        if (!newBlogEntry.title || !newBlogEntry.body || !newBlogEntry.author_id || !newBlogEntry.tags)
            res.status(404).send({ status: false, msg: "Mandatory Feilds is required!" });
        let newBlog = await blogModel.create(newBlogEntry);
        res.status(201).send({
            status: true,
            data: {
                newBlog
            }
        });
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
}

// ********************************************************

const getBlog = async function (req, res) {
    //if(!author_id)res.status(404).send("authors not found")
    try {
        let data = req.query;
        filter = {
            isDeleted: false,
            isPublished: true
        };
        // if(data.author_id!==null)
        // filter.author_id = data.author_id;
        if (data.category) {
            filter.category = data.category;
        }
        if (data.author_id) {
            filter.author_id = data.author_id;
        }
        // if (filters.tags) {
        //     let tagArray
        //     if (filters.tags.includes(",")) {
        //         tagArray = filters.tags.split(",").map(String).map(x => x.trim())
        //         filters.tags = { $all: tagArray }
        //     } else {
        //         tagArray = filters.tags.trim().split(" ").map(String).map(x => x.trim())
        //         filters.tags = { $all: tagArray }
        //     }
        // }
        if (data.tags) {
            let tagArr = data.tags.split(',');
            filter.tags = { $in: tagArr };
        }
        if (data.subcategory) {
            let subcategoryArr = data.subcategory.split(',');
            filter.subcategory = { $in: subcategoryArr };
        }
        let filteredBlog = await blogModel.find(filter)
        if (filteredBlog.length < 1) {
            return res.status(404).send({ status: false, msg: 'No Blog found' })
        }
        res.status(200).send({ status: true, data: { filteredBlog } })
    }


    catch (err) {
        res.status(500).send({ Error: err.message })
    }
}
// ****************************************************************
const updateBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId;
        const blogDocument = req.body;
        let isBlogIdExists = await blogModel.findOne({ _id: blogId }).select({ isDeleted: 1, _id: 0 });
        //console.log(isBlogIdExists.isDeleted)
        if (isBlogIdExists.isDeleted == true) {
            return res.status(404).send({
                status: false,
                msg: 'Blog does not exist!!'
            })
        }
        const updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, blogDocument, { new: true })
        if (!updatedBlog.isPublished) {
            let timeStamps = new Date();
            let updateBlogAdditionalData = await blogModel.findOneAndUpdate(
                { _id: blogId }, //finding the blogId in the COLLECTION to update the PUBLISH STATUS & PUBLISHEDAT
                { isPublished: true, publishedAt: timeStamps }, //updating the IsPublished status publishedAt
                { new: true }
            )
            return res.status(200).send({
                status: true,
                data: {
                    updateBlogAdditionalData
                }
            });
        }
        res.status(200).send({
            status: true,
            msg: "Blog is already published"
        })

        //return res.status(200).send({msg: updateBlog})
    }
    catch (err) {
        return res.status(500).send({ error:'hi' })
    }
}

// ************************************************************
const deleteBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId;
        const getblogId = await blogModel.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] }).select({ _id: 1 });
        if (getblogId) {
            let deletedBlog = await blogModel.findOneAndUpdate(
                { _id: getblogId },
                { $set: { isDeleted: true } },
                { new: true })
            return res.status(200).send({status: true, msg: "Blog is deleted"  })
        }
        // return res.status(404).send({
        //     status: false,
        //     msg: "Blog is not found"
        // })
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}


// *********************************************
        const deleteBlogsBySelection = async function (req, res) {
            try {
                let data = req.query;
                filter = {
                    isPublished: false,
                    isDeleted: false
                };
                if (data.category) {
                    filter.category = data.category;
                }
                if (data.author_id) {
                    filter.author_id = data.author_id;
                }
                if (data.tags) {
                    // let tagObj = {}
                    let tagArr = data.tags.split(',');
                    // tagArr.reduce((arr,el)=>({...arr,[el]: el}),{})
                    // tagArr.map(el => tagObj[tags])
                    filter.tags = { $in: tagArr };
                }
                if (data.subcategory) {
                    let subcategoryArr = data.subcategory.split(',');
                    filter.subcategory = { $in: subcategoryArr };
                }
                let blogDetail = await blogModel.findOne(filter).select({ isDeleted: 1, _id: 0 })
                if (blogDetail) {
                    let timeStamp = new Date();
                    let deleteBlog = await blogModel.updateMany(
                        filter,
                        { isDeleted: true, deletedAt: timeStamp },
                        { new: true }
                    )
                    res.status(200).send({
                        status: true,
                        msg: 'Blog is deleted'
                    })
                }
                else {
                    res.status(400).send({ status: true, msg: "Blog not found" })
                }
            }
    
    catch (err) {
    res.status(500).send({ status: false, msg: err.message })

    }
}

    


module.exports = {createBlog, getBlog, updateBlog, deleteBlog, deleteBlogsBySelection }
