const Router = require('express');
const router = new Router();
const UserController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/auth',authMiddleware,UserController.isAuth);
router.get('/',UserController.getAll);
router.post('/registration',UserController.registration);
router.post('/login',UserController.login);
router.put('/update',UserController.updateUserById);
router.get('/:id',UserController.getUserById);
router.post('/logout',UserController.logout);
router.post('/kick/:id',UserController.kick);
router.delete('/unlock/:id',UserController.unlock);
router.put('/changeRole',UserController.changeRole);



module.exports = router;


 