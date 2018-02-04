var renderer, scene, camera, mesh;
var hEcran,lEcran,hFen,hMenu,hMenu0,lMenu,fsMenu,divpaddingmenu,xFen,yFen;
var modeG="carac";
var idPage="";
var nbEnv=-1;
var nbGaz=-1;
var pAtm=-2;
var retro=false;
var unitAtm=true;
var isDiag=false;
var isSatel=false;
var hasSat=false;
var noAxe=true;

//document.ontouchmove = function(e) {e.preventDefault();};
 document.addEventListener('touchmove', function (e) {if(e.target.type != 'range'){e.preventDefault(); }}, false);

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

function redFaces (tF) {
	var nbFac=Math.round(tF.length/8);
	var texte="[";
	for (var i=0;i<nbFac;i++) {
		var v1=tF[i*8+1];
		var v2=tF[i*8+2];
		var v3=tF[i*8+3];
		texte+=v1+","+v2+","+v3+",";
	}
	console.log (texte);
}

function ajoutAtm (r1,r2,n,coul,opa) {
	var meshAt;
	var material2 = new THREE.MeshPhongMaterial({
			color: coul,
			opacity  :opa,
			transparent : true,
			shininess: 10
	});
		  
		 
	for (var i=0;i<n;i++) {
		var r=(r1*(n-i-1)+r2*i)/(n-1);
		var geometry = new THREE.SphereGeometry( r, 32,32 );
	    var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geometry);
		meshAt = new THREE.Mesh( bufferGeometry, material2 );
		meshAt.castShadow = false;
		meshAt.receiveShadow = false;
		scene.add( meshAt);
	}
	
}


function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

function commafy( num ) {
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}

function sortWithIndeces(toSort) {
  for (var i = 0; i < toSort.length; i++) {
    toSort[i] = [toSort[i], i];
  }
  toSort.sort(function(left, right) {
    return left[0] < right[0] ? -1 : 1;
  });
  toSort.sortIndices = [];
  for (var j = 0; j < toSort.length; j++) {
    toSort.sortIndices.push(toSort[j][1]);
    toSort[j] = toSort[j][0];
  }
  return toSort;
}

function textOmbre (ctx,t,coul,x,y,d) {
	x=Math.round(x);
	y=Math.round(y);
	ctx.save();
	ctx.shadowColor = '#000';
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = d*3;
	ctx.fillStyle="#000000";
	ctx.fillText(t,x,y);
	ctx.fillText(t,x,y);
	ctx.fillText(t,x,y);
	ctx.restore();
	ctx.fillStyle=coul;
	ctx.fillText(t,x,y);
}