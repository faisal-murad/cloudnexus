import { Router } from 'express';
// import express from 'express';
import {register, login, changePassword, forgotPassword, getLatestServer, FindOneUser, 
    addServer, deleteServer, getAllServers, checkSid, uninstallServer, getRecentRecords, 
    installServer, updateThreshold, getThreshold, logoutUser, sendMail, getAllUsersAndServers}  from '../controllers/user.js';
import { authenticateUser  } from '../middlewares/authMiddleware.js';
import {validateInput } from '../middlewares/validationMiddleware.js'; 
import multer from 'multer'; 
import bodyParser from 'body-parser';
const router = Router(); 


//registration routes
router.post('/register', register);

//login route
router.post('/login', authenticateUser, login);

//changepassword routes
router.post('/changepassword', authenticateUser,  changePassword);

router.post('/forgot', forgotPassword); 
router.post('/FindOneUser', FindOneUser); 
router.post('/addServer', addServer); 
router.post('/getLatestServer', getLatestServer); 
router.post('/getAllServers', getAllServers); 
router.post('/installServer', installServer); 
router.post('/uninstallServer', uninstallServer); 
router.post('/checkSid', checkSid); 
router.post('/getRecentRecords', getRecentRecords); 
router.post('/updateThreshold', updateThreshold); 
router.post('/getThreshold', getThreshold); 
router.delete('/deleteServer/:id', deleteServer); 
router.get('/logoutUser', logoutUser);
router.post('/sendMail', sendMail); 
router.get('/getAllUsersAndServers', getAllUsersAndServers);

export default router;