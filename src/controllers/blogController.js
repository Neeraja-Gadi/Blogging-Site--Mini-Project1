const { response } = require("express");
const blogModel = require("../models/blogModel");

const createBlog = async function (req, res) {
  try {
    let newBlogEntry = req.body;
    //Validation if any manadatory field is empty
    if (
      !newBlogEntry.title ||
      !newBlogEntry.body ||
      !newBlogEntry.author_id ||
      !newBlogEntry.tags
    ) {
      return res
        .status(404)
        .send({ status: false, msg: "Mandatory Feilds are required!" });
    }
    //creating new document with given entry in body
    let newBlog = await blogModel.create(newBlogEntry);
    return res.status(201).send({
      status: true,
      data: { newBlog },
    });
  } catch (err) {
    return res.status(500).send({status: false, Error: err.message });
  }
};

const getBlog = async function (req, res) {
  try {
    let data = req.query;
    //creating an object with 2 attributes
    filter = {
      isDeleted: false,
      isPublished: true,
    };
    //For filling filter object on the basis of field
    //given in query param for fileration in blogs collection
    if (data.category) {
      filter.category = data.category;
    }
    if (data.author_id) {
      filter.author_id = data.author_id;
    }
    if (data.tags) {
      let tagArr = data.tags.split(",");
      filter.tags = { $in: tagArr };
    }
    if (data.subcategory) {
      let subcategoryArr = data.subcategory.split(",");
      filter.subcategory = { $in: subcategoryArr };
    }
    let filteredBlog = await blogModel.find(filter);
    if (filteredBlog.length < 1) {
      return res.status(404).send({ status: false, msg: "No Blog found" });
    }
    res.status(200).send({ status: true, data: { filteredBlog } });
  } catch (err) {
    res.status(500).send({status: false, Error: err.message });
  }
};

// ******************************************************************

const updateBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    const blogDocument = req.body;
    //Finding the document in the blogs collection on the basis of blogId given in path param
    let isBlogIdExists = await blogModel
      .findOne({$and:[{_id: blogId},{isDeleted: false }] })
      .select({ isDeleted: 1, _id: 0 });
    //Checking If blog is deleted
    if (!isBlogIdExists) {
      return res.status(404).send({
        status: false,
        msg: "Blog does not exist!!",
      });
    }
    //updating blog with given entries in body If blog is not deleted
    const updatedBlog = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $set: blogDocument },
      { new: true }
    );
    //Checking if updated blog is unpublished
    if (!updatedBlog.isPublished) {
      let timeStamps = new Date();
      //Making Unpublished blog published
      let updateBlogAdditionalData = await blogModel.findOneAndUpdate(
        { _id: blogId }, //finding the blogId in the COLLECTION to update the PUBLISH STATUS & PUBLISHEDAT
        { isPublished: true, publishedAt: timeStamps }, //updating the IsPublished status publishedAt
        { new: true }
      );
      return res.status(200).send({
        status: true,
        data: {
          updateBlogAdditionalData,
        },
      });
    }
    return res.status(200).send({
      status: true,
      msg: "Blog is already published",
    });
  } catch (err) {
    return res.status(500).send({status: false, error: err.message });
  }
};

const deleteBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    //Fetching undeleted blog which having blogId from collection
    const getblog = await blogModel.findOne({
      $and: [{ _id: blogId }, { isDeleted: false }],
    });
    //Deleting the blog If undeleted blog with given blogId exists
    if (getblog) {
      let deletedBlog = await blogModel.findOneAndUpdate(
        { _id: getblog._id },
        { $set: { isDeleted: true } },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        msg: "Blog is deleted",
      });
    }
    //Giving response when undeleted with given blogId does not exist
    return res.status(404).send({
      status: false,
      msg: "Blog is not found",
    });
  } catch (err) {
    return res.status(500).send({status: false, error: err.message });
  }
};
const deleteBlogsBySelection = async function (req, res) {
  try {
    let data = req.query;
    //For filling filter object on the basis of field
    //given in query param for fileration in blogs collection
    filter = {
      isPublished: false,
      isDeleted: false,
    };
    if (data.category) {
      filter.category = data.category;
    }
    if (data.author_id) {
      filter.author_id = data.author_id;
    }
    if (data.tags) {
      let tagArr = data.tags.split(",");
      filter.tags = { $in: tagArr };
    }
    if (data.subcategory) {
      let subcategoryArr = data.subcategory.split(",");
      filter.subcategory = { $in: subcategoryArr };
    }
    //Fetching Blogs with given filter object
    let blogDetail = await blogModel
      .findOne(filter)
      .select({ isDeleted: 1, _id: 0 });
    //Deleting blog if undeleted,unpublish blog with given filter condions exist
    if (blogDetail) {
      let timeStamp = new Date();
      let deleteBlog = await blogModel.updateMany(
        filter,
        { isDeleted: true, deletedAt: timeStamp },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        msg: "Blog is deleted",
      });
    } else {
      //Giving response if undeleted,unpublish blog with given filter condions does not exist
      return res.status(400).send({ status: true, msg: "Blog not found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};


module.exports = { createBlog, getBlog, updateBlog, deleteBlog, deleteBlogsBySelection }
