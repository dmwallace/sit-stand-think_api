import express from 'express';
import cors from 'cors';
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express';
import bodyParser from 'body-parser';
import {apolloUploadExpress} from 'apollo-upload-server'

const playground = require('graphql-playground-middleware-express').default;

import schema from './graphqlData/schema';

const GRAPHQL_PORT = 4000;

const helperMiddleware = [
	bodyParser.json(),
	bodyParser.text({type: 'application/graphql'}),
	(req, res, next) => {
		if (req.is('application/graphql')) {
			req.body = {query: req.body};
		}
		
		console.log("body", JSON.stringify(req.body));
		next();
	},
	apolloUploadExpress(/* Options */),
];

const graphQLServer = express();
graphQLServer.use(cors());
graphQLServer.use('/assets', express.static('./assets'));
graphQLServer.use('/graphql', ...helperMiddleware, graphqlExpress({schema}));
graphQLServer.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
graphQLServer.use('/playground', playground({endpoint: '/graphql'}));

graphQLServer.listen(GRAPHQL_PORT, () =>
	console.log(
		`GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
	)
);