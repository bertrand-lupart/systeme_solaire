var divmenu,divplanetes,divonglets;

function initDivOnglets() {
	var fsOnglets=Math.round(hMenu*6)/10;
	divonglets=document.createElement('div');
	divonglets.className= 'onglets';
	document.body.appendChild(divonglets);
	
	divonglets.style.position = "absolute";
	divonglets.style.left = xFen+"px";
	divonglets.style.top = hGL-hMenu0+"px";
	divonglets.style.width=lGL+"px";
	divonglets.style.height=hMenu0+"px";
	divonglets.style.fontSize=fsOnglets+"px";
	rafrOnglets();

}

function rafrOnglets() {
	var texte="<table height='100%'>";
	var largeOnglet=Math.round(lGL*0.235);
	var txtTD="<td class='ong' width='"+largeOnglet+"px'>";
	var txtTDSel="<td class='ongsel ong' width='"+largeOnglet+"px'>";
	var txtTDNoSel="<td class='ongnolink ong' width='"+largeOnglet+"px'>";
	texte+="<tr>";
	if (modeG=="carac") {texte+=txtTDSel;}
	else {texte+=txtTD;}
	texte+="<a href='javascript:afficheCaracGen();'>Vue&nbsp;d'ensemble</a>";
	texte+="</td>";
	if (nbEnv<=0) {texte+=txtTDNoSel;}
	else if (modeG=="struct") {texte+=txtTDSel;}
	else {texte+=txtTD;}
	texte+="<a href='javascript:afficheStructure();'>Structure</a>";
	texte+="</td>";
	if (!isDiag) {texte+=txtTDNoSel;}
	else if (modeG=="diag") {texte+=txtTDSel;}
	else {texte+=txtTD;}
	texte+="<a href='javascript:afficheDiag(true);'>Etats&nbsp;de&nbsp;l'eau</a>";
	texte+="</td>";
	
	if (nbGaz<0) {texte+=txtTDNoSel;}
	else if (modeG=="atm") {texte+=txtTDSel;}
	else {texte+=txtTD;}
	texte+="<a href='javascript:afficheAtm();'>Atmosphère</a>";
	texte+="</td>";
	
	if (!hasSat) {texte+=txtTDNoSel;}
	else if (modeG=="sat") {texte+=txtTDSel;}
	else {texte+=txtTD;}
	if (isSatel) {
		texte+="";
	}
	else {
		texte+="<a href='javascript:afficheSats();'>Satellite(s)</a>";
	}
	texte+="</td>";

	texte+"</tr>";
	texte+"</table>";
	divonglets.innerHTML=texte;
}

function initDivMenu() {
	divmenu=document.createElement('div');
	divmenu.className= 'menu';
	divmenu.style.zIndex=8;
	document.body.appendChild(divmenu);
	
	divplanetes=document.createElement('div');
	divplanetes.className= 'menu';
	divplanetes.style.zIndex=9;
	divplanetes.style.display= 'none';
	document.body.appendChild(divplanetes);
	
	divautres=document.createElement('div');
	divautres.className= 'menu';
	divautres.style.zIndex=9;
	divautres.style.display= 'none';
	document.body.appendChild(divautres);
	
	divorbites=document.createElement('div');
	divorbites.className= 'menu';
	divorbites.style.zIndex=9;
	divorbites.style.display= 'none';
	document.body.appendChild(divorbites);
	
	divcomp=document.createElement('div');
	divcomp.className= 'menu';
	divcomp.style.zIndex=9;
	divcomp.style.display= 'none';
	document.body.appendChild(divcomp);
	
	var hMenuPlanetes=fsMenu*18;
	var hMenuAutres=fsMenu*12;
	var hMenuInfos=fsMenu*10;
	var lMenuInfos=lMenu/7;
	
	divmenu.style.position = "absolute";
	divmenu.style.padding = divpaddingmenu+"px";
	divmenu.style.left = xFen+"px";
	divmenu.style.top = 0+"px";
	divmenu.style.width=lMenu+"px";
	divmenu.style.height=hMenu+"px";
	divmenu.style.fontSize=fsMenu+"px";
	
	divplanetes.style.position = "absolute";
	divplanetes.style.padding = divpaddingmenu+"px";
	divplanetes.style.left = xFen+Math.round(2*lMenu/10)+"px";
	divplanetes.style.top = yFen+"px";
	divplanetes.style.width=fsMenu*7+"px";
	divplanetes.style.height=hMenuPlanetes+"px";
	divplanetes.style.fontSize=fsMenu+"px";
	
	divautres.style.padding = divpaddingmenu+"px";
	divautres.style.top = yFen+"px";
	divautres.style.width=fsMenu*12+"px";
	divautres.style.height=hMenuAutres+"px";
	divautres.style.fontSize=fsMenu+"px";
	divautres.style.position = "absolute";
	divautres.style.left = xFen+Math.round(3*lMenu/10)+"px";
	
	divcomp.style.padding = divpaddingmenu+"px";
	divcomp.style.top = yFen+"px";
	divcomp.style.width=fsMenu*12+"px";
	divcomp.style.height=hMenuAutres+"px";
	divcomp.style.fontSize=fsMenu+"px";
	divcomp.style.position = "absolute";
	divcomp.style.left = xFen+Math.round(5*lMenu/10)+"px";
	
	divorbites.style.padding = divpaddingmenu+"px";
	divorbites.style.top = yFen+"px";
	divorbites.style.width=fsMenu*12+"px";
	divorbites.style.height=fsMenu*15+"px";
	divorbites.style.fontSize=fsMenu+"px";
	divorbites.style.position = "absolute";
	divorbites.style.left = xFen+Math.round(4*lMenu/10)+"px";
	
}

function init_menu(){
	var lTD=Math.round(lMenu/10);
	var lEspace=Math.round(lMenu/5);
	var texteMenu="<table><tr>";
	var styleTD="<td style='width:"+lTD+"px'>";
	var styleTDNoLink="<td style='width:"+lTD+"px' class='nolinkm'>";
	var styleTDEspace="<td style='width:"+lEspace+"px'>";
	var styleTDAuteur="<td style='width:"+lTD+"px;'>";
	texteMenu+=styleTD;
	texteMenu+="<a href='index.htm'>&nbsp;Accueil&nbsp;</a>";
	texteMenu+="</td>";
	texteMenu+=styleTD;
	texteMenu+="<a href='soleil.htm'>&nbsp;Soleil&nbsp;</a>";
	texteMenu+="</td>";
	texteMenu+=styleTD;
	texteMenu+="<a href='javascript:affichePlanetes(-1)'>&nbsp;Planètes&nbsp;</a>";
	texteMenu+="</td>";
	texteMenu+=styleTD;
	texteMenu+="<a href='javascript:afficheAutres(-1)'>&nbsp;Autres corps&nbsp;</a>";
	texteMenu+="</td>";	
	texteMenu+=styleTD;
	texteMenu+="<a href='javascript:afficheOrbites(-1)'>&nbsp;Orbites&nbsp;</a>";
	texteMenu+="</td>";
	texteMenu+=styleTD;
	texteMenu+="<a href='javascript:afficheCompar(-1)'>&nbsp;Comparaisons&nbsp;</a>";
	texteMenu+="</td>";
	texteMenu+=styleTDEspace;
	texteMenu+="&nbsp;";
	texteMenu+="</td>";
	texteMenu+=styleTDAuteur;
	texteMenu+="<i style='color:#333333'>Auteur&nbsp;:&nbsp;Philippe&nbsp;Cosentino</i>";
	texteMenu+="</td>";
	texteMenu+="</tr></table>";
	divmenu.innerHTML = texteMenu;

	rafrTextMenu();
}

function rafrTextMenu() {
	var clNL="";
	
	
	texteMenu="<p><a href=mercure.htm>&nbsp;&nbsp;Mercure&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=venus.htm>&nbsp;&nbsp;Vénus&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=terre.htm>&nbsp;&nbsp;La Terre&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=mars.htm>&nbsp;&nbsp;Mars&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=jupiter.htm>&nbsp;&nbsp;Jupiter&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=saturne.htm>&nbsp;&nbsp;Saturne&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=uranus.htm>&nbsp;&nbsp;Uranus&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=neptune.htm>&nbsp;&nbsp;Neptune&nbsp;&nbsp;</a></p>";
	divplanetes.innerHTML = texteMenu;
	
	texteMenu="<p><a href=pluton.htm>&nbsp;&nbsp;Pluton (plan&egrave;te naine)&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=eris.htm>&nbsp;&nbsp;Eris (plan&egrave;te naine)&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=ceres.htm>&nbsp;&nbsp;Cérès (plan&egrave;te naine)&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=comete.htm>&nbsp;&nbsp;Com&egrave;tes&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=asteroide.htm>&nbsp;&nbsp;Ast&eacute;roïdes&nbsp;&nbsp;</a></p>";
	divautres.innerHTML = texteMenu;
	
	texteMenu="<p><a href=compdistances.htm>&nbsp;&nbsp;Distances&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=compdiametres.htm>&nbsp;&nbsp;Diamètres&nbsp;&nbsp;</a></p>";
	texteMenu+="<p class='nolinkm'><a href=compmasses.htm>&nbsp;&nbsp;Masses&nbsp;&nbsp;</a></p>";
	divcomp.innerHTML = texteMenu;
	
	texteMenu="<p><a href=vitesseorbitale.htm>&nbsp;&nbsp;Vitesse&nbsp;orbitale&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=periodicite.htm>&nbsp;&nbsp;Périodicité&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=excentricite.htm>&nbsp;&nbsp;Ellipticité&nbsp;&nbsp;</a></p>";
	texteMenu+="<p><a href=excentricite.htm>&nbsp;&nbsp;Excentricité&nbsp;&nbsp;</a></p>";
	texteMenu+="<p class='nolinkm'><a href=compmasses.htm>&nbsp;&nbsp;Inclinaison&nbsp;de&nbsp;l'axe&nbsp;&nbsp;</a></p>";
	texteMenu+="<p class='nolinkm'><a href=compmasses.htm>&nbsp;&nbsp;Précession&nbsp;&nbsp;</a></p>";
	divorbites.innerHTML = texteMenu;
}

function affichePlanetes(v) {
	divorbites.style.display = "none";
	divautres.style.display = "none";
	divcomp.style.display = "none";
	if (v==1) {divplanetes.style.display = "block";} 
	if (v==0) {divplanetes.style.display = "none";}
	if ((v==-1)&&(divplanetes.style.display == "none")) {divplanetes.style.display = "block";} else {divplanetes.style.display = "none";}
}

function afficheAutres(v) {
	divorbites.style.display = "none";
	divplanetes.style.display = "none";
	divcomp.style.display = "none";
	if (v==1) {divautres.style.display = "block";} 
	if (v==0) {divautres.style.display = "none";}
	if ((v==-1)&&(divautres.style.display == "none")) {divautres.style.display = "block";} else {divautres.style.display = "none";}
}

function afficheCompar(v) {
	divorbites.style.display = "none";
	divplanetes.style.display = "none";
	divautres.style.display = "none";
	if (v==1) {divcomp.style.display = "block";} 
	if (v==0) {divcomp.style.display = "none";}
	if ((v==-1)&&(divcomp.style.display == "none")) {divcomp.style.display = "block";} else {divcomp.style.display = "none";}
}

function afficheOrbites(v) {
	divcomp.style.display = "none";
	divplanetes.style.display = "none";
	divautres.style.display = "none";
	if (v==1) {divorbites.style.display = "block";} 
	if (v==0) {divorbites.style.display = "none";}
	if ((v==-1)&&(divcomp.style.display == "none")) {divorbites.style.display = "block";} else {divorbites.style.display = "none";}
}

function afficheCaracGen() {
	modeG="carac";
	if (nbEnv>0) {divstr.style.display="none";divgstr.style.display="none";}
	if (hasSat) {divsat.style.display="none";}
	divbg.style.display="block";
	if (nbGaz>0) {divatm.style.display="none";divtatm.style.display="none";}
	if (isDiag) {afficheDiag(false);}
	rafrOnglets();
}

function afficheStructure() {
	// on place la caméra à la bonne distance
	modeG="struct";
	dist2dist=0;
	distCam=finalDist+dist2dist;
	bougeCamera();
	divstr.style.display="block";
	divgstr.style.display="block";
	divbg.style.display="none";
	if (nbGaz>0) {divatm.style.display="none";divtatm.style.display="none";}
	if (hasSat) {divsat.style.display="none";}
	if (divdiag) {afficheDiag(false);}
	rafrOnglets();
}

function afficheSats() {
	modeG="sat";
	divsat.style.display="block";
	divbg.style.display="none";
	if (nbEnv>0) {divstr.style.display="none";divgstr.style.display="none";}
	if (nbGaz>0) {divatm.style.display="none";divtatm.style.display="none";}
	if (divdiag) {afficheDiag(false);}
	rafrOnglets();
}

function afficheDiag(aff) {
	if (aff) {
		modeG="diag";
		if (nbGaz>0) {divatm.style.display="none";divtatm.style.display="none";}
		if (hasSat) {divsat.style.display="none";}
		divdiag.style.display="block";
		if (nbEnv>0) {divstr.style.display="none";divgstr.style.display="none";}
		divbg.style.display="block";
	}
	else {
		divdiag.style.display="none";
	}
	rafrOnglets();
}

function afficheAtm() {
	modeG="atm";
	divatm.style.display="block";
	divtatm.style.display="block";
	if (hasSat) {divsat.style.display="none";}
	if (divdiag) {afficheDiag(false);}
	if (nbEnv>0) {divstr.style.display="none";divgstr.style.display="none";}
	rafrOnglets();
}
