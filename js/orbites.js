var centre=new THREE.Vector3(0,0,0);
var temps=2400;
var angleCom=1.5;

var tOrb=new Array();

var OrbCom;
var comete;
var queue;
var vieCom=30;
var nbPartQueue = 1000;

var rOrb=new Array();
rOrb=[59,108,150,225,780,1425,2880,4515];

var tDiam=new Array();
tDiam=[4,12,12,7,142,116,47,45];

var tVit=new Array();
tVit=[87,224,365,687,4331,10747,30589,59802];

var vitSoleil=27;

var tCoul=new Array();
tCoul=[0x555555,0x778833,0x0088AA,0xAA5500,0xAA7733,0x999977,0x2244CC,0x1122AA];

var nomPla=new Array();
nomPla=['Mercure','Vénus','Terre','Mars','Jupiter','Saturne','Uranus','Neptune'];

var tPla=new Array();

var tAst=new Array();
var tDiaAst=new Array();
var tOrbAst=new Array();
var tVitAst=new Array();

var anneau;

var nbAster=200;

var autoZoom=true;

function animate(){
	temps++;
	if (autoZoom) {
		distCam=1000*Math.pow((Math.sin(temps/500)+1.7),2);
	}
	bougeCamera();
	bougeComete();
	bougeComete();
	bougeComete();
	bougePlanetes();
	bougeAster();
	
	meshSoleil.rotation.y=+temps*5/vitSoleil;
	requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

function toScreenPosition(obj, camera)
{
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*renderer.context.canvas.width;
    var heightHalf = 0.5*renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };

};

function creeToutesOrbites() {
	for (var i=0;i<8;i++) {
		creeOrbite(i,rOrb[i]);
	}
	creeOrbiteCom();
}

var textPla=new Array();

function creeToutesPlanetes() {
	var fs=Math.round(lGL/80);
	for (var i=0;i<8;i++) {
		creePlanete(i,Math.round(tDiam[i]/10)+2);
		textPla[i] = document.createElement('div');
		textPla[i].className= 'nomplanete';
		textPla[i].style.display = "none";
		textPla[i].style.fontSize = fs+"px";
		textPla[i].style.zIndex = 1;   
		textPla[i].style.width = fs*10+'px';
		textPla[i].style.height = fs*3+'px';
		textPla[i].style.color = "#"+decimalToHex(tCoul[i],6);
		//textPla[i].style.backgroundColor = "#222222";
		textPla[i].innerHTML = "<center style='text-shadow: 0px 0px 4px black;text-align:center;'>"+nomPla[i]+"</center>";
		textPla[i].style.top = 200 + 'px';
		textPla[i].style.left = 50 + 'px';
		document.body.appendChild(textPla[i]);
	}

}

function creeTousAster() {
	for (var i=0;i<nbAster;i++) {
		var diamReelAster=Math.round(Math.random()*2+Math.random()*2+0.1);
		tDiaAst[i]=Math.round(diamReelAster/5*10)/10+0.25;
		creeAster(i,tDiaAst[i]);
	}

}

function bougePlanetes() {
	var fs=Math.round(lGL/80);
	var x,y,z,angle;
	var vFOV = camera.fov * Math.PI / 180;        // convert vertical fov to radians
	for (var i=0;i<8;i++) {
		angle=-(temps-i*90000)*5/tVit[i];
		x=Math.cos(angle)*rOrb[i];
		y=Math.sin(angle)*rOrb[i];

		tPla[i].position.x=x;
		tPla[i].position.z=y;

		if (i==5) {//saturne 
			anneau.position.x=x;
			anneau.position.z=y;		
		}
		var xyPos=toScreenPosition(tPla[i],camera);
		// on calcule la distance à la caméra
		var dx=camera.position.x-tPla[i].position.x;
		var dy=camera.position.y-tPla[i].position.y;
		var dz=camera.position.z-tPla[i].position.z;
		var distance=Math.sqrt(dx*dx+dy*dy+dz*dz);
		var tailleFont=Math.round(fs*200*Math.sqrt(Math.sqrt(tDiam[i])/distance))/10;
		// on calcule le champ de vision de la caméra à cette distance
		//var hPlanete = 2 * Math.tan( vFOV / 2 ) * distance; 
		x=xyPos.x;
		y=xyPos.y;
		if ((x>0)&&(x<lGL)&&(y>0)&&(y<hGL)&&(tailleFont>(fs/2))) {
			textPla[i].style.display="block";
			textPla[i].style.fontSize=tailleFont+1+"px";
			textPla[i].style.left=Math.round(xyPos.x+xFen-fs*5)+"px";
			textPla[i].style.top=Math.round(xyPos.y+yFen+tailleFont/4)+"px";
		}
		else
		{
			textPla[i].style.display="none";
		}
	}	
}


function bougeAster() {
	var x,y,angle;
	for (var i=0;i<nbAster;i++) {
		angle=-(temps-i*10000)*5/tVitAst[i];
		x=Math.cos(angle)*tOrbAst[i];
		y=Math.sin(angle)*tOrbAst[i];
		tAst[i].position.x=x;
		tAst[i].position.z=y;
	}	
}

function bougeComete() {
	var r1,r2,x,y,z,x0,Y0;
	
	// comète fantaisiste
	r1=600;
	r2=300; 
	x0=(r1)-100; 
	y0=0; 

	x=Math.cos(angleCom)*r1+x0;
	y=Math.sin(angleCom)*r2+y0;
	z=-x/4; // inclinaison approximative !!
	
	// on calcule la distance de la comète par rapport au soleil
	var d=Math.sqrt(x*x+y*y+z*z);
	queue.material.opacity=20/d;
	
	// on corrige par rapport à la distance au soleil (accélération quand la comète s'en rapproche)
	vCom=0.1/d;
	
	if (vCom<0.0005) {vCom=0.0005;} // on triche un peu sinon c'est trop long vers Pluton
	
	// on corrige vCom par rapport à l'écrasement qui ralentit au niveau des bords écrasés
	// on calcule la distance si on avance d'un angle arbitraire
	var x1=Math.cos(angleCom)*r1;
	var y1=Math.sin(angleCom)*r2;	
	var z1=-x1/4;
	var x2=Math.cos(angleCom+0.001)*r1;
	var y2=Math.sin(angleCom+0.001)*r2;	
	var z2=-x2/4;
	var dx=x2-x1; var dy=y2-y1; var dz=z2-z1;
	var d2=Math.sqrt(dx*dx+dy*dy+dz*dz);
	var vCom=vCom/d2;
			
	angleCom+=vCom;
	
	comete.position.x=x;
	comete.position.y=z;
	comete.position.z=y;
	
	// on bouge les particules de la queue
	for (var i=1;i<nbPartQueue;i++) {
		var particle =
		queue.geometry.vertices[i];
		
		particle.vie--;
		
		if (particle.vie<0) {
			particle.vie=Math.round(Math.random()*vieCom);
			particle.x=comete.position.x;
			particle.y=comete.position.y;
			particle.z=comete.position.z;
			// on dirige ces particules à l'opposé du soleil
			var vOpp=Math.random()*200+100;
			particle.velocity.x=x/d/d*vOpp+((Math.random()+Math.random()-1))/4;
			particle.velocity.y=z/d/d*vOpp+((Math.random()+Math.random()-1))/4;
			particle.velocity.z=y/d/d*vOpp+((Math.random()+Math.random()-1))/4;
		}
		
		
		var velo=particle.velocity;

		// and the position
		particle.x+=velo.x;
		particle.y+=velo.y;
		particle.z+=velo.z;
	  }

	  // flag to the particle system
	  // that we've changed its vertices.
	  queue.geometry.verticesNeedUpdate = true;
}

function creeOrbite (n,r) {
	var matLigne = new THREE.LineBasicMaterial({
        color: tCoul[n],
		opacity: 0.5,
		transparent:true
    });
	var geomOrb = new THREE.Geometry();
	var angle,x,y;
	
	
	for (var i=0;i<=360;i+=2) {
		angle=Math.PI*2*i/360;
		x=Math.cos(angle)*r;
		y=Math.sin(angle)*r;
		geomOrb.vertices.push(new THREE.Vector3(x,0,y));
	}
    
	tOrb[n] = new THREE.Line(geomOrb, matLigne);
	scene.add(tOrb[n]);
}

function creeOrbiteCom () {
	var matLigne = new THREE.LineBasicMaterial({
        color: '#777777',
		opacity: 0.5,
		transparent:true
    });
	var geomOrb = new THREE.Geometry();
	var angle,r1,r2,x,y,z,x0,Y0;
	
	//halley
	//r1=2684; // demi grand axe à 2 684 millions de km // aphélie à 5 300  millions de km // périhélie à 88 millions de km
	//r2=680; // demi petit axe 680 millions de km
	//x0=(r1)-88; 
	//y0=0; 
	
	// comète fantaisiste
	r1=600;
	r2=300; 
	x0=(r1)-100; 
	y0=0; 
	
	
	for (var i=0;i<=360;i++) {
		angle=Math.PI*2*i/360;
		x=Math.cos(angle)*r1+x0;
		y=Math.sin(angle)*r2+y0;
		z=-x/4; // inclinaison approximative !!
		geomOrb.vertices.push(new THREE.Vector3(x,z,y));
	}
    
	orbCom = new THREE.Line(geomOrb, matLigne);
	scene.add(orbCom);
}



function creeAster (n,dia) {
	// on créé la sphère
	var geomAster = new THREE.SphereGeometry( dia+0.5, 4,4 ); 
	var matAster = new THREE.MeshBasicMaterial  ({
		color: "#555555"
    });
	
	var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geomAster);
	tAst[n] = new THREE.Mesh( bufferGeometry, matAster );
	tOrbAst [n] = 350+Math.random()*50+Math.random()*50+Math.random()*50+Math.random()*50+Math.random()*50;
	tVitAst[n]=Math.pow(tOrbAst [n] ,1.5)*0.1987;
	scene.add( tAst[n] );	
	var z=Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-4;
	tAst[n].position.y=z*20;
}

function creeCom () {
	// on créé la sphère
	var geom = new THREE.SphereGeometry( 1, 8,8 ); 
	var mat = new THREE.MeshBasicMaterial  ({
		color: "#ffffff"
    });
	
	var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geom);
	comete = new THREE.Mesh( bufferGeometry, mat );
	scene.add( comete );
	
	// queue de la comète 
	var particles = new THREE.Geometry();
	var pMaterial = new THREE.PointCloudMaterial({
	  color: 0xFFFFFF,
	  opacity:0.1,
	  blending: THREE.AdditiveBlending,
	  transparent:true,
	  side: THREE.DoubleSide,
	  size: 1
	});

	// now create the individual particles
	for (var p = 0; p < nbPartQueue; p++) {
	  var particle = new THREE.Vector3(0,0,0);
	  particle.vie=Math.random()*vieCom;
	  particle.velocity = new THREE.Vector3(
		  0,              
		  0, 
		  0);   
	  particles.vertices.push(particle); 
	}

	// create the particle system
	queue = new THREE.PointCloud(
		particles,
		pMaterial);

	// add it to the scene
	scene.add(queue);
	
	for (var i=0;i<vieCom;i++) {
		bougeComete();
	}
}


function creePlanete (n,dia) {
	// on créé la sphère
	var geomPlanete = new THREE.SphereGeometry( dia, 32,32 ); 
	var matPlanete = new THREE.MeshLambertMaterial({
		color: tCoul[n]
    });
	
	if (n==5) { // saturne
		var angle1,angle2,v1,v2,v3,v4;
		var geomAnneau = new THREE.Geometry(); 
		var matAnneau = new THREE.MeshBasicMaterial({
			color: tCoul[n],
			side: THREE.DoubleSide
		});
		for (var i=0;i<=90;i++) {
			angle1=Math.PI*2*4*i/360;
			angle2=Math.PI*2*4*(i+1)/360;
			var x=Math.cos(angle1)*dia*1.5;
			var y=Math.sin(angle1)*dia*1.5;
			var v1 = new THREE.Vector3(x,0,y);
			var x=Math.cos(angle1)*dia*2.3;
			var y=Math.sin(angle1)*dia*2.3;
			var v2 = new THREE.Vector3(x,0,y);
			var x=Math.cos(angle2)*dia*2.3;
			var y=Math.sin(angle2)*dia*2.3;
			var v3 = new THREE.Vector3(x,0,y);
			var x=Math.cos(angle2)*dia*1.5;
			var y=Math.sin(angle2)*dia*1.5;
			var v4 = new THREE.Vector3(x,0,y);

			geomAnneau.vertices.push(v1);
			geomAnneau.vertices.push(v2);
			geomAnneau.vertices.push(v3);
			
			geomAnneau.faces.push( new THREE.Face3( i*6, i*6+1,i*6+2 ) );

			geomAnneau.vertices.push(v3);
			geomAnneau.vertices.push(v4);
			geomAnneau.vertices.push(v1);
			
			
			geomAnneau.faces.push( new THREE.Face3( i*6+3, i*6+4,i*6+5 ) );
			geomAnneau.computeFaceNormals();
		}
		var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geomAnneau);
		anneau = new THREE.Mesh( bufferGeometry, matAnneau );
		scene.add( anneau );
	}
	 
	var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geomPlanete);
	tPla[n] = new THREE.Mesh( bufferGeometry, matPlanete );
	
	scene.add( tPla[n] );	
}

var imageSoleil;

function avanceImage() {

	// on créé la sphère
	var geomSoleil = new THREE.SphereGeometry( 30, 32,32 ); 
	var texture = new THREE.Texture( imageSoleil );
	
	var matSoleil = new THREE.MeshBasicMaterial({
        //emissive: '#FFFF77',
		map: texture,
		
    });

	texture.needsUpdate = true;	
	
	var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geomSoleil);
	meshSoleil = new THREE.Mesh( bufferGeometry, matSoleil );
	
	scene.add( meshSoleil );
	
	animate();
	
}

function creeSoleil(){
    imageSoleil = document.createElement( 'img' );
	imageSoleil.onload = function () {
		avanceImage();
	}
	imageSoleil.src='data:image/jpg;base64,/9j/4R6wRXhpZgAATU0AKgAAAAgADQEAAAMAAAABB9AAAAEBAAMAAAABA+gAAAECAAMAAAADAAAAqgEGAAMAAAABAAIAAAESAAMAAAABAAEAAAEVAAMAAAABAAMAAAEaAAUAAAABAAAAsAEbAAUAAAABAAAAuAEoAAMAAAABAAIAAAExAAIAAAAcAAAAwAEyAAIAAAAUAAAA3IKYAAIAAAA4AAAA8IdpAAQAAAABAAABKAAAAWAACAAIAAgAACcQAAAnEAAAJxAAACcQQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzADIwMTU6MDc6MDEgMTc6NDQ6MjQAQ29weXJpZ2h0IDIwMDEgQ2FsdmluIEouIEhhbWlsdG9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLgAABJAAAAcAAAAEMDIyMaABAAMAAAAB//8AAKACAAQAAAABAAABAKADAAQAAAABAAAAgAAAAAAAAAAGAQMAAwAAAAEABgAAARoABQAAAAEAAAGuARsABQAAAAEAAAG2ASgAAwAAAAEAAgAAAgEABAAAAAEAAAG+AgIABAAAAAEAABzqAAAAAAAAAEgAAAABAAAASAAAAAH/2P/iCgRJQ0NfUFJPRklMRQABAQAACfQAAAAAAgIAAG1udHJSR0IgWFlaIAfZAAkAHQAQACQAK2Fjc3BNU0ZUAAAAAFNFQyBGUEQgAAAAAAAAAAAAAAABAAD21QABAAAAANMsU0VDIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAOGRlc2MAAAGIAAAAgGNoYWQAAAIIAAAALHRlY2gAAAI0AAAADGRtbmQAAAJAAAAAemRtZGQAAAK8AAAAYnJYWVoAAAMgAAAAFGdYWVoAAAM0AAAAFGJYWVoAAANIAAAAFHd0cHQAAANcAAAAFGJrcHQAAANwAAAAFGx1bWkAAAOEAAAAFHJUUkMAAAOYAAACDGdUUkMAAAWkAAACDGJUUkMAAAewAAACDGNhbHQAAAm8AAAAFHZpZXcAAAnQAAAAJHRleHQAAAAAQ29weXJpZ2h0IChjKSAyMDAzIFNhbXN1bmcgRWxlY3Ryb25pY3MgQ28uLCBMdGQAZGVzYwAAAAAAAAAkU2Ftc3VuZyAtIE5hdHVyYWwgQ29sb3IgUHJvIDEuMCBJQ00AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzZjMyAAAAAAABDEYAAAXb///zMgAAB5YAAP2M///7pf///akAAAPSAADAsHNpZyCKndiJQ1JUIGRlc2MAAAAAAAAAHVNhbXN1bmcgRWxlY3Ryb25pY3MgQ28uLCBMdGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAAUgICAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAHGeAAA5HwAAAlJYWVogAAAAAAAAXr8AALBdAAAX5VhZWiAAAAAAAAAmeAAAFocAALj2WFlaIAAAAAAAAPbVAAEAAwAA0yxYWVogAAAAAAAAQAAAAEAAAABAAFhZWiAAAAAAAAAAAAD6AAAAAAAAY3VydgAAAAAAAAEAAAAAAAABAAMABwALABEAGAAgACkANABBAE4AXQBuAIAAlACpAMAA2ADyAQ0BKgFJAWkBiwGvAdQB+wIkAk8CewKpAtkDCgM9A3IDqQPiBBwEWQSXBNcFGQVdBaIF6gYzBn4GywcaB2sHvggTCGoIwwkdCXoJ2Qo5CpwLAQtnC9AMOgynDRYNhg35Dm4O5Q9eD9kQVhDVEVYR2RJeEuYTbxP7FIkVGRWqFj8W1RdtGAgYpBlDGeQahxssG9Qcfh0pHdcehx86H+4gpSFeIhki1yOWJFglHCXjJqsndihDKRIp5Cq3K44sZi1ALh0u/C/eMMExpzKQM3o0ZzVWNkg3PDgyOSo6JTsiPCE9Iz4nPy5ANkFBQk9DX0RxRYVGnEe1SNFJ70sPTDJNV05/T6lQ1VIEUzVUaFWeVtdYEVlOWo5b0F0UXltfpGDwYj5jj2TiZjdnj2jpakZrpW0Hbmtv0nE7cqd0FXWFdvh4bnnme2B83X5df9+BY4LqhHOF/4eOiR+KsoxIjeGPfJEZkrmUXJYBl6mZU5sAnK+eYaAVocyjhqVCpwGowqqFrEyuFa/gsa6zf7VStyi5ALrbvLi+mMB7wmDESMYyyCDKD8wBzfbP7tHo0+XV5Nfm2erb8d374AjiF+Qo5j3oVOpt7InuqPDK8u71Ffc++Wr7mf3K//9jdXJ2AAAAAAAAAQAAAAAAAAEAAwAHAAsAEQAYACAAKQA0AEEATgBdAG4AgACUAKkAwADYAPIBDQEqAUkBaQGLAa8B1AH7AiQCTwJ7AqkC2QMKAz0DcgOpA+IEHARZBJcE1wUZBV0FogXqBjMGfgbLBxoHawe+CBMIagjDCR0JegnZCjkKnAsBC2cL0Aw6DKcNFg2GDfkObg7lD14P2RBWENURVhHZEl4S5hNvE/sUiRUZFaoWPxbVF20YCBikGUMZ5BqHGywb1Bx+HSkd1x6HHzof7iClIV4iGSLXI5YkWCUcJeMmqyd2KEMpEinkKrcrjixmLUAuHS78L94wwTGnMpAzejRnNVY2SDc8ODI5KjolOyI8IT0jPic/LkA2QUFCT0NfRHFFhUacR7VI0UnvSw9MMk1XTn9PqVDVUgRTNVRoVZ5W11gRWU5ajlvQXRReW1+kYPBiPmOPZOJmN2ePaOlqRmulbQdua2/ScTtyp3QVdYV2+HhueeZ7YHzdfl1/34FjguqEc4X/h46JH4qyjEiN4Y98kRmSuZRclgGXqZlTmwCcr55hoBWhzKOGpUKnAajCqoWsTK4Vr+CxrrN/tVK3KLkAutu8uL6YwHvCYMRIxjLIIMoPzAHN9s/u0ejT5dXk1+bZ6tvx3fvgCOIX5CjmPehU6m3sie6o8Mry7vUV9z75avuZ/cr//2N1cnYAAAAAAAABAAAAAAAAAQADAAcACwARABgAIAApADQAQQBOAF0AbgCAAJQAqQDAANgA8gENASoBSQFpAYsBrwHUAfsCJAJPAnsCqQLZAwoDPQNyA6kD4gQcBFkElwTXBRkFXQWiBeoGMwZ+BssHGgdrB74IEwhqCMMJHQl6CdkKOQqcCwELZwvQDDoMpw0WDYYN+Q5uDuUPXg/ZEFYQ1RFWEdkSXhLmE28T+xSJFRkVqhY/FtUXbRgIGKQZQxnkGocbLBvUHH4dKR3XHocfOh/uIKUhXiIZItcjliRYJRwl4yarJ3YoQykSKeQqtyuOLGYtQC4dLvwv3jDBMacykDN6NGc1VjZINzw4MjkqOiU7IjwhPSM+Jz8uQDZBQUJPQ19EcUWFRpxHtUjRSe9LD0wyTVdOf0+pUNVSBFM1VGhVnlbXWBFZTlqOW9BdFF5bX6Rg8GI+Y49k4mY3Z49o6WpGa6VtB25rb9JxO3KndBV1hXb4eG555ntgfN1+XX/fgWOC6oRzhf+HjokfirKMSI3hj3yRGZK5lFyWAZepmVObAJyvnmGgFaHMo4alQqcBqMKqhaxMrhWv4LGus3+1UrcouQC627y4vpjAe8JgxEjGMsggyg/MAc32z+7R6NPl1eTX5tnq2/Hd++AI4hfkKOY96FTqbeyJ7qjwyvLu9RX3Pvlq+5n9yv//ZHRpbQAAAAAH2QAJAB0AEAAkADV2aWV3AAAAAAIkLCsCQOxPAnN+EwBtom8Ac2J2AH1/nQAAAAL/7QAMQWRvYmVfQ00AAv/uAA5BZG9iZQBkgAAAAAH/2wCEAAwICAgJCAwJCQwRCwoLERUPDAwPFRgTExUTExgRDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBDQsLDQ4NEA4OEBQODg4UFA4ODg4UEQwMDAwMEREMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAFAAoAMBIgACEQEDEQH/3QAEAAr/xAE/AAABBQEBAQEBAQAAAAAAAAADAAECBAUGBwgJCgsBAAEFAQEBAQEBAAAAAAAAAAEAAgMEBQYHCAkKCxAAAQQBAwIEAgUHBggFAwwzAQACEQMEIRIxBUFRYRMicYEyBhSRobFCIyQVUsFiMzRygtFDByWSU/Dh8WNzNRaisoMmRJNUZEXCo3Q2F9JV4mXys4TD03Xj80YnlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vY3R1dnd4eXp7fH1+f3EQACAgECBAQDBAUGBwcGBTUBAAIRAyExEgRBUWFxIhMFMoGRFKGxQiPBUtHwMyRi4XKCkkNTFWNzNPElBhaisoMHJjXC0kSTVKMXZEVVNnRl4vKzhMPTdePzRpSkhbSVxNTk9KW1xdXl9VZmdoaWprbG1ub2JzdHV2d3h5ent8f/2gAMAwEAAhEDEQA/AOsFDLH+lW5r3ns1jZH9cbdzWqTMVjC716W7GktNjZdBH5uymz/qmIlNtNX6P0xYbCTJgvJI9pcx4/R+n/1CjZY9m22tjZbMudL90e7a6xsfm/pPRXERjECzIk6XHXhjf0/7t2OKd0LAPX5Zf81E77Nu21Ab9IZta46/yvTakWsJgtbOsgtZGmn85W3d/wCBpWbL6z6u3SHFxBAd/L9L27dn8pibdLpsa0uawDc5pJA/NPJ3b2+3coz5rx9bG/8AvqfXDWwxrS7QCJmf+LUXsY32ixzX9vcACfDixSbWPTJ93eDDZc0j6Jshrva79xiTG2VuAqO0mQCwToDpsdHqO2z+e6xDzKb8dmO7YS2x+wjmCdw0n6TQ1jkSoteYFhd4tc8td/Zbua53+aogM2NkQAZYACHbiefo7LG/13p3Oe+WS47fotBhxBO5rztbtdwlQ/BB+xf02PB9Ox4dqQ1xLt0f6M/vf2lCsfoy8ku26l0bmx/Kd7mtd/XRWMPu9JxbDgSGu26nRrtPc3+oz89OTktmx1rmuAaCWPgA/m+6Ppv930mogChdj/nI4jtf27qNkNbuZV+kB9Noa31NOfUYKtrVDZjvft2HXQEPaNfD06m2oteTufNTRWTG5rP0ZJ7ud+a1z/5fqeoiGt/qQXBzyZe4GdD+a7e31K2fuVfpt/8Ao1LvqJGXTUX/ANLiWXw6EcOnemoyixzSW4zY11j1Tp/Jne3/ADFI4lJgvmmRMwY/8D+j/mrRpeMS0ip9fpvjQlzZcPa7ZZtf+jrc3bsQ786xg2vrb7nbgQXQXA+51e33NUpw44wBlkqetwqU4+n5fVjl+mt97IZVEaHY3Uv+e0trKhuLCW8e6HT+77bGt+kk0B74axrwRILa2yR/V2/9+Yivts2n1N9kTWHgkODZh+57j9Ld/o/51iEG+5wcwPLQ4HUmT5T+9u9n5irEVQs1vqyA2CTv/L95VePqSXgNE7g+GQR/JeWO/wC+Ivo2NkelU5pBIe+ANP8AhN+xyH+j2uLdwLpY4/SJGhLNfpbP639T00Rl7WUBlZBEOJLxvggfo+foP/c/M/4yxOgMZ+bTT+WnCiRmdtem3/eo9lZIAAcD9Fw/Rgz+7vP0P5aQqdBIqbsH55O6J/ke1zkf9Waxu5rSQAWbo/zL9dnrfT2/nqD3NY79ADvcZl4jaB7H27/zXf8AA/Q/wlSBxjv9P/RlCZOwP1f/0Ou2sZJ2bWzBaW6EjT3P+j/L3bfepMaNrdx9uhD+BqdrGu3fQdu+kz8xigTxXLnc8js33vH9Xd/0/wDhFIvG4FjSxwBA0nnlv9ln5/7i4XR2DanN2Q4CXg7nEQTz+99Kz+vtQ4bIIMNJc4NInX6UNj/1X/IUoJ3Q4EjsBuJBHt4H5jf9a0oe8QBDzw0GAAfdsd/K3fvoHwH0SNFw0scdQHM97iCRAH8oR+c5Jwlu21pLGnQOBEGePVH0Nn0m/T/z1EgMENcBrOwA8g6s/wBf3E7/AGDaS5zWxrEaOO5rdRta31PzP/UiI6q6hTpDWnV5I3NLRzJ/OZ+//wAGnc47i4OkyYaNDppu2t+ipbBYJ2gbfotJ5Pn/AFN232oZZDYiH8nQyO7mxHv2oEV9VAhRcC4y4kOkkHWdfo7v9d6kwOrcSCA5kPcdRAHHEfvKDWlwIYIe/wDNBgRztP5rn/m7npyG1jRzRBnZB5BgsH53/nCQB3/FJ7fgzdIbteHbGmIII1B+j6jfotZ9Jn0/89OA1zR6kOaQDviAZMMa79x+7bu/cUhi5D2QwOe1kcxJBO/aGR+8z6H/AKkT3VtrHrMI2NbNbwPp7vbsbI/N3el/pFJ7cq4jE8Nf4zHxC6B1vp/L9Jg+xwLfUeeSS4GTMbNun0v6/wBB6i4hzR6k7nSSPgB9Lbt9zt36NPXVudt1Lyfe3aQQXD3sdI/N/P2KEb5bWCHHSN2ka6f+dJhvfv8A4S4V9n0ZzY0mXe5vveeOPu/OKThA2vaQxhI2wQJn37nfR/lfR9//AIGoENrGjmgAzsg8zBYP3v8AzBGGJkPZ7A57WRzyWk79oZH7zPof+pEYxlIkAGR7D1f81RIFEmh/ioxUw6+0NcAQ/UAEnawfyfdt9Rn5iVjXw07i57dSAWkD817m/wDU+oxn9RFurDB6tZGwN/RuH5+7TY2R+bu9L/SILmQ2I/SE7iYkj94bW/6/4RKUeE8JGvmqMro/msHMADedpc5vPju2ae3upnVxFgDg0bnN3GBA9mkBn521Da0uBDBD3fmgwI19rvzXP/M3PTlrWD2ua2DO2DoZgsH+v5iaLSQL6v8A/9HrCxpa2G6Fu4Hx/lujdt9r/wA1OWhjR6oBBMtABhwd9F3Pu/kKLXNb7du4t/Sbp5DT+9P0/wCwiMM7y6PcS4g93O92127+r9FcKKp2TYVG0k8sAE7TA1/O/wA36aI01Oa4O97jJDOHD4fyPb/r+eN9m5hc5xDDq4TLjof+j+7tUq7KwxrLG+p6kAbmzE/RfsH73+m+n6idGr3777LSDXW/BZ59R21zQy4uBe4QAC7xE+m3d9Gx6jBaQS0FwboZmAPFsfmbv3EvUZ6m0MBbWSGgTB2j9Lsrfu/P+mmcXNdFn6V0eoLN0ghup22T7v3faxI667m9/wBv95IB2rStmZ2UsItG5r42OEiRPs2fvMd9JNq2REMaBO0x9I6v/eUWxue90S8n2xPvcePcpa2Bxdr+aQPpQN3sO4/vfnoaHQaD9EfxV5/VbYRrY6CeCZMtkD3f+dJbpY4H3PP0nfRkHv8Au/pP++VpwdhaH/pNPokDk/vFu32vj3/+CKBdMsMOILoLjPH85t3fS/4RK+31vVIS15FtbNtcit7AAZkwNHOb9P027Nn0f/UilZYGM22y5jgAyCQ2J9uxo+kx7VXa5rfbt3Fvv3eIaf3p/nP7CmwS573x75JaRPuJn86fD3o+4eECzW0b1FfpelBgLuv4lnbkWWWA2gFoA9zSW7mkNG92n6Rv76es1uY5j5scJIafp/1/6r/Z9FRNhtbDnQ0mTJk6j6Jf+YxJj62zVY31NxDQXCYP5r9rf3/9N/OeojxcUrMr4v0pftW16aAojpFVji7cHMDbjrYWnbzr9H6Hu9vqJ68i6tm2uRW9gAMyYGjnNHv9NmzZ/r+kQ3PaXGtrWwyWt5j2x6uxj/5X0lBrmt9u3cW+/dPIYf3p/nP7CHGRKwfV+8F3CCKI+hbNlvpti2XNIArAJDSJ9mxg+kx7dqg9zi5zz9GBJB2iDHv/AM36blFglz3u2++SWnX3n3a7v+mpOc61hkktP0mzLjIJ/wAz9zakZcV7+A/75AAH7f7GVZrcx1b5e4SWtP0o/f8A6r/Z9H/wRRseXbg5obcdbC3TnX6P0Pd7fUTscxgFdoFm+AJE7SdN21v73+l/nfU/nENzmkmtrWhrJa3kD2j9LsY/+V9JEn07jxBUBqdD3vo//9Lq2BwcGkbmtgCNu0RO36X8t37icSxk6xG1wIkQJBb+9td/L9/pqRaHaMO5p03bdPb7ny72t/O3e56aGhu6ZLCARGgJOj9R/bXCa/2uzd/7zAhwAfMnaZJAkT9JoH73/nCkWta7TaTO0CARMGSz6Pt/6CX6R7iS0ue3TtA09rZa76bvp/mKHtcGtcdB5kEHvucErXfy0XYC5oEEtEnTUTG6Nx9376mXust3lpLXkOjQgafo/wCc/s/mJiGuIePoAAXGJDtfZsk7Ppfm7k/ov1Badx9sQIndxuO1z27iiAa01/sQSOtMSHNbAa46QRt3DQlun/qRO6Ghzmgj90aRBH0pH57dv0WJNbvaCydwnaDoCf5P/flP0nPYfa59ggRoHTEt/wCj/wBuJV4IJA3Pmw2w72bTA2y4SNB7odH7rvz/APzNMwFzY92xoJkQe25urvd+9/URqaq7/wBI61jBB2t9xcAB7W/5yGWOLgfog+17nHQ7T9LXb7Wv2omJAB0o3sf+5/R/w1cQ1HUd2LA5pDSNzWwBG3aI+j9P+W79xOJYwwDG2HCNIBIc1r/pe7b/AIREfUGEiPoja8OGhjX9F+c/b9P9J71AAF25rdzYO1sHWTO6W/5zP30CCDR3VYOq4MxYACQZcZJn9zd/pWs/qqG6YdoXE7QHQ4kndvf/AOdp3+qHGPzNZIIOg9/6M7v/AEoovaHAlxLgDLjoHAk/n+mfpptlIAVWC5oB3bGgmRBExLRud7v3v6n84xOwOaWtI3NbAEbdrY+j9P8Alu/cSfu3EfRc0AWT4y7Z7J3fTZ9D9J/NJhrO8e0gMaRwHDaSLP5G6z/X1EUr61tIg6ja4Rpy7c1r/pe7b/hPzFJ7pabBzr5z/L3fvMb7FCdSHABk7Q6dASfpO/d930f8H/wim/UjcB6rSRtPMzwyPf8A1ktfp+CDusWta7SHOEMAIBnQ6t43N/rqNYLmga7WgmRBExLW7nf2v6n84p7GFg37treGzBn6Rl7B/qxI+kLBvdtaRq4EEO2+727fpN+j+ckNVXp3L//T7FrWsd+nJ3uMQwxtA97Ktn5rv+G+h/g7VP8AVmsdte0kAh+2P8+jTZ630N356AbXQAbW7B+YBuif5ftc5LfWSSSHA/Saf0YM/vbB9D+QuGGQdvr/AOiuwYE7k/RI+hrKC+wAiGgBh3wQP0nH0H/v/mf8ZYh/o9rQ7cC+HtHJI1Afp9LZ/V/r+mietY2D6tTmkAFjIA0/4PZschWZGoAYA0RtLIZBH8pgY7/viMzjPy6afy14lREzvr13/wC+UX+5pa8P2hpGhMnzj97d7/zEVlVkD091kRYWkEODSZYGsaPpbvpep/OsQnEPfLnteCIIdY2SP627/vrEtzKhtDyW8+2HT+97q3N+kmg1Zo1tokiwAN/5fup6a3VvsayS5hAexzTBO727jLv+gn372usaGsYHCS327hO7e8Nfu9Nrm/o/z60AZlRkMJp7ASY/8E+j/ZdvUH3Pc0B2S2OYn1TzP0oD2/56eJAAjXr/AC9UUe3Imzptvv8A81tNe8PBA9SyNrQ4TzqXt9MtfWz9+39J6ihZjBz9tjhWdQ1z/wBGSdPa381m/wDkep6iFvx3v3bzrqQWNGvj6lrrVMVw1219X6QD1HFzfU049N5t2tS39JiZVroeL/o8SK4Td8P04VD7S2K21Oa5ocQHsIAM+72z9N/t+imc9wj1WlsEgFzY1Orm6+5v9d/56FYf0YaAXbdA2dzY/kt9zWu/qKfqMeB6lbw7QFzQXbo/0g/e/sqMka1Y/wCcu4etXvtus0WOLXgOlsEuI2u1O0sG53u+imcWljtYAJ3kkh255DSPp7Ht/NfsrUrQ15k1l3g5rC139p21rnf5yHt2EOrZsI4kHcNI+i4tY5DiHjquH2LuL6T+kbs00DzO0fRd7Z9T/ttlmxO949MD3CIESPcyJ9te5vta/wDfd/wiix7G+41ua/v7QAT482KTLIa6XtaXazMzP/GJeQ3SQe2ytpLorc0vawkta4kgfnN4929vu2J69l9YFW0RLQ0EgO/ker7duz+S9IOYTIc2dIIcyNNf5ux27/wRJv2bdutI36y/c1x1/k+o1EeSDt1vp/vJq63s3VPe2WxDWy/dHt3NrdH5v6P1k91VNX6T1BYbCBAgvJIlwa9h/R+n/wBQhuymM2+hc3Y0hwrdLoI/O33V/wDUvUTeyx/q2Na957ue2R/UO7c1qklKIFCJJF1LXhj+P/cLOGd2bAPT5Zf85//Z/+0l+FBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAABTHAFaAAMbJUccAVoAAxslRxwCAAACAAIcAnQAN0NvcHlyaWdodCAyMDAxIENhbHZpbiBKLiBIYW1pbHRvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC4AOEJJTQQlAAAAAAAQHQ77g0jV8KSF52nI6YHJxThCSU0EOgAAAAAAtwAAABAAAAABAAAAAAALcHJpbnRPdXRwdXQAAAAEAAAAAFBzdFNib29sAQAAAABJbnRlZW51bQAAAABJbnRlAAAAAENscm0AAAAPcHJpbnRTaXh0ZWVuQml0Ym9vbAAAAAALcHJpbnRlck5hbWVURVhUAAAAIQBIAFAAOQA3AEEANAA3ADcAIAAoAEgAUAAgAE8AZgBmAGkAYwBlAGoAZQB0ACAAUAByAG8AIAA4ADYAMAAwACkAAAA4QklNBDsAAAAAAbIAAAAQAAAAAQAAAAAAEnByaW50T3V0cHV0T3B0aW9ucwAAABIAAAAAQ3B0bmJvb2wAAAAAAENsYnJib29sAAAAAABSZ3NNYm9vbAAAAAAAQ3JuQ2Jvb2wAAAAAAENudENib29sAAAAAABMYmxzYm9vbAAAAAAATmd0dmJvb2wAAAAAAEVtbERib29sAAAAAABJbnRyYm9vbAAAAAAAQmNrZ09iamMAAAABAAAAAAAAUkdCQwAAAAMAAAAAUmQgIGRvdWJAb+AAAAAAAAAAAABHcm4gZG91YkBv4AAAAAAAAAAAAEJsICBkb3ViQG/gAAAAAAAAAAAAQnJkVFVudEYjUmx0AAAAAAAAAAAAAAAAQmxkIFVudEYjUmx0AAAAAAAAAAAAAAAAUnNsdFVudEYjUHhsP/AAAAAAAAAAAAAKdmVjdG9yRGF0YWJvb2wBAAAAAFBnUHNlbnVtAAAAAFBnUHMAAAAAUGdQQwAAAABMZWZ0VW50RiNSbHQAAAAAAAAAAAAAAABUb3AgVW50RiNSbHQAAAAAAAAAAAAAAABTY2wgVW50RiNQcmNAWQAAAAAAADhCSU0D7QAAAAAAEAABAAAAAQACAAEAAAABAAI4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0D8gAAAAAACgAA////////AAA4QklNBA0AAAAAAAQAAAB4OEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNBAoAAAAAAAEBADhCSU0ECwAAAAAAKWh0dHA6Ly9zb2xhcnZpZXdzLmNvbS9jYXAvc3VuL3N1bmN5bDEuaHRtADhCSU0nEAAAAAAACgABAAAAAAAAAAI4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA0cAAAAGAAAAAAAAAAAAAACAAAABAAAAAAkAcwBvAGwAZQBpAGwANQAxADIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAQAAAACAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAACAAAAAAFJnaHRsb25nAAABAAAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAAAAxFU2xpY2VPcmlnaW4AAAANYXV0b0dlbmVyYXRlZAAAAABUeXBlZW51bQAAAApFU2xpY2VUeXBlAAAAAEltZyAAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAAAgAAAAABSZ2h0bG9uZwAAAQAAAAADdXJsVEVYVAAAAAEAAAAAAABudWxsVEVYVAAAAAEAAAAAAABNc2dlVEVYVAAAAAEAAAAAAAZhbHRUYWdURVhUAAAAAQAAAAAADmNlbGxUZXh0SXNIVE1MYm9vbAEAAAAIY2VsbFRleHRURVhUAAAAAQAAAAAACWhvcnpBbGlnbmVudW0AAAAPRVNsaWNlSG9yekFsaWduAAAAB2RlZmF1bHQAAAAJdmVydEFsaWduZW51bQAAAA9FU2xpY2VWZXJ0QWxpZ24AAAAHZGVmYXVsdAAAAAtiZ0NvbG9yVHlwZWVudW0AAAARRVNsaWNlQkdDb2xvclR5cGUAAAAATm9uZQAAAAl0b3BPdXRzZXRsb25nAAAAAAAA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LmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiBwaG90b3Nob3A6TGVnYWN5SVBUQ0RpZ2VzdD0iMTlCOEQ1MTUwOTI2QUVDRDEzRjIxMkNGNDExMTEwNzQiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgeG1wTU06RG9jdW1lbnRJRD0iMDlBRTFFRTcxMTk1MjA3NjE5Mzg5Q0UxMTdFMTkxOEMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUU1NTU5QzEwNjIwRTUxMTk2RUNCQzE0MUQ2REZBMTgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iMDlBRTFFRTcxMTk1MjA3NjE5Mzg5Q0UxMTdFMTkxOEMiIHhtcDpDcmVhdGVEYXRlPSIyMDE1LTA2LTMwVDIxOjIwOjA1KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNS0wNy0wMVQxNzo0NDoyNCswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNS0wNy0wMVQxNzo0NDoyNCswMjowMCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcFJpZ2h0czpXZWJTdGF0ZW1lbnQ9Imh0dHA6Ly9zb2xhcnZpZXdzLmNvbS9jYXAvc3VuL3N1bmN5bDEuaHRtIiB4bXBSaWdodHM6TWFya2VkPSJUcnVlIj4gPGRjOnJpZ2h0cz4gPHJkZjpBbHQ+IDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+Q29weXJpZ2h0IDIwMDEgQ2FsdmluIEouIEhhbWlsdG9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLjwvcmRmOmxpPiA8L3JkZjpBbHQ+IDwvZGM6cmlnaHRzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpBMTUzQjAxOTVEMUZFNTExQURDQkNDNjU2QTRGREJENiIgc3RFdnQ6d2hlbj0iMjAxNS0wNi0zMFQyMToyMDo0MiswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpBMjUzQjAxOTVEMUZFNTExQURDQkNDNjU2QTRGREJENiIgc3RFdnQ6d2hlbj0iMjAxNS0wNi0zMFQyMToyMDo1MSswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpBMzUzQjAxOTVEMUZFNTExQURDQkNDNjU2QTRGREJENiIgc3RFdnQ6d2hlbj0iMjAxNS0wNi0zMFQyMTozMTowNyswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNDUzQjAxOTVEMUZFNTExQURDQkNDNjU2QTRGREJENiIgc3RFdnQ6d2hlbj0iMjAxNS0wNi0zMFQyMTozMTowNyswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RDU1NTlDMTA2MjBFNTExOTZFQ0JDMTQxRDZERkExOCIgc3RFdnQ6d2hlbj0iMjAxNS0wNy0wMVQxNzo0NDoyNCswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RTU1NTlDMTA2MjBFNTExOTZFQ0JDMTQxRDZERkExOCIgc3RFdnQ6d2hlbj0iMjAxNS0wNy0wMVQxNzo0NDoyNCswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+4ADkFkb2JlAGQAAAAAAf/bAIQACgcHBwgHCggICg8KCAoPEg0KCg0SFBAQEhAQFBEMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAELDAwVExUiGBgiFA4ODhQUDg4ODhQRDAwMDAwREQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAgAEAAwERAAIRAQMRAf/dAAQAIP/EAaIAAAAHAQEBAQEAAAAAAAAAAAQFAwIGAQAHCAkKCwEAAgIDAQEBAQEAAAAAAAAAAQACAwQFBgcICQoLEAACAQMDAgQCBgcDBAIGAnMBAgMRBAAFIRIxQVEGE2EicYEUMpGhBxWxQiPB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';
}