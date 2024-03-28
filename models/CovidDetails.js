import mongoose from "mongoose";
const MAX_VACCINE_DATES = 4;

const covidDetailsSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  vaccineDates: [
    {
      date: { type: Date },
      manufacturer: { type: String },
    },
  ],
  positiveResultDate: { type: Date },
  recoveryDate: { type: Date },
  isVaccinated: { type: Boolean, default: false, required: true },
});

covidDetailsSchema.path("recoveryDate").validate(function (value) {
  return !this.positiveResultDate || value > this.positiveResultDate;
}, "Recovery date must be after positive result date.");

covidDetailsSchema.path("vaccineDates").validate(function (value) {
  return value.length <= MAX_VACCINE_DATES;
}, `Maximum of ${MAX_VACCINE_DATES} vaccine dates allowed.`);

covidDetailsSchema.pre("save", function (next) {
  if (this.isModified("vaccineDates") && this.vaccineDates.length > 0) {
    this.isVaccinated = true;
  }
  next();
});

const CovidDetails = mongoose.model("CovidDetails", covidDetailsSchema);

export { CovidDetails, MAX_VACCINE_DATES };
