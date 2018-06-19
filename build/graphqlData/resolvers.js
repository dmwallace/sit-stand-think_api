'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _apolloUploadServer = require('apollo-upload-server');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _promisesAll = require('promises-all');

var _promisesAll2 = _interopRequireDefault(_promisesAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const uploadDir = './assets/images/cards';

// Ensure upload directory exists
_mkdirp2.default.sync(uploadDir);

const storeFS = ({ stream, filename }) => {
	const id = _shortid2.default.generate();
	const path = `${uploadDir}/${id}-${filename}`;
	const url = `/assets/images/cards/${id}-${filename}`;
	console.log("url", url);
	return new Promise((resolve, reject) => stream.on('error', error => {
		if (stream.truncated)
			// Delete the truncated file
			_fs2.default.unlinkSync(path);
		reject(error);
	}).pipe(_fs2.default.createWriteStream(path)).on('error', error => reject(error)).on('finish', () => resolve({ id, path, url })));
};

const processUpload = async upload => {
	const { stream, filename, mimetype, encoding } = await upload;
	const { id, path, url } = await storeFS({ stream, filename });
	return { url, path, filename };
};

const resolvers = {
	Query: {
		class: (_, { id }) => _db2.default.models.class.findById(id),
		classes: (_, args) => _db2.default.models.class.findAll(),
		deck: (_, { id }) => _db2.default.models.deck.findById(id),
		decks: (_, args) => _db2.default.models.deck.findAll(),
		cards: (_, args) => _db2.default.models.card.findAll({
			where: { deck_id: args.deck_id },
			order: [['order']]
		}),
		pools: (_, args) => _db2.default.models.pool.findAll({
			where: { deck_id: args.deck_id }
		}),
		games: async (_, args) => {
			//console.log("args", args);
			let result = await _db2.default.models.game.findAll({
				where: { deck_id: args.deck_id }
			});

			//console.log("result", result);
			return result;
		}

	},

	Game: {
		standOnCards: async ({ id: game_id }) => {
			//console.log("game_id", game_id);
			_db2.default.models.card.hasMany(_db2.default.models.game_cards_stand, { foreignKey: 'card_id' });
			_db2.default.models.game_cards_stand.belongsTo(_db2.default.models.card, { foreignKey: 'card_id' });

			let cards = await _db2.default.models.card.findAll({
				include: [{
					model: _db2.default.models.game_cards_stand,
					where: { game_id }
				}]
			});

			//console.log("cards", cards);
			return cards;
		}
	},

	Pool: {
		cards: async ({ id: pool_id }) => {
			//console.log("pool_id", pool_id);
			_db2.default.models.card.hasMany(_db2.default.models.pool_cards, { foreignKey: 'card_id' });
			_db2.default.models.pool_cards.belongsTo(_db2.default.models.card, { foreignKey: 'card_id' });

			let cards = await _db2.default.models.card.findAll({
				include: [{
					model: _db2.default.models.pool_cards,
					where: { pool_id }
				}],
				order: [['order']]
			});
			return cards;
		}
	},

	Mutation: {
		upsertClass: (_, args) => _db2.default.models.class.upsert(args),
		upsertClasses: (_, { classes }) => {
			return classes.map(cl => {
				return _db2.default.models.class.upsert(cl).then(() => {
					let upsertedCl;

					if (!cl.id) {
						upsertedCl = _db2.default.models.class.findOne({
							'order': [['id', 'DESC']]
						});
					} else {
						upsertedCl = _db2.default.models.class.findById(cl.id);
					}

					return upsertedCl;
				});
			});
		},
		deleteClasses: (_, { classes }) => {
			//console.log("classes", classes);
			return classes.map(c => _db2.default.models.class.destroy({
				where: { id: c.id }
			}));
		},
		upsertDecks: (_, { decks }) => {
			return decks.map(deck => {
				return _db2.default.models.deck.upsert(deck).then(() => {
					let upsertedDeck;

					if (!deck.id) {
						upsertedDeck = _db2.default.models.deck.findOne({
							'order': [['id', 'DESC']]
						});
					} else {
						upsertedDeck = _db2.default.models.deck.findById(deck.id);
					}

					return upsertedDeck;
				});
			});
		},
		deleteDecks: (_, { decks }) => {
			//console.log("decks", decks);
			return decks.map(c => _db2.default.models.deck.destroy({
				where: { id: c.id }
			}));
		},
		upsertPools: (_, { pools }) => {
			//console.log("pools", pools);
			return pools.map(pool => {
				let fields = Object.keys(pool);

				//console.log("fields", fields);
				return _db2.default.models.pool.upsert(pool, { fields }).then(async result => {
					let cards = pool.cards;

					if (!pool.id) {
						pool = await _db2.default.models.pool.findOne({
							'order': [['id', 'DESC']]
						});
					}

					console.log("pool", pool);
					//console.log("pool.id", pool.id);
					console.log("cards", cards);

					if (cards) {
						// delete existing pool_cards
						await _db2.default.models.pool_cards.destroy({
							where: {
								pool_id: pool.id
							}
						});

						let pool_cards = cards.map(card => {
							return {
								pool_id: pool.id,
								card_id: card.id
							};
						});

						if (pool_cards.length) {
							await _db2.default.models.pool_cards.bulkCreate(pool_cards, {
								fields: Object.keys(pool_cards[0])
							});
						}
					}

					pool = await _db2.default.models.pool.findById(pool.id);

					return pool;
				});
			});
		},

		deletePools: (_, { pools }) => {
			//console.log("pools", pools);
			return pools.map(c => _db2.default.models.pool.destroy({
				where: { id: c.id }
			}));
		},
		upsertCards: async (obj, { cards }) => {
			console.log("cards", cards);
			const { resolve, reject } = await _promisesAll2.default.all(cards.map(async card => {
				let image = await card.image;
				console.log("image", image);
				if (image && typeof image !== 'string') {
					try {
						var { url, filename } = await processUpload(image);

						console.log("url", url);
						card = Object.assign({}, card, { image: url });
						console.log("card", card);
					} catch (err) {
						if (err) console.error(err);
					}
				}

				if (!card.id && !card.name && filename) {
					card.name = filename.split('.')[0];
				}

				console.log("card.image", card.image);
				await _db2.default.models.card.upsert(card);

				let result;

				if (card.id) {
					result = await _db2.default.models.card.findById(card.id);
				} else {
					result = await _db2.default.models.card.findOne({
						'order': [['id', 'DESC']]
					});
				}

				return result;
			}));

			if (reject.length) reject.forEach(({ name, message }) =>
			// eslint-disable-next-line no-console
			console.error(`${name}: ${message}`));

			return resolve;
		},
		deleteCards: async (_, { cards }) => {
			//console.log("cards", cards);
			return cards.map(async c => {
				let card = await _db2.default.models.card.findById(c.id);

				let dbSuccess, fsSuccess;

				dbSuccess = await _db2.default.models.card.destroy({
					where: { id: c.id }
				});

				if (dbSuccess && card.image) {
					let urlComponents = card.image.split('/');
					let filename = urlComponents[urlComponents.length - 1];
					let path = `./assets/images/cards/${filename}`;
					fsSuccess = await deleteFile(path);
				}

				return dbSuccess && fsSuccess;
			});
		},

		deleteGames: async (_, { games }) => {
			//console.log("games", games);
			return Promise.all(games.map(async game => {
				let q1 = _db2.default.models.game_cards_stand.destroy({
					where: { game_id: game.id }
				});

				let q2 = _db2.default.models.game.destroy({
					where: { id: game.id }
				});

				return Promise.all([q1, q2]);
			}));
		},

		upsertGames: (_, { games }) => {
			console.log("games", games);
			return games.map(game => {
				let fields = Object.keys(game);

				//console.log("fields", fields);
				return _db2.default.models.game.upsert(game, { fields }).then(async result => {
					let standOnCards = game.standOnCards;

					if (!game.id) {
						game = await _db2.default.models.game.findOne({
							'order': [['id', 'DESC']]
						});
					}

					//console.log("game", game);
					//console.log("game.id", game.id);


					if (standOnCards) {
						// delete existing game_cards
						await _db2.default.models.game_cards_stand.destroy({
							where: {
								game_id: game.id
							}
						});

						let game_cards = standOnCards.map(card => {
							return {
								game_id: game.id,
								card_id: card.id
							};
						});

						if (game_cards.length) {
							await _db2.default.models.game_cards_stand.bulkCreate(game_cards, {
								fields: Object.keys(game_cards[0])
							});
						}
					}

					game = await _db2.default.models.game.findById(game.id);

					return game;
				});
			});
		}
	},

	Upload: _apolloUploadServer.GraphQLUpload
};

async function deleteFile(path) {
	return new Promise((resolve, reject) => {
		_fs2.default.unlink(path, err => {
			if (err) {
				console.error(err);
				throw err;
				reject(false);
			} else {
				resolve(true);
			}
		});
	});
}

exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map