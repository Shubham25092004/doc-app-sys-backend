const Appointment = require("../models/appointmentModel");

/* =========================
   CREATE APPOINTMENT
========================= */
async function createAppointment(req, res) {
  try {
    const { dateTime, doctorId } = req.body;
    const createdBy = req.user.id;

    const newAppointment = await Appointment.create({
      dateTime,
      doctorId,
      createdBy
    });

    return res.status(200).send({
      msg: "Appointment created successfully",
      success: true,
      appointment: newAppointment
    });

  } catch (error) {
    return res.status(500).send({ msg: "Server Error" });
  }
}

/* =========================
   UPDATE STATUS BY DOCTOR
========================= */
async function statusUpdateByDoctor(req, res) {
  const { ID } = req.params;

  try {
    const [updated] = await Appointment.update(
      {
        status: req.body.status,
        updatedBy: req.user.id
      },
      {
        where: { id: ID }
      }
    );

    if (!updated) {
      return res.status(200).send({
        msg: "Appointment not updated",
        success: false
      });
    }

    return res.status(200).send({
      msg: "Appointment status updated",
      success: true
    });

  } catch (error) {
    return res.status(500).send({ msg: "Server Error" });
  }
}

/* =========================
   UPDATE APPOINTMENT (USER)
========================= */
async function updateAppointment(req, res) {
  const { ID } = req.params;
  const { dateTime, doctorId } = req.body;

  try {
    const appointment = await Appointment.findByPk(ID);

    if (!appointment) {
      return res.status(404).send({
        msg: "Appointment not found",
        success: false
      });
    }

    if (appointment.createdBy !== req.user.id) {
      return res.status(403).send({
        msg: "Unauthorized",
        success: false
      });
    }

    await appointment.update({
      dateTime,
      doctorId,
      updatedBy: req.user.id
    });

    return res.status(200).send({
      msg: "Appointment updated successfully",
      success: true,
      appointment
    });

  } catch (error) {
    return res.status(500).send({ msg: "Server Error" });
  }
}

/* =========================
   DELETE APPOINTMENT
========================= */
async function deleteAppointment(req, res) {
  try {
    const appointmentId = Number(req.params.ID);
    const userId = req.user.id;

    const deleted = await Appointment.destroy({
      where: {
        id: appointmentId,
        createdBy: userId
      }
    });

    if (!deleted) {
      return res.status(200).send({
        msg: "Appointment not deleted",
        success: false
      });
    }

    return res.status(200).send({
      msg: "Appointment deleted successfully",
      success: true
    });

  } catch (error) {
    return res.status(500).send({ msg: "Server Error" });
  }
}

/* =========================
   GET APPOINTMENTS (USER)
========================= */
async function getAppointmentsByUser(req, res) {
  try {
    const appointments = await Appointment.findAll({
      where: { createdBy: req.user.id }
    });

    return res.status(200).send({
      success: true,
      appointments
    });

  } catch (error) {
    return res.status(500).send({ msg: "Server Error" });
  }
}

/* =========================
   GET APPOINTMENTS (DOCTOR)
========================= */
async function showAppointmentsOfDoctor(req, res) {
  console.log("Logged-in Doctor ID:", req.user.id); 
  try {
    const appointments = await Appointment.findAll({
      where: { doctorId: req.user.id }
    });
    console.log("Appointments found:", appointments); 
    return res.status(200).send({
      success: true,
      appointments
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Server Error" });
  }
}


module.exports = {
  createAppointment,
  statusUpdateByDoctor,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByUser,
  showAppointmentsOfDoctor
};
