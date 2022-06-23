const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const auth = require("../middlewares/auth")

router.post("/authors", authorController.createAuthor)
router.post("/blogs",blogController.createBlog)
router.get("/blogs",auth.authentication,auth.authorisation,blogController.getBlog)
router.put("/blogs/:blogId",auth.authentication,auth.authorisation,blogController.updateBlog)
router.delete("/blogs/:blogId",auth.authentication,auth.authorisation,blogController.deleteBlog)
router.delete("/blogs",auth.authentication,auth.authorisation,blogController.deleteBlogsBySelection)
router.post("/login",authorController.login)
router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api endpoint not found"
    })
})
module.exports = router;