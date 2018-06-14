'use strict';

/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('game_cards_stand', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true, autoIncrement: true
		},
		game_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		card_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'card',
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
		}
	}, {
		tableName: 'game_cards_stand'
	});
};
//# sourceMappingURL=game_cards_stand.js.map