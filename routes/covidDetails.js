import express from "express";

const router = express.Router();

import {
  getActivePositives,
  getAllVaccinated,
  addVaccine,
  addCovidDetails,
  getById,
  addResultandRecovery,
} from "../controllers/covidDetails.js";

router.route("/positive").get(getActivePositives);
router.route("/positive/:clientId").patch(addResultandRecovery);
router.route("/vaccine").get(getAllVaccinated);
router.route("/vaccine/:clientId").patch(addVaccine);
router.route("/:clientId").get(getById);
router.route("/").post(addCovidDetails);

export default router;
