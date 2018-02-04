var canvStr,ctxStr;
function traceEnveloppes () {
	// on crée le canvas
	canvStr = document.createElement('canvas');
    canvStr.id     = "canvStr";
    canvStr.width  = lGL;
    canvStr.height = hGL;
    canvStr.style.position = "absolute";
    divstr.appendChild(canvStr);
	ctxStr = canvStr.getContext('2d');
	
		
	var diam=lGL*0.8;
	
	if (typeof anneau !== 'undefined') {
		diam=lGL*0.39;
	}
	
	var x0=lGL/2;
	var y0=hGL/2;
	var r=(diam/2);
	
	// disque de fond gris
	ctxStr.beginPath();
	ctxStr.arc(x0, y0, r, 0, 2*Math.PI, false);
	ctxStr.fillStyle = 'rgba(100,100,100,0.5)';
	ctxStr.fill();
	ctxStr.lineWidth = 2;
	ctxStr.strokeStyle = 'rgba(255,255,255,0.75)';
	ctxStr.stroke();

	for (var i=0;i<nbEnv;i++) {
		var r=(diam/2)*tEnv[i]/tEnv[0];
		ctxStr.beginPath();
		ctxStr.arc(x0, y0, r, Math.PI/2, 3*Math.PI/2, false);
		ctxStr.fillStyle = tColEnv[i];
		ctxStr.fill();
		ctxStr.lineWidth = 1;
		ctxStr.strokeStyle = 'rgba(0,0,0,0.25)';
		ctxStr.stroke();
	}
	
	ctxStr.save();
	ctxStr.scale(0.4,1);
	var x0=lGL/2/0.4;
	var y0=hGL/2;

	for (var i=0;i<nbEnv;i++) {
		var r=(diam/2)*tEnv[i]/tEnv[0];
		ctxStr.beginPath();
		ctxStr.arc(x0, y0, r, 3*Math.PI/2, Math.PI/2, false);
		ctxStr.fillStyle = tColEnv[i];
		ctxStr.fill();
		ctxStr.lineWidth = 1;
		ctxStr.strokeStyle = 'rgba(0,0,0,0.25)';
		ctxStr.stroke();
	}
	
	// disque ombre
	var r=(diam/2);
	ctxStr.beginPath();
	ctxStr.arc(x0, y0, r, 3*Math.PI/2, Math.PI/2, false);
	ctxStr.fillStyle = 'rgba(0,0,0,0.25)';
	ctxStr.fill();
	
	ctxStr.restore();
}