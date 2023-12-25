import { Router } from 'express';
import { createCategory, deleteCategory, displayCategory, displayOneCategory, updateCategory } from '../controllers/category.js';
import uploadMiddleware from '../middlewares/upload.js';

const router = Router(); 

// import uploadMiddleware from '../middlewares/upload.js' 

// router.post('/createCategory', uploadMiddleware.single("image"), createCategory)

router.get('/displayOneCategory/:id', displayOneCategory);

router.get('/displayCategory', displayCategory);

router.post('/createCategory',uploadMiddleware.single("photo"), createCategory);

router.delete('/deleteCategory/:id', deleteCategory);

router.put('/updateCategory',  updateCategory);
// router.put('/updateCategory',uploadMiddleware.single("photo"), updateCategory);

export default router;