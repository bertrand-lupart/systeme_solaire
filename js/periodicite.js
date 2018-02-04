idPage="perio";
var rOrb=new Array();
rOrb=[59,108,150,225,414,780,1425,2880,4515];
rSoleil=0.7;

var sonore=false;
var mode=0;

var tDiam=new Array();
tDiam=[4,12,12,7,1,142,116,47,45];

var tVit=new Array();
tVit=[87,224,365,687,1679,4331,10747,30589,59802];

var vitSoleil=27;

var tCoul=new Array();
tCoul=[0x555555,0x778833,0x0088AA,0xAA5500,0x222222,0xAA7733,0x999977,0x2244CC,0x1122AA];

var nomPla=new Array();
nomPla=['Mercure','Vénus','Terre','Mars','Ceres','Jupiter','Saturne','Uranus','Neptune'];

var tNote=new Array();
tNote=['C4','E4','G4','C5','E5','G5','C6','E6','G6','C7'];

var anglePla=0;
var timer;
var j0Pla=new Array();
var jPla=new Array();
for (var i=0;i<10;i++) {jPla[i]=0;j0Pla[i]=0;}

var zoom=1600;
var temps=0;
var vitesse;
var temps2=0;

var sonPlanete = new Wad({
    source : 'sine', 
    env : {
        attack : .01, 
        decay : .01, 
        sustain : .5, 
        hold : .015, 
        release : .4
    }, 
    filter : {
        type : 'lowpass', 
        frequency : 2000, 
        q : 8.5, 
        env : {
            attack : .2, 
            frequency : 600
        }
    }
})


function joue (note,v) {
	sonPlanete.play({pitch:note,volume:v});
}


function initAnim() {
	timer=setInterval(function () {tempsPasse()}, 10);
}

function changeVit() {
	vitesse=document.getElementById("rangeVit").value;
}

function cocheSon() {
	sonore=document.getElementById("checkSon").checked;
	document.getElementById("texteSon").style.display="none";
	document.getElementById("texteFormule").style.display="none";
	if (sonore) {
		if (mode==-1) {
			document.getElementById("texteFormule").style.display="block";
		} else {
			document.getElementById("texteSon").style.display="block";
		}
	}
		
}

function cocheFormule () {
	mode=-1;
	document.getElementById("texteSon").style.display="none";
	document.getElementById("texteFormule").style.display="block";
}

function remplitTableau () {
	var texte="";
	texte+="<table class='tableauPerio'><tr><th width='1%'></th><th>Nom</th><th>Distance<br>(millions&nbsp;de&nbsp;km)</th><th>Période<br>(jours)</th></tr>";
	for (var i=0;i<rOrb.length;i++) {
		texte+="<tr><td width='1%' bgcolor='#"+decimalToHex(tCoul[i],6)+"'></td><td>"+nomPla[i]+"</td><td>"+rOrb[i]+"</td><td>"+tVit[i]+"</td></tr>";
	}
	texte+="</table>";
	
	divbg.innerHTML+=texte;
}

function jouePlanete (i) {
	if (!sonore) {return false;}
	var volume=Math.sqrt((i*3+1)/8)/4;
	var note=0;
	if (mode==-1) {
		var fo=document.getElementById("text_formule").value;
		fo=fo.replace("racine", "Math.sqrt");
		fo=fo.replace("Racine", "Math.sqrt");
		fo=fo.replace("RACINE", "Math.sqrt");
		fo=fo.replace("Math.log", "log");
		fo=fo.replace("log", "Math.log");
		fo=fo.replace("Log", "Math.log");
		fo=fo.replace("LOG", "Math.log");
		var d=rOrb[i];
		
		var erreur=false;
		var fr="";
		try {
			fr=eval (fo);
		} catch (e) {
			erreur=true;
		}

		if (isNaN(fr)||erreur) {
			document.getElementById("label_freq").innerHTML=" = ???";
			note=0;
			volume=0;
			console.log (volume);
		} else {
			note=fr;
			document.getElementById("label_freq").innerHTML=" = "+Math.round(note)+" Hz";
		}
	}
	
	if (mode==0) {note=tNote[i];}
	if (mode==1) {note=rOrb[i]*3;}
	if (mode==2) {note=Math.sqrt(rOrb[i])*35;}
	if (mode==3) {note=Math.log(rOrb[i])*100-140;}
	console.log (note);
	if ((volume>0)&&(note!=0)) {joue (note,volume);}
}

function tempsPasse() {
	temps+=Math.exp(vitesse)/2;
	for (var i=0;i<rOrb.length;i++) {
		jPla[i]=(temps/tVit[i])%(Math.PI*2);
		if (jPla[i]<j0Pla[i]) {
			jouePlanete(i);
		}
		j0Pla[i]=jPla[i];
	}
	
	temps2++;
	if (temps2==2) {
		dessineEllipse();
		temps2=0;
	}
}

function dessineEllipse() {
	ctx.fillStyle="black";
	ctx.fillRect(0,0,lGL,hGL);
	var x0=Math.round(lGL/2);
	var y0=Math.round(hGL/2);
	var rPla=lGL*0.01;
	ctx.fillStyle="yellow";
	var r=rSoleil/zoom*lGL;
	ctx.beginPath();
	ctx.arc(x0,y0,r,0,Math.PI*2);
	ctx.closePath;
	ctx.fill();
	
	// trait initial
	ctx.strokeStyle="rgb(20,20,20)";
	ctx.beginPath ();
	ctx.moveTo(x0,y0+0.5);
	ctx.lineTo(lGL,y0+0.5);
	ctx.stroke();
	
	for (var i=0;i<rOrb.length;i++) {
		var r=rOrb[i]/zoom*lGL;
		ctx.strokeStyle="#"+decimalToHex(tCoul[i],6);
		ctx.beginPath();
		ctx.arc(x0,y0,r,0,Math.PI*2);
		ctx.closePath;
		ctx.stroke();
		var x=x0+Math.cos(jPla[i])*r;
		var y=y0+Math.sin(jPla[i])*r;
		ctx.fillStyle="#"+decimalToHex(tCoul[i],6);
		ctx.beginPath();
		ctx.arc(x,y,rPla,0,Math.PI*2);
		ctx.closePath;
		ctx.fill();

		var opa=1/(jPla[i]*2+1);
		ctx.fillStyle="rgba(255,255,255,"+opa+")";
		ctx.beginPath();
		ctx.arc(x,y,rPla*(1+opa/2),0,Math.PI*2);
		ctx.closePath;
		ctx.fill();
	}
	
	//	texte
	var fs=Math.round(lGL*0.25)/10;
	ctx.font="italic "+fs+"px Arial";
	ctx.textAlign="center";
	ctx.fillStyle="#aaaaaa";
	ctx.fillText("Utiliser la molette de la souris pour zoomer",x0,hGL-fs*2);
	ctx.fillText("Les diamètres des planètes ne sont pas représentées à l'échelle",x0,hGL-fs);
	
	var xJours=lGL-fs;
	var yJours=hMenu+fs*2;
	ctx.textAlign="right";
	var jours=Math.round(temps/Math.PI/2);
	var annees=Math.floor(jours/365);
	ctx.fillText (jours+" j",xJours,yJours);
	ctx.fillText ("("+annees+" a)",xJours,yJours+fs*1.5);

}