var centre=new THREE.Vector3(0,0,0);
function animate(){
	if ((typeof mesh === 'undefined')||(divgl.style.display=='none')) {
		return false;
	}
	
	// on rapproche la caméra
	dist2dist=dist2dist*0.9;
	if (dist2dist>1) {
		distCam=finalDist+dist2dist;
		bougeCamera();
	}
	
	if (autoTurn) {
		// on fait tourner la planète
		if (retro) {
			mesh.rotation.y -= 0.005;
		}
		else {
			mesh.rotation.y += 0.005;
		}
		// et éventuellement l'autre 
		if (typeof mesh2 !== 'undefined') {
			mesh2.rotation.y += 0.005*vitMesh2;
		}
	}
    renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
