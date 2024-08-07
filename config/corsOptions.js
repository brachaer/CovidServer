const whitelist = ["https://covidmanager.onrender.com"];
const corsOptionsConfig = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

export default corsOptionsConfig;
