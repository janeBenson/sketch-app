function addColor() {
	let rgb
	if (!this.style.backgroundColor) {
		rgb = getRandomColor()
		this.dataset.originalColor = rgb
		this.dataset.passes = 1
	} else {
		this.dataset.passes++
		const parsedOriginalColor = parseRGB(this.dataset.originalColor)
		const parsedNewColor = parsedOriginalColor.map((n) => n - (this.dataset.passes - 1) * n * 0.1)
		rgb = `rgb(${parsedNewColor[0]},${parsedNewColor[1]},${parsedNewColor[2]})`
	}
	this.style.backgroundColor = rgb
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
	const gridNodes = document.querySelectorAll('.row')
	gridNodes.forEach((el) => {
		el.addEventListener('mouseover', addColor)
	})
}

function createGrid(n = 16) {
	if (n <= 0 || n > 100) throw new Error('Number must be between 1 and 100')
	const oldContainerNode = document.querySelector('.container')
	if (oldContainerNode) {
		document.body.removeChild(oldContainerNode)
	}
	const containerNode = createElement('div', 'container')
	for (let i = 1; i <= n; i++) {
		const columnNode = createElement('div', 'column')
		for (let j = 1; j <= n; j++) {
			const rowNode = createElement('div', 'row')
			columnNode.appendChild(rowNode)
		}
		containerNode.appendChild(columnNode)
	}
	document.body.appendChild(containerNode)
	addHoverEffect()
}

createGrid()
