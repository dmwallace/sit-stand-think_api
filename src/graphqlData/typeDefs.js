let timestamps = `
	createdAt: String
	updatedAt: String
`;

const typeDefs = `
scalar Upload
type Class {
	${timestamps}
	id: ID
	name: String
	games: [Game]
	order: Int
}
type Game {
	${timestamps}
	id: ID
	instructions: String
	class_id: ID
	level: Int
	deck_id: ID
	pool_id: ID
	standOnCards: [Card]
	order: Int
}
type Deck {
	${timestamps}
	id: ID
	name: String
	description: String
	cards: [Card]
	pools: [Pool]
	order: Int
}
type Pool {
	${timestamps}
	id: ID
	name: String
	cards: [Card]
	deck_id: ID
	order: Int
}

type Card {
	${timestamps}
	id: ID
	name: String
	image: String
	order: Int
	deck_id: ID
}

type Query {
	class(id: ID): Class
   classes: [Class]
   deck(id: ID): Deck
   decks: [Deck],
   cards(deck_id: ID): [Card]
   pools(deck_id: ID): [Pool]
   games(deck_id: ID): [Game]
}

input ClassInput {
	id: ID
	name: String
	order: Int
}

input DeckInput {
	id: ID
	name: String
	description: String
	order: Int
}

input CardInput {
	id: ID
	name: String
	image: Upload
	order: Int
	deck_id: ID
}

input PoolInput {
	id: ID
	name: String
	deck_id: ID
	cards: [CardInput]
	order: Int
}

input GameInput {
	id: ID
	class_id: ID
	level: Int
	instructions: String
	pool_id: ID
	deck_id: ID
	standOnCards: [CardInput]
	order: Int
}

type Mutation {
	upsertClass (
		id: ID
		name: String
		order: Int
	): Class
	
	upsertClasses (
		classes: [ClassInput]
	): [Class]
	
	deleteClasses (
		classes: [ClassInput]
	): [Boolean]
	
	upsertDeck (
		id: ID
		name: String
		description: String
		order: Int
	): Deck
	
	upsertDecks (
		decks: [DeckInput]
	): [Deck]
	
	deleteDecks (
		decks: [DeckInput]
	): [Boolean]
	
	upsertCards (
		cards: [CardInput]
	): [Card]
	
	deleteCards (
		cards: [CardInput]
	): [Boolean]
	
	upsertPools (
		pools: [PoolInput]
	): [Pool]
	
	deletePools (
		pools: [PoolInput]
	): [Boolean]
	
	upsertGames (
		games: [GameInput]
	): [Game]
	
	deleteGames (
		games: [GameInput]
	): [Boolean]
}
`;

export default typeDefs;