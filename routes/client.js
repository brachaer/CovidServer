import express from "express";

const router = express.Router();

import {
  getAll,
  getClientById,
  addClient,
  deleteClient,
  updateClient,
} from "../controllers/client.js";

router.route("/").get(getAll).post(addClient);

router
  .route("/:id")
  .get(getClientById)
  .patch(updateClient)
  .delete(deleteClient);

export default router;
