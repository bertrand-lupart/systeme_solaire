var rOrb=new Array();
rOrb=[0,59,108,150,225,780,1425,2880,4515,10000];
var isTouchDevice = 'ontouchstart' in document.documentElement;
var zoom=300;

var tDiam=new Array();
tDiam=[999,4,12,12,7,142,116,47,45,2.2];

var tCoul=new Array();
tCoul=[0xDDDD55,0x777777,0x778833,0x0088AA,0xAA5500,0xAA7733,0x999977,0x2244CC,0x1122AA,0x555555];

var nomPla=new Array();
nomPla=['Soleil','Mercure','Vénus','Terre','Mars','Jupiter','Saturne','Uranus','Neptune','Eris'];

var renderer, scene, camera, mesh;
var hEcran,lEcran,hFen,hMenu,hMenu0,lMenu,fsMenu,divpaddingmenu,xFen,yFen;
var modeG="carac";
var idPage="";
var nbEnv=-1;
var nbGaz=-1;
var isDiag=false;
var isSatel=false;
var hasSat=false;
var noAxe=true;

function calcDim () {

	hEcran=window.innerHeight;
	lEcran=window.innerWidth;

	// on calcule hFen et lFen
	var hFenTot=hEcran+lEcran;
	lFen=Math.floor(hFen*1.6);
	while ((hFenTot>hEcran)||(lFen>lEcran))
	{
		hFenTot=Math.floor(hFenTot*0.995);
		lFen=Math.floor(hFenTot*1.5);
		//console.log (hFen+" "+lFen);
	}

	// on réserve le bandeau du menubar
	hMenu0=hFenTot/30;
	divpaddingmenu=Math.round(hMenu0/8);
	
	hFen=hFenTot-hMenu0;

	xFen=Math.round((lEcran-lFen)/2);
	yFen=hMenu0;
	
	hMenu=hMenu0-divpaddingmenu*2;
	lMenu=lFen-divpaddingmenu*2;
	fsMenu=Math.round(hMenu*0.8);
}
var idPage="compdist";

// #LANCEMENT#

var divgl=document.createElement('div');
document.body.appendChild(divgl);

var divtitre=document.createElement('div');
divtitre.style.zIndex=9;
divtitre.className= 'unselectable';
divtitre.style.zIndex=9;
document.body.appendChild(divtitre);

calcDim();
initDivMenu();

//pleine fenêtre !
var hGL=hFen;
var lGL=lFen;

var hTitre=hGL/2;
var fsTitre=Math.round(hTitre*0.1);

divgl.style.position = "absolute";
divgl.style.padding = 0+"px";
divgl.style.left = xFen+"px";
divgl.style.top = yFen+"px";
divgl.style.width=lGL+"px";
divgl.style.height=hGL+"px";
divgl.style.backgroundColor="black";

var canv = document.createElement('canvas');
canv.width  = lGL;
canv.height  = hGL;
canv.style.zIndex   = 2;
canv.style.position = "absolute";
divgl.appendChild(canv)
var ctx = canv.getContext("2d");

divtitre.style.position = "absolute";
divtitre.style.left = xFen+"px";
divtitre.style.top = yFen+"px";
divtitre.style.width=lMenu+"px";
divtitre.style.height=hTitre+"px";
divtitre.style.fontSize=fsTitre+"px";



divgl.addEventListener('touchmove',touchMoveGL);
divgl.addEventListener('touchstart',touchStartGL);

function touchMoveGL (event) {
	var touch = event.touches[0];
	var offsets = divgl.getBoundingClientRect();
	var left = offsets.left;
		
    var mousex = touch.pageX - left;

	var dx=xClicGL-mousex;
		
	// on émule la molette
	var d=dx/lGL*5;
	xClicGL=mousex;
	if (d>0) {zoom=zoom*Math.exp(d);}
	if (d<0) {zoom=zoom/Math.exp(-d);}
	if (zoom>zoomMax) {zoom=zoomMax;}
	if (zoom<zoomMin) {zoom=zoomMin;}
	pasEncoreZoom=false;
	dessine();
}


function touchStartGL (event) {
	var touch = event.touches[0];
	var offsets = divgl.getBoundingClientRect();
	var left = offsets.left;
		
    var mousex = touch.pageX - left;
	xClicGL=mousex;
}


setTimeout(function(){
	init_menu();
	initMolette();
	divgl.style.display = "block";
	divtitre.innerHTML="<center><p><i><font color=#777777>Comparaison des demi-grands axes</font></i><br><i><font color=#777777>(distances au soleil)</font></i></p></center>";
	divtitre.style.display = "block";
	divmenu.style.display = "block";
	dessine();
},10)

function dessine() {
	var fs=Math.round(hGL*0.3)/10;
	var yBarre=hGL*0.8;
	var xBarre=lGL*0.2;
	var lBarre=lGL-xBarre;
	var hBarre=hGL*0.01;
	var hTrait0=fs*2.4;
	var hTrait=hTrait0;
	var hTiret=hGL*0.01;

	//on efface
	ctx.fillStyle="black";
	ctx.fillRect(0,0,lGL,hGL);
	//on dessine la barre
	ctx.fillStyle="#777777";
	ctx.fillRect(xBarre-1,yBarre,lBarre+1,hBarre);
	
	ctx.textAlign="center";
	
	ctx.font="italic "+fs+"px Trebuchet MS";
	if (isTouchDevice==true) {
			ctx.fillText("Glisser le doigt de droite à gauche sur l'écran pour changer l'échelle",lGL/2,hGL*0.95);
		} else {
			ctx.fillText("Utiliser la molette de la souris pour changer l'échelle",lGL/2,hGL*0.95);
	}
	
	// affichage planètes
	for (var i=0;i<rOrb.length;i++) {
		var d=rOrb[i];
		var d2=d/zoom*lBarre;
		var x=d2+xBarre;
		if (d2<lGL) {
			ctx.fillStyle="#"+decimalToHex(tCoul[i],6);
			ctx.fillRect(x,yBarre,1,-hTrait);
			ctx.font="bold "+fs+"px Trebuchet MS";
			ctx.fillText(nomPla[i],x,yBarre-hTrait-fs*1.2);
			if (i>0) {
				ctx.font="italic "+fs+"px Trebuchet MS";
				ctx.fillText(commafy(d*1000000)+" km",x,yBarre-hTrait-fs*0.1);
			}
			hTrait+=hTrait0;
		}
	}
	
	// affichage échelle
	var z2=zoom*0.6;
	var uni=Math.pow(10,Math.floor(Math.log10(z2)));
	//console.log (zoom+" "+uni);
	uni=uni/100;
	var d2=uni/zoom*lBarre;
	if (d2>4) {
		var x=xBarre;
		ctx.fillStyle="#444444";
		while (x<lGL) {
			x+=d2;
			ctx.fillRect(x,yBarre+hBarre,1,hTiret*0.3);	
		}
	}
	uni=uni*10;
	var d2=uni/zoom*lBarre;
	var x=xBarre;
	ctx.fillStyle="#666666";
	while (x<lGL) {
		x+=d2;
		ctx.fillRect(x,yBarre+hBarre,1,hTiret*0.6);	
	}
	uni=uni*10;
	var d2=uni/zoom*lBarre;
	var x=xBarre;
	ctx.fillStyle="#888888";
	var dd=0;
	var dtot=lGL;
	while (x<lGL) {
		x+=d2;
		dtot+=d2;
		dd+=uni;
		if (dtot>lBarre/3) {
			ctx.font="italic "+fs+"px Trebuchet MS";
			ctx.fillRect(x,yBarre+hBarre,1,hTiret*2);
			ctx.fillText(commafy(dd*1000000)+" km",x,yBarre+hBarre+hTiret+fs*2);	
			dtot=0;
		}
		else {
				ctx.fillRect(x,yBarre+hBarre,1,hTiret);	
		}
	}
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
	dessine();
}

var zoomMin=80;
var zoomMax=12000;
function molette(e) {
	// cross-browser wheel delta
	var vZoom=1.1;
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	if (delta<0)
	{
		zoom=zoom*vZoom;
		if (zoom>zoomMax) {zoom=zoomMax;}
	}
	else if (delta>0)
	{
		zoom=zoom/vZoom;
		if (zoom<zoomMin) {zoom=zoomMin;}
	}	
	dessine();
}

