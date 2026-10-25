// Génère la narration des tutoriels avec la voix macOS « Amélie (Premium) ».
// Usage : node generer_voix.mjs   (ne régénère que les phrases modifiées)
import fs from 'fs'; import {execFileSync} from 'child_process'; import crypto from 'crypto';
globalThis.window={}; eval(fs.readFileSync(new URL('./tutos.js',import.meta.url),'utf8'));
const dir=new URL('./voix/',import.meta.url).pathname; fs.mkdirSync(dir,{recursive:true});
const idxF=dir+'index.json'; const idx=fs.existsSync(idxF)?JSON.parse(fs.readFileSync(idxF,'utf8')):{};
const garder=new Set(['index.json']);
for(const [id,etapes] of Object.entries(window.TUTOS)){ let tot=0;
  etapes.forEach((e,i)=>{ const nom=`${id}-${i}.m4a`, h=crypto.createHash('md5').update(e.dit).digest('hex'); garder.add(nom);
    if(idx[nom]?.h!==h||!fs.existsSync(dir+nom)){ const tmp=dir+'tmp.aiff';
      execFileSync('say',['-v','Amélie (Premium)','-r','165','-o',tmp,e.dit]);
      execFileSync('afconvert',['-f','m4af','-d','aac','-b','48000',tmp,dir+nom]); fs.unlinkSync(tmp);
      const s=execFileSync('afinfo',[dir+nom]).toString().match(/estimated duration: ([\d.]+)/);
      idx[nom]={h,d:+(+s[1]).toFixed(2)}; }
    tot+=idx[nom].d; });
  console.log(id.padEnd(4), tot.toFixed(1)+' s de voix', etapes.length+' étapes'); }
for(const f of fs.readdirSync(dir)) if(!garder.has(f)) fs.unlinkSync(dir+f);
fs.writeFileSync(idxF,JSON.stringify(idx,null,0));
