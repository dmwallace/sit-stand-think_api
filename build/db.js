'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.sequelize = exports.sequilizeConfig = exports.dbPassword = exports.dbUsername = exports.dbName = undefined;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let dbLocation = `./db/sit_stand_think.sqlite`;
console.log("dbLocation", dbLocation);

const dbName = exports.dbName = 'main';
const dbUsername = exports.dbUsername = '';
const dbPassword = exports.dbPassword = '';

const sequilizeConfig = exports.sequilizeConfig = {
	dialect: 'sqlite',
	operatorsAliases: false,

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},

	// SQLite only
	storage: dbLocation
};

const sequelize = exports.sequelize = new _sequelize2.default(dbName, dbUsername, dbPassword, sequilizeConfig);
exports.default = sequelize;


require('./sequilizeModels')(sequelize);

/*Object.values(models).forEach((model) => {
	model.sync({force: true})
});*/
//# sourceMappingURL=db.js.map