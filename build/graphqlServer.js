'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _apolloServerExpress = require('apollo-server-express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _apolloUploadServer = require('apollo-upload-server');

var _schema = require('./graphqlData/schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const playground = require('graphql-playground-middleware-express').default;

const GRAPHQL_PORT = 4000;

const helperMiddleware = [_bodyParser2.default.json(), _bodyParser2.default.text({ type: 'application/graphql' }), (req, res, next) => {
	if (req.is('application/graphql')) {
		req.body = { query: req.body };
	}

	console.log("body", JSON.stringify(req.body));
	next();
}, (0, _apolloUploadServer.apolloUploadExpress)()];

const graphQLServer = (0, _express2.default)();
graphQLServer.use((0, _cors2.default)());
graphQLServer.use('/assets', _express2.default.static('./assets'));
graphQLServer.use('/graphql', ...helperMiddleware, (0, _apolloServerExpress.graphqlExpress)({ schema: _schema2.default }));
graphQLServer.use('/graphiql', (0, _apolloServerExpress.graphiqlExpress)({ endpointURL: '/graphql' }));
graphQLServer.use('/playground', playground({ endpoint: '/graphql' }));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(`GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`));
//# sourceMappingURL=graphqlServer.js.map