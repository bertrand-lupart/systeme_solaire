var ligneAxe;
var angleCam=Math.PI/12; // inclinaison caméra
var distCam=10000;
var dist2dist=50000;
var finalDist=1000;
var autoTurn=true;

var yClicGL=-1;
var xClicGL=-1;
var clicGL=false;

function bougeCamera() {
	var x=0;
	var y=Math.sin(angleCam)*distCam;
	var z=Math.cos(angleCam)*distCam;
    camera.position.set(x, y, z);
	camera.lookAt(centre);	
}

function mousemoveD(event) {
	affichePlanetes(false);
	afficheAutres(false);
}

function mousemoveGL(event) {
	var offsets = divgl.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;
		
    var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	
	moveGL (mousex,mousey);
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

function moveGL (mousex,mousey) {
	// partie commune à mouseMove et touchMove
	var dy=yClicGL-mousey;
	var dx=xClicGL-mousex;
	
	affichePlanetes(false);
	afficheAutres(false);
	divgl.style.cursor = "move";
	//window.getSelection().empty();
	if (!clicGL) {return false;}
	if(window.event) event = window.event;
		

	
	angleCam-=dy/hGL*4;
	if (angleCam>Math.PI/2) {angleCam=Math.PI/2;}
	if (angleCam<(-Math.PI/2)) {angleCam=-Math.PI/2;}
	
	mesh.rotation.y-=dx/hGL*4;
	
	autoTurn=false;
	bougeCamera();
	yClicGL=mousey;
	xClicGL=mousex;
}

function mouseupGL() {
	clicGL=false;
	autoTurn=true;
}

function clickGL(event) {
	if(window.event) event = window.event;
		
	var offsets = divgl.getBoundingClientRect();
	var top = offsets.top;
	var left = offsets.left;
		
    var mousex = event.clientX - left;
	var mousey = event.clientY - top;
	yClicGL=mousey;
	xClicGL=mousex;
	
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

    // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
    // renderer = new THREE.CanvasRenderer();
    renderer.setSize( lGL, hGL);
    divgl.appendChild(renderer.domElement);

    // on initialise la scène
    scene = new THREE.Scene();

    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(50, lGL/ hGL, 1, 200000 );
    scene.add(camera);
	bougeCamera();
	
	if (!noAxe)
	{
		// axe de rotation
		var matLigne = new THREE.LineBasicMaterial({
			color: 0x997777
		});
		var geomLigne = new THREE.Geometry();
		geomLigne.vertices.push(new THREE.Vector3(0, -1000, 0));
		geomLigne.vertices.push(new THREE.Vector3(0, 1000, 0));
		ligneAxe = new THREE.Line(geomLigne, matLigne);
		scene.add(ligneAxe);
	}
	


	
	if (idPage!="soleil") {
		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1.5, 0.2, 0.4).normalize();
		scene.add(directionalLight);
		// add subtle ambient lighting
		var ambientLight = new THREE.AmbientLight(0x111111);
		scene.add(ambientLight);
	}
	else {
		var ambientLight = new THREE.AmbientLight(0xFFFFFF);
		scene.add(ambientLight);
	}
}

// #LANCEMENT#
var divgl=document.createElement('div');
document.body.appendChild(divgl);

calcDim();

initDivMenu();

var hGL=Math.round(window.hFen*0.6);
var lGL=hGL;

initDivOnglets();

var divpadding=Math.round(hGL/16);
var lBG=lGL-divpadding*2;
var hBG=(hFen-hGL)+hMenu0;
var fsBG=Math.round(hBG/18*10)/10;
var fsD=Math.floor(hBG/15*10)/10;
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

if (nbEnv>0) {
	// structure interne
	var divgstr=document.getElementById('divgstr');
	var divstr=document.createElement('div');
	document.body.appendChild(divstr);
	divstr.style.cssText = divgl.style.cssText;
	divstr.style.display="none";
	divgstr.style.cssText = divbg.style.cssText;
}

if (nbGaz>0) {
	// diagramme atmosphère
	var divatm=document.createElement('div');
	document.body.appendChild(divatm);
	divatm.style.cssText = divgl.style.cssText;
	divatm.style.display="none";
	var canvAtm = document.createElement('canvas');
	canvAtm.width  = lGL;
	canvAtm.height  = hGL;
	canvAtm.style.zIndex   = 2;
	canvAtm.style.position = "absolute";
	divatm.appendChild(canvAtm)
	var ctxAtm = canvAtm.getContext("2d");
	// tableau atmosphère
	var divtatm=document.createElement('div');
	document.body.appendChild(divtatm);
	divtatm.style.cssText = divbg.style.cssText;
	divtatm.style.display="none";
	dessineGraphAtm();
}

if (isDiag) {
	var divdiag=document.getElementById('divdiag');
	divdiag.style.cssText = divgl.style.cssText;
	divdiag.style.display="none";
	divdiag.style.zIndex=2;
}

if (hasSat) {
	var divsat=document.getElementById('divsat');
	divsat.style.cssText = divbg.style.cssText;
	divsat.style.display="none";
	divsat.style.backgroundColor="#000000";
}

divgl.addEventListener('mousedown',clickGL);
divgl.addEventListener('mouseup',mouseupGL);
divgl.addEventListener('mouseout',mouseupGL);
divgl.addEventListener('mousemove',mousemoveGL);
if (isDiag) {divdiag.addEventListener('mousemove',mousemoveD);}
divd.addEventListener('mousemove',mousemoveD);

divgl.addEventListener('touchmove',touchMoveGL);
divgl.addEventListener('touchend',mouseupGL);
divgl.addEventListener('touchstart',touchStartGL);

setTimeout(function(){
	init_menu();
	init_scene();
	init_planete();
	init_press();
	init_dist();
	if (nbEnv>0) {traceEnveloppes ();}
	divbg.style.display = "block";
	divd.style.display = "block";
	divgl.style.display = "block";
	divmenu.style.display = "block";
	rafrTextMenu();
},10)

function dessineGraphAtm() {
	ctxAtm.fillStyle="#CCCCCC";
	var tCoul=['#770000','#007700','#000077','#777700','#770077','#777777'];
	ctxAtm.fillRect(0,0,canvAtm.width,canvAtm.height);
	ctxAtm.lineWidth=0.5;
	var x0=lGL/2;
	var y0=hGL/2;
	var r=hGL*0.38;
	var rt=r*1.1;
	var rt2=r*0.86;
	var fsAtm=Math.floor(hGL*0.38)/10;
	var fsAtm2=Math.floor(hGL*0.3)/10;
	ctxAtm.textAlign="center";
	var angle=0;
	for (var i=0;i<nbGaz;i++) {
		var dangle=tPGaz[i]/100*Math.PI*2;
		ctxAtm.beginPath();
		ctxAtm.moveTo(x0,y0);
		ctxAtm.arc(x0, y0, r, angle, angle+dangle, false);
		ctxAtm.lineTo(x0,y0);
		ctxAtm.closePath();
		ctxAtm.fillStyle = tCoul[i];
		ctxAtm.fill();
		ctxAtm.strokeStyle="black";
		ctxAtm.stroke();
		if (tPGaz[i]>=1.5) {
			var x=x0+Math.cos(angle+dangle/2)*rt;
			var y=y0+Math.sin(angle+dangle/2)*rt+fsAtm*0.3;
			ctxAtm.fillStyle="black";
			ctxAtm.font=fsAtm+"px Trebuchet MS";
			ctxAtm.fillText(tGaz[i],x,y);
			var x=x0+Math.cos(angle+dangle/2)*rt2;
			var y=y0+Math.sin(angle+dangle/2)*rt2+fsAtm*0.3;
			ctxAtm.fillStyle="white";
			ctxAtm.font=fsAtm2+"px Trebuchet MS";
			ctxAtm.fillText(tPGaz[i]+"%",x,y);
		}
		angle+=dangle;
	}
	ctxAtm.beginPath();
	ctxAtm.moveTo(x0,y0);
	ctxAtm.arc(x0, y0, r, angle, 2*Math.PI, false);
	ctxAtm.lineTo(x0,y0);
	ctxAtm.closePath();
	ctxAtm.fillStyle = "black";
	ctxAtm.fill();
	
	// tableau atmosphère
	var texte="";
	if (pAtm>-2) {
		texte+="<p>Pression atmosphérique : "+ecrit_pa(pAtm)+"</p>";
	}
	divtatm.className="tableau";
	texte+="<p><i>Composition de l'atmosphère :</i></p>";
	texte+="<table><tr><th width='1%'></th><th>Gaz</th><th>Pourcentage</th></tr>";
	var autres=100;
	for (var i=0;i<nbGaz;i++) {
		texte+="<tr><td width='1%' bgcolor='"+tCoul[i]+"'></td><td>"+tGaz[i]+"</td><td>"+tPGaz[i]+"%</td></tr>";
		autres-=tPGaz[i];
	}
	texte+="<tr><td width='1%' bgcolor='#000000'></td><td>Autres</td><td>&lt;"+Math.ceil(autres*1000)/1000+"%</td></tr>";
	texte+="</table>";
	
	divtatm.innerHTML=texte;
}

var modeDist=-1;
function init_dist() {
	if (typeof distSol == 'undefined') {return false;}
	modeDist++;
	if (modeDist>2) {modeDist=0;}
	var spdist=document.getElementById("spandist");
	spdist.innerHTML=ecrit_dist(distSol);
}

function ecrit_dist(valDist) {
	var txt;
	var p2=valDist;
	if (modeDist==1) {p2=p2/1e6;p2=Math.round(p2*1000)/1000;}
	if (modeDist==2) {p2=p2/1.496e8;p2=Math.round(p2*1000)/1000;}

	if (modeDist==0) {
		//écriture scientifique
		if ((p2>0.1)&&(p2<100)) {
			txt=Math.round(p2*100)/100;
		}
		else {
			txt=p2.toExponential(1);
			txt=txt.replace(".", ",");
			txt=txt.replace("e", ".10<sup>");
			txt=txt.replace("+", "");
			txt+="</sup>";
		}
	}
	if ((modeDist==1)||(modeDist==2)) {
		txt=commafy(p2);
		txt=txt.replace(".", ",");
	}
	
	if (modeDist==0) {txt+=" km";}
	if (modeDist==1) {txt+=" millions de km";}
	if (modeDist==2) {txt+=" UA";}

	txt="<a href='javascript:init_dist()' style='text-decoration:none;color:inherit;' title='Cliquer pour changer d unité'>"+txt+"</a>";
	return txt;
}

function init_press() {
	if (pAtm==-2) {return false;}
	unitAtm=!unitAtm;
	var spa=document.getElementById("spanpa");
	spa.innerHTML=ecrit_pa(pAtm);
	if (nbGaz>0) {dessineGraphAtm();}
}

function ecrit_pa(valPa) {
	var txtPatm;
	if (pAtm==-1) {
		txtPatm="(négligeable)";
	}
	else {
		var p2=valPa;
		if (unitAtm) {
			// p2=pAtm*9.86923267e-6; plus précis
			p2=valPa*1e-5;
		}
		if ((p2>0.1)&&(p2<100)) {
			txtPatm=Math.round(p2*100)/100;
		}
		else {
			txtPatm=p2.toExponential(1);
			txtPatm=txtPatm.replace(".", ",");
			txtPatm=txtPatm.replace("e", ".10<sup>");
			txtPatm=txtPatm.replace("+", "");
			txtPatm+="</sup>";
		}
		if (unitAtm) {txtPatm+="&nbsp;atm";}
		else {txtPatm+="&nbsp;Pa";}
	}
	txtPatm="<a href='javascript:init_press()' style='text-decoration:none;color:inherit;' title='Cliquer pour changer d unité'>"+txtPatm+"</a>";
	return txtPatm;
}