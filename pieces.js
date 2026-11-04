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
   - 'tempo'  : avec la batterie, la pièce avance au tempo. Une bonne note jouée près de son temps s'allume. */

const PIECES=[
 {id:'clair',titre:'Au clair de la lune',c:4,bpm:76,cle:'sol',
  // Sans la 3e phrase (« Ma chandelle est morte »), qui descend sous le Do central. Forme A A B A : on joue les trois A.
  m:'C4:n C4:n C4:n D4:n | E4:b D4:b | C4:n E4:n D4:n D4:n | C4:r | '+
    'C4:n C4:n C4:n D4:n | E4:b D4:b | C4:n E4:n D4:n D4:n | C4:r | '+
    'C4:n C4:n C4:n D4:n | E4:b D4:b | C4:n E4:n D4:n D4:n | C4:r'},
 {id:'jacques',titre:'Frère Jacques',c:4,bpm:80,cle:'sol',
  m:'C4:n D4:n E4:n C4:n | C4:n D4:n E4:n C4:n | E4:n F4:n G4:b | E4:n F4:n G4:b'},
 {id:'joie',titre:'Ode à la joie',sous:'Beethoven',c:4,bpm:80,cle:'sol',
  // Rythme pointé de la 4e mesure simplifié en noire, noire, blanche.
  m:'E4:n E4:n F4:n G4:n | G4:n F4:n E4:n D4:n | C4:n C4:n D4:n E4:n | E4:n D4:n D4:b | '+
    'E4:n E4:n F4:n G4:n | G4:n F4:n E4:n D4:n | C4:n C4:n D4:n E4:n | D4:n C4:n C4:b'},
 {id:'maman',titre:'Ah ! vous dirai-je maman',sous:'Mozart',c:4,bpm:80,cle:'sol',
  m:'C4:n C4:n G4:n G4:n | A4:n A4:n G4:b | F4:n F4:n E4:n E4:n | D4:n D4:n C4:b | '+
    'G4:n G4:n F4:n F4:n | E4:n E4:n D4:b | G4:n G4:n F4:n F4:n | E4:n E4:n D4:b | '+
    'C4:n C4:n G4:n G4:n | A4:n A4:n G4:b | F4:n F4:n E4:n E4:n | D4:n D4:n C4:b'},
];
const DUREE_P={n:1,b:2,bp:3,r:4,c:.5,s:1,dp:2,p:null};

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
  return {mesures,notes,nb:mesures.length};
}

/* ----- Dessin d'une ligne de mesures sur la portée ----- */
// Renvoie le SVG de la ligne et, pour chaque note, sa position x et l'indice de son groupe graphique.
function ligneSVG(pc,lu,m0,m1,o){
  const p=o.geo.portees[0],c=pc.c,bw=o.bw,pad=28,coulT='var(--ry,var(--staff))';
  let x=o.x0,h='';const debuts=[];
  if(m0===0){ h+=chiffreSVG(x+22,c); x+=50; }
  const dansLigne=lu.notes.filter(n=>n.mi>=m0&&n.mi<m1);
  for(let mi=m0;mi<m1;mi++){debuts[mi]=x;x=x+pad+c*bw+pad*.5;
    h+=`<line x1="${x}" x2="${x}" y1="${p.bas-80}" y2="${p.bas}" stroke="var(--staff)" stroke-width="${mi===lu.nb-1?4:2}"/>`;}
  const r=n=>n.d-REF[p.cle];
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
function lancerPiece(id,mode='libre'){
  const pc=PIECES.find(x=>x.id===id);if(!pc){toast('Pièce introuvable.');return;}
  const lu=lirePiece(pc),geo=geom(pc.cle);
  montrer('jeu');garderEcran();$('#jeu').classList.add('mode-piece');
  const rc=$('#scene').getBoundingClientRect();
  const W=Math.round(Math.max(560,Math.min(1100,geo.H*1.15*(rc.width/Math.max(1,rc.height)))));
  // Autant de mesures par ligne que la largeur le permet, sans que les notes deviennent trop serrées (2 à 4).
  const parLigne=Math.max(2,Math.min(4,Math.floor((W-160)/(pc.c*58+42))));
  const lignes=[];for(let m=0;m<lu.nb;m+=parLigne)lignes.push([m,Math.min(lu.nb,m+parLigne)]);
  const S=G={piece:pc,mode,lu,geo,W,lignes,li:0,fin:false,noms:mode!=='tempo',bpm:Math.round(pc.bpm*(mode==='tempo'?R().vitesse:1)),
    sons:lu.notes.filter(n=>n.son&&!n.lie),justes:0};
  $('#prog').style.width='0%';$('#score').textContent='';$('#combo').textContent='';
  $('#consigne').textContent=mode==='ecoute'?'Écoute la pièce et suis les notes.':mode==='libre'?'Joue chaque note. La pièce t\'attend.':'Joue avec la batterie. Si tu te trompes, continue !';
  $('#encourage').classList.remove('vu');$('#encourage-masc').innerHTML=mascotte(46);
  const ds=[...new Set(S.sons.map(n=>n.d))];
  const [lo,hi]=bornesClavier(ds,'portee');
  clavJeu=clavier($('#clavier-jeu'),lo,hi,{noms:S.noms?'tous':'do',onNote:m=>{ecoute.ignorer(900);pieceNote(m,performance.now(),'ecran');}});
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
function pieceLigne(){
  const S=G;if(!S||!S.piece||S.fin) return;
  if(S.li>=S.lignes.length){finPiece();return;}
  const [m0,m1]=S.lignes[S.li],pc=S.piece,svg=$('#planche');
  svg.innerHTML='';svg.setAttribute('viewBox',`0 0 ${S.W} ${S.geo.H}`);dessinerPortee(svg,S.geo,0,S.W);
  const nbM=m1-m0,bw=Math.min(90,(S.W-(m0===0?160:110)-nbM*42)/(nbM*pc.c));
  const L=ligneSVG(pc,S.lu,m0,m1,{geo:S.geo,x0:110,bw,noms:S.noms});
  const g=svgEl('g');g.innerHTML=L.h;svg.append(g);S.fx=svgEl('g');svg.append(S.fx);
  S.ligne={svg,notes:L.notes,a:L.notes.filter(n=>n.son&&!n.lie),k:0,t0:null};
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
  if(S.mode==='tempo'&&L.t0!=null){
    const beat=60000/S.bpm,adj=t-S.decal[source]*1000;
    // La note libre la plus proche de ce moment, de la bonne hauteur, dans sa fenêtre.
    let best=null,bd=Infinity;
    for(const n of L.a){ if(n.juste||!noteJuste(m,n)) continue; const d=Math.abs(adj-(L.t0+(n.t-L.tLigne)*beat)); if(d<=n.tol&&d<bd){bd=d;best=n;} }
    if(best){allumer(best);clavJeu&&clavJeu.flash(m,'joue-ok');}
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
  if(S.mode==='tempo') for(let k=0;k<c+nbT;k++) pulsation(k,c,c0+k*beat,beat);
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
  const S=G;S.fin=true;arreterMetro();ecoute.onNote=null;ecoute.onTrame=null;ecoute.arreter();
  const dit=S.mode==='ecoute'?'Tu l\'as entendue. À toi de la jouer !':S.justes===S.sons.length?'Bravo ! Tu as joué toute la pièce.':'Bravo ! Tu as joué la pièce jusqu\'au bout.';
  sonFin();$('#encourage').classList.remove('vu');
  const pan=document.createElement('div');pan.className='fin-piece';
  pan.innerHTML=`<div>${mascotte(84,'wow')}</div><div class="titre">${S.piece.titre}</div><div class="dit">${dit}</div><div class="rangee"><button class="btn ok" id="fp-encore">Rejouer</button><button class="btn" id="fp-retour">Retour</button></div>`;
  $('#scene').append(pan);
  $('#fp-encore').onclick=()=>{pan.remove();lancerPiece(S.piece.id,S.mode);};
  $('#fp-retour').onclick=()=>{pan.remove();quitter();};
}
// Pour essayer une pièce avant qu'elle soit dans le chemin : ?piece=clair&mode=libre|tempo|ecoute
addEventListener('load',()=>{const q=new URLSearchParams(location.search),id=q.get('piece');
  if(id) setTimeout(()=>lancerPiece(id,q.get('mode')||'libre'),300);});
