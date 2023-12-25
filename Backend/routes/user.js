import { Router } from 'express';
// import express from 'express';
import {register, login, changePassword, forgotPassword, createCart, FindOneUser, findItems, deleteItem}  from '../controllers/user.js';
import { authenticateUser  } from '../middlewares/authMiddleware.js';
import {validateInput } from '../middlewares/validationMiddleware.js'; 
import multer from 'multer'; 
const router = Router();

//registration routes
router.post('/register', validateInput, register);

//login route
router.post('/login', validateInput, login);

//changepassword routes
router.post('/changepassword', authenticateUser,  changePassword);

router.post('/forgot', forgotPassword);
router.post('/createCart/', createCart);
router.post('/FindOneUser', FindOneUser);
router.post('/findItems', findItems);
router.post('/deleteItem', deleteItem); 
 
export default router;