
let HideElements = ["StartMenu", "Lemon", "Works", "About1"];
let HideButtons = ["bottomBarLeft", "bottomBarLemon", "bottomBarWorks" , "bottomBarAbout"];
var buttonsUrl = "url('UITextures/";


dragElement(document.getElementById("Lemon"));
dragElement(document.getElementById("About1"));

for (var i = 0; i < 4; i++) {
	ToggleElement(i);
}


setTimeout(function(){ document.getElementById("StartScreen").style.display = "none"; }, 1300);

function dragElement(elmnt) {
	var x = 0, y = 0, x2 = 0, y2 = 0;
	elmnt.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		x2 = e.clientX;
		y2 = e.clientY;
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();

		z = x2 - e.clientX;
		y = y2 - e.clientY;
		x2 = e.clientX;
		y2 = e.clientY;


		if (elmnt.offsetTop - y < 0 || elmnt.offsetTop - y > window.innerHeight - elmnt.offsetHeight) {
			y = 0;
		}
		if (elmnt.offsetLeft - z < 0 || elmnt.offsetLeft - z > window.innerWidth - elmnt.offsetWidth) {
			z = 0;
		}

		elmnt.style.top = (elmnt.offsetTop - y) + "px";
		elmnt.style.left = (elmnt.offsetLeft - z) + "px";
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
	}   
}

function ToggleElement(index) {
	var window = document.getElementById(HideElements[index]);
	var button = document.getElementById(HideButtons[index]);

	if (window.style.display == "none") {
		window.style.display = "block";
		button.style.backgroundImage = buttonsUrl + HideButtons[index] + "Hover.png";
	}
	else {
		window.style.display = "none";
		button.style.backgroundImage = buttonsUrl + HideButtons[index] + ".png";
	}
}