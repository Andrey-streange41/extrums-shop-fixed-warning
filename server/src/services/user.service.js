const { User, UserInfo, UserCommunication, BlockedUsers } = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const generateJWT = (
  email,
  id,
  role,
  firstname,
  lastname,
  telphone,
  password
) => {
  const jwt_token = jwt.sign(
    { id, email, role, firstname, lastname, telphone, password },
    process.env.SECRET,
    { expiresIn: "24h" }
  );
  return jwt_token;
};

class UserService {
  async login(email, password) {
    try {
      let user = await User.findOne({ where: { email },include:{all:true} });
      if (!user) {
        throw new Error("User with the same email not exist !");
      }
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        throw new Error("Invalid password or email !");
      }
      const userInf = await UserInfo.findOne({ where: { user_id: user.id } });

      if(user.blocked_user){
        return 'Your account was banned for Bad behavior !'
      }

      return generateJWT(
        user.email,
        user.id,
        user.role,
        userInf.firstname,
        userInf.lastname,
        userInf.telphone,
        password
      );
    } catch (error) {
      console.error(error.message);
      return new Error(error.message);
    }
  }
  async registration(candidate) {
    try {
      await UserCommunication.update({ isActive: false }, { where: {} });
      const { email, password, role, firstname, lastname, telphone, avatar } =
        candidate;
      let user = await User.findOne({
        where: { email },
        include: { all: true },
      });
      if (user) {
        throw new Error("User with the same email allready exist !");
      }
      const hashPassword = await bcrypt.hash(password, 5);

      user = await User.create({
        email: email,
        password: hashPassword,
        role: role || "USER",
      });

      const userInfo = await UserInfo.create({
        firstname,
        lastname,
        telphone,
        avatar,
        userId: user.id,
        user_id: user.id,
      });

      if (!userInfo) {
        throw new Error("Failed operation !");
      }

      const jwt_token = generateJWT(
        String(email),
        user.id,
        role,
        firstname,
        lastname,
        telphone,
        password
      );
      return jwt_token;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }
  async isAuth(email, id, role, firstname, lastname, telphone, password) {
    try {
      const jwt_token = generateJWT(
        email,
        id,
        role,
        firstname,
        lastname,
        telphone,
        password
      );
      return jwt_token;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }
  async getAll() {
    try {
      const users = await User.findAll({ include: [{model:BlockedUsers},{model:UserInfo}] });
      
      return users;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async logout() {
    try {
      await UserCommunication.update({ isActive: false }, { where: {} });
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async updateUserById(data) {
    try {
      const { id, password, email, avatar } = data;
      const hashPassword = await bcrypt.hash(password, 5);
      const user = { password, email };
      const oldUser = await User.findByPk(id);
     
      if(email&&password&&id)
      { await User.update(
        {
          ...oldUser,
          email: user.email ? user.email : oldUser.email,
          password: user.password ? hashPassword : oldUser.password,
        },
        { where: { id } }
      );}
      else if(email&&!password&&id){
        await User.update(
          {
            ...oldUser,
            email: user.email ? user.email : oldUser.email,
          },
          { where: { id } }
        );
      }
      else if(password&&!email&&id){
        await User.update(
          {
            ...oldUser,
            password: user.password ? hashPassword : oldUser.password
          },
          { where: { id } }
        );
      }

      const { firstname, lastname, tel, agrements } = data;
      const oldUserInfo = await UserInfo.findOne({ where: { user_id: id } });
      
      await UserInfo.update(
        {
          ...oldUserInfo,
          firstname: firstname ? firstname : oldUserInfo.firstname,
          lastname: lastname ? lastname : oldUserInfo.lastname,
          telphone: tel ? tel : oldUserInfo.telphone,
          avatar: avatar ? avatar : oldUserInfo.avatar,
          agrements: agrements? agrements:oldUserInfo.agrements
        },
        { where: { user_id: id } }
      );
     
      const jwt_token = generateJWT(
        String(email),
        oldUser.id,
        oldUser.role,
        firstname,
        lastname,
        tel,
        password
      );
      return jwt_token;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }
  async getUserById(id) {
    try {
      const user = await User.findByPk(id, { include: { all: true } });
      const userInfo = await UserInfo.findOne({
        where: { user_id: id },
        include: { all: true },
      });

      return { user, userInfo };
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async kick(id){
    try {

      const candidate = await BlockedUsers.findOne({where:{userId:id}});
      if(candidate){
        const users = await User.findAll({ include: [{model:BlockedUsers},{model:UserInfo}] });
        return users;
      }
      await BlockedUsers.create({userId:id,ban_reason:'For bad behavior'}); // better from client set reason
      const users = await User.findAll({ include: [{model:BlockedUsers},{model:UserInfo}] });
    
     return users;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async unlock(id){
    try {
      const candidate = await BlockedUsers.findOne({where:{userId:id}});
      if(candidate){
        await BlockedUsers.destroy({where:{userId:id}});
        const users = await User.findAll({ include: [{model:BlockedUsers},{model:UserInfo}] });
        return users;
      }
      const users = await User.findAll({ include: [{model:BlockedUsers},{model:UserInfo}] });
     return users;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async changeRole({role,id}){
    try {
         await User.update({role:role},{where:{id:id}});
        const users = await User.findAll({ include: [{model:BlockedUsers},{model:UserInfo}] });
        return users;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  
}

module.exports = new UserService();
