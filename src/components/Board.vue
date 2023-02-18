<template>
	<div class="board-container">
		<div class="row" v-for="(row, index) in rows" :key="index">
			<div :class="slot.resultClass + ' ' + slot.spinClass" class="slot" v-for="(slot, slotIndex) in rows[index]" :key="slotIndex">{{slot.letter}}</div>
		</div>
	</div>
</template>

<script>
import { useToast } from "vue-toastification";

import $ from 'jquery';
import keycode from 'keycode';
import {Howl} from 'howler';
import CoinSound from '/audio/coin.mp3';
export default {
	created(){
		for (let i = 0; i < 6; i++) {
			this.rows.push([]);
			for (let j = 0; j < 5; j++) {
				this.rows[i].push({
					slot: j,
					letter: '',
					resultClass: '',
					spinClass: '',
				})
			}
		}

		$(document).on('keydown', (event) => {
			this.handleKeypress(event.keyCode);
		});

		this.answerWord = 'tasty';
	},

	mounted(){
		this.toast = useToast();
		this.emitter.on('keyboardKeyClick', (data) => {
			this.handleKeypress(keycode(data));
		});

		this.coinSound = new Howl({
			src: [CoinSound]
		});
		this.gameLoseSound = new Howl({
			src: [CoinSound]
		});
		this.noiceSound = new Howl({
			src: [CoinSound]
		});
	},

	unmounted(){
		$(document).off('keydown');
	},

	data(){
		return {
			rows: [],
			activeRow: 0,
			loading: false,
			coinSound: {},
			gameLoseSound: {},
			noiceSound: {},
			answerWord: 'jelly',
			toast: {},
		}
	},

	// watch: {
	// 	rows: {
	// 		deep: true,
	// 		handler: () => {
	// 			console.log('change')
	// 		}
	// 	}
	// },

	methods: {
		handleKeypress(keyCode){
			if (this.loading) { // dictionary api pending
				return;
			}

			//Check if input is a letter
			let inputKey = keycode(keyCode);
			let inputArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
			let actionsArr = ['enter', 'backspace'];

			if (inputArr.indexOf(inputKey) > -1) {
				inputKey = inputKey.toUpperCase();

				//Find first empty slot, if any
				for (let i = 0; i < this.rows[this.activeRow].length; i++) {
					if(this.rows[this.activeRow][i].letter == ''){ //Found, insert letter
						this.rows[this.activeRow][i].letter = inputKey;
						this.coinSound.stop().play();
						return;
					}
				}

			} else if(actionsArr.indexOf(inputKey) > -1){
				if (inputKey == 'backspace') {

					//Find last filled slot, if any
					for (let i = this.rows[this.activeRow].length - 1; i >= 0 ; i--) {
						if(this.rows[this.activeRow][i].letter != ''){ //Found, delete letter
							this.rows[this.activeRow][i].letter = '';
							return;
						}

					}
				} else if(inputKey == 'enter'){
					//check if all are full
					for (let i = this.rows[this.activeRow].length - 1; i >= 0 ; i--) {
						if(this.rows[this.activeRow][i].letter == ''){ //is incomplete, exit
							return;
						} else {
							// word is 5 characters, check for win
							let word = '';
							//Recreate word from letters
							for (let i = 0; i < this.rows[this.activeRow].length; i++) {
								word += this.rows[this.activeRow][i].letter;
							}
							word = word.toLowerCase();

							//Check if word is an actual english word

							let vThis = this;
							// this.checkForWin(word);
							$.ajax({
								url: 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/' + word + '?key=49bf0489-d419-4979-8642-c6c53306c971',
								method: 'GET',
								beforeSend(){
									vThis.loading = true;
								},
								success(response){
									if (typeof response[0] == 'object') {

										// FINALLY, check for win!
										vThis.checkForWin(word);

									} else {
										vThis.toast.info('Not in word list');
									}
								},
								error(){
									vThis.toast.error('Can\'t reach the dictionary 😌');
									vThis.checkForWin();
								},
								complete(){
									vThis.loading = false;
								}
							})
							return;
						}
					}
				}
			}
		},

		checkForWin(word){
			if (word == this.answerWord) {
				//All green
				for (let i = 0; i < this.rows[this.activeRow].length; i++) {
					this.rows[this.activeRow][i].resultClass = 'green';
					this.rows[this.activeRow][i].spinClass = 'spin';
				}
				// Win
				this.noiceSound.play();
				this.toast.success('✅👏', {
					position: 'bottom-left'
				});
				setTimeout(() => {
					this.toast.info('Refresh to play again');
				}, 2500)

				return;
			} else{
				// User hasn't won, but might be close, let's give hints.

				let inputWordArray = word.split('');
				let answerWordArray = this.answerWord.split('');
				let freqOfCharsInAnswer = this.checkFreqInString(this.answerWord);

				for (let i = 0; i < inputWordArray.length; i++) {
					for(let j = 0; j < answerWordArray.length; j++) {
						if(inputWordArray[i] == answerWordArray[j]) {
							this.rows[this.activeRow][i].resultClass = 'yellow';
							this.rows[this.activeRow][i].spinClass = 'spin';
						}
					}
				}

				let counter = 0;
				for (let i = 0; i < inputWordArray.length; i++) {
					if (this.rows[this.activeRow][i].resultClass == 'yellow') {
						counter++;
						if (counter > freqOfCharsInAnswer[this.rows[this.activeRow][i].letter.toLowerCase()]) {
							this.rows[this.activeRow][i].resultClass = 'grey';
						}
					} else {
						this.rows[this.activeRow][i].resultClass = 'grey';
					}
				}

				for (let i = 0; i < inputWordArray.length; i++) {
					if (inputWordArray[i] == answerWordArray[i]) {
						this.rows[this.activeRow][i].resultClass = 'green';
						this.rows[this.activeRow][i].spinClass = 'spin';
					}
				}

				if (this.activeRow >= 5) {
					this.gameLoseSound.play();
					this.toast('Out of tries... refresh the page to play again');
					return;
				}
				this.activeRow++;
			}
		},

		checkFreqInString(str){
			return str.split('').reduce((total, letter) => {
				total[letter] ? total[letter]++ : total[letter] = 1;
    			return total;
			}, {});
		}
	}
}

</script>

<style lang="scss" scoped>
	@import "../scss/variables";

	.board-container{
		margin-top: 20px;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		.row{
			margin-top: 10px;
			display: flex;
			justify-content: center;
			align-items: center;

			&:first-child{
				margin-top: 0;
			}
			.slot{
				width: 50px;
				height: 50px;
				display: inline-block;
				background: transparent;
				border: solid 1px $text-color;
				// border-radius: 10px;
				margin-left: 5px;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				font-size: 1.4em;
				font-weight: 400;
				color: $text-color;
				transition: all .15s;
				&.spin{
					animation: spinIntoView linear .4s;
				}
				&.green{
					background: $green;
					border-color: darken($green, 5%);
					color: white;
				}
				&.grey{
					background: darken(white, 40%);
					border-color: darken(white, 40%);
					opacity: 0.7;
					color: white;
				}
				&.yellow{
					background: $yellow;
					border-color: darken($yellow, 3%);
					color: white;
				}
				&:first-child{
					margin-left: 0;
				}
			}
		}
	}

	@include media-y(700px){
		.board-container{
			.row{
				.slot{
					height: 35px;
					width: 35px;
				}
			}
		}
	}

	@include media-y(580px){
		.board-container{
			margin-top: 5px;
			.row{
				.slot{
					height: 28px;
					width: 28px;
				}
			}
		}
	}

	@keyframes spinIntoView{
		from{
			transform: rotate3d(0) scale(1, 1);
		} 50% {
			transform: rotate3d(1, 0, 0, 90deg) scale(0.5, 0.5);
		} to {
			transform: rotate3d(0) scale(1, 1);
		}
	}
</style>