'use strict';
/* Rythme : valeurs de notes, dessin, quiz (pratique) et « Lis et joue » (défi).
   Jetons : n noire, b blanche, bp blanche pointée, r ronde, cc deux croches, s soupir, dp demi-pause, p pause, | barre.
   Un ~ après un jeton le lie au son suivant (liaison) : « n~ | n » se joue une fois et dure deux temps. */
const VALEURS={
  n:{nom:'noire',art:'la',t:1,son:1}, b:{nom:'blanche',art:'la',t:2,son:1}, bp:{nom:'blanche pointée',art:'la',t:3,son:1},
  r:{nom:'ronde',art:'la',t:4,son:1}, cc:{nom:'deux croches',art:'les',t:1,son:1},
  s:{nom:'soupir',art:'le',t:1,son:0}, dp:{nom:'demi-pause',art:'la',t:2,son:0}, p:{nom:'pause',art:'la',t:4,son:0}};
const NOTIONS={...VALEURS, li:{nom:'liaison',art:'la'}};
const nomNotion=k=>(NOTIONS[k]||{nom:k}).nom;
const RY_Y=145, RY_MIL=125;
const baseTok=tok=>tok.replace('~','');
const lireRythme=txt=>txt.split('|').map(m=>m.trim().split(/\s+/).filter(Boolean));
const dureeTok=(tok,c)=>{const b=baseTok(tok);return b==='p'?c:VALEURS[b].t;};
const tempsTxt=t=>t===.5?'Un demi-temps':t===1?'1 temps':t+' temps';
const hasard=a=>a[Math.floor(Math.random()*a.length)];
function melanger(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const LeLa=tok=>{const a=NOTIONS[tok].art;return a==='le'?'Le':a==='les'?'Les':'La';};

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
    case 'dp': return `<rect x="${x-12}" y="${RY_MIL-9}" width="25" height="9" fill="${c}"/>`;     // posée sur la 3e ligne
    case 'p': return `<rect x="${x-12}" y="${RY_MIL-20}" width="25" height="9" fill="${c}"/>`;     // pend sous la 4e ligne
  }
  return '';
}
function chiffreSVG(x,c,inconnu){
  const t=(y,v)=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="var(--f-display)" font-weight="700" font-size="44" fill="${inconnu?'var(--accent)':'var(--staff)'}">${v}</text>`;
  const t2=(y,v)=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="var(--f-display)" font-weight="700" font-size="44" fill="var(--staff)">${v}</text>`;
  return t(105,inconnu?'?':c)+t2(146,4);
}
/* mesures : tableau de mesures (tableaux de jetons). Retourne le dessin et la position de chaque son ou silence.
   o.compte : 2 = chiffres de comptage sur chaque temps, 1 = sur le premier temps de chaque mesure, 0 = aucun.
   o.manque : largeur (en temps) de la case « ? ». */
function rythmeSVG(mesures,o={}){
  const c=o.c||4,bw=o.bw||60,pad=o.pad||28;let x=o.x0||0,h='';const items=[],debuts=[];
  if(o.chiffre){h+=chiffreSVG(x+22,c,o.inconnu);x+=50;}
  const croches=mesures.some(m=>m.includes('cc'));
  mesures.forEach((m,mi)=>{
    const d0=x;debuts.push(d0);let tm=0;
    if(o.compte) for(let b=0;b<c;b++){ if(o.compte===1&&b>0) continue;
      h+=`<text class="compte" x="${d0+pad+b*bw+6}" y="66" text-anchor="middle" font-family="var(--f-display)" font-weight="700" font-size="21" fill="var(--muted)">${b+1}</text>`;
      if(o.compte===2&&croches) h+=`<text class="compte" x="${d0+pad+(b+.5)*bw+6}" y="66" text-anchor="middle" font-family="var(--f-display)" font-size="15" fill="var(--muted)">et</text>`; }
    m.forEach(tk=>{
      const lie=tk.endsWith('~'),tok=baseTok(tk);
      const dur=tok==='?'?(o.manque||1):dureeTok(tok,c),xx=tok==='p'?d0+pad+(c*bw)/2-6:d0+pad+tm*bw+6;
      const idx=items.length;
      if(tok==='?'){const w=Math.max(44,bw*(o.manque||1)-8);
        h+=`<rect x="${xx-16}" y="${RY_Y-80}" width="${w}" height="104" rx="10" fill="var(--hit)" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="6 6"/><text x="${xx+w/2-16}" y="${RY_Y-22}" text-anchor="middle" font-family="var(--f-display)" font-weight="700" font-size="40" fill="var(--accent)">?</text>`;}
      else h+=`<g class="sym" data-i="${idx}">${symboleTok(tok,xx,bw)}</g>`;
      if(tok==='cc'){items.push({x:xx,t:mi*c+tm,son:1,tok,g:idx,dur:.5});items.push({x:xx+bw/2,t:mi*c+tm+.5,son:1,tok,g:idx,dur:.5});}
      else if(tok!=='?') items.push({x:xx,t:mi*c+tm,son:VALEURS[tok].son,tok,g:idx,dur,lieSuivant:lie});
      tm+=dur;
    });
    x=d0+pad+c*bw+pad*.5;
    if(mi<mesures.length-1||o.barreFin) h+=`<line x1="${x}" x2="${x}" y1="85" y2="165" stroke="var(--staff)" stroke-width="2"/>`;
  });
  // Liaisons : un arc sous les têtes, du son lié au son suivant. Le son suivant ne se rejoue pas.
  const sons=items.filter(i=>i.son);
  sons.forEach((a,k)=>{a.sonDur=a.dur;});
  for(let k=sons.length-1;k>=0;k--){const a=sons[k],b=sons[k+1];
    if(a.lieSuivant&&b){ b.lie=true; a.sonDur=a.dur+b.sonDur;
      const x1=a.x+4,x2=b.x-4,y=RY_Y+12,mx=(x1+x2)/2;
      h+=`<path class="liaison" d="M${x1} ${y} Q${mx} ${y+17} ${x2} ${y} Q${mx} ${y+11} ${x1} ${y}Z" fill="var(--staff)"/>`; } }
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
  const nums=svgEl('g');calque.append(nums);
  return new Promise(res=>{
    const t0=performance.now()+150;let fini=false,prochain=0,prochainNum=0;
    const etapes=ry.items.slice().sort((a,b)=>a.t-b.t);
    const tic=()=>{
      if(fini) return; if(o.annule&&o.annule()){fini=true;calque.remove();res();return;}
      const b=(performance.now()-t0)/1000/beat;
      while(prochainNum<total&&b>=prochainNum){const x=ry.xDe(prochainNum);const t=svgEl('text',{x,y:62,'text-anchor':'middle','font-family':'var(--f-display)','font-weight':700,'font-size':24,fill:'var(--accent)'});t.textContent=(prochainNum%ry.c)+1;nums.append(t);prochainNum++;}
      while(prochain<etapes.length&&b>=etapes[prochain].t){const it=etapes[prochain];
        if(it.son&&!it.lie){ton(fMidi(midiDe(G4)),Math.max(.25,(it.sonDur||it.dur||1)*beat*.95),.26);ecoute.ignorer(400);}
        const g=svgParent.querySelector(`.sym[data-i="${it.g}"]`);if(g){g.style.setProperty('--ry','var(--accent)');setTimeout(()=>g.style.removeProperty('--ry'),Math.max(300,(it.dur||.5)*beat*1000));}
        prochain++;}
      if(b>=total+.2){fini=true;setTimeout(()=>{calque.remove();res();},250);return;}
      requestAnimationFrame(tic);
    };
    requestAnimationFrame(tic);
  });
}

/* ----- Maîtrise de chaque notion -----
   Les 20 dernières tentatives (quiz et défi). Nouvelle sous 10 tentatives, fragile sous 85 %, acquise au-delà. */
function noterNotion(k,ok){ if(!k||!NOTIONS[k]) return; const p=P(),m=p.maitrise||(p.maitrise={}),h=m[k]||(m[k]=[]); h.push(ok?1:0); if(h.length>20)h.shift(); }
function etatNotion(k){ const h=(P().maitrise||{})[k]||[]; if(h.length<10) return 'nouvelle'; return h.reduce((a,b)=>a+b,0)/h.length>=.85?'acquise':'fragile'; }
// Notions acquises qui viennent de redevenir fragiles (depuis la fin de la partie précédente).
function reculsRythme(niv){
  const p=P(),avant=p.etats||{},maint={};
  for(const k of Object.keys(p.maitrise||{})) maint[k]=etatNotion(k);
  p.etats=maint;sauver();
  return Object.keys(maint).filter(k=>avant[k]==='acquise'&&maint[k]==='fragile'&&!(niv.nouv||[]).includes(k));
}
function lancerRevisionRythme(tok){
  const vals=tok==='li'?['n']:tok==='p'||tok==='dp'?['n','p','dp']:['n',tok];
  lancerQuiz({id:'rev-'+tok,titre:'Révision : '+nomNotion(tok),mode:'rythme',cle:'sol',ds:[dDe('G4')],vals:[...new Set(vals)],nouv:[tok],
    chiffres:tok==='bp'?[3]:[4],liaison:tok==='li',bpm:66,aide:2,revision:true,unite:{num:3}});
}
// Jetons enseignés dans les niveaux qui précèdent niv (tous si niv est null).
function connuesAvant(niv){
  const s=new Set();for(const n of NIVEAUX){ if(n.mode!=='rythme') continue; if(niv&&n.id===niv.id) break; (n.nouv||[]).forEach(t=>s.add(t)); }
  return [...s];
}
const aLiaisons=niv=>!!niv.liaison||(niv.nouv||[]).includes('li');

/* ----- Génération de mesures -----
   Placements d'usage : la ronde et la blanche pointée commencent la mesure (la blanche pointée peut aussi tomber sur le 2e temps à 4 temps),
   la demi-pause tombe sur le 1er ou le 3e temps à 4 temps, la pause occupe toute la mesure. */
function placable(tok,pos,c,reste){
  if(VALEURS[tok].t>reste) return false;
  switch(tok){
    case 'p': return false;
    case 'r': return c===4&&pos===0;
    case 'bp': return (c===3&&pos===0)||(c===4&&pos<=1);
    case 'dp': return (c===4&&(pos===0||pos===2))||(c===2&&pos===0);
    case 'b': return c===2?pos===0:c===3?pos<=1:true;
  }
  return true;
}
function genMesure(vals,c,poids={}){
  for(let essai=0;essai<80;essai++){
    if(vals.includes('p')&&Math.random()<(poids.p>1?.3:.1)) return ['p'];
    const m=[];let reste=c,ok=true;
    while(reste>0){
      const pos=c-reste,opts=vals.filter(t=>placable(t,pos,c,reste));
      if(!opts.length){ok=false;break;}
      const w=opts.map(t=>poids[t]??1);let r=Math.random()*w.reduce((a,b)=>a+b,0),tok=opts[0];
      for(let i=0;i<opts.length;i++){r-=w[i];if(r<=0){tok=opts[i];break;}}
      m.push(tok);reste-=VALEURS[tok].t;
    }
    if(!ok) continue;
    if(m.every(t=>!VALEURS[t].son)) continue;
    // Deux soupirs sur une demi-mesure s'écrivent avec une demi-pause, une fois qu'on la connaît.
    if(c===4&&(vals.includes('dp')||poids._dp)){let pos=0,mauvais=false;for(let i=0;i<m.length-1;i++){if(m[i]==='s'&&m[i+1]==='s'&&pos%2===0)mauvais=true;pos+=VALEURS[m[i]].t;} if(mauvais) continue;}
    return m;
  }
  return Array(c).fill('n');
}
const compter=(l,tok)=>l.flat().filter(t=>baseTok(t)===tok).length;
// Ajoute des liaisons : par-dessus la barre de mesure, et (niveau de la liaison) entre deux noires d'une même mesure.
function lier(l,nb,dedans){
  let faits=0;
  for(let k=0;k<l.length-1&&faits<nb;k++){const a=l[k],b=l[k+1],u=a[a.length-1];
    if(VALEURS[u].son&&u!=='cc'&&VALEURS[b[0]].son&&b[0]!=='cc'){a[a.length-1]=u+'~';faits++;}}
  for(let k=0;k<l.length&&faits<nb+dedans;k++) for(let i=0;i<l[k].length-1&&faits<nb+dedans;i++)
    if(l[k][i]==='n'&&l[k][i+1]==='n'&&Math.random()<.6){l[k][i]='n~';faits++;i++;}
  return l;
}
/* Une ligne du défi. li = numéro de la ligne (0 à 3).
   Ligne 0 : seulement des notions acquises (on commence par une réussite).
   Lignes 1 à 3 : la notion du niveau, de plus en plus présente, accompagnée de noires. Révision : les notions fragiles reviennent plus souvent. */
function valeursLigne(niv,c,li){
  const acquises=t=>etatNotion(t)==='acquise';
  if(niv.rev){
    const v=niv.vals.filter(t=>t==='n'||(li===0?acquises(t):true));
    const poids={};v.forEach(t=>{const e=etatNotion(t);poids[t]=e==='fragile'?3:e==='nouvelle'?2:1;});
    return {vals:v,poids,neuf:null};
  }
  if(niv.metre) return {vals:li===0?['n']:niv.vals.filter(t=>t==='n'||acquises(t)||niv.vals.length<=2),poids:{},neuf:null};
  const neuf=(niv.nouv||[]).find(t=>VALEURS[t]);
  if(li===0) return {vals:[...new Set(['n',...connuesAvant(niv).filter(t=>VALEURS[t]&&acquises(t))])],poids:{},neuf:null};
  if(!neuf) return {vals:niv.vals,poids:{},neuf:null};
  return {vals:niv.vals,poids:{[neuf]:[0,1,2,3][li]},neuf};
}
function genLigne(niv,c,li=1,nb=c===2?3:2){
  let {vals,poids,neuf}=valeursLigne(niv,c,li);
  vals=vals.filter(t=>t==='p'||[0,1,2,3].some(pos=>placable(t,pos,c,c)));
  if(!vals.some(t=>VALEURS[t].son)) vals=['n',...vals];
  const dpConnue=niv.vals.includes('dp')||connuesAvant(niv).includes('dp');
  let l;
  for(let essai=0;essai<60;essai++){
    l=[];for(let i=0;i<nb;i++) l.push(genMesure(vals,c,{...poids,_dp:dpConnue}));
    if(essai<50&&l.flat().filter(t=>VALEURS[t].son).length<nb+1) continue;   // au moins 3 attaques sur 2 mesures
    if(neuf&&compter(l,neuf)<((VALEURS[neuf].t>=3||neuf==='p')?1:Math.min(li,2))) continue;      // la nouveauté apparaît à coup sûr
    break;
  }
  if(li>0&&(niv.nouv||[]).includes('li')) lier(l,1,li-1);
  else if(li>0&&niv.liaison&&Math.random()<.45) lier(l,1,0);
  return l;
}

/* ----- Quiz (pratique) ----- */
function choisirTok(niv,filtre=()=>true){
  const opts=niv.vals.filter(filtre);
  const w=opts.map(t=>{const e=etatNotion(t);return ((niv.nouv||[]).includes(t)?3:1)*(e==='fragile'?3:e==='nouvelle'?2:1);});
  let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<opts.length;i++){r-=w[i];if(r<=0)return opts[i];}return opts[opts.length-1];
}
// Pour chaque valeur, les mauvaises réponses qui correspondent à l'erreur typique.
const CONFUSIONS={n:[2,4],b:[1,4],r:[2,3],bp:[2,4],s:[2,4],dp:[4,1],p:[2,1],cc:[.5,2]};
function typesQuiz(niv){
  const v=niv.vals,durs=new Set(v.filter(t=>t!=='p').map(t=>VALEURS[t].t)),T={combien:2,temps:2,manque:1.5};
  if(durs.size>=2){T.lequel=1.5;T.complete=1.5;}
  if(v.some(t=>!VALEURS[t].son)&&v.some(t=>VALEURS[t].son)) T.sonsil=1;
  if(v.includes('p')&&v.includes('dp')) T.pausedp=2;
  if((niv.quizC||niv.chiffres).length>1) T.chiffre=niv.metre?4:1.5;
  if(niv.metre){T.manque=3;T.temps=3;}
  if(aLiaisons(niv)) T.lie=(niv.nouv||[]).includes('li')?5:1;
  return T;
}
function mesureQuiz(niv,c,min=2){
  let vals=niv.vals.filter(t=>t!=='p'&&[0,1,2,3].some(p=>placable(t,p,c,c)));
  if(!vals.some(t=>VALEURS[t].son)) vals=['n',...vals];
  for(let k=0;k<30;k++){const m=genMesure(vals,c,{});if(m.length>=min)return m;}
  return Array(c).fill('n');
}
function genQuestion(niv){
  const T=typesQuiz(niv),noms=Object.keys(T);
  for(let essai=0;essai<30;essai++){
    let r=Math.random()*noms.reduce((a,k)=>a+T[k],0),type=noms[0];
    for(const k of noms){r-=T[k];if(r<=0){type=k;break;}}
    const q=QUESTIONS[type](niv);
    if(q){q.type=type;return q;}
  }
  return QUESTIONS.combien(niv);
}
const QUESTIONS={
  combien(niv){
    const tok=choisirTok(niv),d=dureeTok(tok,4),v=VALEURS[tok];
    let autres=(tok==='n'&&niv.vals.includes('cc'))?[.5,2]:CONFUSIONS[tok].slice();
    return {tok,texte:tok==='cc'?'Combien de temps durent ces deux croches ?':tok==='p'?'Dans une mesure à 4 temps, combien de temps dure la pause ?':`Combien de temps dure ${v.art==='le'?'ce':'cette'} ${v.nom} ?`,
      dessin:tok==='p'?{mesures:[['p']],c:4,chiffre:true,barreFin:true}:{mesures:[[tok]],c:4,seul:true},choix:melanger([d,...autres]).map(x=>({label:tempsTxt(x),ok:x===d})),
      expl:tok==='cc'?'Chaque croche dure un demi-temps. Les deux ensemble durent 1 temps.':tok==='p'?'La pause dure toute la mesure : 4 temps ici.':tok==='bp'?'Deux temps pour la blanche, plus un pour le point : 3 temps.':`${LeLa(tok)} ${v.nom} dure ${tempsTxt(d)}.`};
  },
  lequel(niv){
    const tok=choisirTok(niv,t=>t!=='p'),d=VALEURS[tok].t;
    const pris=[];for(const t of melanger(niv.vals.filter(t=>t!=='p'&&VALEURS[t].t!==d))){if(!pris.some(p=>VALEURS[p].t===VALEURS[t].t))pris.push(t);if(pris.length===2)break;}
    if(!pris.length) return null;
    return {tok,texte:`Lequel dure ${tempsTxt(d)} ?`,choix:melanger([tok,...pris]).map(t=>({tok:t,ok:t===tok})),
      expl:`${LeLa(tok)} ${VALEURS[tok].nom} ${tok==='cc'?'durent':'dure'} ${tempsTxt(d)}.`};
  },
  sonsil(niv){
    const tok=choisirTok(niv),son=!!VALEURS[tok].son;
    return {tok,texte:'Un son ou un silence ?',dessin:{mesures:[[tok]],c:4,seul:true},
      choix:[{label:'Un son',ok:son},{label:'Un silence',ok:!son}],expl:`${LeLa(tok)} ${VALEURS[tok].nom} ${son?(tok==='cc'?'sont des sons.':'est un son.'):'est un silence : on compte sans jouer.'}`};
  },
  // Sur quel temps commence le symbole en couleur ? On lit les durées qui le précèdent.
  temps(niv){
    const c=hasard(niv.chiffres);if(c<2) return null;
    const m=mesureQuiz(niv,c,2);let pos=0;const debuts=m.map(t=>{const p=pos;pos+=VALEURS[t].t;return p;});
    const cand=m.map((t,i)=>i).filter(i=>i>0);if(!cand.length) return null;
    const i=hasard(cand),rep=debuts[i]+1,tok=m[i],son=VALEURS[tok].son;
    const autres=melanger([...Array(c)].map((_,k)=>k+1).filter(x=>x!==rep)).slice(0,2);
    let gi=0;for(let k=0;k<i;k++)gi+=m[k]==='cc'?2:1;
    return {tok:null,texte:`Sur quel temps commence ${tok==='cc'?'les croches':son?'la note':'le silence'} en couleur ?`,dessin:{mesures:[m],c,chiffre:true,barreFin:true,marque:gi},
      choix:[rep,...autres].sort((a,b)=>a-b).map(x=>({label:'Temps '+x,ok:x===rep})),
      expl:`Avant, il y a ${tempsTxt(debuts[i])}. ${tok==='cc'?'Les croches commencent':son?'La note commence':'Le silence commence'} donc sur le temps ${rep}.`};
  },
  // Combien de temps manque-t-il ? La case garde la même largeur : elle ne donne pas la réponse.
  manque(niv){
    const c=hasard(niv.chiffres),m=mesureQuiz(niv,c,2);
    const enleve=m.length>=3&&Math.random()<.4?2:1,reste=m.slice(0,m.length-enleve),d=c-reste.reduce((s,t)=>s+VALEURS[t].t,0);
    if(d<1||d>=c) return null;
    const autres=melanger([1,2,3,4].filter(x=>x!==d&&x<=c)).slice(0,2);
    return {tok:null,texte:'Combien de temps manque-t-il dans cette mesure ?',dessin:{mesures:[[...reste,'?']],c,chiffre:true,manque:1.2},
      choix:[d,...autres].sort((a,b)=>a-b).map(x=>({label:tempsTxt(x),ok:x===d})),expl:`La mesure compte ${c} temps. Il y en a ${c-d}, il manque donc ${tempsTxt(d)}.`};
  },
  complete(niv){
    const c=hasard(niv.chiffres),m=mesureQuiz(niv,c,2),tok=m.pop(),d=VALEURS[tok].t;
    const pris=[];for(const t of melanger(niv.vals.filter(t=>t!=='p'&&VALEURS[t].t!==d))){if(!pris.some(p=>VALEURS[p].t===VALEURS[t].t))pris.push(t);if(pris.length===2)break;}
    if(!pris.length) return null;
    return {tok,texte:'Quel symbole complète la mesure ?',dessin:{mesures:[[...m,'?']],c,chiffre:true,manque:1.2},
      choix:melanger([tok,...pris]).map(t=>({tok:t,ok:t===tok})),expl:`Il manque ${tempsTxt(d)} pour arriver à ${c} : ${LeLa(tok).toLowerCase()} ${VALEURS[tok].nom}.`};
  },
  chiffre(niv){
    const cs=(niv.quizC||niv.chiffres).slice().sort(),c=hasard(cs),l=[mesureQuiz(niv,c,1),mesureQuiz(niv,c,1)];
    return {tok:null,texte:'Quel chiffre va en haut ?',dessin:{mesures:l,c,chiffre:true,inconnu:true},
      choix:cs.map(x=>({label:String(x),ok:x===c})),expl:`Chaque mesure compte ${c} temps, donc le chiffre du haut est ${c}.`};
  },
  pausedp(niv){
    const tok=Math.random()<.5?'p':'dp',m=tok==='p'?['p']:hasard([['dp','b'],['n','n','dp'],['dp','n','n']]);
    return {tok,texte:'Ce silence en couleur, c\'est une pause ou une demi-pause ?',dessin:{mesures:[m],c:4,chiffre:true,barreFin:true,marque:m.indexOf(tok)},
      choix:melanger([{label:'Une pause',ok:tok==='p'},{label:'Une demi-pause',ok:tok==='dp'}]),
      expl:tok==='p'?'Il pend sous la quatrième ligne : c\'est la pause. Plus longue, plus lourde, elle pend.':'Il est posé sur la ligne du milieu : c\'est la demi-pause.'};
  },
  lie(niv){
    if(Math.random()<.4) return {tok:'li',texte:'Deux notes liées : combien de fois les joues-tu ?',dessin:{mesures:[['n','n','n','n~'],['n','n','b']],c:4,chiffre:true,barreFin:true},
      choix:melanger([{label:'Une fois',ok:true},{label:'Deux fois',ok:false}]),expl:'On joue la première note, puis on la tient pendant la deuxième sans la rejouer.'};
    const c=4,sons=['n','b'];
    const a=hasard(sons),b=hasard(sons),m1=genMesureFin(a,c),m2=[b,...genMesureDebut(b,c)];
    m1[m1.length-1]=a+'~';const tot=VALEURS[a].t+VALEURS[b].t;
    const autres=[...new Set([VALEURS[a].t,tot+1,VALEURS[b].t===VALEURS[a].t?tot+2:VALEURS[b].t].filter(x=>x!==tot))].slice(0,2);
    return {tok:'li',texte:'Les deux notes liées durent combien de temps en tout ?',dessin:{mesures:[m1,m2],c,chiffre:true,barreFin:true},
      choix:melanger([tot,...autres]).map(x=>({label:tempsTxt(x),ok:x===tot})),expl:`${tempsTxt(VALEURS[a].t)} plus ${tempsTxt(VALEURS[b].t)} : ${tempsTxt(tot)} en tout.`};
  },
};
// Une mesure de noires qui finit par a, et la suite d'une mesure qui commence par b.
function genMesureFin(a,c){const m=[];for(let r=c-VALEURS[a].t;r>0;r--)m.push('n');m.push(a);return m;}
function genMesureDebut(b,c){const m=[];for(let r=c-VALEURS[b].t;r>0;r--)m.push('n');return m;}
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
  if(d.marque!=null){const g=svg.querySelector(`.sym[data-i="${d.marque}"]`);if(g)g.style.setProperty('--ry','var(--accent)');}
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
    if(!G.essais){G.bons++;G.combo++;noterNotion(q.tok,true);}else G.combo=0;
    const pts=G.essais?40:Math.round(100*(1+Math.min(4,Math.floor(G.combo/5))*.5));G.score+=pts;
    $('#q-dit').textContent=G.essais?q.expl:(G.combo%5===0?`${G.combo} bonnes réponses de suite.`:q.expl);$('#q-retour').classList.add('vu');
    $('#q-score').textContent=G.score;$('#q-prog').style.width=(G.faits/G.total*100)+'%';
    $('#q-combo').textContent=G.combo>=3?`${G.combo} de suite`:'';
    sauver();setTimeout(questionSuivante,G.essais?1500:1100);
  } else {
    G.essais++;G.combo=0;b.classList.add('non');b.disabled=true;sonNon();
    if(G.essais===1&&q.tok){noterNotion(q.tok,false);G.revoir[q.tok]=1;}
    $('#q-dit').textContent=q.expl;$('#q-retour').classList.add('vu');$('#q-combo').textContent='';
  }
}

/* ----- Lis et joue (défi) ----- */
function lancerLecture(niv){
  const geo=geom('sol');
  G={niv,mode:'defi',lecture:true,lignes:4,li:0,res:[],rejeu:null,bons:0,total:0,score:0,combo:0,maxCombo:0,revoir:{},fin:false,geo,
     bpm:Math.round((niv.bpm||66)*R().vitesse),attente:100};
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
      if(ok){ecoute.onAttaque=null;ecoute.onNote=(m,t)=>frappe(t,'micro');G.attente=450;   // une attaque compte seulement si une vraie note de piano suit
        ecoute.onTrame=({rms})=>{$('#vu').style.width=Math.min(100,rms/(R().seuil*4)*100)+'%';};$('#entendu-txt').textContent='J\'écoute…';}
      else{$('#entendu-txt').textContent='Micro indisponible';toast('Le micro n\'est pas accessible. Tu peux jouer sur le clavier à l\'écran.',4200);}
    } else $('#entendu-txt').textContent='Clavier à l\'écran';
    ligneSuivante();
  })();
}
function ligneSuivante(){
  if(!G||G.fin||!G.lecture) return;
  if(G.li>=G.lignes){
    // Seconde chance : la ligne la moins réussie revient une fois, à la fin.
    const pire=G.res.map((r,i)=>({i,q:r.bons/(r.total+r.extras)})).filter(x=>x.q<1).sort((a,b)=>a.q-b.q)[0];
    if(G.rejeu==null&&pire){G.rejeu=pire.i;}
    else {finDefi();return;}
  }
  const niv=G.niv,geo=G.geo,rejeu=G.li>=G.lignes;
  let c,mes;
  if(rejeu){({c,mes}=G.res[G.rejeu]);}
  else {c=hasard(niv.chiffres);mes=genLigne(niv,c,G.li);}
  const svg=$('#planche');svg.innerHTML='';svg.setAttribute('viewBox',`0 0 ${G.W} ${geo.H}`);
  dessinerPortee(svg,geo,0,G.W);
  const nb=mes.length,bw=Math.min(90,(G.W-200-nb*42)/(nb*c));
  const r=rythmeSVG(mes,{c,x0:110,bw,chiffre:true,barreFin:true,compte:niv.aide??2});
  const gR=svgEl('g');gR.innerHTML=r.h;svg.append(gR);G.fx=svgEl('g');svg.append(G.fx);G.marques=svgEl('g');svg.append(G.marques);
  const beat=60/G.bpm;
  G.ligne={r,c,mes,beat,svg,items:r.items,attendus:r.items.filter(i=>i.son&&!i.lie).map(i=>({...i})),silences:r.items.filter(i=>!i.son),frappes:[],vus:0,onJuge:rendreLigne};
  fenetres(G.ligne.attendus,beat*1000);
  $('#consigne').textContent=rejeu?'Seconde chance : rejoue cette ligne.':'Joue chaque note au bon moment, sur n\'importe quelle touche.';
  // décompte d'une mesure, puis la pulsation continue sur chaque temps jusqu'à la fin de la ligne
  const mot=$('#mot');mot.hidden=false;
  const debut=performance.now()+700;G.ligne.t0=debut+c*beat*1000;G.enCours=true;
  const a0=audio().currentTime+.7;
  for(let k=0;k<c*(r.nb+1);k++) pulsation(k,c,a0+k*beat,beat);
  for(let k=0;k<c;k++) setTimeout(()=>{if(!G||G.fin)return;mot.textContent=k+1;},700+k*beat*1000);
  setTimeout(()=>{if(G&&!G.fin)mot.hidden=true;},700+c*beat*1000);
  const fin=G.ligne.t0+(r.nb*c)*beat*1000+Math.max(...G.ligne.attendus.map(a=>a.tol))+G.attente+50;
  let dernier=0;
  const tic=()=>{ if(!G||G.fin||!G.lecture) return;
    const now=performance.now();
    if(now-dernier>100){dernier=now;jugerLigne(now);rendreLigne(null);}
    if(now>=fin){finLigne();return;}
    requestAnimationFrame(tic);};
  requestAnimationFrame(tic);
}
// Couleurs des notes, marques des frappes en trop, « Parfait » ou « Bien » sous la note qu'on vient de jouer.
function rendreLigne(k){
  const L=G.ligne,E=L.etat;if(!E) return;
  const coul={parfait:'var(--ok)',bien:'var(--gold)',faux:'var(--bad)',rate:'var(--bad)'};
  const parG={};
  L.attendus.forEach((a,i)=>{const e=E.notes[i];if(!e) return;const pire=parG[a.g];
    if(!pire||e==='faux'||e==='rate'||(e==='bien'&&pire==='parfait')) parG[a.g]=e;});
  L.svg.querySelectorAll('.sym').forEach(g=>{const e=parG[g.dataset.i];if(e)g.style.setProperty('--ry',coul[e]);else g.style.removeProperty('--ry');});
  G.marques.innerHTML='';
  for(const j of E.extras){const b=(L.frappes[j].t-L.t0)/(L.beat*1000)-E.niveau,x=L.r.xDe(Math.max(0,Math.min(b,L.r.nb*L.c-.001)));
    G.marques.append(svgEl('line',{x1:x,x2:x,y1:185,y2:200,stroke:'var(--bad)','stroke-width':4,'stroke-linecap':'round'}));}
  G.ptsLigne=pointsLigne(E);majHudLecture();
  if(k==null) return;
  const i=E.par[k];
  if(i>=0&&(E.notes[i]==='parfait'||E.notes[i]==='bien')){
    const t=svgEl('text',{x:L.attendus[i].x,y:205,'text-anchor':'middle',class:'points'});t.textContent=E.notes[i]==='parfait'?'Parfait':'Bien';G.fx.append(t);setTimeout(()=>t.remove(),800);
    clavJeu&&clavJeu.flash(clavJeuTouche(),'joue-ok',250);
  } else if(E.extras.includes(k)){
    clavJeu&&clavJeu.flash(clavJeuTouche(),'joue-non',250);
    const b=(L.frappes[k].t-L.t0)/(L.beat*1000)-E.niveau,sil=L.silences.find(s=>b>=s.t&&b<s.t+(s.dur||1));
    if(sil) encourager(`Chut ! ${LeLa(sil.tok)} ${VALEURS[sil.tok].nom} est un silence.`,'triste');
  }
}
function frappe(t,source){
  if(!G||!G.lecture||!G.ligne||!G.enCours) return;
  const L=G.ligne,adj=t-G.decal[source]*1000;
  if(adj<L.t0-L.beat*500) return;           // pendant le décompte
  L.frappes.push({t:adj,brut:t,vol:source==='micro'?ecoute.volNote:0});
  jugerLigne(performance.now());
  L.onJuge&&L.onJuge(L.frappes.length-1);
}
/* Jugement d'une ligne.
   On juge la lecture des valeurs, pas la précision du geste. Chaque note a une fenêtre autour de son temps (voir fenetres).
   L'enfant peut jouer toute une suite décalée d'un temps entier : c'est ce qui arrive quand il lit mal une valeur
   (une blanche jouée comme une noire avance tout ce qui suit). Ce décalage ne coûte qu'une faute, à la note dont la durée
   était fausse. On cherche l'appariement frappes/notes le moins coûteux (programmation dynamique) :
   note jamais jouée = 1, frappe en trop = 1, changement de décalage = 1. */
function jugerLigne(now){
  const L=G.ligne,N=L.attendus.length,A=L.frappes,M=A.length,beat=L.beat*1000;
  const vMax=A.reduce((m,f)=>Math.max(m,f.vol),0);
  const T=i=>L.t0+L.attendus[i].t*beat;
  const niv=(i,j)=>Math.round((A[j].t-T(i))/beat);
  const ecart=(i,j)=>Math.abs(A[j].t-T(i)-niv(i,j)*beat);
  // Frappe hors appariement : gratuite si elle est faible (une note qui résonne, relancée par la batterie)
  // ou si elle tombe à la fin d'une note jouée (étouffoir, touche qui remonte).
  const libre=(k,i,j)=>{ if(A[k].vol<vMax*SEUIL_FRAPPE) return 0;
    if(i>=0){const fin=A[j].t+L.attendus[i].sonDur*beat;if(Math.abs(A[k].t-fin)<=beat*.5) return 0;} return 1; };
  const cumuls=new Map();   // sommes cumulées des frappes libres, pour chaque dernière paire (i,j)
  const somme=(a,b,i,j)=>{const cle=i*1000+j;let cu=cumuls.get(cle);
    if(!cu){cu=[0];for(let k=0;k<M;k++)cu.push(cu[k]+libre(k,i,j));cumuls.set(cle,cu);} return b>a?cu[b]-cu[a]:0;};
  const due=(i,lv)=>now>T(i)+lv*beat+L.attendus[i].tol+G.attente;
  const f=[...Array(N)].map(()=>new Array(M).fill(Infinity)),de=[...Array(N)].map(()=>new Array(M).fill(null));
  for(let i=0;i<N;i++) for(let j=0;j<M;j++){
    const lv=niv(i,j),e=ecart(i,j),dans=e<=L.attendus[i].tol,fin=e/beat*1e-3;
    let c=i+somme(0,j,-1,-1)+(lv===0&&dans?0:1)+fin;
    if(c<f[i][j]){f[i][j]=c;de[i][j]=null;}
    for(let i2=0;i2<i;i2++) for(let j2=0;j2<j;j2++){ if(f[i2][j2]===Infinity) continue;
      c=f[i2][j2]+(i-i2-1)+somme(j2+1,j,i2,j2)+(lv===niv(i2,j2)&&dans?0:1)+fin;
      if(c<f[i][j]){f[i][j]=c;de[i][j]=[i2,j2];} }
  }
  let best={c:somme(0,M,-1,-1)+L.attendus.filter((a,i)=>due(i,0)).length,i:-1,j:-1};
  for(let i=0;i<N;i++) for(let j=0;j<M;j++){ if(f[i][j]===Infinity) continue;
    let c=f[i][j]+somme(j+1,M,i,j);const lv=niv(i,j);for(let k=i+1;k<N;k++) if(due(k,lv)) c++;
    if(c<best.c){best={c,i,j};} }
  // On remonte l'appariement retenu.
  const notes=new Array(N).fill(null),par=new Array(M).fill(-1),paires=[];
  for(let p=best.i>=0?[best.i,best.j]:null;p;p=de[p[0]][p[1]]) paires.unshift(p);
  let lvAv=0,iAv=-1,jAv=-1;const extras=[],faux=[];
  for(const [i,j] of paires){
    for(let k=iAv+1;k<i;k++) notes[k]='rate';
    for(let k=jAv+1;k<j;k++) if(libre(k,iAv,jAv)) extras.push(k);
    const lv=niv(i,j),e=ecart(i,j),a=L.attendus[i];par[j]=i;
    if(e>a.tol) notes[i]='faux';                       // l'attaque tombe entre deux temps
    else if(lv!==lvAv&&iAv<0) notes[i]='faux';          // dès le départ, un temps trop tôt ou trop tard
    else { notes[i]=e<=a.tolP?'parfait':'bien'; if(lv!==lvAv) faux.push(iAv); }
    lvAv=lv;iAv=i;jAv=j;
  }
  for(let k=jAv+1;k<M;k++) if(libre(k,iAv,jAv)) extras.push(k);
  for(let k=iAv+1;k<N;k++) if(due(k,lvAv)) notes[k]='rate';
  // Le changement de décalage revient à la note d'avant : c'est sa durée qui était fausse.
  // Au tout début de la ligne, c'est la note elle-même (ou le silence qui la précède) qui est fausse.
  const changements=[];
  for(const i of faux){ notes[i]='faux'; changements.push(i); }
  L.etat={notes,par,extras,changements,paires,niveau:lvAv};
  return L.etat;
}
// Bilan d'une ligne terminée : notes justes, notes, frappes en trop, et ce qu'il faut noter pour chaque notion.
function bilanLigne(){
  const L=G.ligne,E=jugerLigne(Infinity),N=L.attendus.length;
  const bons=E.notes.filter(e=>e==='parfait'||e==='bien').length;
  // Chaque écart entre deux notes jouées vérifie la durée de la première note (et des silences qui suivent, et de la liaison).
  const notions=[];
  const entre=(i,i2)=>{const a=L.attendus[i],b=i2!=null?L.attendus[i2]:null,t=[a.tok];if(a.lieSuivant||a.sonDur>a.dur)t.push('li');
    for(const s of L.silences) if(s.t>a.t&&(!b||s.t<b.t)) t.push(s.tok); return t;};
  for(let k=0;k<E.paires.length;k++){const [i]=E.paires[k],suiv=E.paires[k+1];
    if(!suiv) continue; const ok=!E.changements.includes(i)&&E.notes[i]!=='faux';
    for(const t of entre(i,suiv[0])) notions.push([t,ok]); }
  E.notes.forEach((e,i)=>{if(e==='rate') notions.push([L.attendus[i].tok,false]);});
  for(const j of E.extras){const b=(L.frappes[j].t-L.t0)/(L.beat*1000)-E.niveau,sil=L.silences.find(s=>b>=s.t&&b<s.t+(s.dur||1));if(sil) notions.push([sil.tok,false]);}
  const beatMs=L.beat*1000,bruts=E.paires.filter(([i])=>E.notes[i]!=='faux').map(([i,j])=>{const T=L.t0+L.attendus[i].t*beatMs,lv=Math.round((L.frappes[j].t-T)/beatMs);
    return (L.frappes[j].brut-T-lv*beatMs)/1000;});
  return {bons,total:N,extras:E.extras.length,notions,bruts,points:pointsLigne(E)};
}
const SEUIL_FRAPPE=.8;
// La fenêtre de chaque note va jusqu'à 40 % de l'écart avec la note voisine (un temps au plus, un demi-temps entre deux croches).
// Lire une blanche comme une noire décale l'attaque d'un temps entier : elle tombe hors de la fenêtre et reste une faute.
const FEN_BIEN=.4;
function fenetres(att,beatMs){
  const s=att.slice().sort((a,b)=>a.t-b.t);
  s.forEach((a,i)=>{const g=Math.min(1,i>0?a.t-s[i-1].t:1,i<s.length-1?s[i+1].t-a.t:1);
    a.tol=FEN_BIEN*g*beatMs; a.tolP=Math.min(a.tol/2,Math.max(85,beatMs*.12));});
}
// Points d'une ligne : 100 pour « Parfait », 60 pour « Bien », multipliés par la série en cours.
function pointsLigne(E){
  let pts=0,serie=0;
  for(const e of E.notes){ if(e==='parfait'||e==='bien'){serie++;pts+=Math.round((e==='parfait'?100:60)*(1+Math.min(4,Math.floor(serie/5))*.5));} else if(e) serie=0; }
  return pts;
}
function clavJeuTouche(){return 67;}
function finLigne(){
  const L=G.ligne;G.enCours=false;
  const B=bilanLigne();rendreLigne(null);
  // décalage du micro ou de l'écran, appris sur les notes justes
  if(B.bruts.length>=3){const v=B.bruts.slice().sort((a,b)=>a-b)[Math.floor(B.bruts.length/2)];
    const src=R().entree==='micro'&&ecoute.actif?'micro':'ecran';G.decal[src]=Math.max(-.05,Math.min(.25,G.decal[src]*.5+v*.5));
    (R().decalage||(R().decalage={}))[src]=+G.decal[src].toFixed(3);}
  for(const [t,ok] of B.notions){noterNotion(t,ok);if(!ok)G.revoir[t]=1;}
  sauver();
  const parfaite=B.bons===B.total&&!B.extras;
  let bonus=parfaite?200:0;G.score+=B.points+bonus;G.ptsLigne=0;
  const res={bons:B.bons,total:B.total,extras:B.extras,c:L.c,mes:L.mes};
  if(G.li>=G.lignes){ const o=G.res[G.rejeu]; if(B.bons/(B.total+B.extras)>o.bons/(o.total+o.extras)) G.res[G.rejeu]={...res,rejoue:true}; }
  else G.res.push(res);
  if(parfaite){encourager('Ligne parfaite ! +200 points','wow');sonOk();}
  else encourager(B.bons===B.total?`Toutes les notes au bon moment, ${B.extras>1?B.extras+' notes':'une note'} en trop.`:`${B.bons} notes sur ${B.total} au bon moment.`,'content');
  G.li++;const tot=G.lignes+(G.rejeu!=null?1:0);$('#prog').style.width=(Math.min(G.li,tot)/tot*100)+'%';majHudLecture();
  setTimeout(ligneSuivante,1500);
}
function finDefi(){
  G.fin=true;G.bons=G.res.reduce((s,r)=>s+r.bons,0);G.total=G.res.reduce((s,r)=>s+r.total+r.extras,0);
  setTimeout(resultats,500);
}
function majHudLecture(){ $('#score').textContent=G.score+(G.ptsLigne||0); $('#combo').textContent=''; }
