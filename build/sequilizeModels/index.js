'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let models = _fs2.default.readdirSync(`${__dirname}`).reduce((accumulator, file) => {
	let regex = /(?:(.*)\.([^.]+))?$/;
	let regexResults = regex.exec(file);

	let name = regexResults[1];
	let extension = regexResults[2];

	if (extension.toLowerCase() === 'js' && name.toLowerCase() !== 'index') {
		accumulator.push({
			modelName: name,
			importFunction: require(`./${file}`)
		});
	}

	return accumulator;
}, []);

module.exports = function (sequelize) {
	models.forEach(({ modelName, importFunction }) => {
		sequelize.import(modelName, importFunction);
	});

	return sequelize.models;
};
//# sourceMappingURL=index.js.map