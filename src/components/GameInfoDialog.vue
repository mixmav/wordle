<template>
	<div class="vPage-component-game-info-dialog-container generic-dialog-container" ref="container" :class="[{visible: visible}]" @click="checkClickClose">
		<!-- <transition name="translate-y-minus-100px" delay="300"> -->
			<div class="container" v-show="visible">
				<p class="aim">Aim: guess the word</p>
				<div class="instructions mt-30">
					<div class="box green">C</div>
					<p>The letter C is in the word and in the correct spot.</p>
					<div class="box yellow">S</div>
					<p>The letter S is in the word but in the wrong spot.</p>
					<div class="box grey">S</div>
					<p>The letter S is not in the word in any spot.</p>
				</div>
				<button class="btn full-width mt-30" @click="updateVisible(false)"><i class="fa fa-thumbs-up"></i>Got it</button>
			</div>
		<!-- </transition> -->
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import $ from 'jquery';

export default {
	created(){
		$(window).on({
			keydown: (event) => {
				if (this.visible && event.keyCode == 27) {
					this.updateVisible(false);
				}
			},
		}, this.$refs.container);

	},

	unmounted(){
		$(window).off('keydown', this.$refs.container);
	},

	methods: {
		checkClickClose(event){
			if (event.target == this.$refs.container && this.$refs.container.contains(event.target)) {
				if (!this.loading) {
					this.updateVisible(false);
				}
			}
		},

		...mapActions('GameInfoDialog', {
			updateVisible: 'updateVisible',
		}),

	},

	computed: {
		...mapState('GameInfoDialog', [
			'visible',
		]),

	},
}
</script>

<style lang="scss" scoped>
	@import "../scss/_variables.scss";

	.vPage-component-game-info-dialog-container{
		z-index: $zIndex-game-info-dialog;
		&.visible{
			& > .container{
				opacity: 1;
				transform: scale(1, 1);
				transition: all .15s ease-out .3s;
			}
		}
		& > .container{
			height: auto;
			padding-bottom: 40px;
			max-width: 550px;
			transition: all .35s ease .3s;

			transform: scale(0.6, 0.6);
			opacity: 0;

			.aim{
				font-weight: 700;
			}
			.instructions{
				.box{
					width: 50px;
					height: 50px;
					border-radius: 5px;
					background: $green;
					margin-top: 10px;
					display: flex;
					justify-content: center;
					align-items: center;
					color: white;
					font-size: 2em;
					font-weight: 700;
					&.green{
						background: $green;
						border-color: darken($green, 5%);
						color: white;
					}
					&.grey{
						background: darken(white, 40%);
						border-color: darken(white, 40%);
						opacity: 0.8;
						color: white;
					}
					&.yellow{
						background: $yellow;
						border-color: darken($yellow, 3%);
						color: white;
					}
				}
				p{
					font-weight: 600;
					margin-top: 5px;
					margin-bottom: 10px;
					font-size: .8em;
				}
			}
		}
	}

	@include media-y(670px){
		.vPage-component-game-info-dialog-container{
			& > .container{
				margin-top: 0;
				max-height: 100%;
				border-radius: 0;
			}
		}
	}
</style>