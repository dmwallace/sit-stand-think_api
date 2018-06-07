/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('pool_cards', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true, autoIncrement: true
		},
		pool_id: {
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
		tableName: 'pool_cards'
	});
};
