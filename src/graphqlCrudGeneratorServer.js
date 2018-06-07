'use strict';

const express = require('express');
import graphqlHTTP from 'express-graphql';
const playground = require('graphql-playground-middleware-express').default;

import {
	getSchema,
	ModelTypes,
} from 'graphql-sequelize-crud';

import {sequelize} from './db';

const app = express();

sequelize.authenticate()
.then(() => {
	console.log('Database connection has been established successfully.');
	
	const schema = getSchema(sequelize);
	
	app.use('/graphql', graphqlHTTP({
		schema,
		graphiql: true
	}));
	
	app.use('/playground', playground({endpoint: '/graphql'}));
	
	const port = 4001;
	app.listen(port, () => {
		// tslint:disable-next-line:no-console
		console.log(`Listening on port ${port}`);
	});
	
}).catch(err => {
	console.error('Unable to connect to the database:', err);
});
