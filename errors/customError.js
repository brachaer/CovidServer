class CustomAPIError extends Error {
    constructor(message,statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
};

const createCustomError =(message,statusCode) =>{
    console.log(message);
    console.log(statusCode);
    return new CustomAPIError(message,statusCode);
};

export  {createCustomError, CustomAPIError};