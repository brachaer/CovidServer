import asyncWrapper from "../middleware/async.js";
import { CovidDetails } from "../models/CovidDetails.js";
import { createCustomError } from "../errors/customError.js";
import validateVaccineDates from "../utilitis/covidValidate.js";
import { validateClientId } from "../utilitis/clientValidate.js";
import { startOfMonth, endOfMonth, format } from "date-fns";

const getAllVaccinated = asyncWrapper(async (req, res, next) => {
  const vaccinated = await CovidDetails.find({ isVaccinated: true });
  res.json({ vaccinated });
});

const getActivePositives = asyncWrapper(async (req, res, next) => {
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const result = await CovidDetails.aggregate([
    {
      $match: {
        positiveResultDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$positiveResultDate" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const activeClientsByDay = result.map(({ _id, count }) => ({
    date: _id,
    count,
  }));

  res.json(activeClientsByDay);
});

const addCovidDetails = asyncWrapper(async (req, res, next) => {
  const covid = await CovidDetails.create(req.body);
  res.status(201).json({ covid });
});

const getById = asyncWrapper(async (req, res, next) => {
  const { clientId } = req.params;
  validateClientId(clientId);
  const covidDetails = await CovidDetails.findOne({ clientId });
  if (!covidDetails) {
    return next(createCustomError(`client id ${clientId} not found`, 404));
  }
  res.json({ covidDetails });
});

const addVaccine = asyncWrapper(async (req, res, next) => {
  const { clientId } = req.params;
  validateClientId(clientId);

  const { date, manufacturer } = req.body;
  const covidDetails = await CovidDetails.findOne({ clientId });
  if (!covidDetails) {
    return next(createCustomError(`client id ${clientId} not found`, 404));
  }
  validateVaccineDates(req.body);
  
  covidDetails.vaccineDates.push({ date, manufacturer });

  await covidDetails.save();

  res.json({ covidDetails });
});

const addResultandRecovery = asyncWrapper(async (req, res, next) => {
  const { clientId } = req.params;
  validateClientId(clientId);

  const client = await CovidDetails.findOne({ clientId });
  if (!client) {
    return next(createCustomError(`client id ${clientId} not found`, 404));
  }

  let covidDetails = await CovidDetails.findOne({ clientId });

  if (!covidDetails) {
    covidDetails = await CovidDetails.create({ clientId });
  }

  if (req.body.positiveResultDate) {
    covidDetails.positiveResultDate = req.body.positiveResultDate;
  }

  if (req.body.recoveryDate) {
    covidDetails.recoveryDate = req.body.recoveryDate;
  }

  await covidDetails.save();

  res.json({ covidDetails });
});
export {
  getActivePositives,
  getAllVaccinated,
  addVaccine,
  addCovidDetails,
  getById,
  addResultandRecovery,
};
