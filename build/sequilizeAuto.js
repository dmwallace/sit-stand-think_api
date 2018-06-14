'use strict';

var _sequelizeAuto = require('sequelize-auto');

var _sequelizeAuto2 = _interopRequireDefault(_sequelizeAuto);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _db = require('./db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pathToModels = `${__dirname}/sequilizeModels`;

const sequilizeAutoConfig = Object.assign({}, _db.sequilizeConfig, {
	directory: pathToModels
});

const sequelizeAuto = new _sequelizeAuto2.default(_db.dbName, _db.dbUsername, _db.dbPassword, sequilizeAutoConfig);

sequelizeAuto.run(function (err) {
	if (err) throw err;

	console.log(sequelizeAuto.tables); // table list
	console.log(sequelizeAuto.foreignKeys); // foreign key list
}).then(() => {});
//# sourceMappingURL=sequilizeAuto.js.map