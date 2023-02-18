<template>
	<div class="keyboard-container no-select">
		<div class="row" v-for="(row, index) in keyboardRows" :key="index">
			<div @click="handleKeyClick(key.key)" class="key" v-for="(key, keyIndex) in keyboardRows[index]" :key="keyIndex" v-html="key.key" :class="[{'bigger': key.bigger, 'padding-m': key.paddingM, 'padding-xl': key.paddingXL}]"></div>
		</div>
	</div>
</template>

<script>

export default {
	data(){
		return {
			keyboardRows: [
				[
					{ key: 'Q'},{ key: 'W'},{ key: 'E'},{ key: 'R'},{ key: 'T'},{ key: 'Y'},{ key: 'U'},{ key: 'I'},{ key: 'O'},{ key: 'P'}
				],
				[
					{ key: 'A'},{ key: 'S'},{ key: 'D'},{ key: 'F'},{ key: 'G'},{ key: 'H'},{ key: 'J'},{ key: 'K'},{ key: 'L'}
				],
				[
					{ key: 'ENTER', bigger: true, paddingM: true},{ key: 'Z'},{ key: 'X'},{ key: 'C'},{ key: 'V'},{ key: 'B'},{ key: 'N'},{ key: 'M'},{ key: '<i class="fa fa-backspace"></i>', bigger: true, paddingXL: true}
				],
			],
		}
	},
	methods: {
		handleKeyClick(key){
			if (key == '<i class="fa fa-backspace"></i>') {
				key = 'backspace';
			}
			this.emitter.emit('keyboardKeyClick', key);
		}
	}
}

</script>

<style lang="scss" scoped>
	@import "../scss/variables";
	.keyboard-container{
		margin-top: 30px;
		width: 100%;
		.row{
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 10px;
			&:first-child{
				margin-top: 0;
			}
			.key{
				border: solid 1px $text-color;
				margin-left: 5px;
				&:first-child{
					margin-left: 0;
				}
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				// border-radius: 5px;
				max-width: 45px;
				height: 50px;
				cursor: pointer;
				font-size: .8em;
				color: $text-color;
				font-weight: 700;
				transition: all .15s;
				&:active, &:focus{
					transform: scale(0.95, 0.95);
				}

				&.bigger{
					flex-grow: 1.5;
					width: initial;
					max-width: 75px;
				}
				&.padding-m{
					padding: 2px;
				}
				&.padding-xl{
					padding: 10px;
				}
			}
		}
	}

</style>