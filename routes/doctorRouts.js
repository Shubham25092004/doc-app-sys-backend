const express =  require('express')
const { auth, admin } = require('../middleware/auth')
const doctorController = require('../controllers/doctorController')

const router = express.Router()


router.post('/apply', auth, doctorController.applyDoctor)
router.post('/docStatus/:DoctorID', auth, doctorController.docStatus);

router.get('/getDoctors', auth, doctorController.getDoctorList);




// router.patch('/update/:ID',doctorController.updateDoctor)
// router.delete('/delete/:ID', doctorController.deleteDoctor)



module.exports = router