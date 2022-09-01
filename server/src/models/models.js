const sequelize = require("../db/db");
const {
  DataTypes,
  INTEGER,
  STRING,
  BOOLEAN,
  BLOB,
  TEXT,
  INET,
} = require("sequelize");

const User = sequelize.define(
  "user",
  {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: STRING, unique: true, allowNull: false },
    password: { type: STRING, allowNull: false },
    role: { type: STRING, defaultValue: "USER" },
  },
  {
    timestamps: false,

    createdAt: false,

    updatedAt: false,
  }
);

const UserInfo = sequelize.define("user_infos", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  firstname: { type: STRING, allowNull: false },
  lastname: { type: STRING, allowNull: false },
  telphone: { type: STRING, allowNull: true },
  avatar: { type: STRING, allowNull: true },
  agrements: { type: BOOLEAN, defaultValue: false },
  user_id: { type: INTEGER, allowNull: false, unique: true },
},
{
  timestamps: false,

  createdAt: false,

  updatedAt: false,
});


const BlockedUsers = sequelize.define('blocked_users',
{
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  userId:{ type: INTEGER, allowNull: true, unique: false },
  ban_reason:{ type: STRING, allowNull:true },
  
})

const Comments = sequelize.define("comments", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  message: { type: STRING },
  
});

const Date = sequelize.define("date", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  month: { type: STRING, allowNull: false },
  year: { type: INTEGER, allowNull: false },
  day: { type: INTEGER, allowNull: false },
  hour: { type: INTEGER, allowNull: false },
  min: { type: INTEGER, allowNull: false },
},
{
  timestamps: false,

  createdAt: false,

  updatedAt: false,
});

const Product = sequelize.define("product", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  images: { type: TEXT, allowNull: false },
  full_info: { type: TEXT, allowNull: false },
  isFavor: { type: BOOLEAN, defaultValue: false },
  category: { type: STRING, allowNull: false },
  sub_category: { type: STRING, allowNull: false },
  avatar: { type: TEXT, allowNull: false },
  title: { type: STRING, allowNull: false },
  price: { type: INTEGER, allowNull: false },
  discount: { type: BOOLEAN, defaultValue: false },
  discountPrice:{type:INTEGER,defaultValue:0}
},
{
  timestamps: false,

  createdAt: false,

  updatedAt: false,
});

const FavoriteList = sequelize.define("favorites", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: INTEGER },
  userId: { type: INTEGER },
},
{
  timestamps: false,

  createdAt: false,

  updatedAt: false,
});

const UserCommunication = sequelize.define("userComunication", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  amount: { type: INTEGER, allowNull: false },
  name: { type: STRING, allowNull: false },
  productId: { type: INTEGER },
  isActive: { type: BOOLEAN, defaultValue: false },
},
{
  timestamps: false,

  createdAt: false,

  updatedAt: false,
});

const Characteristics = sequelize.define("characteristics", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: STRING, allowNull: false },
  info: { type: TEXT, defaultValue:'unset' },
},
{
  timestamps: false,

  createdAt: false,

  updatedAt: false,
});

const Purpose = sequelize.define("purpose", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: STRING, allowNull: false },
  is_active: { type: BOOLEAN, defaultValue: false, allowNull: true },
},
{
  timestamps: false,

  createdAt: false,

  updatedAt: false,
});

const SubMenu = sequelize.define("sub_menu", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: STRING, allowNull: false },
  is_active: { type: BOOLEAN, defaultValue: false },
  img: { type: STRING, allowNull: false },
  active_img: { type: STRING, allowNull: false },
},
{
  timestamps: false,

  createdAt: false,

  updatedAt: false,
});

const AddCharacteristics = sequelize.define("add_characteristics", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: STRING, allowNull: false },
},
{
  timestamps: false,

  createdAt: false,

  updatedAt: false,
});

const ModalItems = sequelize.define("modal_items", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: STRING, allowNull: false },
},
{
  timestamps: false,

  createdAt: false,

  updatedAt: false,
});

const SubCategory = sequelize.define("sub_categories", {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: STRING, allowNull: false },
  is_active: { type: BOOLEAN, defaultValue: false },
},
{
  timestamps: false,

  createdAt: false,

  updatedAt: false,
});

User.hasOne(UserInfo);
UserInfo.belongsTo(User);



User.hasMany(Comments);
Comments.belongsTo(User);

Date.hasMany(Comments);
Comments.belongsTo(Date);

Product.hasMany(Comments), { as: "comments" };
Comments.belongsTo(Product);

Product.hasMany(Characteristics, { as: "characteristics" });
Characteristics.belongsTo(Product);

Product.hasMany(Purpose, { as: "purpose" });
Purpose.belongsTo(Product);

User.hasOne(BlockedUsers);
BlockedUsers.belongsTo(User);

Product.hasMany(UserCommunication);
UserCommunication.belongsTo(Product);

User.belongsToMany(Product, { through: FavoriteList });
Product.belongsToMany(User, { through: FavoriteList });

SubMenu.hasMany(Purpose);
Purpose.belongsTo(SubMenu);

SubMenu.hasMany(AddCharacteristics);
AddCharacteristics.belongsTo(SubMenu);

SubMenu.hasOne(ModalItems);
ModalItems.belongsTo(SubMenu);

ModalItems.hasMany(SubCategory);
SubCategory.belongsTo(ModalItems);

module.exports = {
  BlockedUsers,
  FavoriteList,
  UserCommunication,
  User,
  UserInfo,
  Comments,
  Date,
  Product,
  Characteristics,
  Purpose,
  SubMenu,
  AddCharacteristics,
  ModalItems,
  SubCategory,
};
