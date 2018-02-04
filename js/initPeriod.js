// #LANCEMENT#
var divgl=document.createElement('div');
document.body.appendChild(divgl);

calcDim();
initDivMenu();

var hGL=Math.round(window.hFen*0.6);
var lGL=hGL;

var canv = document.createElement('canvas');
canv.width  = lGL;
canv.height  = hGL;
canv.style.zIndex   = 2;
canv.style.position = "absolute";
divgl.appendChild(canv)
var ctx = canv.getContext("2d");

var divpadding=Math.round(hGL/16);
var lBG=lGL-divpadding*2;
var hBG=(hFen-hGL)+hMenu0;
var fsBG=Math.floor(hBG/18*100)/100;
var fsD=Math.floor(hBG/15*100)/100;
var xDivD=lGL+xFen;
var lDivD=(lFen-lGL-divpadding*2);
var hDivD=(hFen);

var divbg=document.getElementById('divbg');
var divd=document.getElementById('divd');

divd.style.position = "absolute";
divd.style.paddingLeft = divpadding+"px";
divd.style.paddingRight = divpadding+"px";
divd.style.left = xDivD+"px";
divd.style.top = yFen+"px";
divd.style.width=lDivD+"px";
divd.style.height=hDivD+"px";
divd.style.fontSize=fsD+"px";

divgl.style.position = "absolute";
divgl.style.padding = 0+"px";
divgl.style.left = xFen+"px";
divgl.style.top = 0+"px";
divgl.style.width=lGL+"px";
divgl.style.height=hGL+"px";
divgl.style.zIndex=0;

divbg.style.position = "absolute";
divbg.style.paddingLeft = divpadding+"px";
divbg.style.paddingRight = divpadding+"px";
divbg.style.left = xFen+"px";
divbg.style.top = hGL+"px";
divbg.style.backgroundColor="black";
divbg.style.width=lBG+"px";
divbg.style.height=hBG+"px";
divbg.style.fontSize=fsBG+"px";
document.body.style.fontSize=fsBG+"px";

divd.addEventListener('mousemove',mousemoveD);

setTimeout(function(){
	init_menu();
	initMolette ();
	remplitTableau();
	initAnim();
	changeVit();
	divbg.style.display = "block";
	divd.style.display = "block";
	divgl.style.display = "block";
	divmenu.style.display = "block";
	rafrTextMenu();
},10)

function mousemoveD(event) {
	affichePlanetes(false);
	afficheAutres(false);
}


function initMolette () {
	// for mouse scrolling in Firefox
	var elem =divgl;
	if (elem.addEventListener) {    // all browsers except IE before version 9
			// Internet Explorer, Opera, Google Chrome and Safari
		elem.addEventListener ("mousewheel", molette, false);
			// Firefox
		elem.addEventListener ("DOMMouseScroll", molette, false);
	}
	else {
		if (elem.attachEvent) { // IE before version 9
			elem.attachEvent ("onmousewheel", molette);
		}
	}
	var elem =divbg;
	if (elem.addEventListener) {    // all browsers except IE before version 9
			// Internet Explorer, Opera, Google Chrome and Safari
		elem.addEventListener ("mousewheel", molette, false);
			// Firefox
		elem.addEventListener ("DOMMouseScroll", molette, false);
	}
	else {
		if (elem.attachEvent) { // IE before version 9
			elem.attachEvent ("onmousewheel", molette);
		}
	}
}


function molette(e) {
	// cross-browser wheel delta
	var vZoom=1.1;
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	if (delta<0)
	{
		zoom=zoom*vZoom;
		if (zoom>12000) {zoom=12000;}
	}
	else if (delta>0)
	{
		zoom=zoom/vZoom;
		if (zoom<20) {zoom=20;}
	}	
}