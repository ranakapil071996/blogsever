const router = require("express").Router();
const Blog = require("../models/Blog");
const passport = require("passport");

router.get("/", async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const size = req.query.size ? parseInt(req.query.size): 20;
  let blogFetchParams = { isActive: true }
  if (req.query.all) {
    delete blogFetchParams.isActive
  }
  if(req.query.category){
    blogFetchParams.category = { $in: req.query.category }
  }

  if(req.query.title){
    blogFetchParams.title = { $regex : req.query.title, $options: "i" }
  }

  if(req.query.userId){
    blogFetchParams["author.userId"] = { $in: req.query.userId};
  }
  if(req.query.slug){
    blogFetchParams.slug = req.query.slug
  }

  try{
    const blogs = await Blog.find(blogFetchParams).skip(page * size).limit(size).sort({createdAt: -1});
    const count = await Blog.find(blogFetchParams).countDocuments()
    res.status(200).json({blogs, page: { number: page, size, count}});
  }
  catch(err){
    res.status(500).json(err)
  }
});

router.get("/:id", async (req, res)=> {
  try{
    const blogData = await Blog.findOne({ _id: req.params.id, isActive: true});
    if(blogData){
      res.status(200).json(blogData);
    }else{
      res.status(400).json({error: true, message: "Blog not found"})
    }
  }
  catch(err){
    res.status(500).json(err)
  }
})

router.post("/",  passport.authenticate('jwt', {session: false}),(req, res) => {
  const isError = blogValidation(req.body);
  if (isError.error) {
    res.status(400).json({ ...isError });
  } else {
    const body = { ...req.body};
    if(body.title){
      let slug = body.title.replace(/[^\w\s]/gi, '').replace(/,/g, '-').replace(/ /g, '-').toLowerCase();
      body.slug =slug
    }
    const newBlog = new Blog({ ...body });
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
  const body = { ...req.body};
  if(body.title){
    let slug = body.title.replace(/[^\w\s]/gi, '').replace(/,/g, '-').replace(/ /g, '-').toLowerCase();
    body.slug =slug
  }
  Blog.findByIdAndUpdate(req.params.id, body, { new: true}, (err, blog) => {
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
