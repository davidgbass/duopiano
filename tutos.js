// Tutoriels animés : une étape = une phrase dite (fichier voix/<id>-<n>.m4a) + des actions.
// Actions : groupes(g), touche(n), note(n, nb), monte(ns, portee), ligne(n), cle, efface, toi(n).
window.TUTOS={
k1:[
 {dit:"Regarde les touches noires. Elles sont en groupes de deux et de trois.",a:[{t:'groupes',g:2},{t:'groupes',g:3}]},
 {dit:"Le Do est la touche blanche juste à gauche du groupe de deux.",a:[{t:'groupes',g:2},{t:'touche',n:'C4'},{t:'note',n:'C4'}]},
 {dit:"Il y a un Do avant chaque groupe de deux. Ils ont le même nom, mais pas la même hauteur.",a:[{t:'touche',n:'C3'},{t:'touche',n:'C4'}]},
 {dit:"Dans ce niveau, tous les Do comptent.",a:[]},
 {dit:"À toi ! Joue un Do.",a:[{t:'toi',n:'C4'}]}],
k2:[
 {dit:"Le groupe de deux touches noires a trois voisines blanches.",a:[{t:'groupes',g:2}]},
 {dit:"Do, Ré, Mi.",a:[{t:'monte',ns:['C4','D4','E4']}]},
 {dit:"Ré est pris en sandwich entre les deux touches noires.",a:[{t:'groupes',g:2},{t:'touche',n:'D4'}]},
 {dit:"À toi ! Joue un Ré.",a:[{t:'toi',n:'D4'}]}],
k3:[
 {dit:"Maintenant, le groupe de trois touches noires.",a:[{t:'groupes',g:3}]},
 {dit:"Ses quatre voisines sont Fa, Sol, La et Si.",a:[{t:'monte',ns:['F4','G4','A4','B4']}]},
 {dit:"Fa est juste à gauche du groupe de trois. Si est juste à droite.",a:[{t:'groupes',g:3},{t:'touche',n:'F4'},{t:'touche',n:'B4'}]},
 {dit:"Après Si, on recommence à Do.",a:[{t:'efface'},{t:'monte',ns:['B3','C4']}]},
 {dit:"À toi ! Joue un Sol.",a:[{t:'toi',n:'G4'}]}],
k4:[
 {dit:"Do, Ré, Mi, Fa, Sol, La, Si. Sept notes, puis on recommence.",a:[{t:'monte',ns:['C4','D4','E4','F4','G4','A4','B4']}]},
 {dit:"Pour te repérer, cherche d'abord les touches noires.",a:[{t:'efface'},{t:'groupes',g:2},{t:'groupes',g:3}]},
 {dit:"Près de deux noires : Do, Ré, Mi. Près de trois noires : Fa, Sol, La, Si.",a:[{t:'groupes',g:2},{t:'groupes',g:3}]},
 {dit:"À toi ! Joue un La.",a:[{t:'toi',n:'A4'}]}],
s1:[
 {dit:"Voici la portée : cinq lignes. Au début, il y a la clé de sol.",a:[{t:'cle'}]},
 {dit:"Le Do central a sa petite ligne à lui, sous la portée.",a:[{t:'ligne',n:'C4'},{t:'note',n:'C4'}]},
 {dit:"Sur le piano, c'est le Do du milieu, en face de toi.",a:[{t:'touche',n:'C4'}]},
 {dit:"Un pas plus haut, c'est Ré, juste sous la portée. Puis Mi, sur la première ligne.",a:[{t:'monte',ns:['D4','E4'],portee:1}]},
 {dit:"Une touche vers la droite, c'est un pas plus haut sur la portée.",a:[{t:'efface'},{t:'monte',ns:['C4','D4','E4'],portee:1}]},
 {dit:"À toi ! Joue le Do central.",a:[{t:'toi',n:'C4'}]}],
s2:[
 {dit:"Pose le pouce droit sur le Do central.",a:[{t:'note',n:'C4'},{t:'touche',n:'C4'}]},
 {dit:"Chaque doigt a sa touche : Do, Ré, Mi, Fa, Sol.",a:[{t:'efface'},{t:'monte',ns:['C4','D4','E4','F4','G4'],portee:1}]},
 {dit:"Sur la portée, la note monte d'un pas à chaque fois : ligne, interligne, ligne.",a:[]},
 {dit:"Fa est dans le premier interligne. Sol est sur la deuxième ligne.",a:[{t:'ligne',n:'F4'},{t:'ligne',n:'G4'}]},
 {dit:"À toi ! Joue le Fa.",a:[{t:'toi',n:'F4'}]}],
s3:[
 {dit:"Regarde la clé de sol. Elle s'enroule autour de la deuxième ligne.",a:[{t:'cle'},{t:'ligne',n:'G4'}]},
 {dit:"Cette ligne, c'est Sol. C'est ton deuxième repère.",a:[{t:'ligne',n:'G4'},{t:'note',n:'G4'},{t:'touche',n:'G4'}]},
 {dit:"Un pas plus haut, La. Encore un pas, Si.",a:[{t:'monte',ns:['A4','B4'],portee:1}]},
 {dit:"Un pas plus bas que Sol, c'est Fa. Puis Mi, sur la première ligne.",a:[{t:'efface'},{t:'monte',ns:['G4','F4','E4'],portee:1}]},
 {dit:"Il n'y a plus de couleurs. Trouve le Sol, puis compte les pas.",a:[]},
 {dit:"À toi ! Joue le La.",a:[{t:'toi',n:'A4'}]}],
s4:[
 {dit:"Un pas, c'est passer de la ligne à l'interligne. Sur le piano, c'est la touche voisine.",a:[{t:'monte',ns:['E4','F4'],portee:1}]},
 {dit:"Un saut, c'est passer de ligne à ligne. Sur le piano, on saute une touche.",a:[{t:'efface'},{t:'monte',ns:['E4','G4'],portee:1}]},
 {dit:"Ligne, ligne, ligne : Mi, Sol, Si.",a:[{t:'efface'},{t:'monte',ns:['E4','G4','B4'],portee:1}]},
 {dit:"Interligne, interligne, interligne : Fa, La, Do.",a:[{t:'monte',ns:['F4','A4','C5'],portee:1}]},
 {dit:"À toi ! Joue le Si.",a:[{t:'toi',n:'B4'}]}],
s5:[
 {dit:"Dans ce niveau, aucune aide. Les notes sont noires, comme dans un vrai livre de piano.",a:[]},
 {dit:"Tu as trois repères. Le Do central, sous la portée.",a:[{t:'note',n:'C4',nb:1},{t:'touche',n:'C4'}]},
 {dit:"Le Sol de la clé, sur la deuxième ligne.",a:[{t:'note',n:'G4',nb:1},{t:'touche',n:'G4'}]},
 {dit:"Et le Do aigu, dans le troisième interligne.",a:[{t:'note',n:'C5',nb:1},{t:'touche',n:'C5'}]},
 {dit:"Pour chaque note, trouve le repère le plus proche, puis compte.",a:[]},
 {dit:"À toi ! Joue le Do aigu.",a:[{t:'toi',n:'C5'}]}],
s6:[
 {dit:"Le Do aigu est dans le troisième interligne. Il est sept touches blanches plus haut que le Do central.",a:[{t:'note',n:'C5'},{t:'touche',n:'C4'},{t:'touche',n:'C5'}]},
 {dit:"Un pas plus haut, Ré. Puis Mi, sur la quatrième ligne.",a:[{t:'monte',ns:['D5','E5'],portee:1}]},
 {dit:"Un pas plus bas que Do, c'est Si. Puis La.",a:[{t:'efface'},{t:'monte',ns:['C5','B4','A4'],portee:1}]},
 {dit:"À toi ! Joue le Ré, juste au-dessus du Do aigu.",a:[{t:'toi',n:'D5'}]}],
s7:[
 {dit:"On monte encore. Après Mi, il y a Fa, sur la ligne du haut.",a:[{t:'monte',ns:['E5','F5'],portee:1}]},
 {dit:"Et Sol, juste au-dessus de la portée.",a:[{t:'monte',ns:['G5'],portee:1},{t:'ligne',n:'G5'}]},
 {dit:"Pour les trouver, pars du Do aigu et monte.",a:[{t:'efface'},{t:'monte',ns:['C5','D5','E5','F5','G5'],portee:1}]},
 {dit:"À toi ! Joue le Sol tout en haut.",a:[{t:'toi',n:'G5'}]}],
f1:[
 {dit:"Voici la clé de fa. Elle sert à la main gauche, pour les sons graves.",a:[{t:'cle'}]},
 {dit:"Regarde ses deux points. Entre les deux passe la quatrième ligne.",a:[{t:'cle'},{t:'ligne',n:'F3'}]},
 {dit:"Cette ligne, c'est Fa. C'est ton repère dans la clé de fa.",a:[{t:'ligne',n:'F3'},{t:'note',n:'F3'},{t:'touche',n:'F3'}]},
 {dit:"Un pas plus haut, Sol. Encore un pas, La.",a:[{t:'monte',ns:['G3','A3'],portee:1}]},
 {dit:"À toi ! Joue ce Fa.",a:[{t:'toi',n:'F3'}]}],
f1b:[
 {dit:"Partons du Fa de la clé et montons.",a:[{t:'note',n:'F3'},{t:'touche',n:'F3'}]},
 {dit:"Fa, Sol, La, Si, Do.",a:[{t:'efface'},{t:'monte',ns:['F3','G3','A3','B3','C4'],portee:1}]},
 {dit:"Ce Do, c'est le Do central. Ici, il a sa petite ligne au-dessus de la portée.",a:[{t:'ligne',n:'C4'}]},
 {dit:"C'est la même touche que le Do central de la clé de sol.",a:[{t:'touche',n:'C4'}]},
 {dit:"À toi ! Joue le Si.",a:[{t:'toi',n:'B3'}]}],
f2:[
 {dit:"Le Do grave est dans le deuxième interligne.",a:[{t:'ligne',n:'C3'},{t:'note',n:'C3'},{t:'touche',n:'C3'}]},
 {dit:"Pose le petit doigt gauche dessus. Chaque doigt a sa touche, jusqu'à Sol.",a:[{t:'efface'},{t:'monte',ns:['C3','D3','E3','F3','G3'],portee:1}]},
 {dit:"Le Fa de la clé est toujours là pour t'aider.",a:[{t:'ligne',n:'F3'}]},
 {dit:"À toi ! Joue le Ré.",a:[{t:'toi',n:'D3'}]}],
f3:[
 {dit:"Plus d'aide dans ce niveau. Voici tes trois repères.",a:[]},
 {dit:"Le Do grave, dans le deuxième interligne.",a:[{t:'note',n:'C3',nb:1},{t:'touche',n:'C3'}]},
 {dit:"Le Fa de la clé, sur la quatrième ligne.",a:[{t:'note',n:'F3',nb:1},{t:'touche',n:'F3'}]},
 {dit:"Et le Do central, au-dessus de la portée.",a:[{t:'note',n:'C4',nb:1},{t:'touche',n:'C4'}]},
 {dit:"À toi ! Joue le Mi.",a:[{t:'toi',n:'E3'}]}],
f4:[
 {dit:"La ligne du bas de la clé de fa, c'est Sol.",a:[{t:'ligne',n:'G2'},{t:'note',n:'G2'}]},
 {dit:"C'est un son grave, à gauche du piano.",a:[{t:'touche',n:'G2'}]},
 {dit:"Monte par pas : Sol, La, Si, Do.",a:[{t:'efface'},{t:'monte',ns:['G2','A2','B2','C3'],portee:1}]},
 {dit:"À toi ! Joue le La.",a:[{t:'toi',n:'A2'}]}],
f5:[
 {dit:"Sous la ligne du bas, il y a encore une note : Fa.",a:[{t:'note',n:'F2'}]},
 {dit:"C'est un Fa, comme celui de la clé, mais plus grave.",a:[{t:'touche',n:'F3'},{t:'touche',n:'F2'}]},
 {dit:"Fa, Sol, La, Si, Do.",a:[{t:'efface'},{t:'monte',ns:['F2','G2','A2','B2','C3'],portee:1}]},
 {dit:"À toi ! Joue le Fa grave.",a:[{t:'toi',n:'F2'}]}],
g1:[
 {dit:"Voici la grande portée : la clé de sol en haut, la clé de fa en bas.",a:[{t:'cle'}]},
 {dit:"Les deux portées se touchent au Do central.",a:[{t:'note',n:'C4'},{t:'touche',n:'C4'}]},
 {dit:"En haut : le Sol de la clé et le Do aigu. En bas : le Fa de la clé et le Do grave.",a:[{t:'note',n:'G4'},{t:'note',n:'C5'},{t:'note',n:'F3'},{t:'note',n:'C3'}]},
 {dit:"Regarde d'abord la clé. Ensuite, trouve le repère le plus proche.",a:[{t:'cle'}]},
 {dit:"À toi ! Joue le Fa de la clé de fa.",a:[{t:'toi',n:'F3'}]}],
g2:[
 {dit:"Toutes les notes, du Fa grave au Sol aigu.",a:[{t:'monte',ns:['F2','G5'],portee:1}]},
 {dit:"Six repères suffisent pour tout trouver.",a:[{t:'efface'},{t:'note',n:'G2',nb:1},{t:'note',n:'C3',nb:1},{t:'note',n:'F3',nb:1},{t:'note',n:'C4',nb:1},{t:'note',n:'G4',nb:1},{t:'note',n:'C5',nb:1}]},
 {dit:"Pour chaque note : la clé, le repère, puis compte les pas.",a:[]},
 {dit:"À toi ! Joue le Sol de la clé de sol.",a:[{t:'toi',n:'G4'}]}],
g3:[
 {dit:"Le grand défi : vingt-cinq notes, plus vite que d'habitude.",a:[]},
 {dit:"La vitesse s'ajuste à toi. Si tu te trompes, les notes ralentissent.",a:[]},
 {dit:"Lis la note, trouve le repère, joue.",a:[{t:'cle'}]},
 {dit:"À toi ! Joue le Do central.",a:[{t:'toi',n:'C4'}]}],
};
