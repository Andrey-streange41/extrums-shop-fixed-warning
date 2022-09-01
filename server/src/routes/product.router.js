const Router = require('express');
const router = new Router();
const ProductController = require('../controllers/product.controller');
const checkRoleMiddleware = require('../middlewares/checkRole.middleware');
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/',ProductController.takeAllProducts);
router.get('/:id',ProductController.takeById);
router.post('/', checkRoleMiddleware('ADMIN'), ProductController.addProduct);
router.put('/', ProductController.updateComunicationByProductId);
router.post('/favorites',authMiddleware,ProductController.addToFavorite);
router.delete('/favorites',authMiddleware, ProductController.removeFromFavorite);
router.get('/favorites/take:id',ProductController.getFavorList);
router.post('/comments',ProductController.addComments);
router.get('/comments/:id', ProductController.getComments);
router.delete('/comments/:id', ProductController.deleteComment);
router.put('/updateInfo',ProductController.updateProductInfo);
router.delete('/removeInfo',ProductController.removeProductInfo);
router.put('/addInfo', ProductController.addProductInfo);
router.post('/addChar',ProductController.addChar);
router.delete('/:id',ProductController.deleteById);

module.exports = router;


 