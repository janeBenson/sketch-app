const resetBtn = document.querySelector('#reset-button')
const slider = document.querySelector('#slider')
const sliderOutput = document.querySelector('#slider-output')
const colorThemesDropdown = document.querySelector('#color-themes')
const colorThemePreview = document.querySelector('#color-theme-preview')
const fadeToBlackCheckbox = document.querySelector('#fade-to-black-option')
const customColors = document.querySelectorAll('.custom-color')
const customColorsSection = document.querySelector('#custom-colors')

const defaultGridSize = 16
let chosenGridSize = defaultGridSize
let mouseDown = false
const defaultColorTheme = 'random'
let chosenColorTheme = defaultColorTheme
let fadeToBlack = true
const colorPalettes = {
	candy: ['rgb(193,202,214)', 'rgb(212,173,207)', 'rgb(242,106,141)', 'rgb(244,156,187)', 'rgb(203,238,243)'],
	tropical: ['rgb(182,252,213)', 'rgb(181,255,131)', 'rgb(236,252,182)', 'rgb(255,225,131)', 'rgb(255,176,136)'],
	mocha: ['rgb(120,77,32)', 'rgb(147,100,51)', 'rgb(177,137,95)', 'rgb(232,188,143)', 'rgb(244,208,171)'],
	celestial: ['rgb(131,24,152)', 'rgb(121,4,112)', 'rgb(176,38,157)', 'rgb(0,23,112)', 'rgb(9,0,73)'],
	cherryBlossom: ['rgb(251,111,146)', 'rgb(255,143,171)', 'rgb(255,179,198)', 'rgb(255,194,209)', 'rgb(255,229,236)'],
	lilac: ['rgb(230,215,255)', 'rgb(231,209,255)', 'rgb(225,196,255)', 'rgb(216,185,255)', 'rgb(210,175,255)'],
	ocean: ['rgb(6,66,115)', 'rgb(118,182,196)', 'rgb(127,205,255)', 'rgb(29,162,216)', 'rgb(222,243,246)'],
	neon: ['rgb(254,0,0)', 'rgb(253,254,2)', 'rgb(11,255,1)', 'rgb(1,30,254)', 'rgb(254,0,246)'],
	facebook: ['rgb(0,0,0)', 'rgb(137,143,156)', 'rgb(66,103,178)'],
	highlighter: ['rgb(140,255,50)', 'rgb(171,255,50)', 'rgb(212,255,50)', 'rgb(233,255,50)', 'rgb(253,255,50)'],
	custom: [getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor()],
}

let currentDesign = {
	// '1-3': { originalColor, passes }
}

let savedDesigns = {
	/*
	designName: {
	size: 12,
	design: { '1-1': { originalColor, passes } }
	}
	
	*/
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
	chosenGridSize = val
	createGrid()
})

colorThemesDropdown.addEventListener('change', updateColorTheme)

fadeToBlackCheckbox.addEventListener('change', (e) => {
	fadeToBlack = e.target.checked
})

customColors.forEach((el) => {
	el.addEventListener('change', handleColorChange)
})

function handleColorChange() {
	const i = this.id.slice(-1)
	const color = hexToRgb(this.value)
	colorPalettes['custom'][i - 1] = color
}

function resetSlider() {
	slider.value = defaultGridSize
	updateSliderOutput(defaultGridSize)
}

function updateSliderOutput(val) {
	sliderOutput.textContent = `${val} x ${val}`
}
function addColor(target) {
	let rgb
	// first pass
	if (!target.style.backgroundColor) {
		rgb = getColor(chosenColorTheme)
		currentDesign[target.id] = {}
		currentDesign[target.id].originalColor = rgb
		currentDesign[target.id].passes = 1
		// subsequent passes
	} else {
		if (fadeToBlack) {
			currentDesign[target.id].passes++
			const parsedOriginalColor = parseRGB(currentDesign[target.id].originalColor)
			const parsedNewColor = parsedOriginalColor.map((n) => n - (currentDesign[target.id].passes - 1) * n * 0.1)
			rgb = `rgb(${parsedNewColor[0]},${parsedNewColor[1]},${parsedNewColor[2]})`
		} else {
			rgb = getColor(chosenColorTheme)
			currentDesign[target.id].passes = 1
			currentDesign[target.id].originalColor = rgb
		}
	}
	target.style.backgroundColor = rgb
}

function getRandomColor() {
	return `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`
}
function getColor(theme) {
	let rgb
	if (theme === 'random') {
		rgb = getRandomColor()
	} else {
		const colorPalette = colorPalettes[theme]
		rgb = colorPalette[getRandomInt(0, colorPalette.length - 1)]
	}
	return rgb
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

function createElement(tag, className, id) {
	const node = document.createElement(tag)
	if (className) node.classList.add(className)
	if (id) node.id = id
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

function createGrid(n = chosenGridSize) {
	if (n <= 0 || n > 100) throw new Error('Number must be between 1 and 100')
	const oldContainerNode = document.querySelector('.container')
	if (oldContainerNode) {
		document.body.removeChild(oldContainerNode)
	}
	const containerNode = createElement('div', 'container')
	for (let i = 1; i <= n; i++) {
		const columnNode = createElement('div', 'column')
		for (let j = 1; j <= n; j++) {
			const rowNode = createElement('div', 'cell', `${j}-${i}`)
			columnNode.appendChild(rowNode)
		}
		containerNode.appendChild(columnNode)
	}
	document.body.prepend(containerNode)
	addHoverEffect()
}

function resetGrid() {
	chosenColorTheme = defaultColorTheme
	chosenGridSize = defaultGridSize
	fadeToBlack = true
	resetCurrentDesignData()
	resetSlider()
	resetColorThemesDropdown()
	displayColorTheme()
	updateFadeToBlackCheckbox()
	hideElement(customColorsSection)
	showElement(colorThemePreview)
	createGrid()
}

function resetColorThemesDropdown() {
	colorThemesDropdown.value = defaultColorTheme
}

function resetCurrentDesignData() {
	currentDesign = {}
}

function saveCurrentDesign(name) {
	savedDesigns[name] = {}
	savedDesigns[name].size = chosenGridSize
	savedDesigns[name].design = currentDesign
}

function updateColorTheme() {
	chosenColorTheme = this.value
	if (chosenColorTheme === 'custom') {
		// hide color theme display & show custom colors
		showElement(customColorsSection)
		hideElement(colorThemePreview)
	} else {
		hideElement(customColorsSection)
		showElement(colorThemePreview)
		displayColorTheme()
	}
}

function displayColorTheme() {
	removeColorTheme()
	let colorTheme
	if (chosenColorTheme === 'random') {
		colorTheme = []
		for (let i = 0; i < 10; i++) {
			colorTheme.push(getRandomColor())
		}
	} else {
		colorTheme = colorPalettes[chosenColorTheme]
	}
	colorTheme.forEach((color) => {
		const colorNode = createElement('div', 'color')
		colorNode.style.backgroundColor = color
		colorThemePreview.appendChild(colorNode)
	})
}

function removeColorTheme() {
	const oldColors = document.querySelectorAll('.color')
	oldColors.forEach((colorNode) => {
		colorThemePreview.removeChild(colorNode)
	})
}

function updateFadeToBlackCheckbox() {
	fadeToBlackCheckbox.checked = fadeToBlack
}

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	if (!result) return null
	const rgbArr = result.map((n) => parseInt(n, 16))
	return `rgb(${rgbArr[1]},${rgbArr[2]},${rgbArr[3]})`
}

const componentToHex = (c) => {
	const hex = c.toString(16)
	return hex.length == 1 ? '0' + hex : hex
}

const rgbToHex = (rgb) => {
	;[r, g, b] = parseRGB(rgb)
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

function updateCustomColorsInputs() {
	customColors.forEach((el, i) => {
		const rgb = colorPalettes['custom'][i]
		el.value = rgbToHex(rgb)
	})
}

function hideElement(node) {
	node.classList.add('hidden')
}
function showElement(node) {
	node.classList.remove('hidden')
}

createGrid()
displayColorTheme()
updateFadeToBlackCheckbox()
updateCustomColorsInputs()
