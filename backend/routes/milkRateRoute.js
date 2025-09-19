import express from "express";
import {
  createMilkRate,
  getMilkRates,
  getMilkRateById,
  updateMilkRate,
  deleteMilkRate,
} from "../controllers/milkRateController.js";

const router = express.Router();

router.post("/", createMilkRate);
router.get("/", getMilkRates);
router.get("/:id", getMilkRateById);
router.put("/:id", updateMilkRate);
router.delete("/:id", deleteMilkRate);

export default router;
