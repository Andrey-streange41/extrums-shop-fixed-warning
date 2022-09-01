const UserInfoService = require('../services/userInfo.service');
const ApiError = require('../errors/api.errors');
const uuid = require('uuid');
const path = require('path');

class UserInfoController{
    async addNewItem(req,res,next){
        try {
            const {firstname,lastname,telphone,user_id} = req.body;
            const {avatar} = req.files;
           
            let fileName = uuid.v4() + `.jpg`;
            avatar.mv(path.resolve(__dirname,'..','..','static',fileName));

            if(!firstname||!lastname||!telphone||!user_id){
                return next(ApiError.badRequest("User info data have invalid format, bad request !"));
            }
            
            const newInfo = await UserInfoService.addUserInfo({firstname,lastname,telphone,user_id,avatar:fileName});
            
            res.status(200).json(newInfo);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
    async removeItem(req,res){

    }
    async updateItem(req,res){

    }
}

module.exports = new UserInfoController();