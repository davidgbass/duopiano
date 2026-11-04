# Fabrique une interprétation d'une mélodie avec les échantillons Steinway (aucun fichier n'est copié dans le dépôt).
import sys,json,wave,numpy as np
SR=48000;D=sys.argv[1]
def lire(p):
    import subprocess
    raw=open(p,'rb').read(); i=raw.find(b'data'); n=int.from_bytes(raw[i+4:i+8],'little')
    return np.frombuffer(raw[i+8:i+8+n],dtype='<f4').astype(np.float64)
ECH={}
def note(midi,dur,couche,rng):
    base=min([57,60,63,66,69,72],key=lambda b:abs(b-midi)); k=(couche,base)
    if k not in ECH: ECH[k]=lire(f'{D}/ech/{couche}-{base:03d}.wav')
    x=ECH[k]; r=2**((midi-base)/12); idx=np.arange(0,len(x)-1,r); y=np.interp(idx,np.arange(len(x)),x)
    n=int((dur+0.25)*SR); y=y[:n] if len(y)>=n else np.pad(y,(0,n-len(y)))
    rel=int(dur*SR); fade=np.ones(n); L=min(int(.12*SR),n-rel)
    if L>0: fade[rel:rel+L]=np.linspace(1,0.02,L); fade[rel+L:]=0.02
    return y*fade*rng.uniform(.8,1.0)
spec=json.loads(sys.argv[2]); bpm=spec['bpm']; beat=60/bpm; rng=np.random.default_rng(spec.get('seed',1))
avance=spec.get('debut',2.0); tot=avance+sum(d for m,d in spec['notes'])*beat+3
out=np.zeros(int(tot*SR)); t=avance; vrais=[]
for m,d in spec['notes']:
    j=rng.normal(0,spec.get('jitter',0.02)); deb=max(0,t+j)
    if m is not None:
        y=note(m,d*beat*0.92,spec.get('couche','V3'),rng); i=int(deb*SR); out[i:i+len(y)]+=y[:len(out)-i]; vrais.append([m,round(deb,3)])
    t+=d*beat
out+=np.random.default_rng(7).normal(0,spec.get('bruit',0.002),len(out))
out=out/np.max(np.abs(out))*0.8
w=wave.open(spec['sortie'],'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype('<i2').tobytes());w.close()
json.dump(vrais,open(spec['sortie']+'.json','w'))
print(len(vrais),'notes',round(tot,1),'s')
