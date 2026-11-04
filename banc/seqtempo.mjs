// Interprétation au tempo de l'appli : une mesure de décompte avant chaque ligne, retard et irrégularité de l'enfant.
import fs from 'fs';
const src=fs.readFileSync('/Users/david/duopiano/pieces.js','utf8');
const PIECES=new Function(src.slice(src.indexOf('const PIECES'),src.indexOf('const DUREE_P'))+';return PIECES;')();
const [pid,parLigne,sortie,retard,jitter,seed]=process.argv.slice(2);const pc=PIECES.find(p=>p.id===pid);
const D={n:1,b:2,bp:3,r:4,c:.5,s:1,dp:2,p:pc.c},L='CDEFGAB',SE=[0,2,4,5,7,9,11];
const mes=pc.m.split('|').map(m=>m.trim().split(/\s+/));const notes=[];
mes.forEach((m,i)=>{ if(i%+parLigne===0) notes.push([null,pc.c]);
  m.forEach(tk=>{tk=tk.replace('~','');if(!tk.includes(':')){notes.push([null,D[tk]]);return;}const [a,v]=tk.split(':');notes.push([12*(+a[1]+1)+SE[L.indexOf(a[0])],D[v]]);});});
console.log(JSON.stringify({bpm:pc.bpm,notes,sortie,couche:'V3',seed:+seed,jitter:+jitter,debut:.5+ +retard}));
