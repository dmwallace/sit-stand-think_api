'use strict';

/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('card', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true, autoIncrement: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		image: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		deck_id: {
			type: DataTypes.INTEGER,
			allowNull: false
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
		tableName: 'card'
	});
};
//# sourceMappingURL=card.js.map