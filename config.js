/**
 * Create and expoert the configuartion variables
 */

//Container for all the environments
var environments = {};

//Staging (default) environment
environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging'
};

//Production environment
environments.production = {
    'httpPort' : 3002,
    'httpsPort' : 3003,
    'envName' : 'production'
};

//Determine which environment was passed as a commandline argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : "";

//Check that the current environment is one of the environments above other wise us staging as the default.
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module
module.exports = environmentToExport;