var style = 0;
var buttonsUrl = "url('UITextures/";
if (getUrlVars().ver == "1") { 
	var style = 1; 
	var buttonsUrl = "url('UITextures2/"; 
	var styleElement = document.getElementById('style');
	styleElement.setAttribute('href', 'style2.css');
}

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
dragElement(document.getElementById("CommisionsEmote"));


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
DisableElementWindow("Commissions");
DisableElementWindow("Commisions3D");
DisableElementWindow("CommisionsEmote");
DisableElementWindow("Gallery");

DisableElementButton("bottomBarLeft");
DisableElementButton("bottomBarWorks");
DisableElementButton("bottomBarAbout");
DisableElementButton("bottomBarCommisions");
DisableElementButton("bottomBarGallery");

document.getElementById("icons").style.display = "none"; 
document.getElementById("icons2").style.display = "none"; 
document.getElementById("icons3").style.display = "none"; 
document.getElementById("icons4").style.display = "none"; 

setTimeout(function(){ document.getElementById("StartScreen").style.display = "none"; }, 600);
setTimeout(function(){ document.getElementById("icons").style.display = "block"; }, 680);
setTimeout(function(){ document.getElementById("icons2").style.display = "block"; }, 750);
setTimeout(function(){ document.getElementById("icons3").style.display = "block"; }, 790);
setTimeout(function(){ document.getElementById("icons4").style.display = "block"; }, 930);
setTimeout(function(){ EnableElementWindow("bottomBar"); }, 890);
startTime();
setTimeout(function(){ setRandomBackground()}, 1100);

switch(getUrlVars().load){
	case "commissions":
		setTimeout(function(){ EnableElementWindow("Commissions"); EnableElementButton("bottomBarCommisions");}, 1690);
		break;
	case "about":
		setTimeout(function(){ EnableElementWindow("About2"); }, 1330);
		setTimeout(function(){ EnableElementWindow("About1"); EnableElementButton("bottomBarAbout"); }, 1870);
        break;
    case "gallery":
        setTimeout(function () { EnableElementWindow("Gallery"); EnableElementButton("bottomBarGallery"); }, 1690);
        break;
    case "interactive":
        setTimeout(function () { EnableElementWindow("Works"); EnableElementButton("bottombarWorks"); }, 1690);
        break;
	default:
}

if(window.innerWidth / window.innerHeight < 1){
	var comm = document.getElementById("Commissions");
	var tos = document.getElementById("commissionTOS");
	var cont = document.getElementById("CommisionContent");

	if (style == 1) {
		comm.style.borderImage = "url('UITextures2/twitchWindowSlimm.png')";
		comm.style.borderImageSlice = "27 28 4 106 fill";
		comm.style.borderImageWidth = "81px 84px 12px 318px";
	} else {
		comm.style.borderImage = "url('UITextures/twitchWindowSlimm.png')";
		comm.style.borderImageSlice = "27 27 3 106 fill";
		comm.style.borderImageWidth = "81px 81px 9px 318px";
	}
	tos.style.display = "none";
	cont.style.right = "calc(27px + 5%)";
} else	{
	var comm = document.getElementById("Commissions");

	if (style == 1) {
		comm.style.borderImage = "url('UITextures2/twitchWindow.png')";
		comm.style.borderImageSlice = "66 155 31 107 fill";
		comm.style.borderImageWidth = "198px 465px 93px 321px";
	} else {
		comm.style.borderImage = "url('UITextures/twitchWindow.png')";
		comm.style.borderImageSlice = "66 155 30 107 fill";
		comm.style.borderImageWidth = "198px 465px 90px 321px";
	}
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

function SwitchFullscreenApp(app, forceOn) {
    switch (app) {
        case 'About':
            if (document.getElementById("About1").style.display == "none" || forceOn) {
                disableFullscreenApps();
                EnableElementWindow("About1");
                EnableElementWindow("About2");
                EnableElementButton("bottomBarAbout");
            } else disableFullscreenApps();
            break;
        case 'Works':
            if (document.getElementById("Works").style.display == "none" || forceOn) {
                disableFullscreenApps();
                EnableElementWindow("Works");
                EnableElementButton("bottomBarWorks");
            } else disableFullscreenApps();
            break;
        case 'Commissions':
            if (document.getElementById("Commissions").style.display == "none" || forceOn) {
                disableFullscreenApps();
                EnableElementWindow("Commissions");
                EnableElementButton("bottomBarCommisions");
            } else disableFullscreenApps();
            break;
        case 'Gallery':
            if (document.getElementById("Gallery").style.display == "none" || forceOn) {
                disableFullscreenApps();
                EnableElementWindow("Gallery");
                EnableElementButton("bottomBarGallery");
            } else disableFullscreenApps();

            break;
        default:
            disableFullscreenApps();
    }

    function disableFullscreenApps() {
        DisableElementWindow("About1");
        DisableElementWindow("About2");
        DisableElementButton("bottomBarAbout");
        DisableElementWindow("Works");
        DisableElementButton("bottomBarWorks");
        DisableElementWindow("Commissions");
        DisableElementButton("bottomBarCommisions");
        DisableElementWindow("Gallery");
        DisableElementButton("bottomBarGallery");
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

function startTime() {
	const today = new Date();
	let h = today.getHours();
	let m = today.getMinutes();
	m = checkTime(m);
	document.getElementById('clock').innerHTML =  h + ":" + m;
	setTimeout(startTime, 1000);
}

function checkTime(i) {
	if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}

function setRandomBackground() {
	if (style == 1) {
		document.body.style.backgroundImage="url(UITextures2/wallpaper.png)";
		document.body.style.backgroundColor ="#8afff6";
		return;
	};
	var urls = ["","","","","BGprefab.png","BGpolyguise.png","BGbrick.png"];
	setBackGround(urls[Math.floor(Math.random() * 7)]);
}

function setBackGround(BG) {
	document.body.style.backgroundImage="url(UITextures/"+BG+")";
}