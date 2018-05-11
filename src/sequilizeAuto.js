import SequelizeAuto from 'sequelize-auto';

import {dbName, dbUsername, dbPassword, sequilizeConfig} from './db';


const sequilizeAutoConfig = {
	...sequilizeConfig,
	directory: `${__dirname}/sequilizeModels`
};

const sequelizeAuto = new SequelizeAuto(dbName, dbUsername, dbPassword, sequilizeAutoConfig);

sequelizeAuto.run(function (err) {
	if (err) throw err;
	
	console.log(sequelizeAuto.tables); // table list
	console.log(sequelizeAuto.foreignKeys); // foreign key list
});


