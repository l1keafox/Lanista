const express = require("express");

const router = express.Router();


router.get('/assets/:folder/:image',async(req,res)=>{
  console.log(req.params)
	// res.setHeader('Content-Type', 'image/png')
  //  let png = require('./../assets/hume1.png');
  // console.log(png)
  res.status(200).send({});
})


module.exports = router;
