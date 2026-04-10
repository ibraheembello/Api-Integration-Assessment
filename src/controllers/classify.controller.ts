import { Request, Response } from "express";
import { GenderizeService } from "../services/genderize.service";

export class ClassifyController {
  public static async handleClassification(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { name } = req.query;

      // 400 Bad Request: Missing or empty
      if (!name || String(name).trim() === "") {
        res
          .status(400)
          .json({
            status: "error",
            message: "Missing or empty name parameter",
          });
        return;
      }

      // 422 Unprocessable Entity: Not a string (Array/Object check)
      if (typeof name !== "string") {
        res
          .status(422)
          .json({ status: "error", message: "name must be a string" });
        return;
      }

      const processedData = await GenderizeService.classifyName(name);

      // 200 OK: Success Response
      res.status(200).json({
        status: "success",
        data: processedData,
      });
    } catch (error: any) {
      // Handle Edge Case Error
      if (error.message === "No prediction available for the provided name") {
        res.status(404).json({ status: "error", message: error.message });
        return;
      }

      // Handle 500/502 Upstream errors
      res
        .status(502)
        .json({ status: "error", message: "Upstream or server failure" });
    }
  }
}
