import { chromium } from 'playwright'; import fs from 'fs';
const [wav,pid,mode]=process.argv.slice(2); const vrais=JSON.parse(fs.readFileSync(wav+'.json'));
const dur=vrais[vrais.length-1][1]+3;
const b=await chromium.launch({executablePath:process.env.CHROME,args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--use-file-for-fake-audio-capture='+wav+'%noloop','--autoplay-policy=no-user-gesture-required']});
const ctx=await b.newContext({permissions:['microphone']}); const pg=await ctx.newPage({viewport:{width:1180,height:820}});
const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file:///Users/david/duopiano/index.html');
await pg.evaluate(()=>{R().entree='micro';R().son=false;window.LOG=[];const o=pieceNote;pieceNote=(m,t,s)=>{if(s==='micro')LOG.push([m,t]);o(m,t,s);};});
await pg.evaluate(([pid,mode])=>lancerPiece(pid,mode),[pid,mode]);
await pg.waitForTimeout(dur*1000+1500);
const r=await pg.evaluate(()=>({log:LOG,justes:G?G.justes:'fin',total:G?G.sons.length:0}));
// alignement : séquence détectée contre séquence jouée (programmation dynamique sur les hauteurs)
const A=vrais.map(v=>v[0]),B=r.log.map(v=>v[0]);const n=A.length,m=B.length;
const f=[...Array(n+1)].map(()=>Array(m+1).fill(0));
for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)f[i][j]=Math.max(f[i-1][j],f[i][j-1],f[i-1][j-1]+(A[i-1]===B[j-1]?1:0));
const ok=f[n][m];
console.log(wav.split('/').pop(),mode,'| jouées',n,'détectées',m,'| bonnes',ok,'manquées',n-ok,'en trop',m-ok,'| allumées',r.justes,'/',r.total,'| erreurs',errs.length);
await b.close();
