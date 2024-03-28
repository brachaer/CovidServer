import { MAX_VACCINE_DATES } from "../models/CovidDetails.js";
import { createCustomError } from "../errors/customError.js";

function validateVaccineDates(vaccineDates, next) {
  if (vaccineDates.length > MAX_VACCINE_DATES) {
    return next(
      createCustomError(
        `Maximum of ${MAX_VACCINE_DATES} vaccine dates allowed`,
        400
      )
    );
  }
}

export default validateVaccineDates;
