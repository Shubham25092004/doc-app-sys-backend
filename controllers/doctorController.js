const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");



const applyDoctor = async (req, res) => {
  try {
    const { Specialist, fees, available } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    await Doctor.create({
      name: user.name,            // ✅ SAVE USER NAME
      Specialist,
      fees,
      available,
      createdBy: user.id
    });

    res.status(200).send({
      success: true,
      msg: "Doctor applied successfully"
    });

  } catch (error) {
    console.error("Apply Doctor Error 👉", error);
    res.status(500).send({ success: false, msg: "Server Error" });
  }
};




const docStatus = async(req,res)=>{
    try{
        //admin req.user.id
        // DoctorID = req.params.DoctorID   Doctor model
    //     Doctor model status ->accepted
    //    if status is accepted -> createdBy  = userID   -> role ->doctor

    const DoctorID = req.params.DoctorID
    console.log(req.user.id,"admin", req.params.DoctorID,"DoctorID")
    const getDoctor = await Doctor.findByPk(DoctorID)
    // console.log(getDoctor)
    if(!getDoctor){
        res.status(400).send({msg:"Doctor not found", success:false})
    }else{
         // 2️⃣ Update doctor status
    getDoctor.status = req.body.status;
    await getDoctor.save(); //
        if(getDoctor.status ==="Accepted"){
            await User.update({role:"Doctor"},{where:{id:getDoctor.createdBy}} )
        
         res
      .status(200)
      .send({ msg: "doctor applied successfully", success: true });

    }
    else {
     res
      .status(200)
      .send({ msg: "doctor applied rejected", success: false });
        }
    }

  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Server Error" });
  }
}




const getDoctorList = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { status: "Pending" },
      attributes: ["id", "Specialist", "fees", "available"]
    });

    res.status(200).send({
      success: true,
      doctors
    });
  } catch (error) {
    console.error("Get Doctor List Error 👉", error);
    res.status(500).send({
      success: false,
      msg: "Server Error"
    });
  }
};




const updateDoctor = (req,res)=>{
    try{
            res
      .status(200)
      .send({ msg: "doctor created successfully", success: true });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

const deleteDoctor = (req,res)=>{
    try{
            res
      .status(200)
      .send({ msg: "doctor created successfully", success: true });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}
module.exports = {applyDoctor,docStatus, getDoctorList,updateDoctor,deleteDoctor}