const divs = document.querySelectorAll('.row')
function addColor() {
	this.classList.add('hovered')
}
divs.forEach((el) => {
	el.addEventListener('mouseover', addColor)
})
