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


/**
 * @swagger
 * components:
 *   schemas:
 *     CategorySchema:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the book category
 *           example: Fiction
 *         description:
 *           type: string
 *           description: A description of the book category
 *           example: Stories that contain imaginary events and people

 *     UpdateCategorySchema:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Updated name of the category
 *           example: Science
 *         description:
 *           type: string
 *           description: Updated description of the category
 *           example: Books covering topics like physics, biology, and chemistry

 * /api/v1/category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategorySchema'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized, user needs to be authenticated
 *       403:
 *         description: Forbidden, admin role required

 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all categories
 *       401:
 *         description: Unauthorized, user needs to be authenticated

 * /api/v1/category/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to retrieve
 *     responses:
 *       200:
 *         description: Category details retrieved successfully
 *       401:
 *         description: Unauthorized, user needs to be authenticated
 *       404:
 *         description: Category not found

 *   patch:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategorySchema'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized, user needs to be authenticated
 *       403:
 *         description: Forbidden, admin role required
 *       404:
 *         description: Category not found

 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Category not found
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     CategorySchema:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the book category
 *           example: Fiction
 *         description:
 *           type: string
 *           description: A description of the book category
 *           example: Stories that contain imaginary events and people

 *     UpdateCategorySchema:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Updated name of the category
 *           example: Science
 *         description:
 *           type: string
 *           description: Updated description of the category
 *           example: Books covering topics like physics, biology, and chemistry

 * /api/v1/category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategorySchema'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized, user needs to be authenticated
 *       403:
 *         description: Forbidden, admin role required

 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all categories
 *       401:
 *         description: Unauthorized, user needs to be authenticated

 * /api/v1/category/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to retrieve
 *     responses:
 *       200:
 *         description: Category details retrieved successfully
 *       401:
 *         description: Unauthorized, user needs to be authenticated
 *       404:
 *         description: Category not found

 *   patch:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategorySchema'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized, user needs to be authenticated
 *       403:
 *         description: Forbidden, admin role required
 *       404:
 *         description: Category not found

 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Category not found
 */




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