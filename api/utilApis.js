const Category = require("../models/Category");
const router = require("express").Router();
const passport = require("passport");
const Email = require("../models/Email");

//fetch category
router.get("/category", (req, res) => {
  let findParams = { isActive: true };
  if (req.query.all) {
    findParams = {};
  }
  Category.find(findParams)
    .then((category) => {
      res.status(200).json(category);
    })
    .catch((err) => res.status(400).json(err));
});

router.post(
  "/category",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.body.name) {
      res
        .status(400)
        .json({ error: true, message: "Category name is required" });
    } else {
      Category.find({ name: req.body.name.replace(/ /g, "_").toUpperCase() })
        .then((item) => {
          if (item.length) {
            res
              .status(400)
              .json({ error: true, message: "Category aleady exist" });
          } else {
            const newCategory = new Category({
              name: req.body.name.toUpperCase(),
            });
            newCategory.save((err, result) => {
              if (err) res.status(400).json(err);
              res.status(200).json(result);
            });
          }
        })
        .catch((err) => res.status(500).json(err));
    }
  }
);

router.put(
  "/category/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let tempReq = { ...req.body };
    if (tempReq.name) {
      tempReq.name = tempReq.name.toUpperCase();
    }
    Category.findByIdAndUpdate(
      req.params.id,
      tempReq,
      { new: true },
      (err, blog) => {
        if (err) {
          res.status(400).json({ ...err, message: "Id not found" });
        } else {
          res.status(200).json(blog);
        }
      }
    );
  }
);

router.delete(
  "/category/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Category.findByIdAndDelete(req.params.id, (err, result) => {
      if (err) res.status(500).json({ ...err, message: "Id not found" });
      res.status(200).json(result);
    });
  }
);

router.post("/email", (req, res) => {
  const mailData = new Email({ ...req.body });
  mailData.save((err, result) => {
    if (err) res.status(500).json(err);
    res.status(200).json(result);
  });
});

router.get("/email", async (req, res) => {
  try{
    const queries = await Email.find();
    res.status(200).json(queries) 
  }
  catch(err){
    res.status(500).json(err)
  }
});

router.delete("/email/:id", async (req, res) => {
  Email.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) res.status(500).json({ ...err, message: "Id not found" });
    res.status(200).json(result);
  });
});

module.exports = router;
