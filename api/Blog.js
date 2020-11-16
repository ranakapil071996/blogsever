const router = require("express").Router();
const Blog = require("../models/Blog");
const passport = require("passport");

router.get("/",(req, res) => {
  let blogFetch = Blog.find({ isActive: true });
  if (req.query.all) {
    blogFetch = Blog.find();
  }
  blogFetch
    .then((blogs) => {
      res.status(200).json(blogs);
    })
    .catch((err) => res.status(500).json(err));
});

router.post("/",  passport.authenticate('jwt', {session: false}),(req, res) => {
  const isError = blogValidation(req.body);
  if (isError.error) {
    res.status(400).json({ ...isError });
  } else {
    const newBlog = new Blog({ ...req.body });
    newBlog.save((err, blog) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(blog);
      }
    });
  }
});

router.put("/:id",  passport.authenticate('jwt', {session: false}),(req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body, { new: true}, (err, blog) => {
    if (err) {
      res.status(400).json({...err, message: "Id not found"});
    } else {
      res.status(200).json(blog);
    }
  });
});

router.delete("/:id",  passport.authenticate('jwt', {session: false}),(req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err, result) => {
      if (err) res.status(500).json({...err, message: "Id not found"});
      res.status(200).json(result);
    });
  });

function blogValidation(blogData) {
  if (!blogData.title) {
    return { error: true, message: "title is required" };
  }
  if (!blogData.content) {
    return { error: true, message: "content is required" };
  }
  if (!blogData.description) {
    return { error: true, message: "description is required" };
  }
  if (
    !blogData.category ||
    !Array.isArray(blogData.category) ||
    !blogData.category.length
  ) {
    return { error: true, message: "Atleast one category[] is required" };
  }
  if (
    !blogData.keywords ||
    !Array.isArray(blogData.keywords) ||
    !blogData.keywords.length
  ) {
    return { error: true, message: "keywords[] is required for seo" };
  }
  return { error: false };
}

module.exports = router;
