'use strict';
/* Pièces : de vraies mélodies, faites seulement des notes et des valeurs déjà apprises.
   Une pièce se JOUE, elle ne se passe pas (décision de David, 2026-11-03) : pas de score, pas d'étoiles,
   pas de rouge. Une note juste s'allume. Une fausse note ne fait rien.

   Format : mesures séparées par « | », un jeton par note : « C4:n » (note:valeur).
   Valeurs : n noire, b blanche, bp blanche pointée, r ronde, c croche (les croches d'un même temps sont réunies par une barre).
   Silences sans hauteur : s soupir, dp demi-pause, p pause. Un ~ lie la note à la suivante : « C4:b~ | C4:n ».

   Trois façons de jouer (lancerPiece(id, mode)) :
   - 'ecoute' : l'appli joue la mélodie, la note jouée s'allume ;
   - 'libre'  : à mon rythme, la pièce attend la bonne note ;
   - 'tempo'  : avec la batterie, la pièce avance au tempo (o.lent : 75 % du tempo). Une bonne note jouée près de son temps s'allume ;
   - 'recital': au tempo, sans les noms. Le seul mode qui compte : une médaille (étoile dorée) si 90 % des notes sont justes.
     C'est une médaille, jamais une porte : rien ne s'ouvre ni ne se ferme avec.

   Place dans le chemin : apres = niveau de notes qui précède la pièce, req = niveau de valeurs requis.
   La pièce s'ouvre quand les deux ont 2 étoiles. Elle ne bloque jamais le niveau suivant. */

const PIECES=[
 {id:'clair',titre:'Au clair de la lune',c:4,bpm:76,cle:'sol',apres:'s1',req:'v4',
  // Sans la 3e phrase (« Ma chandelle est morte »), qui descend sous le Do central. Forme A A B A : on joue les trois A.
  m:'C4:n C4:n C4:n D4:n | E4:b D4:b | C4:n E4:n D4:n D4:n | C4:r | '+
    'C4:n C4:n C4:n D4:n | E4:b D4:b | C4:n E4:n D4:n D4:n | C4:r | '+
    'C4:n C4:n C4:n D4:n | E4:b D4:b | C4:n E4:n D4:n D4:n | C4:r'},
 {id:'jacques',titre:'Frère Jacques',c:4,bpm:80,cle:'sol',apres:'s2',req:'v3',
  m:'C4:n D4:n E4:n C4:n | C4:n D4:n E4:n C4:n | E4:n F4:n G4:b | E4:n F4:n G4:b'},
 {id:'joie',titre:'Ode à la joie',sous:'Beethoven',c:4,bpm:80,cle:'sol',apres:'s2',req:'v3',
  // Rythme pointé de la 4e mesure simplifié en noire, noire, blanche.
  m:'E4:n E4:n F4:n G4:n | G4:n F4:n E4:n D4:n | C4:n C4:n D4:n E4:n | E4:n D4:n D4:b | '+
    'E4:n E4:n F4:n G4:n | G4:n F4:n E4:n D4:n | C4:n C4:n D4:n E4:n | D4:n C4:n C4:b'},
 {id:'maman',titre:'Ah ! vous dirai-je maman',sous:'Mozart',c:4,bpm:80,cle:'sol',apres:'s3',req:'v3',
  m:'C4:n C4:n G4:n G4:n | A4:n A4:n G4:b | F4:n F4:n E4:n E4:n | D4:n D4:n C4:b | '+
    'G4:n G4:n F4:n F4:n | E4:n E4:n D4:b | G4:n G4:n F4:n F4:n | E4:n E4:n D4:b | '+
    'C4:n C4:n G4:n G4:n | A4:n A4:n G4:b | F4:n F4:n E4:n E4:n | D4:n D4:n C4:b'},
 // Répertoire de l'étape 4 (2026-11-04).
 {id:'largo',titre:'Largo du Nouveau Monde',sous:'Dvořák',c:4,bpm:60,cle:'sol',apres:'s2',req:'v4',
  // Thème du cor anglais (2e mouvement), transposé en Do. Le rythme pointé (noire pointée, croche) devient deux noires.
  m:'E4:n G4:n G4:b | E4:n D4:n C4:b | D4:n E4:n G4:n E4:n | D4:r | '+
    'E4:n G4:n G4:b | E4:n D4:n C4:b | D4:n E4:n D4:n C4:n | C4:r'},
 {id:'jacques-c',titre:'Frère Jacques, avec les croches',c:4,bpm:72,cle:'sol',apres:'s3',req:'v14',
  // Les trois premières phrases. La 4e (« Ding, dang, dong ») descend au Sol grave, sous le Do central.
  m:'C4:n D4:n E4:n C4:n | C4:n D4:n E4:n C4:n | E4:n F4:n G4:b | E4:n F4:n G4:b | '+
    'G4:c A4:c G4:c F4:c E4:n C4:n | G4:c A4:c G4:c F4:c E4:n C4:n'},
 {id:'surprise',titre:'La Surprise',sous:'Haydn',c:4,bpm:80,cle:'sol',apres:'s7',req:'v3',
  // Thème du 2e mouvement de la Symphonie no 94, une octave plus haut pour rester dans la portée de sol.
  // Les croches de l'original (à 2 temps) deviennent des noires, la noire finale une blanche.
  m:'C5:n C5:n E5:n E5:n | G5:n G5:n E5:b | F5:n F5:n D5:n D5:n | B4:n B4:n G4:b | '+
    'C5:n C5:n E5:n E5:n | G5:n G5:n E5:b | F5:n F5:n D5:n D5:n | B4:n B4:n G4:b'},
];
// Main gauche (après f2) : les mêmes mélodies une octave plus bas, lues en clé de fa. L'enfant les connaît déjà.
const octave=(m,k)=>m.replace(/([A-G])(\d)/g,(x,l,o)=>l+(+o+k));
[['clair','Au clair de la lune, main gauche'],['jacques','Frère Jacques, main gauche']].forEach(([id,titre])=>{
  const b=PIECES.find(x=>x.id===id);PIECES.push({...b,id:id+'-g',titre,cle:'fa',apres:'f2',m:octave(b.m,-1)});});
const DUREE_P={n:1,b:2,bp:3,r:4,c:.5,s:1,dp:2,p:null};
const MOTIFS=['#F2B84B','#5FB0E5','#8FCB6B','#E58FB6','#B49BE8','#F08A5D'];
const SEUIL_MEDAILLE=.9;

/* ----- Lecture du format ----- */
function lirePiece(pc){
  const mesures=pc.m.split('|').map(s=>s.trim().split(/\s+/).filter(Boolean));
  const notes=[];   // une entrée par note écrite (y compris silences), t en temps depuis le début de la pièce
  mesures.forEach((m,mi)=>{let tm=0;
    m.forEach(tk=>{const lie=tk.endsWith('~'),s=tk.replace('~',''),[a,b]=s.includes(':')?s.split(':'):[null,s];
      const val=b,dur=val==='p'?pc.c:DUREE_P[val];
      if(dur==null) throw new Error(`Pièce ${pc.id}, mesure ${mi+1} : valeur inconnue « ${tk} »`);
      const d=a?dDe(a):null;
      notes.push({mi,t:mi*pc.c+tm,tm,val,dur,d,midi:d==null?null:midiDe(d),son:d!=null,lieSuivant:lie});
      tm+=dur;});
    if(Math.abs(tm-pc.c)>1e-6) throw new Error(`Pièce ${pc.id}, mesure ${mi+1} : ${tm} temps au lieu de ${pc.c}`);
  });
  // Liaisons : la note liée ne se rejoue pas, la première dure les deux.
  const sons=notes.filter(n=>n.son);sons.forEach(n=>n.sonDur=n.dur);
  for(let k=sons.length-1;k>=0;k--){const a=sons[k],b=sons[k+1];if(a.lieSuivant&&b){b.lie=true;a.sonDur=a.dur+b.sonDur;}}
  // Motifs : les mesures identiques reçoivent le même numéro (-1 si la mesure n'apparaît qu'une fois).
  const cles=mesures.map(m=>m.join(' ')),groupes=[];
  const motif=cles.map(k=>{ if(cles.filter(x=>x===k).length<2) return -1; let g=groupes.indexOf(k); if(g<0){groupes.push(k);g=groupes.length-1;} return g; });
  return {mesures,notes,nb:mesures.length,motif};
}

/* ----- Dessin d'une ligne de mesures sur la portée ----- */
// Renvoie le SVG de la ligne et, pour chaque note, sa position x et l'indice de son groupe graphique.
function ligneSVG(pc,lu,m0,m1,o){
  const p=o.geo.portees[0],c=pc.c,bw=o.bw,pad=28,coulT='var(--ry,var(--staff))';
  let x=o.x0,h='';const debuts=[],fins=[];
  if(m0===0){ h+=chiffreSVG(x+22,c); x+=50; }
  const dansLigne=lu.notes.filter(n=>n.mi>=m0&&n.mi<m1);
  for(let mi=m0;mi<m1;mi++){debuts[mi]=x;x=x+pad+c*bw+pad*.5;fins[mi]=x;
    h+=`<line x1="${x}" x2="${x}" y1="${p.bas-80}" y2="${p.bas}" stroke="var(--staff)" stroke-width="${mi===lu.nb-1?4:2}"/>`;}
  const r=n=>n.d-REF[p.cle];
  // À mon rythme : les mesures qui se répètent ont la même couleur de fond, pour repérer les motifs.
  if(o.motifs){ let f='';
    for(let mi=m0;mi<m1;mi++){ const g=lu.motif[mi]; if(g<0) continue;
      f+=`<rect class="motif" x="${debuts[mi]+6}" y="${p.bas-112}" width="${fins[mi]-debuts[mi]-12}" height="150" rx="12" fill="${MOTIFS[g%MOTIFS.length]}" opacity=".22"/>`; }
    h=f+h; }
  dansLigne.forEach(n=>{n.x=debuts[n.mi]+pad+n.tm*bw+6;});
  // Croches : réunies deux par deux sur un même temps.
  const croches=dansLigne.filter(n=>n.val==='c');
  croches.forEach(n=>{n.paire=croches.find(k=>k!==n&&k.mi===n.mi&&Math.floor(k.tm)===Math.floor(n.tm));});
  dansLigne.forEach((n,i)=>{
    n.g=i;
    if(!n.son){ h+=`<g class="sym" data-i="${i}">${symboleTok(n.val,n.x,bw)}</g>`; return; }
    const y=yNote(p,n.d),rr=r(n);let s='';
    for(let k=-2;k>=rr;k-=2){const yy=p.bas-k*ESP;s+=`<line x1="${n.x-21}" x2="${n.x+21}" y1="${yy}" y2="${yy}" stroke="var(--staff)" stroke-width="1.8"/>`;}
    for(let k=10;k<=rr;k+=2){const yy=p.bas-k*ESP;s+=`<line x1="${n.x-21}" x2="${n.x+21}" y1="${yy}" y2="${yy}" stroke="var(--staff)" stroke-width="1.8"/>`;}
    const plein=n.val==='n'||n.val==='c',ronde=n.val==='r';
    s+=tete(n.x,y,plein,ronde);
    // Tige vers le haut sous la 3e ligne, vers le bas à partir d'elle. Une paire de croches suit la note la plus loin de la 3e ligne.
    const ref=n.paire?(Math.abs(r(n)-4)>=Math.abs(r(n.paire)-4)?n:n.paire):n,haut=r(ref)<4;
    n.haut=haut;
    if(!ronde){ const sx=haut?n.x+11.2:n.x-11.2;
      const bout=n.paire?(haut?Math.min(y,yNote(p,n.paire.d))-62:Math.max(y,yNote(p,n.paire.d))+62):(haut?y-62:y+62);
      s+=`<line x1="${sx}" x2="${sx}" y1="${haut?y-2:y+2}" y2="${bout}" stroke="${coulT}" stroke-width="2.4"/>`;
      n.sx=sx;n.bout=bout;
      if(n.val==='c'&&!n.paire) s+=`<path d="M${sx} ${bout} q14 ${haut?18:-18} 10 ${haut?40:-40}" fill="none" stroke="${coulT}" stroke-width="3"/>`; }
    if(n.val==='bp') s+=`<circle cx="${n.x+24}" cy="${rr%2===0?y-5:y}" r="4" fill="${coulT}"/>`;
    if(o.noms) s+=`<text class="nom-note" x="${n.x}" y="${p.bas+42}" text-anchor="middle" font-family="var(--f-display)" font-weight="700" font-size="17" fill="${coul(n.d)}">${nomD(n.d)}</text>`;
    h+=`<g class="sym" data-i="${i}">${s}</g>`;
  });
  // Barres des croches (dessinées une fois, sur la première de la paire).
  croches.forEach(n=>{ if(!n.paire||n.paire.tm<n.tm) return; const a=n,b=n.paire,e=a.haut?7.5:-7.5;
    h+=`<path d="M${a.sx} ${a.bout} L${b.sx} ${b.bout} L${b.sx} ${b.bout+e} L${a.sx} ${a.bout+e} Z" fill="var(--staff)"/>`; });
  // Liaisons : un arc du côté opposé à la tige.
  dansLigne.forEach((n,i)=>{ if(!n.son||!n.lieSuivant) return; const b=dansLigne.slice(i+1).find(k=>k.son); if(!b) return;
    const y=yNote(p,n.d)+(n.haut?14:-14),x1=n.x+6,x2=b.x-6,mx=(x1+x2)/2,cb=n.haut?16:-16;
    h+=`<path d="M${x1} ${y} Q${mx} ${y+cb} ${x2} ${y} Q${mx} ${y+cb*.65} ${x1} ${y}Z" fill="var(--staff)"/>`; });
  return {h,notes:dansLigne};
}

/* ----- Jouer une pièce ----- */
const etatsPieces=()=>P().pieces||(P().pieces={});
const etatPieceDe=id=>etatsPieces()[id]||(etatsPieces()[id]={fois:0,medaille:false});
function lancerPiece(id,mode='libre',o={}){
  const pc=PIECES.find(x=>x.id===id);if(!pc){toast('Pièce introuvable.');return;}
  const lu=lirePiece(pc),geo=geom(pc.cle);
  montrer('jeu');garderEcran();$('#jeu').classList.add('mode-piece');
  const rc=$('#scene').getBoundingClientRect();
  const W=Math.round(Math.max(560,Math.min(1100,geo.H*1.15*(rc.width/Math.max(1,rc.height)))));
  // Autant de mesures par ligne que la largeur le permet, sans que les notes deviennent trop serrées (2 à 4).
  const parLigne=Math.max(2,Math.min(4,Math.floor((W-160)/(pc.c*58+42))));
  const lignes=[];for(let m=0;m<lu.nb;m+=parLigne)lignes.push([m,Math.min(lu.nb,m+parLigne)]);
  const auTempo=mode==='tempo'||mode==='recital';
  const noms=mode==='recital'?false:mode==='ecoute'?true:!!P().nomsPieces;
  const S=G={piece:pc,mode,o,lu,geo,W,lignes,li:0,fin:false,noms,
    bpm:Math.round(pc.bpm*(auTempo?R().vitesse:1)*(o.lent?.75:1)),sons:lu.notes.filter(n=>n.son&&!n.lie),justes:0};
  lu.notes.forEach(n=>{n.juste=false;n.bonMoment=false;});
  $('#prog').style.width='0%';$('#score').textContent='';$('#combo').textContent='';
  $('#consigne').textContent={ecoute:'Écoute la pièce et suis les notes.',libre:'Joue chaque note. La pièce t\'attend.',
    tempo:'Joue avec la batterie. Si tu te trompes, continue !',recital:'Récital : toute la pièce, sans les noms. Si tu te trompes, continue !'}[mode];
  $('#encourage').classList.remove('vu');$('#encourage-masc').innerHTML=mascotte(46);
  const bn=$('#b-noms');bn.hidden=mode==='ecoute'||mode==='recital';majBoutonNoms();
  bn.onclick=()=>{ if(G!==S||S.fin) return; S.noms=!S.noms;P().nomsPieces=S.noms;sauver();majBoutonNoms();faireClavier();if(S.ligne)repeindre(); };
  const ds=[...new Set(S.sons.map(n=>n.d))];
  const [lo,hi]=bornesClavier(ds,'portee');
  const faireClavier=()=>{clavJeu=clavier($('#clavier-jeu'),lo,hi,{noms:S.noms?'tous':'do',onNote:m=>{ecoute.ignorer(900);pieceNote(m,performance.now(),'ecran');}});};
  faireClavier();
  const dec=R().decalage||{};S.decal={micro:dec.micro??.06,ecran:dec.ecran??.02};
  (async()=>{
    if(mode!=='ecoute'&&R().entree==='micro'){const ok=await ecoute.demarrer();
      if(G!==S) return;
      if(ok){ecoute.onAttaque=null;ecoute.onNote=(m,t)=>pieceNote(m,t,'micro');
        ecoute.onTrame=({rms})=>{$('#vu').style.width=Math.min(100,rms/(R().seuil*4)*100)+'%';};$('#entendu-txt').textContent='J\'écoute…';}
      else{$('#entendu-txt').textContent='Micro indisponible';toast('Le micro n\'est pas accessible. Tu peux jouer sur le clavier à l\'écran.',4200);}
    } else $('#entendu-txt').textContent=mode==='ecoute'?'L\'appli joue':'Clavier à l\'écran';
    pieceLigne();
  })();
}
function majBoutonNoms(){ const b=$('#b-noms');if(!G||!G.piece)return; b.textContent=G.noms?'Cacher les noms':'Voir les noms'; b.setAttribute('aria-pressed',String(G.noms)); }
// Dessine la ligne courante. Les notes gardent leur état (allumées ou non) : on peut redessiner en pleine pièce.
function peindreLigne(){
  const S=G,[m0,m1]=S.lignes[S.li],pc=S.piece,svg=$('#planche');
  svg.innerHTML='';svg.setAttribute('viewBox',`0 0 ${S.W} ${S.geo.H}`);dessinerPortee(svg,S.geo,0,S.W);
  const nbM=m1-m0,bw=Math.min(90,(S.W-(m0===0?160:110)-nbM*42)/(nbM*pc.c));
  const L=ligneSVG(pc,S.lu,m0,m1,{geo:S.geo,x0:110,bw,noms:S.noms,motifs:S.mode==='libre'});
  const g=svgEl('g');g.innerHTML=L.h;svg.append(g);S.fx=svgEl('g');svg.append(S.fx);
  return {svg,notes:L.notes};
}
function repeindre(){
  const S=G;if(S.li>=S.lignes.length) return;
  peindreLigne();S.ligne.a.forEach(n=>{if(n.juste)couleurNote(n,'var(--ok)');});
  if(S.mode==='libre') marquerCourante();
}
function pieceLigne(){
  const S=G;if(!S||!S.piece||S.fin) return;
  if(S.li>=S.lignes.length){finPiece();return;}
  const {svg,notes}=peindreLigne();
  S.ligne={svg,notes,a:notes.filter(n=>n.son&&!n.lie),k:0,t0:null};
  if(S.mode==='libre'){ marquerCourante(); }
  else ligneAuTempo();
}
const couleurNote=(n,c)=>{const g=G.ligne.svg.querySelector(`.sym[data-i="${n.g}"]`);if(!g)return;if(c)g.style.setProperty('--ry',c);else g.style.removeProperty('--ry');};
function allumer(n){
  n.juste=true;G.justes++;couleurNote(n,'var(--ok)');
  const y=yNote(G.geo.portees[0],n.d);
  const t=svgEl('circle',{cx:n.x,cy:y,r:14,fill:'none',stroke:'var(--ok)','stroke-width':3,class:'eclat'});G.fx.append(t);
  t.animate([{r:14,opacity:1},{r:30,opacity:0}],{duration:450,easing:'ease-out'});setTimeout(()=>t.remove(),460);
  $('#prog').style.width=(G.justes/G.sons.length*100)+'%';
}
// À mon rythme : la note attendue est en couleur d'accent, avec son nom au clavier si les noms sont affichés.
function marquerCourante(){
  const L=G.ligne,n=L.a[L.k];if(!n) return;
  couleurNote(n,'var(--accent)');
  if(G.noms&&clavJeu) clavJeu.flash(n.midi,'joue',600);
}
function noteJuste(m,n){ return m===n.midi||(!R().octave&&((m-n.midi)%12+12)%12===0); }
function pieceNote(m,t,source){
  const S=G;if(!S||!S.piece||S.fin) return;
  $('#entendu-txt').textContent='Entendu : '+NOMS12[((m%12)+12)%12];
  const L=S.ligne;if(!L) return;
  if(S.mode==='libre'){
    const n=L.a[L.k];if(!n||!noteJuste(m,n)) return;      // une fausse note ne fait rien
    allumer(n);clavJeu&&clavJeu.flash(m,'joue-ok');L.k++;
    if(L.k>=L.a.length){S.li++;pieceLigne();}     // la ligne suivante tout de suite : l'enfant qui connaît la pièce ne s'arrête pas
    else marquerCourante();
    return;
  }
  if((S.mode==='tempo'||S.mode==='recital')&&L.t0!=null){
    const beat=60000/S.bpm,adj=t-S.decal[source]*1000;
    // La note libre la plus proche de ce moment, de la bonne hauteur, dans sa fenêtre.
    let best=null,bd=Infinity,proche=null,pd=Infinity;
    for(const n of L.a){ if(n.juste) continue; const d=Math.abs(adj-(L.t0+(n.t-L.tLigne)*beat)); if(d>n.tol) continue;
      if(noteJuste(m,n)&&d<bd){bd=d;best=n;} if(d<pd){pd=d;proche=n;} }
    if(best){allumer(best);clavJeu&&clavJeu.flash(m,'joue-ok');}
    else if(proche) proche.bonMoment=true;   // au bon moment, mais une autre touche : compté seulement au Récital, sans rien montrer
  }
}
// Au tempo (et pour l'écoute) : une mesure de décompte, puis la ligne. La batterie ne s'arrête pas entre deux lignes :
// la mesure de décompte de la ligne suivante laisse le temps de la lire.
function ligneAuTempo(){
  const S=G,L=S.ligne,pc=S.piece,c=pc.c,beat=60/S.bpm,nbT=(S.lignes[S.li][1]-S.lignes[S.li][0])*c,ac=audio();
  L.tLigne=S.lignes[S.li][0]*c;
  // Fenêtre de chaque note : 45 % de l'écart avec ses voisines, un temps au plus.
  L.a.forEach((n,i)=>{const g=Math.min(1,i>0?n.t-L.a[i-1].t:1,i<L.a.length-1?L.a[i+1].t-n.t:1);n.tol=.45*g*beat*1000;});
  // Horloge audio : la ligne suivante commence exactement à la fin de celle-ci, la batterie ne s'interrompt pas.
  const c0=S.aSuite??ac.currentTime+.5,decal=performance.now()-ac.currentTime*1000,perf=a=>a*1000+decal;
  L.t0=perf(c0+c*beat);S.aSuite=c0+(c+nbT)*beat;
  if(S.mode!=='ecoute') for(let k=0;k<c+nbT;k++) pulsation(k,c,c0+k*beat,beat);
  else for(let k=0;k<c;k++) clicMetro(k===0,c0+k*beat);
  const mot=$('#mot');mot.hidden=false;mot.textContent='';
  for(let k=0;k<c;k++) setTimeout(()=>{if(G===S&&!S.fin){mot.hidden=false;mot.textContent=k+1;}},perf(c0+k*beat)-performance.now());
  setTimeout(()=>{if(G===S&&!S.fin)mot.hidden=true;},perf(c0+c*beat)-performance.now());
  if(S.mode==='ecoute'){
    for(const n of L.a){ const quand=c0+(c+n.t-L.tLigne)*beat;ton(fMidi(n.midi),Math.max(.25,n.sonDur*beat*.95),.28,'sine',quand-ac.currentTime);
      setTimeout(()=>{if(G!==S||S.fin)return;allumer(n);clavJeu&&clavJeu.flash(n.midi,'joue-ok',Math.max(250,n.sonDur*beat*900));},perf(quand)-performance.now()); }
  }
  // La ligne suivante s'affiche au début de son décompte : une mesure pour la lire avant de la jouer.
  setTimeout(()=>{if(G!==S||S.fin)return;S.li++;
    if(S.li>=S.lignes.length){setTimeout(()=>{if(G===S&&!S.fin)finPiece();},400);return;}
    pieceLigne();},perf(S.aSuite)-performance.now());
}
function finPiece(){
  const S=G;S.fin=true;arreterMetro();ecoute.onNote=null;ecoute.onTrame=null;ecoute.arreter();$('#b-noms').hidden=true;
  const pc=S.piece,e=etatPieceDe(pc.id),tot=S.sons.length,rythme=S.sons.filter(n=>!n.juste&&n.bonMoment).length;
  // XP fixe, quel que soit le résultat : jouer une pièce compte pour l'objectif du jour et la série.
  ajouterXP(S.mode==='ecoute'?5:10);
  if(S.mode!=='ecoute') e.fois++;
  const medaille=S.mode==='recital'&&S.justes/tot>=SEUIL_MEDAILLE,nouvelle=medaille&&!e.medaille;
  if(medaille) e.medaille=true;
  sauver();
  const dit=S.mode==='ecoute'?'Tu l\'as entendue. À toi de la jouer !'
    :S.mode==='recital'?(nouvelle?'Bravo ! Tu as gagné l\'étoile dorée de cette pièce.':medaille?'Bravo ! Encore un beau récital.':'Beau récital ! Rejoue-la quand tu veux.')
    :S.justes===tot?'Bravo ! Tu as joué toute la pièce.':'Bravo ! Tu as joué la pièce jusqu\'au bout.';
  // Seul le Récital donne des chiffres.
  const chiffres=S.mode==='recital'?`<div class="dit">${S.justes} notes justes sur ${tot}${rythme?`, et ${rythme} au bon moment sur une autre touche`:''}.</div>`
    +(medaille?`<svg viewBox="0 0 100 100" width="64" height="64" class="medaille-fin"><g fill="var(--gold)">${ETOILE}</g></svg>`:`<div class="dit">L'étoile dorée se gagne avec ${Math.ceil(tot*SEUIL_MEDAILLE)} notes justes.</div>`):'';
  sonFin();$('#encourage').classList.remove('vu');
  const pan=document.createElement('div');pan.className='fin-piece';
  pan.innerHTML=`<div>${mascotte(84,'wow')}</div><div class="titre">${pc.titre}</div><div class="dit">${dit}</div>${chiffres}<div class="rangee"><button class="btn ok" id="fp-encore">Rejouer</button><button class="btn" id="fp-autre">Une autre pièce</button><button class="btn" id="fp-retour">Retour au chemin</button></div>`;
  $('#scene').append(pan);
  $('#fp-encore').onclick=()=>{pan.remove();lancerPiece(pc.id,S.mode,S.o);};
  $('#fp-autre').onclick=()=>{pan.remove();quitter();mesPieces();};
  $('#fp-retour').onclick=()=>{pan.remove();quitter();};
}

/* ----- Place dans le chemin ----- */
const niveauDe=id=>NIVEAUX.find(n=>n.id===id);
// 'ouverte', 'notes' (le niveau de notes n'a pas 2 étoiles) ou 'rythme' (il manque la valeur requise).
function etatPiece(pc){
  if(R().ouvert) return 'ouverte';
  const et=P().etoiles;
  if((et[pc.apres]||0)<2) return 'notes';
  if((et[pc.req]||0)<2) return 'rythme';
  return 'ouverte';
}
const ilTeFaut=pc=>{const t=niveauDe(pc.req).titre;return 'Il te faut '+t[0].toLowerCase()+t.slice(1);};
function toucherPiece(pc){
  const e=etatPiece(pc);
  if(e==='ouverte'){feuillePiece(pc);return;}
  if(e==='notes'){toast(`Gagne 2 étoiles à « ${niveauDe(pc.apres).titre} » pour ouvrir cette pièce.`,3200);return;}
  // Il manque une valeur de note : on ouvre le niveau qui l'enseigne (ou le premier niveau de valeurs à faire avant lui).
  const i=NIVEAUX.indexOf(niveauDe(pc.req));
  let cible=i;
  if(!ouvert(i)) cible=NIVEAUX.findIndex((n,k)=>k<=i&&n.mode==='rythme'&&ouvert(k)&&(P().etoiles[n.id]||0)<2);
  toast(ilTeFaut(pc)+(cible===i?'.':'. On commence par les valeurs de notes.'),3200);
  $('#voile').hidden=true;$('#voile').innerHTML='';
  if(cible>=0) ouvrirNiveau(cible);
}
const ICONE_PIECE=`<svg width="44" height="34" viewBox="0 0 44 34" aria-hidden="true"><g stroke="currentColor" stroke-width="2" opacity=".5"><line x1="2" x2="42" y1="8" y2="8"/><line x1="2" x2="42" y1="15" y2="15"/><line x1="2" x2="42" y1="22" y2="22"/><line x1="2" x2="42" y1="29" y2="29"/></g><g fill="currentColor"><ellipse cx="14" cy="26" rx="5.5" ry="4" transform="rotate(-20 14 26)"/><ellipse cx="30" cy="20" rx="5.5" ry="4" transform="rotate(-20 30 20)"/><rect x="18" y="7" width="2.4" height="19"/><rect x="34" y="2" width="2.4" height="18"/><path d="M18 7 L36.4 2 L36.4 7 L18 12 Z"/></g></svg>`;
function noeudPiece(pc,dx){
  const e=etatPiece(pc),med=etatPieceDe(pc.id).medaille;
  const b=document.createElement('button');b.className='noeud piece'+(e==='notes'?' ferme':e==='rythme'?' attend':'');
  b.style.transform=`translateX(${dx}px)`;
  b.setAttribute('aria-label',`Pièce : ${pc.titre}${e==='ouverte'?'':e==='notes'?' (verrouillée)':' ('+ilTeFaut(pc).toLowerCase()+')'}`);
  b.innerHTML=`<span class="partition">${ICONE_PIECE}${med?'<span class="medaille" aria-hidden="true">★</span>':''}</span>
    <span class="nom">${pc.titre}</span>${e==='rythme'?`<span class="manque">${ilTeFaut(pc)}</span>`:''}`;
  b.onclick=()=>toucherPiece(pc);
  return b;
}
function feuillePiece(pc){
  const v=$('#voile'),e=etatPieceDe(pc.id);v.innerHTML='';
  const f=document.createElement('div');f.className='feuille';f.setAttribute('role','dialog');f.setAttribute('aria-label',pc.titre);
  f.innerHTML=`<div class="rangee" style="justify-content:space-between"><div class="eyebrow">Pièce${pc.sous?' · '+pc.sous:''}</div><button class="fermer" aria-label="Fermer">×</button></div>
   <h2>${pc.titre}</h2>
   <button class="dialogue intro" aria-label="Réécouter la présentation">${mascotte(52)}<div class="dit">${INTROS[pc.id]||''} Ici, pas de points : joue-la comme tu veux, autant de fois que tu veux.</div></button>
   <div class="choix" style="margin-top:12px">
     <button class="btn" data-m="ecoute">Écoute<small>L'appli joue, tu suis</small></button>
     <button class="btn prim" data-m="libre">À mon rythme<small>La pièce t'attend</small></button>
     <button class="btn" data-m="tempo" data-lent="1">Avec la batterie<small>Lentement</small></button>
     <button class="btn" data-m="tempo">Avec la batterie<small>Au tempo normal</small></button>
   </div>
   <div class="rangee recital"><button class="btn petit" data-m="recital">Récital</button>
     <span>${e.medaille?'<span style="color:var(--gold)">★</span> Tu as l\'étoile dorée de cette pièce.':'Toute la pièce, sans les noms. Une étoile dorée à gagner, si tu veux.'}</span></div>`;
  v.append(f);v.hidden=false;
  const fermer=()=>{v.hidden=true;v.innerHTML='';};
  f.querySelector('.fermer').onclick=fermer;v.onclick=ev=>{if(ev.target===v)fermer();};
  f.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{arreterIntro();fermer();lancerPiece(pc.id,b.dataset.m,{lent:!!b.dataset.lent});});
  f.querySelector('.fermer').onclick=()=>{arreterIntro();fermer();};
  // La présentation se dit d'elle-même la première fois, puis d'un toucher sur la bulle.
  const cle='p-'+pc.id,p=P(),tu=p.tutos||(p.tutos={});
  f.querySelector('.intro').onclick=()=>direIntro(pc.id);
  if(!tu[cle]&&INTROS[pc.id]){tu[cle]=true;sauver();direIntro(pc.id);}
}
let introSrc=null;
function arreterIntro(){ try{introSrc&&introSrc.stop();}catch(e){} introSrc=null; }
async function direIntro(id){
  arreterIntro();const buf=await chargerVoix(`p-${id}-0.m4a`);if(!buf) return;
  const c=audio(),src=c.createBufferSource();src.buffer=buf;src.connect(c.destination);src.start();introSrc=src;ecoute.ignorer(buf.duration*1000+300);
}
function mesPieces(){
  const v=$('#voile');v.innerHTML='';
  const f=document.createElement('div');f.className='feuille';f.setAttribute('role','dialog');f.setAttribute('aria-label','Mes pièces');
  f.innerHTML=`<div class="rangee" style="justify-content:space-between"><h2 style="margin:0">Mes pièces</h2><button class="fermer" aria-label="Fermer">×</button></div>
   <p style="color:var(--muted);margin:6px 0 12px">Les pièces ouvertes se rejouent quand tu veux, juste pour le plaisir.</p><div class="liste-pieces"></div>`;
  const liste=f.querySelector('.liste-pieces');
  PIECES.forEach(pc=>{const e=etatPiece(pc),st=etatPieceDe(pc.id);
    const b=document.createElement('button');b.className='ligne-piece'+(e==='ouverte'?'':' ferme');
    b.innerHTML=`<span class="titre">${pc.titre}${pc.sous?` <small>${pc.sous}</small>`:''}</span><span class="etat">${e==='ouverte'?(st.medaille?'<span style="color:var(--gold)">★</span>':st.fois?'Déjà jouée':'Nouvelle'):e==='notes'?'Après « '+niveauDe(pc.apres).titre+' »':ilTeFaut(pc)}</span>`;
    b.onclick=()=>toucherPiece(pc);liste.append(b);});
  v.append(f);v.hidden=false;
  const fermer=()=>{v.hidden=true;v.innerHTML='';};
  f.querySelector('.fermer').onclick=fermer;v.onclick=ev=>{if(ev.target===v)fermer();};
}
/* ----- Une pièce n'utilise que ce que le parcours a déjà enseigné ----- */
// Notes : celles du niveau « apres » et des niveaux de la même clé avant lui (n.ds et n.anciens).
// Valeurs, liaison et chiffre de mesure : ceux des niveaux de valeurs jusqu'à « req » compris (n.nouv, n.metre).
// Renvoie la liste des écarts ; vide si la pièce est conforme. Vérifié au chargement (console) et par les tests.
function ecartsPiece(pc){
  const ecarts=[],av=niveauDe(pc.apres),rq=niveauDe(pc.req);
  if(!av||av.mode!=='portee') return [`niveau de notes « ${pc.apres} » introuvable`];
  if(!rq||rq.mode!=='rythme') return [`niveau de valeurs « ${pc.req} » introuvable`];
  if(av.cle!==pc.cle&&av.cle!=='grand') ecarts.push(`clé ${pc.cle}, mais « ${av.titre} » enseigne la clé ${av.cle}`);
  const notesVues=new Set([...av.ds,...(av.anciens||[])]);
  const iR=NIVEAUX.indexOf(rq),vus=NIVEAUX.slice(0,iR+1).filter(n=>n.mode==='rythme');
  const valsVues=new Set(vus.flatMap(n=>n.nouv||[])),metres=new Set(vus.map(n=>n.metre).filter(Boolean));
  const lu=lirePiece(pc);
  const hors=[...new Set(lu.notes.filter(n=>n.son&&!notesVues.has(n.d)).map(n=>nomLong(n.d)))];
  if(hors.length) ecarts.push(`notes pas encore vues : ${hors.join(', ')}`);
  const vals=new Set(lu.notes.map(n=>n.val==='c'?'cc':n.val));if(lu.notes.some(n=>n.lieSuivant)) vals.add('li');
  const valsHors=[...vals].filter(v=>!valsVues.has(v));
  if(valsHors.length) ecarts.push(`valeurs pas encore vues : ${valsHors.map(nomNotion).join(', ')}`);
  // Une croche seule n'est pas enseignée : les croches vont par deux sur un même temps.
  const croches=lu.notes.filter(n=>n.val==='c');
  if(croches.some(n=>!croches.some(k=>k!==n&&k.mi===n.mi&&Math.floor(k.tm)===Math.floor(n.tm)))) ecarts.push('croche seule');
  if(!metres.has(pc.c)) ecarts.push(`mesure à ${pc.c} temps pas encore vue`);
  return ecarts;
}
function verifierPieces(){ const r={};PIECES.forEach(pc=>{const e=ecartsPiece(pc);if(e.length)r[pc.id]=e;}); return r; }
addEventListener('load',()=>{const r=verifierPieces();if(Object.keys(r).length) console.warn('Pièces hors parcours :',r);});
// Pour essayer une pièce directement : ?piece=clair&mode=libre|tempo|ecoute|recital
addEventListener('load',()=>{const q=new URLSearchParams(location.search),id=q.get('piece');
  if(id) setTimeout(()=>lancerPiece(id,q.get('mode')||'libre'),300);});
