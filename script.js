const resetBtn = document.querySelector('#reset-button')
const slider = document.querySelector('#slider')
const sliderOutput = document.querySelector('#slider-output')
const colorThemesDropdown = document.querySelector('#color-themes')

const defaultGridSize = 16
let mouseDown = false
const defaultColorTheme = 'rainbow'
let chosenColorTheme = defaultColorTheme
const colorPalettes = {
	candy: ['rgb(193,202,214)', 'rgb(212,173,207)', 'rgb(242,106,141)', 'rgb(244,156,187)', 'rgb(203,238,243)'],
	tropical: ['rgb(182,252,213)', 'rgb(181,255,131)', 'rgb(236,252,182)', 'rgb(255,225,131)', 'rgb(255,176,136)'],
	mocha: ['rgb(120,77,32)', 'rgb(147,100,51)', 'rgb(177,137,95)', 'rgb(232,188,143)', 'rgb(244,208,171)'],
	celestial: ['rgb(131,24,152)', 'rgb(121,4,112)', 'rgb(176,38,157)', 'rgb(0,23,112)', 'rgb(9,0,73)'],
	cherryBlossom: ['rgb(251,111,146)', 'rgb(255,143,171)', 'rgb(255,179,198)', 'rgb(255,194,209)', 'rgb(255,229,236)'],
	ocean: ['rgb(6,66,115)', 'rgb(118,182,196)', 'rgb(127,205,255)', 'rgb(29,162,216)', 'rgb(222,243,246)'],
	neon: ['rgb(254,0,0)', 'rgb(253,254,2)', 'rgb(11,255,1)', 'rgb(1,30,254)', 'rgb(254,0,246)'],
	facebook: ['rgb(59,89,152)', 'rgb(139,157,195)', 'rgb(223,227,238)', 'rgb(247,247,247)', 'rgb(255,255,255)'],
	highlighter: ['rgb(140,255,50)', 'rgb(171,255,50)', 'rgb(212,255,50)', 'rgb(233,255,50)', 'rgb(253,255,50)'],
}

document.addEventListener('mousedown', () => {
	mouseDown = true
})
document.addEventListener('mouseup', () => {
	mouseDown = false
})
resetBtn.addEventListener('click', resetGrid)

slider.addEventListener('input', (e) => {
	const val = e.target.value
	updateSliderOutput(val)
	createGrid(val)
})

colorThemesDropdown.addEventListener('change', updateColorTheme)

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
		if (chosenColorTheme === 'rainbow') {
			rgb = getRandomColor()
		} else {
			const colorPalette = colorPalettes[chosenColorTheme]
			rgb = colorPalette[getRandomInt(0, colorPalette.length - 1)]
		}
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

function resetGrid() {
	resetSlider()
	resetColorThemesDropdown()
	chosenColorTheme = defaultColorTheme
	createGrid()
}

function resetColorThemesDropdown() {
	colorThemesDropdown.value = defaultColorTheme
}

function updateColorTheme() {
	chosenColorTheme = this.value
	createGrid()
}

createGrid()
