import { Router } from "express";
import { ClassifyController } from "../controllers/classify.controller";

const router = Router();

// Mount the controller method to the GET /api/classify route
router.get("/classify", ClassifyController.handleClassification);

export default router;
