import express from "express";
import { createProducts, deleteProducts, getFlashDeals, getProducts, updateProducts } from "../controllers/productController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const productRouter  = express.Router();

productRouter.get("/flash-deals", getFlashDeals);
productRouter.get("/",getProducts);
productRouter.get("/:id",getProducts);
productRouter.post("/",auth,admin,createProducts);
productRouter.put("/:id",auth,admin,updateProducts);
productRouter.delete("/:id",auth,admin,deleteProducts);

export default productRouter;