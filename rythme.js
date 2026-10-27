'use strict';
/* Rythme : valeurs de notes, dessin, quiz (pratique) et « Lis et joue » (défi).
   Jetons : n noire, b blanche, bp blanche pointée, r ronde, cc deux croches, s soupir, dp demi-pause, p pause, | barre. */
const VALEURS={
  n:{nom:'noire',art:'la',t:1,son:1}, b:{nom:'blanche',art:'la',t:2,son:1}, bp:{nom:'blanche pointée',art:'la',t:3,son:1},
  r:{nom:'ronde',art:'la',t:4,son:1}, cc:{nom:'deux croches',art:'les',t:1,son:1},
  s:{nom:'soupir',art:'le',t:1,son:0}, dp:{nom:'demi-pause',art:'la',t:2,son:0}, p:{nom:'pause',art:'la',t:4,son:0}};
const RY_Y=145, RY_MIL=125;
const lireRythme=txt=>txt.split('|').map(m=>m.trim().split(/\s+/).filter(Boolean));
const dureeTok=(tok,c)=>tok==='p'?c:VALEURS[tok].t;
const tempsTxt=t=>t===1?'1 temps':t+' temps';
const hasard=a=>a[Math.floor(Math.random()*a.length)];
function melanger(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

/* ----- Dessin ----- */
function tete(x,y,plein,ronde){
  return `<ellipse cx="${x}" cy="${y}" rx="${ronde?14.5:12.6}" ry="${ronde?9.8:9}"${ronde?'':` transform="rotate(-20 ${x} ${y})"`} fill="${plein?'var(--ry,var(--staff))':'var(--board)'}" stroke="var(--ry,var(--staff))" stroke-width="${plein?0:3}"/>`;
}
function symboleTok(tok,x,bw){
  const y=RY_Y,c='var(--ry,var(--staff))',tige=xx=>`<line x1="${xx+11.2}" x2="${xx+11.2}" y1="${y-2}" y2="${y-62}" stroke="${c}" stroke-width="2.4"/>`;
  switch(tok){
    case 'n': return tete(x,y,1)+tige(x);
    case 'b': return tete(x,y,0)+tige(x);
    case 'bp': return tete(x,y,0)+tige(x)+`<circle cx="${x+25}" cy="${y-10}" r="4" fill="${c}"/>`;
    case 'r': return tete(x,y,0,1);
    case 'cc': {const x2=x+bw/2;return tete(x,y,1)+tige(x)+tete(x2,y,1)+tige(x2)+`<rect x="${x+10}" y="${y-64}" width="${x2-x+2.4}" height="7.5" fill="${c}"/>`;}
    case 's': return `<path transform="translate(${x-2},${RY_MIL-22})" fill="${c}" d="M0 0 L11 13 Q3 21 4 29 L13 41 Q1 36 2 47 Q3 52 7 55 Q-9 50 -5 38 Q-1 32 6 35 L-5 21 Q3 13 1 5 Z"/>`;
    case 'dp': return `<rect x="${x-12}" y="${RY_MIL-9}" width="25" height="9" fill="${c}"/>`;
    case 'p': return `<rect x="${x-12}" y="${RY_MIL-20}" width="25" height="9" fill="${c}"/>`;
  }
  return '';
}
function chiffreSVG(x,c,inconnu){
  const t=(y,v)=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="var(--f-display)" font-weight="700" font-size="44" fill="${inconnu?'var(--accent)':'var(--staff)'}">${v}</text>`;
  const t2=(y,v)=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="var(--f-display)" font-weight="700" font-size="44" fill="var(--staff)">${v}</text>`;
  return t(105,inconnu?'?':c)+t2(146,4);
}
/* mesures : tableau de mesures (tableaux de jetons). Retourne le dessin et la position de chaque son ou silence. */
function rythmeSVG(mesures,o={}){
  const c=o.c||4,bw=o.bw||60,pad=o.pad||28;let x=o.x0||0,h='';const items=[],debuts=[];
  if(o.chiffre){h+=chiffreSVG(x+22,c,o.inconnu);x+=50;}
  mesures.forEach((m,mi)=>{
    const d0=x;debuts.push(d0);let tm=0;
    m.forEach((tok,k)=>{
      const dur=dureeTok(tok,c),xx=tok==='p'?d0+pad+(c*bw)/2-6:d0+pad+tm*bw+6;
      const idx=items.length;
      if(tok==='?') h+=`<rect x="${xx-16}" y="${RY_Y-80}" width="${Math.max(44,bw*(o.manque||1)-8)}" height="104" rx="10" fill="var(--hit)" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="6 6"/><text x="${xx+Math.max(44,bw*(o.manque||1)-8)/2-16}" y="${RY_Y-22}" text-anchor="middle" font-family="var(--f-display)" font-weight="700" font-size="40" fill="var(--accent)">?</text>`;
      else h+=`<g class="sym" data-i="${idx}">${symboleTok(tok,xx,bw)}</g>`;
      if(tok==='cc'){items.push({x:xx,t:mi*c+tm,son:1,tok,g:idx});items.push({x:xx+bw/2,t:mi*c+tm+.5,son:1,tok,g:idx});}
      else if(tok!=='?') items.push({x:xx,t:mi*c+tm,son:VALEURS[tok].son,tok,g:idx,dur});
      tm+=tok==='?'?(o.manque||1):dur;
    });
    x=d0+pad+c*bw+pad*.5;
    if(mi<mesures.length-1||o.barreFin) h+=`<line x1="${x}" x2="${x}" y1="85" y2="165" stroke="var(--staff)" stroke-width="2"/>`;
  });
  const xDe=b=>{const m=Math.min(debuts.length-1,Math.floor(b/c)),w=b-m*c;return debuts[m]+pad+w*bw+6;};
  return {h,items,xDe,fin:x,c,nb:mesures.length};
}
function largeurRythme(mesures,c,bw,pad=28,chiffre=true){return (chiffre?50:0)+mesures.length*(pad*1.5+c*bw);}
function miniSymbole(tok){
  const w=tok==='cc'?120:90;
  let h='';for(let k=0;k<5;k++){const y=165-k*20;h+=`<line x1="0" x2="${w}" y1="${y}" y2="${y}" stroke="var(--staff)" stroke-width="1.6" opacity=".55"/>`;}
  return `<svg viewBox="0 72 ${w} 110" width="${w*.8}" height="88" aria-label="${VALEURS[tok].nom}">${h}${symboleTok(tok,tok==='cc'?32:38,60)}</svg>`;
}

/* ----- Jouer un rythme (démonstration, tutoriel, fiche) ----- */
function animerRythme(svgParent,ry,o={}){
  const bpm=o.bpm||66,beat=60/bpm,total=ry.nb*ry.c,G4=dDe('G4');
  const calque=svgEl('g');svgParent.append(calque);
  const curseur=svgEl('line',{x1:0,x2:0,y1:70,y2:178,stroke:'var(--accent)','stroke-width':3,opacity:.75});calque.append(curseur);
  const nums=svgEl('g');calque.append(nums);
  return new Promise(res=>{
    const t0=performance.now()+150;let fini=false,prochain=0,prochainNum=0;
    const etapes=ry.items.slice().sort((a,b)=>a.t-b.t);
    const tic=()=>{
      if(fini) return; if(o.annule&&o.annule()){fini=true;calque.remove();res();return;}
      const b=(performance.now()-t0)/1000/beat;
      while(prochainNum<total&&b>=prochainNum){const x=ry.xDe(prochainNum);const t=svgEl('text',{x,y:62,'text-anchor':'middle','font-family':'var(--f-display)','font-weight':700,'font-size':24,fill:'var(--accent)'});t.textContent=(prochainNum%ry.c)+1;nums.append(t);prochainNum++;}
      while(prochain<etapes.length&&b>=etapes[prochain].t){const it=etapes[prochain];
        if(it.son){ton(fMidi(midiDe(G4)),Math.max(.25,(it.tok==='cc'?.5:(it.dur||1))*beat*.95),.26);ecoute.ignorer(400);}
        const g=svgParent.querySelector(`.sym[data-i="${it.g}"]`);if(g){g.style.setProperty('--ry','var(--accent)');setTimeout(()=>g.style.removeProperty('--ry'),Math.max(300,(it.dur||.5)*beat*1000));}
        prochain++;}
      if(b>=0) curseur.setAttribute('x1',ry.xDe(Math.min(b,total-.001))),curseur.setAttribute('x2',ry.xDe(Math.min(b,total-.001)));
      if(b>=total+.2){fini=true;setTimeout(()=>{calque.remove();res();},250);return;}
      requestAnimationFrame(tic);
    };
    requestAnimationFrame(tic);
  });
}

/* ----- Génération de mesures ----- */
function genMesure(vals,c,favoris=[]){
  for(let essai=0;essai<80;essai++){
    const m=[];let reste=c;
    if(vals.includes('p')&&Math.random()<.12){return ['p'];}
    while(reste>0){
      const pos=c-reste,opts=vals.filter(t=>t!=='p'&&VALEURS[t].t<=reste&&(t!=='dp'||(c===4&&(pos===0||pos===2))));
      const poids=opts.map(t=>favoris.includes(t)?3:1);let r=Math.random()*poids.reduce((a,b)=>a+b,0),tok=opts[0];
      for(let i=0;i<opts.length;i++){r-=poids[i];if(r<=0){tok=opts[i];break;}}
      m.push(tok);reste-=VALEURS[tok].t;
    }
    if(m.every(t=>!VALEURS[t].son)) continue;
    return m;
  }
  return Array(c).fill('n');
}
function genLigne(niv,c,nb=2){
  for(let essai=0;essai<40;essai++){const l=[];for(let i=0;i<nb;i++)l.push(genMesure(niv.vals,c,niv.nouv));
    if(!niv.nouv.length||l.flat().some(t=>niv.nouv.includes(t))) return l;}
  return [genMesure(niv.vals,c,niv.nouv),genMesure(niv.vals,c,niv.nouv)];
}

/* ----- Quiz (pratique) ----- */
function choisirTok(niv,filtre=()=>true){
  const st=P().stats,opts=niv.vals.filter(filtre);
  const w=opts.map(t=>{const s=st['v:'+t];let x=niv.nouv.includes(t)?2:1;if(!s||s.ok+s.err<3)x+=1;else x+=4*s.err/(s.ok+s.err);return x;});
  let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<opts.length;i++){r-=w[i];if(r<=0)return opts[i];}return opts[opts.length-1];
}
function genQuestion(niv){
  const types=['combien','combien','lequel','complete'];
  if(niv.vals.some(t=>!VALEURS[t].son)) types.push('sonsil');
  if(niv.chiffres.length>1) types.push('chiffre','chiffre');
  const type=hasard(types),c4=4;
  if(type==='combien'){
    const tok=choisirTok(niv),d=dureeTok(tok,c4),v=VALEURS[tok];
    const autres=melanger([1,2,3,4].filter(x=>x!==d)).slice(0,2);
    return {type,tok,texte:tok==='cc'?'Combien de temps durent ces deux croches ?':tok==='p'?'Dans une mesure à 4 temps, combien de temps dure la pause ?':`Combien de temps dure ${v.art==='le'?'ce':'cette'} ${v.nom} ?`,
      dessin:tok==='p'?{mesures:[['p']],c:4,chiffre:true,barreFin:true}:{mesures:[[tok]],c:c4,seul:true},choix:melanger([d,...autres]).map(x=>({label:tempsTxt(x),ok:x===d})),
      expl:tok==='cc'?'Deux croches durent 1 temps ensemble.':tok==='p'?'La pause dure toute la mesure : 4 temps ici.':`${v.art==='le'?'Le':'La'} ${v.nom} dure ${tempsTxt(d)}.`};
  }
  if(type==='lequel'){
    const tok=choisirTok(niv,t=>t!=='p'),d=VALEURS[tok].t;
    const autres=melanger(niv.vals.filter(t=>t!=='p'&&VALEURS[t].t!==d));
    const pris=[];for(const t of autres){if(!pris.some(p=>VALEURS[p].t===VALEURS[t].t))pris.push(t);if(pris.length===2)break;}
    if(!pris.length) return genQuestion(niv);
    return {type,tok,texte:`Lequel dure ${tempsTxt(d)} ?`,choix:melanger([tok,...pris]).map(t=>({tok:t,ok:t===tok})),
      expl:`${VALEURS[tok].art==='le'?'Le':VALEURS[tok].art==='les'?'Les':'La'} ${VALEURS[tok].nom} ${tok==='cc'?'durent':'dure'} ${tempsTxt(d)}.`};
  }
  if(type==='sonsil'){
    const tok=choisirTok(niv),son=!!VALEURS[tok].son;
    return {type,tok,texte:'Un son ou un silence ?',dessin:{mesures:[[tok]],c:c4,seul:true},
      choix:[{label:'Un son',ok:son},{label:'Un silence',ok:!son}],expl:`${VALEURS[tok].art==='le'?'Le':VALEURS[tok].art==='les'?'Les':'La'} ${VALEURS[tok].nom} ${son?'est un son.':'est un silence : on compte sans jouer.'}`};
  }
  if(type==='complete'){
    const c=hasard(niv.chiffres);let m;for(let k=0;k<30;k++){m=genMesure(niv.vals.filter(t=>t!=='p'),c,niv.nouv);if(m.length>=2)break;}
    if(m.length<2) return genQuestion(niv);
    const tok=m.pop(),d=VALEURS[tok].t;
    const autres=melanger(niv.vals.filter(t=>t!=='p'&&VALEURS[t].t!==d));const pris=[];
    for(const t of autres){if(!pris.some(p=>VALEURS[p].t===VALEURS[t].t))pris.push(t);if(pris.length===2)break;}
    if(!pris.length) return genQuestion(niv);
    return {type,tok,texte:'Quel symbole complète la mesure ?',dessin:{mesures:[[...m,'?']],c,chiffre:true,manque:d},
      choix:melanger([tok,...pris]).map(t=>({tok:t,ok:t===tok})),expl:`Il manque ${tempsTxt(d)} pour arriver à ${c} : ${VALEURS[tok].art==='le'?'le':VALEURS[tok].art==='les'?'les':'la'} ${VALEURS[tok].nom}.`};
  }
  const c=hasard(niv.chiffres),l=genLigne({...niv,vals:niv.vals.filter(t=>t!=='p')},c);
  return {type:'chiffre',tok:null,texte:'Quel chiffre va en haut ?',dessin:{mesures:l,c,chiffre:true,inconnu:true},
    choix:[2,3,4].map(x=>({label:String(x),ok:x===c})),expl:`Chaque mesure compte ${c} temps, donc le chiffre du haut est ${c}.`};
}
function dessinQuestion(q){
  const svg=$('#q-svg');svg.innerHTML='';
  if(!q.dessin){svg.setAttribute('hidden','');return;} svg.removeAttribute('hidden');
  const d=q.dessin,bw=d.seul?60:56;
  const larg=d.seul?260:Math.max(520,90+largeurRythme(d.mesures,d.c,bw));
  svg.setAttribute('viewBox',`0 40 ${larg} 160`);
  dessinerPortee(svg,geom('sol'),0,larg);
  const x0=d.seul?larg/2-58:90;
  const r=rythmeSVG(d.mesures,{c:d.c,x0,bw,chiffre:d.chiffre,inconnu:d.inconnu,manque:d.manque,barreFin:!d.seul||d.barreFin});
  svg.insertAdjacentHTML('beforeend',r.h);
}
function lancerQuiz(niv){
  G={niv,mode:'pratique',quiz:true,total:12,faits:0,bons:0,score:0,combo:0,revoir:{},fin:false};
  montrer('quiz');$('#q-masc').innerHTML=mascotte(46);$('#q-score').textContent='0';$('#q-prog').style.width='0%';$('#q-combo').textContent='';
  questionSuivante();
}
function questionSuivante(){
  if(!G||G.fin||!G.quiz) return;
  if(G.faits>=G.total){G.fin=true;resultats();return;}
  const q=genQuestion(G.niv);G.q=q;G.essais=0;
  $('#q-texte').textContent=q.texte;$('#q-dit').textContent='';$('#q-retour').classList.remove('vu');
  dessinQuestion(q);
  const box=$('#q-choix');box.innerHTML='';
  q.choix.forEach(ch=>{const b=document.createElement('button');b.className='btn q-btn';b.type='button';
    b.innerHTML=ch.tok?miniSymbole(ch.tok):ch.label;b.onclick=()=>repondre(ch,b);box.append(b);});
}
function repondre(ch,b){
  const q=G.q;if(G.fin||q.repondu) return;
  if(ch.ok){
    q.repondu=true;b.classList.add('ok');sonOk();G.faits++;
    if(!G.essais){G.bons++;G.combo++;}else G.combo=0;
    const pts=G.essais?40:Math.round(100*(1+Math.min(4,Math.floor(G.combo/5))*.5));G.score+=pts;
    if(q.tok){const s=P().stats['v:'+q.tok]||(P().stats['v:'+q.tok]={ok:0,err:0,t:0});if(!G.essais)s.ok++;}
    $('#q-dit').textContent=G.essais?q.expl:(G.combo%5===0?`${G.combo} bonnes réponses de suite.`:q.expl);$('#q-retour').classList.add('vu');
    $('#q-score').textContent=G.score;$('#q-prog').style.width=(G.faits/G.total*100)+'%';
    $('#q-combo').textContent=G.combo>=3?`${G.combo} de suite`:'';
    setTimeout(questionSuivante,G.essais?1500:1100);
  } else {
    G.essais++;G.combo=0;b.classList.add('non');b.disabled=true;sonNon();
    if(G.essais===1&&q.tok){const s=P().stats['v:'+q.tok]||(P().stats['v:'+q.tok]={ok:0,err:0,t:0});s.err++;G.revoir[q.tok]=1;}
    $('#q-dit').textContent=q.expl;$('#q-retour').classList.add('vu');$('#q-combo').textContent='';
  }
}

/* ----- Lis et joue (défi) ----- */
function lancerLecture(niv){
  const geo=geom('sol');
  G={niv,mode:'defi',lecture:true,lignes:4,li:0,total:0,bons:0,score:0,combo:0,maxCombo:0,faits:0,revoir:{},fin:false,extras:0,geo,
     bpm:Math.round((niv.bpm||66)*R().vitesse),attente:200};
  montrer('jeu');garderEcran();
  const rc=$('#scene').getBoundingClientRect();
  G.W=Math.round(Math.max(560,Math.min(1100,geo.H*1.15*(rc.width/Math.max(1,rc.height)))));
  $('#prog').style.width='0%';$('#score').textContent='0';$('#combo').textContent='';
  $('#consigne').textContent='Joue chaque note au bon moment, sur n\'importe quelle touche.';
  $('#encourage').classList.remove('vu');$('#encourage-masc').innerHTML=mascotte(46);
  clavJeu=clavier($('#clavier-jeu'),55,79,{noms:'do',onNote:()=>{ecoute.ignorer(600);frappe(performance.now(),'ecran');}});
  const dec=R().decalage||(R().decalage={});G.decal={micro:dec.micro??.06,ecran:dec.ecran??.02};
  (async()=>{
    if(R().entree==='micro'){const ok=await ecoute.demarrer();
      if(ok){ecoute.onAttaque=null;ecoute.onNote=(m,t)=>frappe(t,'micro');G.attente=650;   // une attaque compte seulement si une vraie note de piano suit
        ecoute.onTrame=({rms})=>{$('#vu').style.width=Math.min(100,rms/(R().seuil*4)*100)+'%';};$('#entendu-txt').textContent='J\'écoute…';}
      else{$('#entendu-txt').textContent='Micro indisponible';toast('Le micro n\'est pas accessible. Tu peux jouer sur le clavier à l\'écran.',4200);}
    } else $('#entendu-txt').textContent='Clavier à l\'écran';
    ligneSuivante();
  })();
}
function ligneSuivante(){
  if(!G||G.fin||!G.lecture) return;
  if(G.li>=G.lignes){G.fin=true;G.total=G.total+G.extras;setTimeout(resultats,500);return;}
  const niv=G.niv,c=hasard(niv.chiffres),mes=genLigne(niv,c),geo=G.geo;
  const svg=$('#planche');svg.innerHTML='';svg.setAttribute('viewBox',`0 0 ${G.W} ${geo.H}`);
  dessinerPortee(svg,geo,0,G.W);
  const bw=Math.min(90,(G.W-150-50-2*28*1.5)/(2*c));
  const r=rythmeSVG(mes,{c,x0:110,bw,chiffre:true,barreFin:true});
  const gR=svgEl('g');gR.innerHTML=r.h;svg.append(gR);G.fx=svgEl('g');svg.append(G.fx);
  const beat=60/G.bpm;
  G.ligne={r,c,beat,svg,attendus:r.items.filter(i=>i.son).map(i=>({...i,fait:null})),silences:r.items.filter(i=>!i.son),bruts:[]};
  G.total+=G.ligne.attendus.length;
  const curseur=svgEl('line',{x1:r.xDe(0),x2:r.xDe(0),y1:70,y2:180,stroke:'var(--accent)','stroke-width':3,opacity:.8});svg.append(curseur);G.ligne.curseur=curseur;
  // décompte d'une mesure, puis le métronome continue sur chaque temps jusqu'à la fin de la ligne
  const mot=$('#mot');mot.hidden=false;
  const debut=performance.now()+700;G.ligne.t0=debut+c*beat*1000;G.enCours=true;
  const a0=audio().currentTime+.7;
  for(let k=0;k<c*(r.nb+1);k++) clicMetro(k%c===0,a0+k*beat);
  for(let k=0;k<c;k++) setTimeout(()=>{if(!G||G.fin)return;mot.textContent=k+1;},700+k*beat*1000);
  setTimeout(()=>{if(G&&!G.fin)mot.hidden=true;},700+c*beat*1000);
  const fin=G.ligne.t0+(r.nb*c)*beat*1000+Math.max(450,G.attente+50);
  const tic=()=>{ if(!G||G.fin||!G.lecture) return;
    const now=performance.now(),b=(now-G.ligne.t0)/1000/beat;
    if(b>=0){const x=r.xDe(Math.min(b,r.nb*c-.001));curseur.setAttribute('x1',x);curseur.setAttribute('x2',x);}
    // notes manquées
    for(const a of G.ligne.attendus) if(!a.fait&&now>G.ligne.t0+a.t*beat*1000+G.attente) marquer(a,'rate');
    if(now>=fin){finLigne();return;}
    requestAnimationFrame(tic);};
  requestAnimationFrame(tic);
}
function marquer(a,etat,ecart){
  a.fait=etat;const g=G.ligne.svg.querySelector(`.sym[data-i="${a.g}"]`);
  const coulEtat=etat==='parfait'?'var(--ok)':etat==='bien'?'var(--gold)':'var(--bad)';
  if(g&&!(a.tok==='cc'&&g.dataset.rate)) {g.style.setProperty('--ry',coulEtat);if(etat==='rate')g.dataset.rate=1;}
  if(etat==='rate'){G.combo=0;G.revoir[a.tok]=1;const s=P().stats['v:'+a.tok]||(P().stats['v:'+a.tok]={ok:0,err:0,t:0});s.err++;}
  else{G.bons++;G.combo++;G.maxCombo=Math.max(G.maxCombo,G.combo);
    const pts=Math.round((etat==='parfait'?100:60)*(1+Math.min(4,Math.floor(G.combo/5))*.5));G.score+=pts;
    const s=P().stats['v:'+a.tok]||(P().stats['v:'+a.tok]={ok:0,err:0,t:0});s.ok++;
    const t=svgEl('text',{x:a.x,y:205,'text-anchor':'middle',class:'points'});t.textContent=etat==='parfait'?'Parfait':'Bien';G.fx.append(t);setTimeout(()=>t.remove(),800);}
  G.faits++;majHudLecture();
}
function frappe(t,source){
  if(!G||!G.lecture||!G.ligne) return;
  const L=G.ligne,beat=L.beat*1000,dec=G.decal[source]*1000,adj=t-dec;
  let best=null,bd=1e9;
  for(const a of L.attendus){ if(a.fait) continue; const d=adj-(L.t0+a.t*beat); if(Math.abs(d)<Math.abs(bd)){bd=d;best=a;} }
  const brut=best?t-(L.t0+best.t*beat):null;
  if(best&&Math.abs(bd)<=170){ L.bruts.push(brut/1000); marquer(best,Math.abs(bd)<=85?'parfait':'bien'); clavJeu&&clavJeu.flash(clavJeuTouche(),'joue-ok',250); return; }
  if(t<L.t0-beat*.5) return;           // pendant le décompte
  G.extras++;G.combo=0;clavJeu&&clavJeu.flash(clavJeuTouche(),'joue-non',250);
  const b=(adj-L.t0)/beat,x=L.r.xDe(Math.max(0,Math.min(b,L.r.nb*L.c-.001)));
  const sil=L.silences.find(s=>b>=s.t&&b<s.t+(s.dur||1));
  if(sil){G.revoir[sil.tok]=1;const s=P().stats['v:'+sil.tok]||(P().stats['v:'+sil.tok]={ok:0,err:0,t:0});s.err++;encourager(`Chut ! ${VALEURS[sil.tok].art==='le'?'Le':'La'} ${VALEURS[sil.tok].nom} est un silence.`,'triste');}
  const m=svgEl('line',{x1:x,x2:x,y1:185,y2:200,stroke:'var(--bad)','stroke-width':4,'stroke-linecap':'round'});G.fx.append(m);
  majHudLecture();
}
function clavJeuTouche(){return 67;}
function finLigne(){
  const L=G.ligne;G.enCours=false;
  if(L.bruts.length>=3){const v=L.bruts.slice().sort((a,b)=>a-b)[Math.floor(L.bruts.length/2)];
    const src=R().entree==='micro'&&ecoute.actif?'micro':'ecran';G.decal[src]=Math.max(-.05,Math.min(.25,G.decal[src]*.5+v*.5));
    (R().decalage||(R().decalage={}))[src]=+G.decal[src].toFixed(3);sauver();}
  const ok=L.attendus.filter(a=>a.fait&&a.fait!=='rate').length;
  encourager(ok===L.attendus.length?'Toute la ligne au bon moment.':`${ok} notes sur ${L.attendus.length} au bon moment.`,ok===L.attendus.length?'wow':'content');
  G.li++;$('#prog').style.width=(G.li/G.lignes*100)+'%';
  setTimeout(ligneSuivante,1500);
}
function majHudLecture(){ $('#score').textContent=G.score; $('#combo').textContent=G.combo>=3?`${G.combo} de suite`:''; }
