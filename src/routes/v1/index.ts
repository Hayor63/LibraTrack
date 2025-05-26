import { Router } from "express";
import userRoutes from "./user";
import authRoutes from "./auth";
import bookCreationRoutes from "./bookCreation";
import categoryRoutes from "./category";
import genreRoutes from "./genre";
import bookReservationRoutes from "./bookReservation";
import reviewRatingRoutes from "./reviewRating";
import borrowingRoutes from "./bookBorrowing";
import searchRoutes from "./search";

const router = Router()
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/books", bookCreationRoutes)
router.use("/category", categoryRoutes);
router.use("/genres", genreRoutes);
router.use("/bookReservation", bookReservationRoutes);
router.use("/reviews", reviewRatingRoutes);
router.use("/borrowings", borrowingRoutes);
router.use("/search", searchRoutes)

export default router