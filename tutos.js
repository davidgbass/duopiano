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
 {dit:"Une touche blanche vers la droite, c'est un pas plus haut sur la portée.",a:[{t:'efface'},{t:'monte',ns:['C4','D4','E4'],portee:1}]},
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
 {dit:"Un pas, c'est passer de la ligne à l'interligne. Sur le piano, c'est la touche blanche voisine.",a:[{t:'monte',ns:['E4','F4'],portee:1}]},
 {dit:"Un saut, c'est passer de ligne à ligne, ou d'interligne à interligne. Sur le piano, on saute une touche blanche.",a:[{t:'efface'},{t:'monte',ns:['E4','G4'],portee:1}]},
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
 {dit:"Un pas plus haut, Ré, sur la quatrième ligne. Puis Mi, dans le quatrième interligne.",a:[{t:'monte',ns:['D5','E5'],portee:1}]},
 {dit:"Un pas plus bas que Do, c'est Si. Puis La.",a:[{t:'efface'},{t:'monte',ns:['C5','B4','A4'],portee:1}]},
 {dit:"À toi ! Joue le Ré, juste au-dessus du Do aigu.",a:[{t:'toi',n:'D5'}]}],
s7:[
 {dit:"On monte encore. Après Mi, il y a Fa, sur la ligne du haut.",a:[{t:'monte',ns:['E5','F5'],portee:1}]},
 {dit:"Et Sol, juste au-dessus de la portée.",a:[{t:'monte',ns:['G5'],portee:1},{t:'ligne',n:'G5'}]},
 {dit:"Pour les trouver, pars du Do aigu et monte.",a:[{t:'efface'},{t:'monte',ns:['C5','D5','E5','F5','G5'],portee:1}]},
 {dit:"À toi ! Joue le Sol tout en haut.",a:[{t:'toi',n:'G5'}]}],
f1:[
 {dit:"Voici la clé de fa. Elle sert surtout à la main gauche, pour les sons graves.",a:[{t:'cle'}]},
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
 {dit:"Le Do central est entre les deux portées, sur sa petite ligne.",a:[{t:'note',n:'C4'},{t:'touche',n:'C4'}]},
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
v1:[
 {dit:"Voici la noire : une tête pleine et une tige.",a:[{t:'rythme',m:'n'}]},
 {dit:"La noire dure un temps. Les temps sont réguliers, comme tes pas quand tu marches.",a:[{t:'rythme',m:'n n n n'}]},
 {dit:"Écoute : une noire sur chaque temps. Un, deux, trois, quatre.",a:[{t:'compte'}]},
 {dit:"À toi ! Combien de temps durent ces quatre noires ?",a:[{t:'toiQ',q:"Combien de temps durent ces quatre noires ?",choix:['2 temps','4 temps','8 temps'],rep:'4 temps',expl:"Une noire dure un temps. Quatre noires durent quatre temps."}]}],
v2:[
 {dit:"Les barres verticales coupent la musique en mesures.",a:[{t:'rythme',m:'n n n n | n n n n',c:4}]},
 {dit:"Le chiffre du haut dit combien de temps il y a dans chaque mesure. Ici, quatre. Écoute.",a:[{t:'compte'}]},
 {dit:"Le chiffre du bas veut dire que la noire vaut un temps. Il reste le même dans tout le jeu.",a:[]},
 {dit:"À toi ! Combien de noires remplissent une mesure à quatre temps ?",a:[{t:'toiQ',q:"Combien de noires remplissent une mesure à 4 temps ?",choix:['2','3','4'],rep:'4',expl:"Quatre temps, une noire par temps : quatre noires."}]}],
v3:[
 {dit:"Voici la blanche : une tête vide et une tige.",a:[{t:'rythme',m:'b'}]},
 {dit:"La blanche dure deux temps. On la joue sur un temps et on la tient pendant le temps suivant.",a:[{t:'rythme',m:'n n b',c:4}]},
 {dit:"Écoute : noire, noire, blanche. Un, deux, trois, quatre.",a:[{t:'compte'}]},
 {dit:"À toi ! Sur quel temps commence la blanche ?",a:[{t:'toiQ',q:"Sur quel temps commence la blanche ?",choix:['Le temps 2','Le temps 3','Le temps 4'],rep:'Le temps 3',expl:"Une noire sur 1, une noire sur 2 : la blanche commence sur 3 et tient jusqu'à 4."}]}],
v4:[
 {dit:"Voici la ronde : une tête vide, sans tige.",a:[{t:'rythme',m:'r'}]},
 {dit:"La ronde dure quatre temps. Elle remplit toute une mesure à quatre temps.",a:[{t:'rythme',m:'r | n n n n',c:4},{t:'compte'}]},
 {dit:"Une ronde vaut deux blanches, ou quatre noires.",a:[{t:'rythme',m:'r | b b | n n n n',c:4}]},
 {dit:"À toi ! Combien de noires valent une ronde ?",a:[{t:'toiQ',q:"Combien de noires valent une ronde ?",choix:['2','3','4'],rep:'4',expl:"La ronde dure quatre temps, comme quatre noires."}]}],
v6:[
 {dit:"Ici, le chiffre du haut est trois.",a:[{t:'rythme',m:'n n n | b n',c:3}]},
 {dit:"Chaque mesure compte trois temps. Écoute : un, deux, trois.",a:[{t:'compte'}]},
 {dit:"Une blanche et une noire font trois temps. Elles remplissent la mesure.",a:[]},
 {dit:"À toi ! Quel chiffre va en haut ?",a:[{t:'rythme',m:'b n | n n n',c:3,inconnu:true},{t:'toiQ',q:"Quel chiffre va en haut ?",choix:['2','3','4'],rep:'3',expl:"Chaque mesure compte trois temps : le chiffre du haut est 3."}]}],
v7:[
 {dit:"Voici une blanche avec un point à droite. C'est la blanche pointée.",a:[{t:'rythme',m:'bp'}]},
 {dit:"Le point ajoute la moitié de la valeur de la note. La blanche dure deux temps. La moitié de deux, c'est un. Deux plus un : trois temps.",a:[{t:'rythme',m:'b bp'}]},
 {dit:"Dans une mesure à trois temps, la blanche pointée remplit toute la mesure. Écoute.",a:[{t:'rythme',m:'n n n | bp',c:3},{t:'compte'}]},
 {dit:"À toi ! Combien de temps dure la blanche pointée ?",a:[{t:'toiQ',q:"Combien de temps dure la blanche pointée ?",choix:['2 temps','3 temps','4 temps'],rep:'3 temps',expl:"Deux temps pour la blanche, plus un pour le point : trois temps."}]}],
v9:[
 {dit:"Cette ligne courbe relie deux notes pareilles. C'est une liaison.",a:[{t:'rythme',m:'n n n n~ | n n b',c:4}]},
 {dit:"On joue la première note, puis on la tient pendant la deuxième, sans la rejouer. Écoute.",a:[{t:'compte'}]},
 {dit:"Les durées s'additionnent. Une noire liée à une noire dure deux temps.",a:[]},
 {dit:"À toi ! Deux notes liées : combien de fois les joues-tu ?",a:[{t:'toiQ',q:"Deux notes liées : combien de fois les joues-tu ?",choix:['Une fois','Deux fois'],rep:'Une fois',expl:"On joue la première note et on tient la deuxième sans la rejouer."}]}],
v10:[
 {dit:"Un silence est un moment où on ne joue pas. On continue de compter.",a:[{t:'rythme',m:'s'}]},
 {dit:"Voici le soupir. Il dure un temps, comme la noire.",a:[{t:'rythme',m:'n s n s',c:4}]},
 {dit:"Écoute : noire, silence, noire, silence.",a:[{t:'compte'}]},
 {dit:"À toi ! Pendant un soupir, que fais-tu ?",a:[{t:'toiQ',q:"Pendant un soupir, que fais-tu ?",choix:['Je joue','Je compte sans jouer','Je tiens la note'],rep:'Je compte sans jouer',expl:"Le soupir est un silence d'un temps : on compte sans jouer."}]}],
v11:[
 {dit:"Voici la demi-pause : un petit rectangle posé sur la ligne du milieu.",a:[{t:'rythme',m:'dp'}]},
 {dit:"Elle dure deux temps de silence, comme la blanche dure deux temps de son. Écoute.",a:[{t:'rythme',m:'n n dp | dp b',c:4},{t:'compte'}]},
 {dit:"À toi ! Combien de temps dure la demi-pause ?",a:[{t:'toiQ',q:"Combien de temps dure la demi-pause ?",choix:['1 temps','2 temps','4 temps'],rep:'2 temps',expl:"Deux temps de silence, comme une blanche."}]}],
v12:[
 {dit:"Voici la pause : le même petit rectangle, mais il pend sous la quatrième ligne.",a:[{t:'rythme',m:'p',c:4}]},
 {dit:"La pause dure toute la mesure. Écoute : quatre noires, puis une mesure de silence.",a:[{t:'rythme',m:'n n n n | p',c:4},{t:'compte'}]},
 {dit:"Pour ne pas les confondre : la pause est plus longue, donc plus lourde, et elle pend. La demi-pause est plus légère, et elle se pose.",a:[{t:'rythme',m:'p | dp b',c:4}]},
 {dit:"À toi ! Lequel pend sous la ligne ?",a:[{t:'toiQ',q:"Lequel pend sous la ligne ?",choix:['La pause','La demi-pause'],rep:'La pause',expl:"La pause, plus longue, est plus lourde : elle pend sous la ligne."}]}],
v14:[
 {dit:"Voici deux croches, attachées par une barre.",a:[{t:'rythme',m:'cc'}]},
 {dit:"Chaque croche dure un demi-temps. Les deux ensemble durent un temps.",a:[{t:'rythme',m:'n cc n cc',c:4}]},
 {dit:"On compte : un et, deux et. Écoute.",a:[{t:'compte'}]},
 {dit:"À toi ! Combien de temps durent deux croches attachées ?",a:[{t:'toiQ',q:"Combien de temps durent deux croches attachées ?",choix:['Un demi-temps','1 temps','2 temps'],rep:'1 temps',expl:"Chaque croche dure un demi-temps. Les deux ensemble durent un temps."}]}],
v15:[
 {dit:"Le chiffre du haut peut aussi être deux.",a:[{t:'rythme',m:'n n | b | n n',c:2}]},
 {dit:"Chaque mesure compte deux temps. Écoute : un, deux. Comme une marche.",a:[{t:'compte'}]},
 {dit:"À toi ! Quel chiffre va en haut ?",a:[{t:'rythme',m:'n n | b | n n',c:2,inconnu:true},{t:'toiQ',q:"Quel chiffre va en haut ?",choix:['2','3','4'],rep:'2',expl:"Chaque mesure compte deux temps : le chiffre du haut est 2."}]}],
};
