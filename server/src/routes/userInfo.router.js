const Router = require('express');
const router = new Router();
const UserInfoController = require('../controllers/userInfo.controller');


router.get('/', UserInfoController.updateItem);
router.post('/', UserInfoController.addNewItem);



module.exports = router;


 