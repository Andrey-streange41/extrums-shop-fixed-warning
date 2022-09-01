const { send } = require("process");
const ApiError = require("../errors/api.errors");
const UserService = require("../services/user.service");
const uuid = require("uuid");
const path = require("path");

class UserController {
  async registration(req, res, next) {
    try {
      const { password, email, role, firstname, lastname, telphone, avatar } =
        req.body;
      if (!password || !email) {
        return next(ApiError.badRequest("Password and email is required !"));
      }
      const jwt_token = await UserService.registration({
        email,
        password,
        role,
        firstname,
        lastname,
        telphone,
        avatar,
      });
      return res.status(200).json(jwt_token);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error);
    }
  }

  async logout(_, res) {
    try {
      await UserService.logout();
      res.status(200);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getAll(_, res) {
    try {
      const users = await UserService.getAll();
      return res.status(200).json(users);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!password || !email) {
        return next(ApiError.badRequest("Password and email is required !"));
      }
      const candidate = await UserService.login(email, password);
      return res.status(200).json(candidate);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async isAuth(req, res) {
    try {
      const token = await UserService.isAuth(
        req.user.email,
        req.user.id,
        req.user.role,
        req.user.firstname,
        req.user.lastname,
        req.user.telphone,
        req.user.password
      );
      return res.status(200).json(token);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
  }

  async updateUserById(req, res) {
    try {
      const data = req.body;

      let fileName = null;
      if (req.files) {
        const { avatar } = req.files;
        fileName = uuid.v4() + `.png`;
        avatar.mv(path.resolve(__dirname, "..", "..", "static", fileName));
      }

      const updatedUser = await UserService.updateUserById({
        ...data,
        avatar: fileName,
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json(error.message);
    }
  }

  async kick(req, res) {
    try {
      const users = await UserService.kick(req.params.id);
      return res.status(200).json(users);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json(error.message);
    }
  }
  async unlock(req, res) {
  try {
    const users = await UserService.unlock(req.params.id);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
}

async changeRole(req, res) {
  try {
    console.log(req.body);
    const users = await UserService.changeRole(req.body);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
}

}

module.exports = new UserController();
