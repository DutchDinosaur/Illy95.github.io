var buttonsUrl = "url('UITextures/";

if(window.innerHeight < 650) {
	document.body.style.zoom = 75 + "%";
}
if(window.innerHeight > 1440) {
	document.body.style.zoom = 125 + "%";
}

dragElement(document.getElementById("Lemon"));
dragElement(document.getElementById("About1"));
dragElement(document.getElementById("About2"));
dragElement(document.getElementById("LinkWindow"));
dragElement(document.getElementById("WebGLWindow"));
dragElement(document.getElementById("ProjectInfoWindow"));
dragElement(document.getElementById("Commisions3D"));


DisableElementWindow("StartMenu");
DisableElementWindow("Lemon");
DisableElementWindow("Works");
DisableElementWindow("About1");
DisableElementWindow("About2");
DisableElementWindow("ContactPopup");
DisableElementWindow("LinkWindow");
DisableElementWindow("bottomBar");
DisableElementWindow("WebGLWindow");
DisableElementWindow("ProjectInfoWindow");
DisableElementWindow("Commisions");
DisableElementWindow("Commisions3D");

DisableElementButton("bottomBarLeft");
DisableElementButton("bottomBarWorks");
DisableElementButton("bottomBarAbout");
DisableElementButton("bottomBarCommisions");

document.getElementById("icons").style.display = "none"; 
document.getElementById("icons2").style.display = "none"; 

setTimeout(function(){ document.getElementById("StartScreen").style.display = "none"; }, 1300);
setTimeout(function(){ document.getElementById("icons").style.display = "block"; }, 1380);
setTimeout(function(){ document.getElementById("icons2").style.display = "block"; }, 1450);
setTimeout(function(){ EnableElementWindow("bottomBar"); }, 1490);

switch(getUrlVars().load){
	case "commisions":
		setTimeout(function(){ EnableElementWindow("Commisions"); EnableElementButton("bottomBarCommisions");}, 1690);
		break;
	case "about":
		setTimeout(function(){ EnableElementWindow("About2"); }, 1830);
		setTimeout(function(){ EnableElementWindow("About1"); EnableElementButton("bottomBarAbout"); }, 1870);
		break;
	default:
}

function dragElement(elmnt) {
	var x = 0, y = 0, x2 = 0, y2 = 0;
	elmnt.onmousedown = dragMouseDown;
	elmnt.ontouchstart = dragMouseDown;

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();

		if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
			var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
			var touch = evt.touches[0] || evt.changedTouches[0];
			x2 = touch.pageX;
			y2 = touch.pageY;
		} else{
			x2 = e.clientX;
			y2 = e.clientY;
		}


		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;

		document.ontouchend = closeDragElement;
		document.ontouchmove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();

		if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
			var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
			var touch = evt.touches[0] || evt.changedTouches[0];
			z = x2 - touch.pageX;
			y = y2 - touch.pageY;
			x2 = touch.pageX;
			y2 = touch.pageY;

			console.log(y);
		} else {
			z = x2 - e.clientX;
			y = y2 - e.clientY;
			x2 = e.clientX;
			y2 = e.clientY;
		}


		if (elmnt.offsetTop - y < -200 || elmnt.offsetTop - y > (window.innerHeight + 200) - elmnt.offsetHeight) {
			y = 0;
		}
		if (elmnt.offsetLeft - z < -200 || elmnt.offsetLeft - z > (window.innerWidth + 200) - elmnt.offsetWidth) {
			z = 0;
		}

		elmnt.style.top = (elmnt.offsetTop - y) + "px";
		elmnt.style.left = (elmnt.offsetLeft - z) + "px";
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;

		document.ontouchstart = null;
		document.ontouchend = null;
	}   
}

function SwitchWebglApp(WebGLPage) {
	document.getElementById("WebGLFrame").src = "Works/" + WebGLPage + "Work.html";
	document.getElementById("WebGLBackTitle").textContent = WebGLPage;
	document.getElementById("WebGLTitle").textContent = WebGLPage;
}

function SwitchInfo(InfoPage) {
	document.getElementById("InfoFrame").src = "Works/" + InfoPage + "Info.html";
}

function EnableElementWindow(HideElement) {
	var window = document.getElementById(HideElement);
	window.style.display = "block";
}

function EnableElementButton(HideButton) {
	var button = document.getElementById(HideButton);
	button.style.backgroundImage = buttonsUrl + HideButton + "Hover.png";
}

function DisableElementWindow(HideElement) {
	var window = document.getElementById(HideElement);
	window.style.display = "none";
}

function DisableElementButton(HideButton) {
	var button = document.getElementById(HideButton);
	button.style.backgroundImage = buttonsUrl + HideButton + ".png";
}

function ToggleElementWindow(HideElement) {
	var window = document.getElementById(HideElement);

	if (window.style.display == "none") window.style.display = "block";
	else window.style.display = "none";
}

function ToggleElementButton(HideButton,HideElement) {
	var button = document.getElementById(HideButton);
	var window = document.getElementById(HideElement);

	if (window.style.display == "none") button.style.backgroundImage = buttonsUrl + HideButton + ".png";
	else button.style.backgroundImage = buttonsUrl + HideButton + "Hover.png";
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}