export const GameInfoDialog = {
	namespaced: true,

	state: {
		visible: false,
	},

	mutations: {
		updateVisible(state, value) {
			state.visible = value;
		},
	},

	actions: {
		updateVisible(context, value) {
			context.commit("updateVisible", value);
		},
	},
};
