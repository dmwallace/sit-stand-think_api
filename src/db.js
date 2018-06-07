import Sequelize from 'sequelize';

let dbLocation = `./db/sit_stand_think.sqlite`;
console.log("dbLocation", dbLocation);

export const dbName = 'main';
export const dbUsername = '';
export const dbPassword = '';

export const sequilizeConfig = {
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


export const sequelize = new Sequelize(dbName, dbUsername, dbPassword, sequilizeConfig);
export default sequelize;

require('./sequilizeModels')(sequelize);

/*Object.values(models).forEach((model) => {
	model.sync({force: true})
});*/
