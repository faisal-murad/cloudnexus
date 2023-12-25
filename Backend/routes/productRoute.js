import { Router } from 'express';
import { createProduct, deleteProduct, displayAllProducts, displayOneProduct, displayOneProductPrice, displayProduct, displayProducts } from '../controllers/product.js'; 
import uploadMiddleware from '../middlewares/upload.js';    

const router = Router();  
 
// router.post('/createProduct',uploadMiddleware.any("photo"), createProduct); 
router.post('/createProduct',uploadMiddleware.array("photo", 2), createProduct); 
router.get('/displayProduct', displayProduct);
router.delete('/deleteProduct/:id', deleteProduct);
router.get('/displayProducts/:id', displayProducts);
router.get('/displayOneProduct/:id', displayOneProduct);
router.post('/displayOneProductPrice', displayOneProductPrice);
router.get('/displayAllProducts', displayAllProducts);
// router.post('/createProduct', upload.array('uploadedImages', 10), function(req, res) {
//     var file = req.files;
//     res.end();
//   });

export default router;