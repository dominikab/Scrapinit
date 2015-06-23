var Sequelize = require("sequelize");
var dbConfig = require("./dbConfig");

var sequelize = dbConfig.connect('./db/db.sqlite');
var schemas = dbConfig.createSchemas(sequelize, true);

/**
  * Export the differents models
**/

var User = schemas.User;
var Url = schemas.Url;
var UserUrl = schemas.UserUrl;
