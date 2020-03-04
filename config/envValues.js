var envVariables = require("./envConfig.json");

function getVariablesForCurrentEnv() {
    var node_env = process.env.NODE_ENV || 'local';
    return envVariables[node_env];
}

module.exports = getVariablesForCurrentEnv();