import express from 'express';
const router = express.Router();
import * as controller from './students.controller';


router.post('/create', controller.createStudentAdmissionRecord);
router.get('/getAllStudents', controller.getAllStudentsWithParents);






export = router

