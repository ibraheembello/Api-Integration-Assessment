import { Router } from "express";
import { ClassifyController } from "../controllers/classify.controller";
import { GenderizeService } from "../services/genderize.service";
import { validate } from "../middleware/validation.middleware";
import { classifySchema } from "../validators/classify.validator";

const router = Router();
const genderizeService = new GenderizeService();
const classifyController = new ClassifyController(genderizeService);

/**
 * @swagger
 * /api/classify:
 *   get:
 *     summary: Classify a name by gender
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name to classify
 *     responses:
 *       200:
 *         description: Successfully classified the name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ProcessedData'
 *       400:
 *         description: Missing or empty name parameter
 *       404:
 *         description: No prediction available for the provided name
 *       422:
 *         description: Invalid name parameter
 *       502:
 *         description: Upstream server failure
 */
router.get(
  "/classify",
  validate(classifySchema),
  classifyController.handleClassification,
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ProcessedData:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         gender:
 *           type: string
 *         probability:
 *           type: number
 *         sample_size:
 *           type: number
 *         is_confident:
 *           type: boolean
 *         processed_at:
 *           type: string
 *           format: date-time
 */
