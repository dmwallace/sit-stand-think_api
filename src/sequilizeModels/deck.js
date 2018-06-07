/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('deck', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true, autoIncrement: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'deck'
	});
};
