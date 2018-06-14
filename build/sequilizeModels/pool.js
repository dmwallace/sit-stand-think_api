'use strict';

/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('pool', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true, autoIncrement: true, unique: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		deck_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
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
		order: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'pool'
	});
};
//# sourceMappingURL=pool.js.map