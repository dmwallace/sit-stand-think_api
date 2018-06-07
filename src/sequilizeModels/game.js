/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('game', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true, autoIncrement: true
		},
		class_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'class',
				key: 'id'
			}
		},
		instructions: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		pool_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		deck_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'deck',
				key: 'id'
			}
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		level: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'game'
	});
};
