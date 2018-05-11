import Sequelize from 'sequelize';

let dbLocation = `${__dirname}/../../db/sit_stand_think.sqlite`;
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


const sequelize = new Sequelize(dbName, dbUsername, dbPassword, sequilizeConfig);

sequelize.authenticate()
.then(() => {
	console.log('Connection has been established successfully.');
})
.catch(err => {
	console.error('Unable to connect to the database:', err);
});

require('./sequilizeModels')(sequelize);

/*Object.values(models).forEach((model) => {
	model.sync({force: true})
});*/

console.log("sequelize.models", sequelize.models);
sequelize.models.decks.findAll().then((decks)=>{
	console.log("decks", decks);
})
