//Defining Environments

var enviroments = {};


//staging environment
enviroments.staging = {
    'httpPort':3000,
    'httpsPort':3001,
    'envName':'staging'
};

//production environment
enviroments.production = {
    'httpPort':5000,
    'httpsPort':5001,
    'envName':'production'
};


//determint the environment passed on the command-line arguement

var currentEnv = typeof(process.env.NODE_ENV) == 'string'? process.env.NODE_ENV.toLowerCase():'';


var envToExport = typeof(enviroments[currentEnv]) == 'object'? enviroments[currentEnv]:enviroments.staging;


module.exports = envToExport;