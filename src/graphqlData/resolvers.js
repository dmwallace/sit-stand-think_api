import db from '../db';
import {GraphQLUpload} from 'apollo-upload-server'
import fs from 'fs'
import mkdirp from 'mkdirp'
import shortid from 'shortid'
import promisesAll from 'promises-all'

const uploadDir = './assets/images/cards';

// Ensure upload directory exists
mkdirp.sync(uploadDir)

const storeFS = ({stream, filename}) => {
	const id = shortid.generate()
	const path = `${uploadDir}/${id}-${filename}`
	const url = `/assets/images/cards/${id}-${filename}`
	console.log("url", url);
	return new Promise((resolve, reject) =>
		stream
		.on('error', error => {
			if (stream.truncated)
			// Delete the truncated file
				fs.unlinkSync(path)
			reject(error)
		})
		.pipe(fs.createWriteStream(path))
		.on('error', error => reject(error))
		.on('finish', () => resolve({id, path, url}))
	)
}

const processUpload = async upload => {
	const {stream, filename, mimetype, encoding} = await upload
	const {id, path, url} = await storeFS({stream, filename})
	return {url, path, filename};
}


const resolvers = {
	Query: {
		class: (_, {id}) => db.models.class.findById(id),
		classes: (_, args) => db.models.class.findAll(),
		deck: (_, {id}) => db.models.deck.findById(id),
		decks: (_, args) => db.models.deck.findAll(),
		cards: (_, args) => db.models.card.findAll({
			where: args.deck_id ? {deck_id: args.deck_id} : null,
			order: [['order']]
		}),
		pools: (_, args) => db.models.pool.findAll({
			where: {deck_id: args.deck_id}
		}),
		games: async (_, args) => {
			//console.log("args", args);
			let result = await db.models.game.findAll({
				where: args.deck_id && {deck_id: args.deck_id}
			})
			
			//console.log("result", result);
			return result;
		},
		
	},
	
	Game: {
		standOnCards: async ({id: game_id}) => {
			//console.log("game_id", game_id);
			db.models.card.hasMany(db.models.game_cards_stand, {foreignKey: 'card_id'});
			db.models.game_cards_stand.belongsTo(db.models.card, {foreignKey: 'card_id'});
			
			let cards = await db.models.card.findAll({
				include: [{
					model: db.models.game_cards_stand,
					where: {game_id}
				}]
			});
			
			//console.log("cards", cards);
			return cards;
		}
	},
	
	Pool: {
		cards: async ({id: pool_id}) => {
			//console.log("pool_id", pool_id);
			db.models.card.hasMany(db.models.pool_cards, {foreignKey: 'card_id'});
			db.models.pool_cards.belongsTo(db.models.card, {foreignKey: 'card_id'});
			
			let cards = await db.models.card.findAll({
				include: [{
					model: db.models.pool_cards,
					where: {pool_id}
				}],
				order: [['order']]
			});
			return cards;
		}
	},
	
	Mutation: {
		upsertClass: (_, args) => db.models.class.upsert(args),
		upsertClasses: (_, {classes}) => {
			return classes.map((cl) => {
				return db.models.class.upsert(cl).then(() => {
					let upsertedCl;
					
					if (!cl.id) {
						upsertedCl = db.models.class.findOne({
							'order': [['id', 'DESC']]
						});
					} else {
						upsertedCl = db.models.class.findById(cl.id);
					}
					
					return upsertedCl;
				})
			})
		},
		deleteClasses: (_, {classes}) => {
			//console.log("classes", classes);
			return classes.map(c => db.models.class.destroy({
				where: {id: c.id}
			}))
		},
		upsertDecks: (_, {decks}) => {
			return decks.map((deck) => {
				return db.models.deck.upsert(deck).then(()=>{
					let upsertedDeck;
					
					if(!deck.id) {
						upsertedDeck = db.models.deck.findOne({
							'order': [['id', 'DESC']]
						});
					} else {
						upsertedDeck = db.models.deck.findById(deck.id);
					}
					
					return upsertedDeck;
				})
			})
		},
		deleteDecks: (_, {decks}) => {
			//console.log("decks", decks);
			return decks.map(c => db.models.deck.destroy({
				where: {id: c.id}
			}))
		},
		upsertPools: (_, {pools}) => {
			//console.log("pools", pools);
			return pools.map((pool) => {
				let fields = Object.keys(pool);
				
				//console.log("fields", fields);
				return db.models.pool.upsert(pool, {fields}).then(async (result) => {
					let cards = pool.cards;
					
					if (!pool.id) {
						pool = await db.models.pool.findOne({
							'order': [['id', 'DESC']]
						});
					}
					
					console.log("pool", pool);
					//console.log("pool.id", pool.id);
					console.log("cards", cards);
					
					if (cards) {
						// delete existing pool_cards
						await db.models.pool_cards.destroy({
							where: {
								pool_id: pool.id,
							}
						});
						
						let pool_cards = cards.map((card) => {
							return {
								pool_id: pool.id,
								card_id: card.id,
							}
						});
						
						
						if(pool_cards.length) {
							await db.models.pool_cards.bulkCreate(pool_cards,
								{
									fields: Object.keys(pool_cards[0]),
								})
						}
					}
					
					
					pool = await db.models.pool.findById(pool.id);
					
					return pool;
				});
			});
		}
		
		,
		deletePools: (_, {pools}) => {
			//console.log("pools", pools);
			return pools.map(c => db.models.pool.destroy({
				where: {id: c.id}
			}))
		},
		upsertCards: async (obj, {cards}) => {
			console.log("cards", cards);
			const {resolve, reject} = await promisesAll.all(
				cards.map(async (card) => {
					let image = await card.image;
					console.log("image", image);
					if (image && typeof image !== 'string') {
						try {
							var {url, filename} = await processUpload(image);
							
							console.log("url", url);
							card = {...card, image: url};
							console.log("card", card);
						} catch (err) {
							if (err) console.error(err);
						}
					}
					
					if (!card.id && !card.name && filename) {
						card.name = filename.split('.')[0];
					}
					
					console.log("card.image", card.image);
					await db.models.card.upsert(card);
					
					let result;
					
					if (card.id) {
						result = await db.models.card.findById(card.id);
					} else {
						result = await db.models.card.findOne({
							'order': [['id', 'DESC']]
						});
					}
					
					return result;
				})
			)
			
			if (reject.length)
				reject.forEach(({name, message}) =>
					// eslint-disable-next-line no-console
					console.error(`${name}: ${message}`)
				)
			
			return resolve
		},
		deleteCards: async (_, {cards}) => {
			//console.log("cards", cards);
			return cards.map(async (c) => {
				let card = await db.models.card.findById(c.id);
				
				let dbSuccess, fsSuccess;
				
				dbSuccess = await db.models.card.destroy({
					where: {id: c.id}
				})
				
				if (dbSuccess && card.image) {
					let urlComponents = card.image.split('/');
					let filename = urlComponents[urlComponents.length - 1];
					let path = `./assets/images/cards/${filename}`;
					fsSuccess = await deleteFile(path);
				}
				
				return dbSuccess && fsSuccess;
			})
		},
		
		deleteGames: async (_, {games}) => {
			//console.log("games", games);
			return Promise.all(games.map(async (game) => {
				let q1 = db.models.game_cards_stand.destroy({
					where: {game_id: game.id}
				});
				
				let q2 = db.models.game.destroy({
					where: {id: game.id}
				});
				
				return (Promise.all([q1, q2]));
			}));
		},
		
		upsertGames: (_, {games}) => {
			console.log("games", games);
			return games.map((game) => {
				let fields = Object.keys(game);
				
				//console.log("fields", fields);
				return db.models.game.upsert(game, {fields}).then(async (result) => {
					let standOnCards = game.standOnCards;
					
					if (!game.id) {
						game = await db.models.game.findOne({
							'order': [['id', 'DESC']]
						});
					}
					
					//console.log("game", game);
					//console.log("game.id", game.id);
					
					
					if (standOnCards) {
						// delete existing game_cards
						await db.models.game_cards_stand.destroy({
							where: {
								game_id: game.id,
							}
						});
						
						let game_cards = standOnCards.map((card) => {
							return {
								game_id: game.id,
								card_id: card.id,
							}
						});
						
						
						if(game_cards.length) {
							await db.models.game_cards_stand.bulkCreate(game_cards,
								{
									fields: Object.keys(game_cards[0]),
								})
						}
					}
					
					
					game = await db.models.game.findById(game.id);
					
					return game;
				});
			});
		}
	},
	
	Upload: GraphQLUpload,
};

async function deleteFile(path) {
	return new Promise((resolve, reject) => {
		fs.unlink(path, (err) => {
			if (err) {
				console.error(err);
				throw err;
				reject(false);
			} else {
				resolve(true)
			}
		})
	})
}

export default resolvers;