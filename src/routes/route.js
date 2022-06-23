const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")



router.post("/authors", authorController.createAuthor)
router.post("/blogs",blogController.createBlog)
router.get("/blogs",blogController.getBlog)
router.put("/blogs/:blogId",blogController.updateBlog)
router.delete("/blogs/:blogId",blogController.deleteBlog)
router.delete("/blogs",blogController.deleteBlogsBySelection)

router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})



module.exports = router;
