const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport")

router.get("/",  passport.authenticate('jwt', {session: false}),(req, res) => {
  let userFetch = User.find({ isActive: true });
  if (req.query.all) {
    userFetch = User.find();
  }
  userFetch
    .then((users) => {
        const tempUsers = users.map(user => {
            user["password"] = null;
            return user
        })
      res.status(200).json(tempUsers);
    })
    .catch((err) => res.status(500).json(err));
});

router.post("/login", async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token =  user.generateAuthToken();
        user.password = null
        res.status(200).json({user, token})
    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
})

router.post("/",  passport.authenticate('jwt', {session: false}),async (req, res) => {
  const user = await User.find({ email: req.body.email });
  if (user.length) {
    res.status(500).json({error: true, message: "Email already exists"});
  }else{
      const newUser = new User({ ...req.body });
      newUser.save(async (err, user) => {
          if(err) res.status(500).json({error: true, message: "Error in saving!", ...err});
          user.password = null
          const token =  user.generateAuthToken();
          res.status(200).json({user, token})
      })
  }
});

router.put("/:id",  passport.authenticate('jwt', {session: false}),async (req, res) => {
  const user = await User.findById(req.params.id);
  const updateKeys = Object.keys(req.body);

  updateKeys.forEach((key) => {
    user[key] = req.body[key];
  });

  await user.save((err, result) => {
    if (err) {
      res.status(400).json({ message: "Id not found", ...err });
    }
    res.status(200).json(user);
  });
});

router.delete("/:id",  passport.authenticate('jwt', {session: false}),(req, res) => {
  User.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) res.status(500).json({ ...err, message: "Id not found" });
    res.status(200).json(result);
  });
});

module.exports = router;
