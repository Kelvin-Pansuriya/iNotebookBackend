const jwt = require("jsonwebtoken")
const JWT_Secret_Key = "token is good" 

const fetchuser = (req,res,next)=>{
    let success = false
    const token = req.header("auth-token")
    if(!token){
        return res.status(401).send({error:"Enter Valid Token",success})
    }
    try{
        const verified = jwt.verify(token,JWT_Secret_Key)
        success = true
        req.userId = verified.userId
        next()
    }
    catch(err){
        res.status(401).send({error:"Enter Valid Token....",success})
    }
}

module.exports = fetchuser