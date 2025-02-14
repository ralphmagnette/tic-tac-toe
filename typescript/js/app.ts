import Store from './store.js';
import type { Player } from './types';
import View from './view.js';

const players: Player[] = [
	{
		id: 1,
		name: 'Player 1',
		iconClass: 'fa-x',
		colorClass: 'turquoise',
	},
	{
		id: 2,
		name: 'Player 2',
		iconClass: 'fa-o',
		colorClass: 'yellow',
	},
];

function init() {
	const view = new View();
	const store = new Store('game-state-key', players);

	// Current tab state changes
	store.addEventListener('statechange', () => {
		view.render(store.game, store.stats);
	});

	// Different tab state changes
	window.addEventListener('storage', () => {
		view.render(store.game, store.stats);
	});

	// First load of the document
	view.render(store.game, store.stats);

	view.bindGameResetEvent(() => {
		store.reset();
	});

	view.bindNewRoundEvent(() => {
		store.newRound();
	});

	view.bindPlayerMoveEvent((square) => {
		const existingMove = store.game.moves.find(
			(move) => move.squareId === +square.id
		);

		if (existingMove) {
			return;
		}

		// Advance to the next state by pushing a move to the moves array
		store.playerMove(+square.id);
	});
}

window.addEventListener('load', init);
