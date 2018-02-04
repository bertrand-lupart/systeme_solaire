idPage="exc";
var ellipticite=0.15;
var excentricite=0.64;
var anglePla=0;
var timer;

function initAnim() {
	timer=setInterval(function () {dessineEllipse()}, 30);
}

function getExValue () {
	excentricite=document.getElementById("rangeEx").value;
	ellipticite=1-Math.sqrt(1-excentricite*excentricite);
	ellipticite=Math.round(ellipticite*1000)/1000;
	updateExEl();
}

function setEx (v) {
	excentricite=v;
	ellipticite=1-Math.sqrt(1-excentricite*excentricite);
	ellipticite=Math.round(ellipticite*1000)/1000;
	updateExEl();
}

function getElValue () {
	ellipticite=document.getElementById("rangeEl").value;
	excentricite=Math.sqrt(2*ellipticite-ellipticite*ellipticite);
	excentricite=Math.round(excentricite*1000)/1000;
	updateExEl();
}

function updateExEl() {
	document.getElementById("rangeEx").value = Math.round(excentricite*1000)/1000;
	document.getElementById("rangeEl").value = Math.round(ellipticite*1000)/1000;
	document.getElementById("spanEl").innerHTML = Math.round(ellipticite*1000)/1000;
	document.getElementById("spanEx").innerHTML = Math.round(excentricite*1000)/1000;
}

function dessineEllipse() {
	ctx.fillStyle="black";
	ctx.fillRect(0,0,lGL,hGL);
	ctx.strokeStyle="white";
	var x0=lGL/2;
	var y0=hGL/2;
	var fs=Math.round(lGL*0.3)/10;
	var rMax=lGL*0.3;
	var rSoleil=lGL*0.02;
	var rPlanete=lGL*0.01;
	var r1=rMax;
	var r2=(1-ellipticite)*r1;
	var aph=(1-excentricite)*r1;
	var perih=(1+excentricite)*r2;
	ctx.beginPath();
	for (var i=0;i<360;i+=2) {
		var a=Math.PI*2*i/360;
		var x=x0+Math.cos(a)*r1;
		var y=y0+Math.sin(a)*r2;
		if (i==0) {
			ctx.moveTo(x,y);
		} else {
			ctx.lineTo(x,y);
		}
		
	}
	ctx.closePath();
	ctx.stroke();
	
	ctx.fillStyle="#AAAAAA";
	ctx.strokeStyle="#777777";
	if (excentricite>0) {
		// périhélie/aphélie
		ctx.textAlign="right";
		ctx.font="italic "+fs+"px Arial";
		ctx.fillText("périhélie  ",x0-rMax,y0+fs*0.3);
		ctx.textAlign="left";
		ctx.fillText("  aphélie",x0+rMax,y0+fs*0.3);
		// foyers
		ctx.textAlign="right";
		var x=x0-r1+aph;
		ctx.beginPath();
		ctx.moveTo(x,y0-fs/5);
		ctx.lineTo(x,y0+fs/5);
		ctx.moveTo(x-fs/5,y0);
		ctx.lineTo(x+fs/5,y0);
		ctx.stroke();
		ctx.fillText("F",x,y0+fs*1.6);
		var x=x0+r1-aph;
		ctx.beginPath();
		ctx.moveTo(x,y0-fs/5);
		ctx.lineTo(x,y0+fs/5);
		ctx.moveTo(x-fs/5,y0);
		ctx.lineTo(x+fs/5,y0);
		ctx.stroke();
		ctx.textAlign="left";
		ctx.fillText("F'",x,y0+fs*1.6);
		
	} else {
		ctx.textAlign="center";
		var x=x0-r1+aph;
		ctx.beginPath();
		ctx.moveTo(x,y0-fs/5);
		ctx.lineTo(x,y0+fs/5);
		ctx.moveTo(x-fs/5,y0);
		ctx.lineTo(x+fs/5,y0);
		ctx.stroke();
		ctx.fillText("C",x,y0+fs*1.6);
	}
	
	var xS=x0-r1+aph;
	var yS=y0;
	
	// planète
	ctx.beginPath();
	ctx.fillStyle="cyan";
	var x=x0+Math.cos(anglePla)*r1;
	var y=y0+Math.sin(anglePla)*r2;
	ctx.arc(x,y,rPlanete,0,Math.PI*2);
	ctx.closePath();
	ctx.fill();
	
	// on avance la planète
	for (var n=0;n<10;n++) {
		var x=x0+Math.cos(anglePla)*r1;
		var y=y0+Math.sin(anglePla)*r2;	
		// on calcule la distance par rapport au soleil
		var d=Math.sqrt((x-xS)*(x-xS)+(y-yS)*(y-yS));
		// on corrige par rapport à la distance au soleil (loi de Kepler)
		var correctif=d/rMax;
		if (correctif<0.025) {correctif=0.025;}
		var vitesse=0.002/correctif;
		// on corrige vitesse par rapport à l'écrasement qui ralentit au niveau des bords écrasés
		// on calcule la distance si on avance d'un angle arbitraire
		var x2=x0+Math.cos(anglePla-0.00001)*r1;
		var y2=y0+Math.sin(anglePla-0.00001)*r2;	
		var dx=x2-x; var dy=y2-y;
		var d2=Math.sqrt(dx*dx+dy*dy);
		var vitesse=vitesse/d2*rMax;
		anglePla-=vitesse/100000;
	}
	
	if (aires) {
	// secteurs angulaires
	var angle=anglePla;
	var x1=x;
	var y1=y;
	for (var i=0;i<20;i++) {
		var couleur=200-i*10;
		var x=x0+Math.cos(angle)*r1;
		var y=y0+Math.sin(angle)*r2;
		// on calcule la distance par rapport au soleil
		var d=Math.sqrt((x-xS)*(x-xS)+(y-yS)*(y-yS));
		// on corrige par rapport à la distance au soleil (loi de Kepler)
		var correctif=d/rMax;
		if (correctif<0.2) {correctif=0.2;}
		var vitesse=0.05/correctif/2000;
		// on calcule la distance si on avance d'un angle arbitraire
		var x2=x0+Math.cos(angle-0.0001)*r1;
		var y2=y0+Math.sin(angle-0.0001)*r2;	
		var dx=x2-x; var dy=y2-y;
		var d2=Math.sqrt(dx*dx+dy*dy);
		var vitesse=vitesse/d2*rMax/10;
		angle+=vitesse;
		var x3=x0+Math.cos(angle)*r1;
		var y3=y0+Math.sin(angle)*r2;
		//on trace le secteur
		ctx.beginPath();
		ctx.fillStyle="rgba("+couleur+","+couleur+","+couleur+",0.5)";
		ctx.moveTo (xS,yS);
		ctx.lineTo (x,y);
		ctx.lineTo (x3,y3);
		ctx.lineTo (xS,yS);
		ctx.closePath();
		ctx.fill();
	}
	ctx.beginPath();
	ctx.moveTo (xS,yS);
	ctx.lineTo (x1,y1);
	ctx.stroke();
	ctx.moveTo (xS,yS);
	ctx.lineTo (x3,y3);
	ctx.stroke();
	}//aires
		
	// soleil
	ctx.beginPath();
	ctx.fillStyle="yellow";
	ctx.arc(xS,yS,rSoleil,0,Math.PI*2);
	ctx.closePath();
	ctx.fill();
	
}