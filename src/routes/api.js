const express=require('express');
const { getTotalRevenue, getQuantitySoldByProduct, getTopProductsByRevenue, getAveragePrice, getRevenueByMonth, getHighestQuantitySold, getDepartmentSalaryExpense } = require('../controllers/SalesController');


const router=express.Router();

router.get('/total-revenue',getTotalRevenue);

router.get('/quantity-by-product',getQuantitySoldByProduct);

router.get('/top-products',getTopProductsByRevenue);

router.get('/average-price',getAveragePrice);

router.get('/revenue-by-month',getRevenueByMonth);

router.get('/highest-quantity-sold',getHighestQuantitySold);

router.get('/department-salary-expense',getDepartmentSalaryExpense);

module.exports=router;