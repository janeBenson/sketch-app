const resetBtn = document.querySelector('#reset-button')
const slider = document.querySelector('#slider')
const sliderOutput = document.querySelector('#slider-output')

const defaultGridSize = 16
let mouseDown = false

document.addEventListener('mousedown', () => {
	mouseDown = true
})
document.addEventListener('mouseup', () => {
	mouseDown = false
})

resetBtn.addEventListener('click', () => {
	resetSlider()
	createGrid()
})

slider.addEventListener('input', (e) => {
	const val = e.target.value
	updateSliderOutput(val)
	createGrid(val)
})

function resetSlider() {
	slider.value = defaultGridSize
	updateSliderOutput(defaultGridSize)
}

function updateSliderOutput(val) {
	sliderOutput.textContent = `${val} x ${val}`
}
function addColor(target) {
	let rgb
	if (!target.style.backgroundColor) {
		rgb = getRandomColor()
		target.dataset.originalColor = rgb
		target.dataset.passes = 1
	} else {
		target.dataset.passes++
		const parsedOriginalColor = parseRGB(target.dataset.originalColor)
		const parsedNewColor = parsedOriginalColor.map((n) => n - (target.dataset.passes - 1) * n * 0.1)
		rgb = `rgb(${parsedNewColor[0]},${parsedNewColor[1]},${parsedNewColor[2]})`
	}
	target.style.backgroundColor = rgb
}
function getRandomColor() {
	return `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`
}
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}
function parseRGB(val) {
	const rgb = val
		.slice(4, -1)
		.split(',')
		.map((el) => parseInt(el))
	return rgb
}

function createElement(tag, className) {
	const node = document.createElement(tag)
	if (className) node.classList.add(className)
	return node
}

function addHoverEffect() {
	const gridNodes = document.querySelectorAll('.cell')
	gridNodes.forEach((el) => {
		el.addEventListener('mouseover', (e) => {
			if (mouseDown) addColor(e.target)
		})
		el.addEventListener('mousedown', (e) => {
			addColor(e.target)
		})
	})
}

function createGrid(n = defaultGridSize) {
	if (n <= 0 || n > 100) throw new Error('Number must be between 1 and 100')
	const oldContainerNode = document.querySelector('.container')
	if (oldContainerNode) {
		document.body.removeChild(oldContainerNode)
	}
	const containerNode = createElement('div', 'container')
	for (let i = 1; i <= n; i++) {
		const columnNode = createElement('div', 'column')
		for (let j = 1; j <= n; j++) {
			const rowNode = createElement('div', 'cell')
			columnNode.appendChild(rowNode)
		}
		containerNode.appendChild(columnNode)
	}
	document.body.prepend(containerNode)
	addHoverEffect()
}

createGrid()
