# DuoPiano, plan de la suite (2026-10-25)

Décisions de David :
- Les enfants ont déjà le sens du rythme : on enseigne la THÉORIE des valeurs, pas la pulsation.
- Ensuite, intégrer peu à peu rythme + hauteur, puis des pièces simples pour la motivation.
- Répertoire : classiques simplifiés.

## Fait
- Unité 3 « Les valeurs de notes » (piste parallèle, ouverte dès le départ)
  r1 noire et blanche · r2 ronde · r3 blanche pointée (3/4) · r4 silences · r5 croches · r6 mesures (2/4, 3/4, 4/4)
  Pratique = quiz de 12 questions. Défi = « Lis et joue » 4 lignes, n'importe quelle touche, seule l'attaque compte,
  décalage micro appris automatiquement (médiane, R().decalage).

## Plan de mise à jour du 2026-11-03 : des pièces à chaque étape

Fondement : `PEDAGOGIE.md`. Toutes les méthodes reconnues font jouer une pièce dès la première leçon.
DuoPiano en fait passer tous ses niveaux avant la première pièce. Ce plan remplace les unités 6 et 7 ci-dessous
par des pièces accrochées aux niveaux existants. Les listes de répertoire des unités 6 et 7 restent valables.

### État de l'appli (relevé le 2026-11-03, commit 39ad7b5)
- 36 niveaux (depuis be1aefb) : clavier k1-k4, clé de sol s1-s7, valeurs v1-v16 (piste parallèle, une notion par niveau, ordre Faber), clé de fa f1-f5, grande portée g1-g3.
- Lecture de notes : `lancer()` + `recu(m)` dans index.html. Notes qui défilent, une à la fois, sans rythme.
- Rythme : `lancerLecture()` + `frappe(t)` dans rythme.js. Tempo, batterie ou clic, fenêtres de temps (`fenetres`),
  décalage micro appris. N'importe quelle touche compte : la hauteur `m` reçue par `ecoute.onNote(m,t)` est ignorée.
- Dessin du rythme : `rythmeSVG` place toutes les têtes à la même hauteur (`RY_Y`), tiges toujours vers le haut.
- Dessin des notes : `noteSVG(d,p)` gère la hauteur, les lignes supplémentaires et le sens des tiges, sans valeur rythmique.
- Ce qui manque pour une pièce : une portée qui montre hauteur ET durée, et un juge qui vérifie la note ET le moment.
- Point de vigilance connu : notes répétées rapides mal détectées (environ 37 attaques sur 60 en croches répétées).
  Au clair de la lune commence par Do Do Do en noires : à passer au banc avant tout.

### Étape 1. Moteur de pièce : FAIT le 2026-11-03 (pieces.js)
Fait : format, dessin sur la portée (hauteur, durée, lignes supplémentaires, sens des tiges, croches, liaisons),
trois façons de jouer (`lancerPiece(id,'ecoute'|'libre'|'tempo')`), 4 pièces (clair, jacques, joie, maman),
écran de fin sans chiffres. Pour essayer avant l'étape 2 : `?piece=clair&mode=libre` dans l'adresse.
Banc (`banc/`) : toutes les notes détectées, notes répétées comprises, de 76 à 110 battements par minute.
Pas encore fait : le jugement du Récital (étape 2), les noms affichables sur demande en mode tempo, la clé de fa.
Écart avec le texte d'origine ci-dessous : `frappe()` de rythme.js n'est pas touché, les pièces ont leur propre écoute (`pieceNote`).
Au tempo, chaque ligne est précédée d'une mesure de décompte (la batterie continue) pour laisser le temps de la lire.

1. Format d'une pièce, lisible à la main : `'C4:n C4:n C4:n D4:n | E4:b D4:b | ...'`. Un silence n'a pas de hauteur (`s`, `dp`, `p`).
2. `rythmeSVG` accepte une hauteur par jeton : tête placée avec `yNote`, lignes supplémentaires (Do central),
   tige vers le bas au-dessus de la 3e ligne. Croches : la barre suit les deux têtes.
3. Écoute de la note : `frappe(t,source,m)` reconnaît la bonne note dans sa fenêtre et l’allume. Le jugement (bon moment, mauvaise note =
   « bon rythme ») ne sert qu’au Récital, qui seul affiche des chiffres.
4. Pratique sans tempo : la pièce attend la bonne note (comme `recu`), noms affichés. Sert à trouver la pièce au clavier.

### Étape 2. Une pièce se joue, elle ne se passe pas (décision de David, 2026-11-03)
« Tous les moments n'ont pas besoin d'être un test, certains moments peuvent être juste pour jouer, surtout les pièces. »
- Par défaut, une pièce est un moment de jeu : pas de score, pas d'étoiles, pas de note rouge qui secoue, pas de XP perdu.
  La note jouée s'allume quand elle est juste. Une fausse note ne fait rien : la pièce continue (au tempo) ou attend (sans tempo).
- Trois façons de la jouer, au choix de l'enfant, sans ordre imposé :
  1. **Écoute** : l'appli joue la mélodie, la note s'allume sur la portée. `jouerNote` coupe déjà le micro pendant ce temps.
  2. **À mon rythme** : sans tempo, la pièce attend la bonne note. Noms affichés si l'enfant le veut (bouton).
  3. **Avec la batterie** : au tempo, lent ou normal au choix.
- Fin d'une pièce : un mot de la mascotte et « Rejouer » ou « Une autre pièce ». Aucun chiffre.
- Le défi reste disponible pour qui le veut : un bouton **Récital** (pièce entière, sans aide) donne une étoile dorée
  sur la pièce dans « Mes pièces ». C'est une médaille, jamais une porte : rien ne s'ouvre ni ne se ferme avec.
- Les mesures qui se répètent sont surlignées en « À mon rythme » (repérer les motifs).

### Étape 3. Place dans le chemin
- Chaque niveau de notes annonce sa pièce : « Avec ces notes, tu peux jouer Au clair de la lune ». La pièce apparaît comme
  un nœud du chemin juste après (forme différente : une partition, pas un rond), ouverte quand le niveau de notes ET le
  niveau de rythme requis ont 2 étoiles. Le nœud de pièce ne bloque jamais le niveau suivant.
- Si le rythme manque, le nœud dit lequel (« Il te faut la ronde ») et ouvre v4 d’un toucher.
- Écran « Mes pièces » depuis l'accueil : toutes les pièces ouvertes, rejouables quand on veut, juste pour le plaisir.
- Jouer une pièce compte pour l'objectif du jour et la série de jours (XP fixe à la fin, quel que soit le résultat).
- Les pièces restent hors de la révision des notes difficiles : la révision teste, les pièces non.

### Étape 4. Répertoire de départ (notes vérifiées dans PEDAGOGIE.md, section 4)
| Nœud après | Requis rythme | Pièce |
|---|---|---|
| s1 | v4 (ronde) | Au clair de la lune, sans la 3e phrase (Do Ré Mi) |
| s2 | v3 (blanche) | Frère Jacques, 2 premières phrases |
| s2 | v3 (blanche) | Ode à la joie, rythme simplifié |
| s3 | v3 (blanche) | Ah ! vous dirai-je maman |
| s3 | v14 (croches) | Frère Jacques, avec la 3e phrase (croches) |
| s4 | v7 (blanche pointée) | Berceuse de Brahms (3/4), arrangement à faire |
| f2 | (même) | Au clair de la lune et Frère Jacques, main gauche, une octave plus bas |
| g1 | (même) | Ode à la joie partagée entre les deux mains |
Puis la liste de l'unité 7 ci-dessous, dans son ordre. Tutoriel court par pièce (tutos.js, voix générées).

### Étape 5. Accompagnement (après les étapes 1 à 4, et seulement après un banc)
- v1, sans risque : la batterie actuelle sous la pièce. Bruit filtré, sans hauteur, le filtre anti-voix ne la prend pas pour une note.
- v2 : accords tenus joués par l'appli. Risque : le micro entend l'accord. À tester au banc avec les échantillons Steinway
  avant de construire. Repli : réglage « Accompagnement au casque », ou partie de main gauche affichée pour un parent au piano.

### Tests à chaque étape
- Banc (`banc.mjs`, à réécrire dans le scratchpad) : pièce jouée en échantillons Steinway au bon tempo, puis avec
  une fausse note, une note en retard et une note répétée. Cible : 0 fausse erreur sur la pièce juste.
- Playwright : parcours complet d'une pièce au clavier à l'écran.
- Vrai piano avec Juliette et Albert avant de passer à l'étape suivante.

### Hors de ce plan
Les quiz de l’unité 3 et les 36 niveaux restent tels quels. Rien de neuf en lecture pure.

---

## Ancien plan (2026-10-25), remplacé par celui du dessus pour l'organisation, gardé pour le répertoire
### Unité 6, Notes et rythme ensemble
- Mini-mélodies de 2 à 4 mesures. Une seule difficulté nouvelle à la fois.
- Prérequis : r3 (blanche pointée) et s2 (position de Do). Puis main gauche après f2.
- Correction : la note juste ET le bon moment (combiner recu() et frappe()).

### Unité 7, Mes premières pièces (classiques simplifiés)
Ordre proposé selon les notions requises (arrangements à vérifier : pas de dièse avant qu'on l'enseigne).
1. Beethoven, Ode à la joie : main droite Do à Sol, noires et blanches (rythme pointé simplifié).
2. Mozart, thème des Variations « Ah ! vous dirai-je maman » : Do à La, noires et blanches.
3. Dvořák, Largo de la Symphonie du Nouveau Monde : Do à Sol, blanches et rondes.
4. Haydn, thème de la Symphonie « La Surprise » : sauts Do-Mi-Sol, silences.
5. Brahms, Berceuse : 3/4, blanche pointée.
6. Offenbach, Galop infernal : croches.
7. Pachelbel, basse du Canon : main gauche, clé de fa, rondes et blanches.
8. Bach (attribué à Petzold), Menuet en sol : 3/4, nécessite Fa dièse, donc après une leçon sur les dièses.
Récital : la pièce entière jouée d'un trait, à débloquer.
