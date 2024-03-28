import mongoose from "mongoose";

const ID_NUMBER_LENGTH = 9;

const clientSchema = new mongoose.Schema({
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    IDNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return v.length === ID_NUMBER_LENGTH;
        },
        message: (props) =>
          `${props.value} must be a string of length ${ID_NUMBER_LENGTH}!`,
      },
    },
    address: {
      city: { type: String },
      street: { type: String },
      number: { type: String },
    },
    dateOfBirth: { type: Date, required: true },
    phone: { type: String, required: true },
    mobilePhone: { type: String },
    imageUrl: { type: String },
  },

  covidDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CovidDetails",
  },
});

const Client = mongoose.model("Client", clientSchema);

export { Client, ID_NUMBER_LENGTH };
