function addColor() {
	this.classList.add('hovered')
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
	if (n <= 0 || n > 100) return 'ERROR'
	// todo remove prior grid from dom
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
