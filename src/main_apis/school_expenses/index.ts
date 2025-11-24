import express from 'express';
const router = express.Router();
import * as controller from './expenses.controller';


router.post('/add', controller.addExpense);
router.get('/get-list', controller.getExpenses);
router.delete('/delete-expense/:id', controller.deleteExpense);







export = router

