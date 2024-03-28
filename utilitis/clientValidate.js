import { Client, ID_NUMBER_LENGTH } from "../models/Client.js";
import mongoose from "mongoose";
import { createCustomError } from "../errors/customError.js";

function validateClientId(clientId, next) {
  const isIdValid = mongoose.Types.ObjectId.isValid(clientId);
  if (!isIdValid) {
    return next(
      createCustomError(`client Id ${clientId} format not supported`, 400)
    );
  }
}

function validatePersonalInfo(personalInfo, next) {
  const requiredFields = [
    "firstName",
    "lastName",
    "IDNumber",
    "dateOfBirth",
    "phone",
  ];
  for (const field of requiredFields) {
    if (!personalInfo || personalInfo[field] === undefined) {
      return next(createCustomError(`Missing required field: ${field}`, 400));
    }
  }
}

function validatePersonalField(personalFieldKey, personalFieldValue, next) {
  if (!personalFieldKey || personalFieldValue === undefined) {
    return next(
      createCustomError(`Missing required field: ${personalFieldKey}`, 400)
    );
  }
}

async function validateIDNumber(IDNumber, next) {
  if (IDNumber.length !== ID_NUMBER_LENGTH) {
    return next(
      createCustomError(`ID Number Should have ${ID_NUMBER_LENGTH} digits`, 400)
    );
  }
  const existingClient = await Client.findOne({
    "personalInfo.IDNumber": IDNumber,
  });
  if (existingClient) {
    return next(
      createCustomError(`ID Number ${IDNumber} is already in use`, 400)
    );
  }
}

export {
  validateClientId,
  validateIDNumber,
  validatePersonalInfo,
  validatePersonalField,
};
