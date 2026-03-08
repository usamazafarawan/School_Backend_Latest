import express from 'express';
const router = express.Router();
import * as controller from './academy.controller';


router.get('/getSchoolAcademyStudents', controller.getSchoolAcademyStudents);
router.get('/get-student-details/:studentId', controller.getStudentDetailsById);
router.post('/create', controller.createAcademyStudentAdmissionRecord);
router.put('/update-parent-student-record', controller.updateParentAndStudentRecord);
router.put('/delete-student-account', controller.deleteStudentAccount);








export = router

