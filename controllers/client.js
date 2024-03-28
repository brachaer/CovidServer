import asyncWrapper from "../middleware/async.js";
import { Client } from "../models/Client.js";
import { CovidDetails } from "../models/CovidDetails.js";
import { createCustomError } from "../errors/customError.js";
import {
  validateClientId,
  validateIDNumber,
  validatePersonalInfo,
  validatePersonalField,
} from "../utilitis/clientValidate.js";

const getAll = asyncWrapper(async (req, res, next) => {
  const clients = await Client.find({}).sort({ "personalInfo.lastName": 1 });
  res.json({ clients });
});

const addClient = asyncWrapper(async (req, res, next) => {
  await validateIDNumber(req.body.personalInfo["IDNumber"]);
  validatePersonalInfo(req.body.personalInfo);
  const client = await Client.create({
    personalInfo: req.body.personalInfo,
  });
  const covidDetails = await CovidDetails.create({
    clientId: client._id,
    vaccineDates: [],
    isVaccinated: false,
  });
  res.status(201).json({ client, covidDetails });
});

const getClientById = asyncWrapper(async (req, res, next) => {
  const clientId = req.params.id;
  validateClientId(clientId, next);
  const client = await Client.findOne({ _id: clientId });
  if (!client) {
    return next(createCustomError(`client id ${clientId} not found`, 404));
  }
  return res.json({ client });
});

const deleteClient = asyncWrapper(async (req, res, next) => {
  const clientId = req.params.id;
  validateClientId(clientId, next);
  await CovidDetails.deleteMany({ clientId });
  const deletedClient = await Client.findOneAndDelete({ _id: clientId });
  if (!deletedClient) {
    return next(createCustomError(`client id ${clientId} not found`, 404));
  }
  return res.json({ deletedClient });
});

const updateClient = asyncWrapper(async (req, res, next) => {
  const clientId = req.params.id;
  const { personalInfo, covidDetails } = req.body;

  validateClientId(clientId, next);
  const existingClient = await Client.findById(clientId);
  if (!existingClient) {
    return next(createCustomError(`Client with id ${clientId} not found`, 404));
  }

  const updatedFields = {};
  if (personalInfo) {
    if (Object.keys(personalInfo).length > 0) {
      Object.entries(personalInfo).forEach(([key, value]) => {
        if (existingClient.personalInfo.hasOwnProperty(key)) {
          const validationError = validatePersonalField(key, value, next);
          if (validationError) {
            return next(validationError);
          }
          updatedFields[`personalInfo.${key}`] = value;
        }
      });
    }
  }

  const updatedClient = await Client.findByIdAndUpdate(
    clientId,
    updatedFields,
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(updatedClient);
  if (!updatedClient) {
    return next(createCustomError(`Client with id ${clientId} not found`, 404));
  }

  return res.json({ updatedClient });
});

export { getAll, getClientById, addClient, deleteClient, updateClient };
