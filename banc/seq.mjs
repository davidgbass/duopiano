import fs from 'fs';
const src=fs.readFileSync('/Users/david/duopiano/pieces.js','utf8');
const PIECES=new Function(src.slice(src.indexOf('const PIECES'),src.indexOf('const DUREE_P'))+';return PIECES;')();
const [pid,bpm,sortie,couche,seed]=process.argv.slice(2);const pc=PIECES.find(p=>p.id===pid);
const D={n:1,b:2,bp:3,r:4,c:.5,s:1,dp:2,p:pc.c},L='CDEFGAB',SE=[0,2,4,5,7,9,11];
const notes=pc.m.replace(/\|/g,' ').split(/\s+/).filter(Boolean).map(tk=>{tk=tk.replace('~','');if(!tk.includes(':'))return [null,D[tk]];const [a,v]=tk.split(':');return [12*(+a[1]+1)+SE[L.indexOf(a[0])],D[v]];});
console.log(JSON.stringify({bpm:+bpm,notes,sortie,couche,seed:+seed,jitter:.02}));
