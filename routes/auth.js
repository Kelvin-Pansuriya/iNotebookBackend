const express = require('express');
const User = require('../model/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")
const router = express.Router()
// JWT Secret Key For JWT Sign...
const JWT_Secret_Key = "token is good" 

// Router 1 :- Creating New User Using : Post Method (URL Path Is :- localhost:5000/api/auth/createuser) [No LoggedIn Required Because New User Is Create....]
router.post("/createuser", [
    body("name","Enter A Name With Minimun 3 Characters").isLength({min:3}),
    body("email","Enter A Valid Email").isEmail(),
    body("password","Password Must Be 5 Characters").isLength({min:5})
] ,async (req,res)=>{

    // This Condition Is Check Validation Errors....(For This Validators Package 'express-validator' )
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        // When You Make Unique In Mongoose Schema Then Always Prefer This Types Of Method....
        // This Is Custom Condition, This Condition Is Check If New Users Email Is Already Exist In DataBase....

        let success = false
        const emailUser = await User.findOne({email:req.body.email})
        if(emailUser){
            return res.status(400).json({error:"This Email Is Already Existed",success:success})
        }

        // Password Is Convert Into Hash For Security Purpose...(Now Our MongoDB Stored Password As Hash....)
        // And Salt Is Provide More Security For RainbowTable....
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password,salt);

        const user = User({
            name:req.body.name,
            email:req.body.email,
            password:securePassword
        })
        const storeUser = await user.save() 

        const userId = {
            userId:{
                id:storeUser.id
            }
        }
        console.log(userId);
        success = true
        const singupJwtToken = jwt.sign(userId,JWT_Secret_Key)
        res.json({singupJwtToken,success})

    }catch(err){
        console.log(err);
        res.status(500).send("Internal Errors....")
    }

})

// Router 2 :- Creating Login : Post Method (URL Path Is :- localhost:5000/api/auth/login) [No LoggedIn Required Because This Is For LoggedIN....]

router.post("/login",[
    body("email","Enter Valid Email....").isEmail(),
    body("password","Enter Correct Password").exists()
],async(req,res)=>{

    // This Condition Is Check Validation Errors....(For This Validators Package 'express-validator' )
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const {email,password} = req.body
        const user = await User.findOne({email})
        let success = false
        if(!user){
            return res.status(400).json({error:"Enter Valid Email",success})
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            return res.status(400).json({error:"Enter Valid Password",success})
        }
        
        const userId = {
            userId:{
                id:user.id
            }
        }
        const loginJwtToken = jwt.sign(userId,JWT_Secret_Key)
        success = true
        res.json({loginJwtToken,success})

    }catch(err){
        res.status(500).send("Internal Errors....")
    }
})


// Router 3 :- Fetching Users Stored Data : Post Method (URL Path Is :- localhost:5000/api/auth/fetchuser) [LoggedIn Required....]

router.post("/fetchuser",fetchuser,async(req,res)=>{
    try{
        const userId = req.userId.id
        const fetchedUser = await User.findById(userId).select("-password")
        res.send(fetchedUser)
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Errors...")
    }
})

module.exports = router