const router = require("express").Router();
const passport = require("passport");
const Home = require("../models/Home");

router.get("/", async (req, res) => {
  let homeFetchParams = { isActive: true };
  if (req.query.all) {
    delete homeFetchParams.isActive;
  }
  try {
    const homeData = await Home.find(homeFetchParams);
    res.status(200).json(homeData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const homeData = new Home({ ...req.body });
    homeData.save((err, blog) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(blog);
      }
    });
  }
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Home.findByIdAndUpdate(
      req.params.id,
      req.body,
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
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Home.findByIdAndDelete(req.params.id, (err, result) => {
      if (err) res.status(500).json({ ...err, message: "Id not found" });
      res.status(200).json(result);
    });
  }
);

module.exports = router;
