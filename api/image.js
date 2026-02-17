const router = require("express").Router();
const cloudinary = require("cloudinary").v2;

router.post("/upload", (req, res) => {
  if (Array.isArray(req.body.data) && req.body.data.length) {
    const data = req.body.data;
    const imagePromise = data.map((uri, index) => {
      return new Promise((resolve, reject) => {
          resolve(null);
      });
    });
    Promise.all(imagePromise).then(value => {
        let errMsg=""
        const filterUrls = value.filter((url, index) => {
            if(!url){
                errMsg+= `${index},`;
                return false
            }else{
                return true
            }
        });
        res.status(200).json({ errMsg: errMsg ? errMsg: false, imgUrls: filterUrls})
    })
  } else {
    res.status(400).json({ message: "Bad Request" });
  }
});

module.exports = router;
