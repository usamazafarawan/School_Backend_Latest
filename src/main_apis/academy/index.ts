import express from 'express';
const router = express.Router();
import * as controller from './academy.controller';


router.get('/getSchoolAcademyStudents', controller.getSchoolAcademyStudents);







export = router

