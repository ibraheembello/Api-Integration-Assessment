import { Request, Response, NextFunction } from "express";
import { GenderizeService } from "../services/genderize.service";

export class ClassifyController {
  constructor(private genderizeService: GenderizeService) {}

  public handleClassification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { name } = req.query;

      const processedData = await this.genderizeService.classifyName(name as string);

      res.status(200).json({
        status: "success",
        data: processedData,
      });
    } catch (error) {
      next(error);
    }
  };
}
