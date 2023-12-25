import { Router } from 'express';  
import { createCart } from '../controllers/cart.js';

const router = Router();  
 
router.post('/createCart', createCart); 

export default router;