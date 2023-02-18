import Vuex from 'vuex';

import { GameInfoDialog } from './modules/GameInfoDialog';

export const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',

	modules: {
		GameInfoDialog: GameInfoDialog,
	},
});