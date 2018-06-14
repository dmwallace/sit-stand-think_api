'use strict';

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _graphqlSequelizeCrud = require('graphql-sequelize-crud');

var _db = require('./db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const express = require('express');

const playground = require('graphql-playground-middleware-express').default;

const app = express();

_db.sequelize.authenticate().then(() => {
	console.log('Database connection has been established successfully.');

	const schema = (0, _graphqlSequelizeCrud.getSchema)(_db.sequelize);

	app.use('/graphql', (0, _expressGraphql2.default)({
		schema,
		graphiql: true
	}));

	app.use('/playground', playground({ endpoint: '/graphql' }));

	const port = 4001;
	app.listen(port, () => {
		// tslint:disable-next-line:no-console
		console.log(`Listening on port ${port}`);
	});
}).catch(err => {
	console.error('Unable to connect to the database:', err);
});
//# sourceMappingURL=graphqlCrudGeneratorServer.js.map