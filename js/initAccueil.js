var angleCam=Math.PI/8; // inclinaison caméra
var distCam=500;
var yClicGL=-1;
var clicGL=false;
var idPage="accueil";

function bougeCamera() {
	var x=0;
	var y=Math.sin(angleCam)*distCam;
	var z=Math.cos(angleCam)*distCam;
    camera.position.set(x, y, z);
	camera.lookAt(centre);	
}

function touchMoveGL (event) {
	var touch = event.touches[0];
	var offsets = divgl.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;
		
    var mousex = touch.pageX - left;
	var mousey = touch.pageY - top;
	moveGL (mousex,mousey);
}

function mousemoveGL(event) {
	if(window.event) event = window.event;
		
	var offsets = divgl.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;
		
    var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	moveGL (mousex,mousey);
}

function moveGL(mousex,mousey) {
	affichePlanetes(false);
	afficheAutres(false);
	//window.getSelection().empty();
	divgl.style.cursor = "move";
	if (!clicGL) {return false;}
	
	var dy=yClicGL-mousey;
	
	angleCam-=dy/hGL*4;
	if (angleCam>Math.PI/2) {angleCam=Math.PI/2;}
	if (angleCam<(-Math.PI/2)) {angleCam=-Math.PI/2;}
	bougeCamera();
	yClicGL=mousey;
}

function mouseupGL() {
	clicGL=false;
}

function clickGL(event) {
	if(window.event) event = window.event;
		
	var offsets = divgl.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;
		
    var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	yClicGL=mousey;
	
	clicGL=true;
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
	clicGL=true;
}

function init_scene(){

    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setClearColor( 0x000000, 1);
    renderer.setSize( lGL, hGL);
    divgl.appendChild(renderer.domElement);

    // on initialise la scène
    scene = new THREE.Scene();

    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(50, Math.round(lGL/ hGL*100)/100, 0.1, 100000 );
    scene.add(camera);
	bougeCamera();
	
	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x333333);
	scene.add(ambientLight);
	
	// lumière ponctuelle soleil
	var lumSoleil = new THREE.PointLight(0xffffff, 1, 10000);
	scene.add(lumSoleil);
		
}

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

divtitre.style.position = "absolute";
divtitre.style.left = xFen+"px";
divtitre.style.top = yFen+"px";
divtitre.style.width=lMenu+"px";
divtitre.style.height=hTitre+"px";
divtitre.style.fontSize=fsTitre+"px";

divgl.addEventListener('mousedown',clickGL);
divgl.addEventListener('mouseup',mouseupGL);
divgl.addEventListener('mouseout',mouseupGL);
divgl.addEventListener('mousemove',mousemoveGL);

divgl.addEventListener('touchmove',touchMoveGL);
divgl.addEventListener('touchend',mouseupGL);
divgl.addEventListener('touchstart',touchStartGL);


setTimeout(function(){
	init_menu();
	init_scene();
	creeToutesOrbites();
	creeToutesPlanetes();
	creeTousAster();
	creeCom();
	initMolette();
	creeSoleil();
	divgl.style.display = "block";
	divtitre.innerHTML="<center><p><i><font color=#777777>Le système solaire</font></i></p></center>";
	divtitre.style.display = "block";
	divmenu.style.display = "block";
},10)


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


function molette(e) {
	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	autoZoom=false;
	if (delta<0)
	{
		distCam=distCam*1.1;
		if (distCam>10000) {distCam=10000;}
	}
	else if (delta>0)
	{
		distCam=distCam*0.9;
		if (distCam<140) {distCam=140;}
	}	
}