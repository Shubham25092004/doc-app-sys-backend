const Appointment = require("../models/appointmentModel");

 async function createAppointment(req, res) {
  try {
    const {dateTime, doctorId} = req.body 
     const createdBy = req.user.id

     const newAppoint =  Appointment.create({dateTime, doctorId,createdBy})
    if(!newAppoint){
    res.status(200).send({ msg: "appointment not created", success:false });
    }
    res.status(200).send({ msg: "appointment created successfully", success:true });
  } catch (error) {
    
    res.status(500).send({ msg: "Server Error" });
  }
}

async function statusUpdateByDoctor(req, res) {
    const {ID} = req.params
    console.log(ID,"________id_______")
  try {
    const updatedAppointment = await Appointment.update({
        status:req.body.status,
        updatedBy:req.user.id
    },{
        where:{id:ID}
    })
    console.log(updatedAppointment,"updatedAppointment")
    if(updatedAppointment.length == 0){
    res.status(200).send({ msg: "appointment not updated", success:false });
    }
    res.status(200).send({ msg: "appointments status updated successfully",success:true });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

const updateAppointment = async (req, res) => {
  const { ID } = req.params;
  const { dateTime, doctorId } = req.body;

  try {
    const appointment = await Appointment.findByPk(ID);

    if (!appointment)
      return res.status(404).json({ success: false, msg: "Appointment not found" });

    if (appointment.createdBy !== req.user.id)
      return res.status(403).json({ success: false, msg: "Unauthorized" });

    await appointment.update({
      dateTime,
      doctorId,
      updatedBy: req.user.id
    });

    res.status(200).json({ success: true, msg: "Appointment updated", data: appointment });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};


async function deleteAppointment(req, res) {
  try {
    const appointmentId = Number(req.params.ID);
    const doctorId = Number(req.user.id);

    const deleted = await Appointment.destroy({
      where: {
        id: appointmentId,
        doctorId: doctorId
      }
    });

    if (!deleted) {
      return res.status(200).json({msg: "Appointment not deleted",success: false});
    }

    return res.status(200).json({msg: "Appointment deleted successfully", success: true });

  } catch (error) {
    return res.status(500).json({ msg: "Server Error" });
  }
}

async function getAppointmentsByUser(req, res) {
  try {
    const appointments = await Appointment.findAll({
        where:{createdBy: req.user.id}
    })
    if(appointments.length === 0){
      return  res.status(400).send({msg:"No appointments yet"})
    }
   return res.status(200).send({ appointments:appointments,success:true });
  } catch (error) {
   return res.status(500).send({ msg: "Server Error" });
  }
}

async function showAppointmentsOfDoctor(req, res) {
  try {
    // req.userid (docotr id )

     const appointments =await Appointment.findAll({
        where:{doctorId: req.user.id}
    })
    if(appointments.length == 0){
        res.status(400).send({msg:"No appointments yet", success: false,})
    }
    res.status(200).send({ appointments:appointments,success:true });

  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

module.exports = {
  createAppointment,
  statusUpdateByDoctor,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByUser,
  showAppointmentsOfDoctor,
};