const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require('dotenv').config()


BASEURL = 'http://localhost:7005/upload/'

const register = async (req, res) => {
  try {
    const { name, email, password, contactNumber, address } = req.body;
    imagePath = req.file ? req.file.filename : null
    
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).send({
        msg: "User already exists",
        success: false,
      });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const regUser = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      address,
      imagePath
    });

    return res.status(201).send({
      msg: "Register successfully",
      success: true,
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).send({ msg: "Server Error" });
  }
};



const login = async (req, res) =>{
    console.log(req.body,"****************")

    try {
    const {email, password} = req.body 
    
        const loggedUser = await User.findOne({
            where:{email:email}
            
        })
console.log(loggedUser, "logged user**************************")

            if(!loggedUser){
               return  res.status(400).send({msg:"User Not Found", success: false})
            }     
            
            
            const isMatch = await bcrypt.compare(password, loggedUser.password)

            if(!isMatch){
                return res.status(400).json({
                    msg:"Password Incorrect",
                    success: false
                })
            }
                const payload = {id:loggedUser.id, role:loggedUser.role}

                const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:'1d'})

                res.status(200).send({msg:"Logged Successfully", success:true, token:token})


    } catch (error) {
        res.status(500).send({msg:"Server Error"})
    }
}


const getUserInfo = async (req, res) => {
  try {
        const loggedUser = await User.findByPk(
            req.user.id,{
      attributes:["id", "name","email","address","role","imagePath"]
    });

    loggedUser.imagePath = BASEURL+loggedUser.imagePath

        console.log("------------------",loggedUser)
        res.status(200).send({user:loggedUser,success:true})
    }catch(error){
        res.status(500).send({msg:"Server Error"})
    }
}

const doctorList = async(req,res) =>{
    console.log(req.user,"In controller")
    try{
        const doctors = await User.findAll({
            where:{role:'doctor'},
            attributes:["id",'name']
        })
        res.status(200).send({doctors:doctors,success:true})
    }catch(error){
        res.status(500).send({msg:"Server Error"})
    }
}




module.exports = { register, login, getUserInfo,doctorList };
