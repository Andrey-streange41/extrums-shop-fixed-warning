const {
  UserInfo,
  User,
  Product,
  Comments,
  Date,
  Characteristics,
  Purpose,
  UserCommunication,
  FavoriteList,
} = require("../models/models");

class ProductService {
  async createProduct(productData) {
    try {
      const formatProduct = {};
      const images = productData.images;
      formatProduct.images = JSON.stringify(images);
      formatProduct.category = productData.data.categori;
      formatProduct.sub_category = productData.data.subCategory;
      formatProduct.title = JSON.parse(productData.data.productInfo).title;
      formatProduct.price = JSON.parse(productData.data.productInfo).price;
      formatProduct.discription = JSON.parse(
        productData.data.productInfo
      ).discription;
      formatProduct.full_info = JSON.parse(
        productData.data.productInfo
      ).discription;
      console.log(images);
      formatProduct.avatar = JSON.stringify(images[0]);
      const product = await Product.create({ ...formatProduct });
      const formatCharacteristics = JSON.parse(
        productData.data.characteristics
      ).map((el) => {
        return { ...el, productId: product.id };
      });
      const charcs = await Characteristics.bulkCreate(formatCharacteristics);
      const responce = await Characteristics.findAll({
        include: { all: true },
      });
      const formatPurpose = JSON.parse(productData.data.purpose).map((el) => {
        return { name: el, productId: product.id };
      });

      const purpose = await Purpose.bulkCreate(formatPurpose);

      const comments = await UserCommunication.bulkCreate([
        { name: "likes", amount: 0, productId: product.id, isActive: false },
        { name: "dislikes", amount: 0, productId: product.id, isActive: false },
        {
          name: "favorites",
          amount: 0,
          productId: product.id,
          isActive: false,
        },
        { name: "views", amount: 0, productId: product.id, isActive: false },
      ]);

      return responce;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }
  async getProducts({
    category,
    sub_category,
    price,
    characteristicName_id,
    purposes,
    limit,
    page,
    keyword,
  }) {
    let formatPrice = {
      min: 0,
      max: 0,
    };
    if (price) {
      formatPrice = JSON.parse(price);
    }
    try {
      let products = [];
      page = page || 1;
      limit = limit || 9;
      const offset = limit * page - limit;

      if (!category) {
        products = await Product.findAll({
          include: [
            {
              model: Comments,
              include: [
                { model: Date },
                { model: User, include: { model: UserInfo } },
              ],
            },
            { model: UserCommunication },
            { model: Purpose, include: { model: Product }, as: "purpose" },
            { model: Characteristics, as: "characteristics" },
          ],
        });

        if (keyword && keyword !== "") {
          products = products.filter((el) =>
            String(el.title).toLowerCase().includes(keyword.toLowerCase())
          );
        }

        if (Number(formatPrice?.min) > 0 && !Number(formatPrice?.max) > 0) {
          products = products?.filter((el) => el.price >= formatPrice.min);
        } else if (formatPrice.min > 0 && formatPrice.max > 0) {
          products = products?.filter(
            (el) => el.price >= formatPrice.min && el.price <= formatPrice.max
          );
        } else if (formatPrice.min <= 0 && formatPrice.max > 0) {
          products = products?.filter((el) => el.price <= formatPrice.max);
        }
        return products;
      } else if (category && !sub_category && !purposes) {
        products = await Product.findAndCountAll({
          where: { category: category },
          include: [
            {
              model: Comments,
              include: [
                { model: Date },
                { model: User, include: { model: UserInfo } },
              ],
            },
            { model: UserCommunication },
            { model: Purpose, include: { model: Product }, as: "purpose" },
            { model: Characteristics, as: "characteristics" },
          ],
        });
        if (keyword && keyword !== "") {
          products = products?.rows?.filter((el) =>
            String(el.title).toLowerCase().includes(keyword?.toLowerCase())
          );
        }
        if (Number(formatPrice?.min) > 0 && !Number(formatPrice?.max) > 0) {
          products = products?.rows?.filter(
            (el) => el.price >= formatPrice?.min
          );
        } else if (formatPrice.min > 0 && formatPrice.max > 0) {
          products = products?.rows?.filter(
            (el) => el.price >= formatPrice.min && el.price <= formatPrice.max
          );
        } else if (formatPrice.min <= 0 && formatPrice.max > 0) {
          products = products?.rows?.filter(
            (el) => el.price <= formatPrice.max
          );
        }
        return products;
      } else if (category && sub_category && !purposes) {
        products = await Product.findAll({
          where: { category: category, sub_category: sub_category },
          include: [
            {
              model: Comments,
              include: [
                { model: Date },
                { model: User, include: { model: UserInfo } },
              ],
            },
            { model: UserCommunication },
            { model: Purpose, include: { model: Product }, as: "purpose" },
            { model: Characteristics, as: "characteristics" },
          ],
        });
        if (keyword && keyword !== "") {
          products = products.filter((el) =>
            String(el.title).toLowerCase().includes(keyword.toLowerCase())
          );

          if (Number(formatPrice?.min) > 0 && !Number(formatPrice?.max) > 0) {
            products = products?.filter((el) => el.price >= formatPrice.min);
          } else if (formatPrice.min > 0 && formatPrice.max > 0) {
            products = products?.filter(
              (el) => el.price >= formatPrice.min && el.price <= formatPrice.max
            );
          } else if (formatPrice.min <= 0 && formatPrice.max > 0) {
            products = products?.filter((el) => el.price <= formatPrice.max);
          }

          return products;
        }
      } else if (category && sub_category && purposes) {
        products = await Product.findAll({
          where: { category: category, sub_category: sub_category },
          include: [
            {
              model: Comments,
              include: [
                { model: Date },
                { model: User, include: { model: UserInfo } },
              ],
            },
            { model: UserCommunication },
            { model: Purpose, include: { model: Product }, as: "purpose" },
            { model: Characteristics, as: "characteristics" },
          ],
        });

        if (keyword && keyword !== "") {
          products = products.filter((el) =>
            String(el.title).toLowerCase().includes(keyword.toLowerCase())
          );
        }

        if (Number(formatPrice?.min) > 0 && !Number(formatPrice?.max) > 0) {
          products = products?.filter((el) => el.price >= formatPrice.min);
        } else if (formatPrice.min > 0 && formatPrice.max > 0) {
          products = products?.filter(
            (el) => el.price >= formatPrice.min && el.price <= formatPrice.max
          );
        } else if (formatPrice.min <= 0 && formatPrice.max > 0) {
          products = products?.filter((el) => el.price <= formatPrice.max);
        }

        const buffer = [];
        for (let i = 0; i < products.length; i++) {
          for (let j = 0; j < products[i].purpose.length; j++) {
            if (purposes.includes(products[i].purpose[j].name)) {
              buffer.push(products[i]);
              break;
            }
          }
        }
        return buffer;
      } else if (category && purposes && !sub_category) {
        products = await Product.findAll({
          where: { category: category },
          include: [
            {
              model: Comments,
              include: [
                { model: Date },
                { model: User, include: { model: UserInfo } },
              ],
            },
            { model: UserCommunication },
            { model: Purpose, include: { model: Product }, as: "purpose" },
            { model: Characteristics, as: "characteristics" },
          ],
        });
        if (keyword && keyword !== "") {
          products = products.filter((el) =>
            String(el.title).toLowerCase().includes(keyword.toLowerCase())
          );
        }
        if (Number(formatPrice?.min) > 0 && !Number(formatPrice?.max) > 0) {
          products = products?.filter((el) => el.price >= formatPrice.min);
        } else if (formatPrice.min > 0 && formatPrice.max > 0) {
          products = products?.filter(
            (el) => el.price >= formatPrice.min && el.price <= formatPrice.max
          );
        } else if (formatPrice.min <= 0 && formatPrice.max > 0) {
          products = products?.filter((el) => el.price <= formatPrice.max);
        }
        const buffer = [];
        for (let i = 0; i < products.length; i++) {
          for (let j = 0; j < products[i].purpose.length; j++) {
            if (purposes.includes(products[i].purpose[j].name)) {
              buffer.push(products[i]);
              break;
            }
          }
        }
        return buffer;
      }

      return products;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }
  async getProductById(id) {
    try {
      const product = await Product.findOne({
        include: [
          {
            model: Comments,
            include: [
              { model: Date },
              { model: User, include: { model: UserInfo } },
            ],
          },
          { model: UserCommunication },
          { model: Purpose, include: { model: Product }, as: "purpose" },
          { model: Characteristics, as: "characteristics" },
        ],
        where: { id },
      });
      return product;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }
  async updateComunicationByProductId({ name, id }) {
    try {
      const record = await UserCommunication.findOne({
        where: { productId: id, name: name },
      });
      if (name === "views") {
        await UserCommunication.update(
          { amount: record.amount + 1 },
          { where: { productId: id, name: "views" } }
        );
        const data = await Product.findOne({
          include: [
            {
              model: Comments,
              include: [
                { model: Date },
                { model: User, include: { model: UserInfo } },
              ],
            },
            { model: UserCommunication },
            { model: Purpose, include: { model: Product }, as: "purpose" },
            { model: Characteristics, as: "characteristics" },
          ],
          where: { id: id },
        });
        return data;
      }

      const operation = record.isActive ? record.amount - 1 : record.amount + 1;

      if (name === "dislikes") {
        const like = await UserCommunication.findOne({
          where: { productId: id, name: "likes" },
        });
        if (like.isActive) {
          const likeOp = like.amount - 1;
          await UserCommunication.update(
            { amount: likeOp, isActive: false },
            { where: { productId: id, name: "likes" } }
          );
        }
      } else if (name === "likes") {
        const dislike = await UserCommunication.findOne({
          where: { productId: id, name: "dislikes" },
        });
        if (dislike.isActive) {
          const dislikeOp = dislike.amount - 1;
          await UserCommunication.update(
            { amount: dislikeOp, isActive: false },
            { where: { productId: id, name: "dislikes" } }
          );
        }
      } else if (name === "favorites") {
        const favor = await UserCommunication.findOne({
          where: { productId: id, name: "favorites" },
        });
        if (favor.isActive) {
          const fav = favor.amount - 1;
          await UserCommunication.update(
            { amount: fav, isActive: false },
            { where: { productId: id, name: "favorites" } }
          );
        }
      }
      await UserCommunication.update(
        { amount: operation, isActive: !record.isActive },
        { where: { productId: id, name: name } }
      );
      const data = await Product.findOne({
        include: [
          {
            model: Comments,
            include: [
              { model: Date },
              { model: User, include: { model: UserInfo } },
            ],
          },
          { model: UserCommunication },
          { model: Purpose, include: { model: Product }, as: "purpose" },
          { model: Characteristics, as: "characteristics" },
        ],
        where: { id: id },
      });

      return data;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }
  async addToFavorite(data) {
    try {
      console.error("Removing ... ");
      const { productId, userId } = data;

      const favItems = await FavoriteList.findAll({
        where: { productId, userId },
      }); // check

      await FavoriteList.create({ productId, userId });

      const user = await Product.findAll({
        include: [{ model: User, where: { id: userId } }, { all: true }],
      });
      return user;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async removeFromFavorite({ data }) {
    try {
      const { productId, userId } = data;
      await FavoriteList.destroy({
        where: { productId: productId, userId: userId },
      });

      const user = await Product.findAll({
        include: [{ model: User, where: { id: userId } }, { all: true }],
      });
      return user;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }
  async getFavorList({ id }) {
    try {
      const user = await Product.findAll({
        include: [{ model: User, where: { id: id } }, { all: true }],
      });
      return user;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async addComments(data) {
    try {
      const { day, month, year, minute, hour } = data.comment.date;
      const { textMessage } = data.comment;
      const { userId, productId } = data;
      const date = await Date.create({ day, month, year, min: minute, hour });
      const comments = await Comments.create({
        message: textMessage,
        dateId: date.id,
        userId,
        productId,
      });
      const product = await Product.findOne({
        include: { all: true },
        where: { id: productId },
      });
      return await Product.findAll({
        include: [
          {
            model: Comments,
            include: [
              { model: Date },
              { model: User, include: { model: UserInfo } },
            ],
          },
          { model: UserCommunication },
          { model: Purpose, include: { model: Product }, as: "purpose" },
          { model: Characteristics, as: "characteristics" },
        ],
      });
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async getComments({ id }) {
    try {
      const results = await Product.findAll({
        include: [
          {
            model: Comments,
            include: [
              { model: Date },
              { model: User, include: { model: UserInfo } },
            ],
          },
          { model: UserCommunication },
          { model: Purpose, include: { model: Product }, as: "purpose" },
          { model: Characteristics, as: "characteristics" },
        ],
      });

      return results;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async deleteComment({ id }) {
    try {
      await Comments.destroy({ where: { id: id }, cascade: true });
      return await Product.findAll({
        include: [
          {
            model: Comments,
            include: [
              { model: Date },
              { model: User, include: { model: UserInfo } },
            ],
          },
          { model: UserCommunication },
          { model: Purpose, include: { model: Product }, as: "purpose" },
          { model: Characteristics, as: "characteristics" },
        ],
      });
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }
  async updateProductInfo({
    description,
    id,
    charactersValue,
    charactersKey,
    title,
    price,
    newImage,
    discountPrice,
  }) {
    try {
      if (description && description !== "")
        await Product.update({ full_info: description }, { where: { id } });

      if (charactersKey && charactersValue) {
        await Characteristics.update(
          { info: charactersValue },
          { where: { productId: id, name: charactersKey } }
        );
      }

      if (title) await Product.update({ title: title }, { where: { id } });
      if (price && !discountPrice)
        await Product.update({ price: price }, { where: { id } });
   
        console.log(price,discountPrice);
      if (price && discountPrice >= 0)
    {
        await Product.update(
          {
            price: price,
            discountPrice: discountPrice,
            discount: discountPrice > 0 ? true : false,
          },
          { where: { id: id } }
        );}

      return await Product.findAll({
        include: [
          {
            model: Comments,
            include: [
              { model: Date },
              { model: User, include: { model: UserInfo } },
            ],
          },
          { model: UserCommunication },
          { model: Purpose, include: { model: Product }, as: "purpose" },
          { model: Characteristics, as: "characteristics" },
        ],
      });
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }
  async removeProductInfo({ charactersKey, id, imageId }) {
    try {
      if (charactersKey && id)
        await Characteristics.destroy({
          where: { productId: id, name: charactersKey },
        });

      if (id && imageId) {
        const product = await Product.findOne({ where: { id } });
        await Product.update(
          {
            images: JSON.stringify(
              JSON.parse(product.images).filter((el) => el !== imageId)
            ),
          },
          { where: { id } }
        );
      }

      return await Product.findAll({
        include: [
          {
            model: Comments,
            include: [
              { model: Date },
              { model: User, include: { model: UserInfo } },
            ],
          },
          { model: UserCommunication },
          { model: Purpose, include: { model: Product }, as: "purpose" },
          { model: Characteristics, as: "characteristics" },
        ],
      });
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }
  async addProductInfo({ id, fileName }) {
    try {
      const productId = JSON.parse(id);
      if (productId && fileName) {
        const product = await Product.findOne({ where: { id: productId } });
        const images = [...JSON.parse(product.images), fileName];
        await Product.update(
          { images: JSON.stringify(images) },
          { where: { id: productId } }
        );
      }

      return await Product.findAll({
        include: [
          {
            model: Comments,
            include: [
              { model: Date },
              { model: User, include: { model: UserInfo } },
            ],
          },
          { model: UserCommunication },
          { model: Purpose, include: { model: Product }, as: "purpose" },
          { model: Characteristics, as: "characteristics" },
        ],
      });
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async addChar({ key, value, id }) {
    try {
      if (key && value && id)
        await Characteristics.create({ name: key, info: value, productId: id });

      return await Product.findAll({
        include: [
          {
            model: Comments,
            include: [
              { model: Date },
              { model: User, include: { model: UserInfo } },
            ],
          },
          { model: UserCommunication },
          { model: Purpose, include: { model: Product }, as: "purpose" },
          { model: Characteristics, as: "characteristics" },
        ],
      });
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async deleteById({ id }) {
    try {
      await Product.destroy({ where: { id: id }, cascade: true });

      return await Product.findAll({
        include: [
          {
            model: Comments,
            include: [
              { model: Date },
              { model: User, include: { model: UserInfo } },
            ],
          },
          { model: UserCommunication },
          { model: Purpose, include: { model: Product }, as: "purpose" },
          { model: Characteristics, as: "characteristics" },
        ],
      });
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}

module.exports = new ProductService();
