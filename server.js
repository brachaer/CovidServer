import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import corsOptionsConfig from "./config/corsOptions.js";
import notFound from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import clientRouter from "./routes/client.js";
import covidRouter from "./routes/covidDetails.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors(corsOptionsConfig));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/covid", covidRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    const CONN = process.env.CONN;

    if (!CONN) {
      throw new Error(
        "Connection string (CONN) is not defined in the environment variables."
      );
    }

    await mongoose.connect(CONN);
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();
