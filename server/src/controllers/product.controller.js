const ApiError = require("../errors/api.errors");
const ProductService = require("../services/product.service");
const uuid = require("uuid");
const path = require("path");

class ProductController {
  async addProduct(req, res, next) {
    try {
      const images = req.files;
      
      if(!images){
        throw  res.status(500).json('Images for product is a required attribut !');
      }
      let bufferFormatImages = [];
      if(Array.isArray(images.files))
      {
        for (let i = 0; i < images.files.length; i++) {
          const fileName = uuid.v4() +'.'+ images.files[i].name.split('.')[1];
          images.files[i].mv(path.resolve(__dirname,'..','..','static',fileName));
          bufferFormatImages.push(fileName);
        }}
        else{
          const fileName = uuid.v4() +'.'+ images.files.name.split('.')[1];
          images.files.mv(path.resolve(__dirname,'..','..','static',fileName));
          bufferFormatImages.push(fileName);
        }
        const data = req.body;
       const product = await ProductService.createProduct({images:bufferFormatImages,data:data});
      return res.json(product);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json(error.message);
    }
  }

  async takeAllProducts(req, res) {
    try {
      const {
        category,
        sub_category,
        price,
        characteristicName_id,
        purposes,
        limit,
        page,
        keyword
      } = req.query;
      
      const products = await ProductService.getProducts({
        category,
        sub_category,
        price,
        characteristicName_id,
        purposes,
        limit,
        page,
        keyword
      });
      return res.status(200).json(products);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json(error);
    }
  }

  async takeById(req, res) {
    try {
      const {id} = req.params;
      const product = await ProductService.getProductById(id);
      return res.status(200).json(product);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json(error);
    }
  }
  async updateComunicationByProductId(req,res){
    try {
     
      const responce = await ProductService.updateComunicationByProductId({...req.body});
      return res.status(200).json(responce);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error);
    }
  }

  async addToFavorite(req,res){
    try {
      const results = await ProductService.addToFavorite(req.body);
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json(error)
    }
  }

  async removeFromFavorite(req,res){
    try {
      
      const list = await ProductService.removeFromFavorite(req.body);
      res.status(200).json(list);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  async getFavorList(req,res){
    try {
      console.error(req.params);
      const results = await ProductService.getFavorList(req.params);
      res.status(200).json(results);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error);
    }
  }
  async addComments(req,res){
    try {
      const results = await ProductService.addComments(req.body);
      res.status(200).json(results);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error);
    }
  }
  async getComments(req,res){
    try {
      const results = await ProductService.getComments(req.params);
      return res.status(200).json(results);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error);
    }
  }
  async deleteComment(req,res){
    try {
      const results = await ProductService.deleteComment(req.params);
      return res.status(200).json(results);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error);
    }
  }

  async updateProductInfo(req,res){
    try {
       const responce = await ProductService.updateProductInfo(req.body);
       res.status(200).json(responce);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error)
    }
  }

  async removeProductInfo(req,res){
    try {
      const responce = await ProductService.removeProductInfo(req.body);
      res.status(200).json(responce);
   } catch (error) {
     console.error(error.message);
     res.status(500).json(error);
   }
  }
 
  async addProductInfo(req,res){
    try {
      const {newImage} = req.files;
      const {id} = req.body;
      const fileName = uuid.v4() +'.'+ newImage.name.split('.')[1];
      newImage.mv(path.resolve(__dirname,'..','..','static',fileName));
      const responce = await ProductService.addProductInfo({fileName,id});
      res.status(200).json(responce);
   } catch (error) {
     console.error(error.message);
     res.status(500).json(error);
   }
  }
  async addChar(req,res){
    try {
      const responce = await ProductService.addChar(req.body);
      res.status(200).json(responce);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error);
    }
  }

  async  deleteById(req,res){
    try {
      const responce = await ProductService.deleteById(req.params);
      res.status(200).json(responce);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error);
    }
  }

 
}

module.exports = new ProductController();
