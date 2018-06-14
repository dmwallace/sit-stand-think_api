'use strict';

/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('class', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true, autoIncrement: true
		},
		name: {
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
		tableName: 'class'
	});
};
//# sourceMappingURL=class.js.map