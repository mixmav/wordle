<template>
	<div class="home-page-container">
		<div class="main-page-content">
			
			<button class="more-info" @click="updateGameInfoDialogVisible(true)"><i class="fa fa-question"></i></button>
			
			<div class="intro">
				<h1>Wordle</h1>
				<p>on a budget</p>
			</div>

			<board></board>
			<keyboard></keyboard>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import Keyboard from './Keyboard.vue';
import Board from './Board.vue';

export default {
	components: {
		Keyboard,
		Board,
	},
	methods: {
		...mapActions('GameInfoDialog', {
			updateGameInfoDialogVisible: 'updateVisible',
		})
	}
}
</script>

<style lang="scss" scoped>
	@import "../scss/variables";

	.home-page-container {
		height: 100%;
		.main-page-content{
			padding: 1em;
			height: 100%;
			width: 100%;
			max-width: 500px;
			margin: 0 auto;
			display: flex;
			flex-direction: column;

			.more-info{
				position: fixed;
				top: 10px;
				right: 10px;
				background: transparent;
				font-size: 1em;
				color: $text-color;
				padding: 10px;
				border: none;
				cursor: pointer;
				transition: all .2s;
				&:hover, &:focus{
					outline: 0;
					background: rgba(black, 0.3);
				}
			}
			.intro{
				text-align: center;
				p{
					font-weight: 700;
					color: $secondary-color;
				}
			}
		}
	}

	@include media(420px){
		.home-page-container {
			.main-page-content{
				.intro{
					h1{
						font-size: 1.8em;
					}
				}
			}
		}

	}
	@include media(330px){
		.home-page-container {
			.main-page-content{
				.intro{
					h1{
						font-size: 1.7em;
					}
				}
			}
		}

	}
</style>