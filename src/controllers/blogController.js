const { response } = require('express');
const blogModel = require('../models/blogModel')

const createBlog = async function (req, res) {
    try {
        let newBlogEntry = req.body;
        if (!newBlogEntry.title || !newBlogEntry.body || !newBlogEntry.author_id || !newBlogEntry.tags)
            res.status(404).send({ status: false, msg: "Mandatory Feilds is required!" });
        let newBlog = await blogModel.create(newBlogEntry);
            return res.status(201).send({ msg: newBlog });
    
    }
    catch (err) {
        return res.status(500).send({ Error: err.message })
    }
}


// *********************************************************************

const getBlog = async function (req, res) {
    try {
        let data = req.query;
        filter = {
            isDeleted: false,
            isPublished: true
        };

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
        let filteredBlog = await blogModel.find(filter)

        if (filteredBlog.length < 1) {
            return res.status(404).send({ status: false, msg: 'No Blog found' })
        }
        return res.status(200).send({ status: true, data: { filteredBlog } })

        // if (!data.author_id || !data.category || !data.tags || !data.subcategory) {
        //     return res.status(404).send("Data not found")
    }
    catch (err) {
        return res.status(500).send({ Error: err.message })
    }
}

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
        return res.status(500).send({ error: err.message })
    }
}

// *************************************************************
const deleteBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId;
        const getblogId = await blogModel.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] }).select({ _id: 1 });
        if (getblogId) {
            let deletedBlog = await blogModel.findOneAndUpdate(
                { _id: getblogId },
                { $set: { isDeleted: true } },
                { new: true })
            return res.status(204).send({
                status: true,
                msg: "Blog has been deleted"
            })
        }
        return res.status(404).send({
            status: false,
            msg: "Blog is not found"
        })
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}

// ********************************************************************************
const deleteBlogsBySelection = async function (req, res) {
    try{let data = req.query;
    filter = {
        isPublished: false
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
    let blogDetail = await blogModel.findOne(filter).select({ isDeleted: 1, _id: 0 })
    if (blogDetail.isDeleted == false) {
        let timeStamp = new Date();
        let deleteBlog = await blogModel.updateMany(
            filter,
            { isDeleted: true, deletedAt: timeStamp },
            { new: true }
        )
        return res.status(204).send({
            status: true,
            msg: "Blog has been deleted"
        })
    }
    return res.status(400).send({ status: true, msg: "Blog is already deleted" })
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
