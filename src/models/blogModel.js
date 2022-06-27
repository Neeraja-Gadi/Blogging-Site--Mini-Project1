const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author_id:{
    type: ObjectId,
    ref: "Author",
    required: true
  },
  tags:{
    type: [String],
    required: true
  },
  category: String,
  subcategory: {
    type: [String]
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  deletedAt: String,
  publishedAt: String
},{ timestamps: true})

module.exports = mongoose.model('Blog', blogSchema)
