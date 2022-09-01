const {User, UserInfo} = require('../models/models');




class UserInfoService {
  async addUserInfo(data)  {
    try {
        const user = await User.findByPk(data.user_id);
        if(!user){
            throw new Error('User with the same PK not found ! bad request...')
        }
        const userInfo = await UserInfo.create({...data});
        return userInfo;
    } catch (error) {
      return error.message;
    }
  }
  
}
module.exports = new UserInfoService();
