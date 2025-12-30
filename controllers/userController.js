const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require('dotenv').config()


const register = async (req, res) => {
  try {
    const { name, email, password, contactNumber, address } = req.body;

    
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

                res.status(202).send({msg:"Logged Successfully", success:true, token:token})


    } catch (error) {
        res.status(500).send({msg:"Server Error"})
    }
}


const getUserInfo = async(req, res) => {
    try {

        const user = await User.findByPk(req.user.id,{
            attributes: {exclude: ["password"]}
        })

        if(!user){
            return res.status(404).json({ msg: "User not found" })
        }
             res.status(200).json({
                success:true,
                user
            })
        
        
    } catch (error) {
        res.status(500).send({msg:"server error"})
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
