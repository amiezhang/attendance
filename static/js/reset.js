window.onload = window.onresize = function() {
    reFontSize()
}

function reFontSize() {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px'
}