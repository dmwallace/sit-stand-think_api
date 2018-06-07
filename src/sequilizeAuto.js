import SequelizeAuto from 'sequelize-auto';
import fs from 'fs';
import {dbName, dbUsername, dbPassword, sequilizeConfig} from './db';

const pathToModels = `${__dirname}/sequilizeModels`;

const sequilizeAutoConfig = {
	...sequilizeConfig,
	directory: pathToModels
};

const sequelizeAuto = new SequelizeAuto(dbName, dbUsername, dbPassword, sequilizeAutoConfig);


sequelizeAuto.run(function (err) {
	if (err) throw err;
	
	console.log(sequelizeAuto.tables); // table list
	console.log(sequelizeAuto.foreignKeys); // foreign key list
}).then(()=>{

});


