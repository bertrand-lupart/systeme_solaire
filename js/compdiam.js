var zoom=15;
var zoom2=15;
var pasEncoreZoom=true;
var isTouchDevice = 'ontouchstart' in document.documentElement;
// en milliers de km
var tDiam=new Array();
tDiam=[1600000,108000,1391,4.8,12.1,12.7,3.4,6.7,142,116,51,49,2.2];

var ua=149600; //149 millions de km
var al=10e9; // 10 000 milliards de km

var tCercles=new Array();
tCercles=[384.400,ua*1,4503000,20000*ua,50000*al,40000000000*al];
var nomCercle=new Array();
nomCercle=['Orbite de la Lune','Orbite de la Terre','Orbite de Neptune','Nuage d Oort','Voie lactée','Univers (?)'];


var tCoul=new Array();
tCoul=[0x996611,0x77FFFF,0xDDDD55,0x777777,0x778833,0x0088AA,0x444444,0xAA5500,0xAA7733,0x999977,0x2244CC,0x1122AA,0x555555];

var nomPla=new Array();
nomPla=['Betelgeuse','Rigel','Soleil','Mercure','Vénus','Terre','Lune','Mars','Jupiter','Saturne','Uranus','Neptune','Eris'];

sortWithIndeces(tDiam);
sortWithIndeces(tCercles);

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
divtitre.style.top = hGL*0.83+"px";
divtitre.style.width=lMenu+"px";
divtitre.style.height=hTitre+"px";
divtitre.style.fontSize=fsTitre+"px";


divgl.addEventListener('touchmove',touchMoveGL);
divgl.addEventListener('touchstart',touchStartGL);



function touchMoveGL (event) {
	var touch = event.touches[0];
	var offsets = divgl.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;
		
    var mousex = touch.pageX - left;
	var mousey = touch.pageY - top;

	var dy=yClicGL-mousey;
	var dx=xClicGL-mousex;
		
	// on émule la molette
	var d=dx/lGL*20;
	if (d>0) {zoom2=zoom2/Math.exp(d);}
	if (d<0) {zoom2=zoom2*Math.exp(-d);}
	if (zoom2>zoomMax) {zoom2=zoomMax;}
	if (zoom2<zoomMin) {zoom2=zoomMin;}
	pasEncoreZoom=false;

	yClicGL=mousey;
	xClicGL=mousex;
}


function touchStartGL (event) {
	var touch = event.touches[0];
	var offsets = divgl.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;
		
    var mousex = touch.pageX - left;
	var mousey = touch.pageY - top;
	yClicGL=mousey;
	xClicGL=mousex;
}


setTimeout(function(){
	init_menu();
	initMolette();
	divgl.style.display = "block";
	divtitre.innerHTML="<center><p><i><font color=#777777>Comparaison des diamètres planétaires (et stellaires)</font></i></p></center>";
	divtitre.style.display = "block";
	divmenu.style.display = "block";
	dessine();
},10)

function dessine() {
	var fs=Math.round(hGL*0.25)/10;
	var fs2=Math.round(hGL*0.2)/10;
	var fs3=Math.round(hGL*0.28)/10;
	var x0=lGL/2;
	var rMax=lGL*0.4;
	var yMax=hGL*0.8;
	var dOmbre=fs*0.08;
	var xT1=x0+fs*2;
	var xT2=x0+fs*4;
	var xT3=x0-fs*2;
	var xT4=x0-fs*4;
	zoom=(zoom*3+zoom2)/4;
	
	if (((zoom/zoom2)>0.995)&&((zoom/zoom2)<1.005)) {
		zoom=zoom2;
	}

	//on efface
	ctx.fillStyle="black";
	ctx.fillRect(0,0,lGL,hGL);

	ctx.textAlign="center";
	ctx.fillStyle="#777777";
	
	// affichage planètes
	for (var i=(tDiam.length-1);i>=0;i--) {
		var r=tDiam[i]/2;
		var r2=r/zoom*rMax;
		var y=yMax-r2;
		var yF=y-r2-fs*0.3;
		if (r2>1) {
			ctx.fillStyle="#"+decimalToHex(tCoul[tDiam.sortIndices[i]],6);
			if (r2<(hGL*40)) { // disque suffisamment petit pour que ça ait un sens de le dessiner
				//ctx.strokeStyle="#"+decimalToHex(tCoul[tDiam.sortIndices[i]],6);
				ctx.beginPath();
				ctx.arc(x0,y,r2,0,Math.PI*2);
				ctx.closePath();
				//ctx.stroke();
				ctx.fill();
			}
			else { // si grand qu'un rectangle fera l'affaire
				ctx.fillRect (0,0,lGL,yMax);
			}
		}
	}
	
	ctx.save();
	ctx.strokeStyle="rgba(127,127,127,0.5)";
	ctx.lineWidth=Math.round(lGL/50)/10;
	// affichage orbites et cercles
	for (var i=(tCercles.length-1);i>=0;i--) {
		var r=tCercles[i]/2;
		var r2=r/zoom*rMax;
		var y=yMax-r2;
		var yF=y-r2-fs*0.3;
		if ((r2<lGL)&&(r2>1)) {
			ctx.setLineDash([2,3]);
			ctx.beginPath();
			ctx.arc(x0,y,r2,0,Math.PI*2);
			ctx.closePath();
			ctx.stroke();
		}
	}
	ctx.restore();
	
	ctx.clearRect (0,yMax,lGL,hGL-yMax);

	if (pasEncoreZoom) {
		ctx.font="italic "+fs3+"px Trebuchet MS";
		ctx.fillStyle="#777777";
		if (isTouchDevice==true) {
			ctx.fillText("Glisser le doigt de droite à gauche sur l'écran pour changer l'échelle",lGL/2,hGL*0.95);
		} else {
			ctx.fillText("Utiliser la molette de la souris pour changer l'échelle",lGL/2,hGL*0.95);
		}
	}
	
	if (zoom>90000) {
		ctx.font="italic "+fs3+"px Trebuchet MS";
		ctx.fillStyle="#777777";
		ctx.fillText("(Rigel et Betelgeuse sont deux étoiles géantes, extérieures au système solaire, utilisées ici à titre de comparaison)",lGL/2,hGL*0.98);
	}
		
	
	// affichage nom planètes
	ctx.save();
	var yMin=hGL;
	ctx.lineJoin = 'round';
	ctx.shadowColor = 'rgba(0,0,0,0.5)';
	ctx.strokeStyle="rgba(255,255,255,0.5)";
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.textAlign="left";
	ctx.font=""+fs2+"px Arial";
	for (var i=0;i<tDiam.length;i++) {
		var r=tDiam[i]/2;
		var r2=r/zoom*rMax;
		var y=yMax-r2;
		var yT=y-r2;
		var yF=y-r2;
		if (true) {
			if ((yF+fs)>yMin) {
				yF=yMin-fs;
			}
			ctx.shadowBlur = 1;
			ctx.beginPath();
			ctx.moveTo(x0,yT+1);
			ctx.lineTo(xT1,yF+1);
			ctx.lineTo(xT2,yF+1);
			ctx.stroke();
			ctx.shadowBlur = 0;
			if (yF>0) {
				textOmbre (ctx,nomPla[tDiam.sortIndices[i]]+" : "+commafy(tDiam[i]*1000)+" km",'rgba(255,255,255,1)',xT2,yF+fs*0.3,dOmbre);
			}
			yMin=yF;
		}
	}
	ctx.restore();
	
	// affichage nom cercles
	ctx.save();
	var yMin=hGL;
	ctx.textAlign="right";
	ctx.font=""+fs2+"px Arial";
	for (var i=0;i<tCercles.length;i++) {
		var r=tCercles[i]/2;
		var r2=r/zoom*rMax;
		var y=yMax-r2;
		var yT=y-r2;
		var yF=y-r2;
		if (true) {
			if ((yF+fs)>yMin) {
				yF=yMin-fs;
			}
			ctx.shadowBlur = 1;
			ctx.beginPath();
			ctx.moveTo(x0,yT+1);
			ctx.lineTo(xT3,yF+1);
			ctx.lineTo(xT4,yF+1);
			ctx.stroke();
			//ctx.shadowBlur = 0;
			//ctx.font=""+fs2+"px Arial";
			var valeur=commafy(tCercles[i]*1000);
			if (tCercles[i]>1e18) {valeur="400 000 000 000 000 000 000 000";}
			if (yF>0) {
				textOmbre (ctx,nomCercle[tCercles.sortIndices[i]]+" : "+valeur+" km",'rgba(255,255,255,1)',xT4,yF+fs*0.3,dOmbre);
			}
			yMin=yF;
		}
	}
	ctx.restore();
	setTimeout(function () { dessine()}, 50);
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
}

var zoomMin=4;
var zoomMax=400000000000000000000;
function molette(e) {
	// cross-browser wheel delta
	pasEncoreZoom=false;
	var vZoom=1.3;
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	if (delta<0)
	{
		zoom2=zoom2*vZoom;
		if (zoom2>zoomMax) {zoom2=zoomMax;}
	}
	else if (delta>0)
	{
		zoom2=zoom2/vZoom;
		if (zoom2<zoomMin) {zoom2=zoomMin;}
	}	
}

