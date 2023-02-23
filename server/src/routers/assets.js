const express = require("express");

const router = express.Router();


router.get('/assets/:folder/:image',async(req,res)=>{
  console.log(req.params)
	
})


module.exports = router;
