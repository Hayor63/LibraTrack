import { Router } from "express";
import authenticateUser from "../../../middleware/authenticateUser";
import { CategorySchema, deleteSingleCategorySchema, getSingleCategorySchema, updateCategorySchema } from "../../../validationSchema/category";
import validate from "../../../middleware/validate";
import createCategoryHandler from "./create";
import authorizedRoles from "../../../middleware/role";
import getAllCategoriesHandler from "./getAll";
import deleteCategoryHandler from "./delete";
import updateCategoryHandler from "./update";
import getSingleCategoryHandler from "./getById";

const categoryRoutes = Router()


categoryRoutes.post(
    "/",
    authenticateUser,
    authorizedRoles("admin"),
    validate(CategorySchema),
    createCategoryHandler
  );

//get ALl Categories
categoryRoutes.get(
    "/",
    authenticateUser,
    getAllCategoriesHandler
  );  

//delete Category
categoryRoutes.delete(
    "/:id",
    authenticateUser,
    authorizedRoles("admin"),
    validate(deleteSingleCategorySchema),
    deleteCategoryHandler
  );

  //update Category
categoryRoutes.patch(
    "/:id",
    authenticateUser,
    authorizedRoles("admin"),
    validate(updateCategorySchema),
    updateCategoryHandler
  );

  //get single Category
categoryRoutes.get(
    "/:id",
    authenticateUser,
    validate(getSingleCategorySchema),
    getSingleCategoryHandler
  );
  
  export default categoryRoutes;