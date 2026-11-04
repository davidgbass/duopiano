# DuoPiano, base de connaissance pédagogique (2026-11-03)

Question de départ (David) : que font les méthodes reconnues et récentes, qu'est-ce qui est prouvé, et comment amener l'enfant à jouer vite de vraies pièces avec seulement les notes et les valeurs déjà apprises ?

Niveau de preuve noté pour chaque affirmation :
- **[étude]** recherche publiée avec des données
- **[méthode]** ce que fait la méthode, décrit par l'éditeur ou par des enseignants (pas une preuve d'efficacité)
- **[aucune]** cherché, rien trouvé

## 1. Ce que la recherche établit

L'état de la science est mince. Les méthodes les plus vendues n'ont pas d'essai comparatif publié, et le labo de pédagogie du piano d'Ottawa (Comeau) écrit lui-même que ces approches sont répandues « sans preuve scientifique solide ».

1. **Lecture par repères ou par Do central : ni l'une ni l'autre n'est démontrée supérieure, et le Do central tient bien.** DiCienzo (2019, Ottawa, enfants de 7 à 11 ans) : le groupe Do central a fait mieux que le groupe intervallique à tous les tests sauf deux (identification du clavier, motifs de 3 notes en position de Sol). Emond et Comeau (2013), simulation cognitive ACT-R : l'approche intervallique demande plus de connaissances à mémoriser et plus de planification que le Do central. [étude, petite et unique]
   → DuoPiano mélange déjà les deux (position de Do, puis repères, puis pas et sauts). Rien à changer.
2. **La vitesse de reconnaissance d'une note isolée prédit la capacité à déchiffrer une pièce inconnue.** Leikvoll (2017, Stavanger, élèves débutants, une année scolaire). Le même travail montre l'effet de parler des motifs répétés dans la partition et d'écrire de petites mélodies. [étude, sans chiffres publiés dans le résumé]
   → Les défis de notes chronométrés de DuoPiano ont leur raison d'être. Il manque le repérage des motifs.
3. **Le meilleur prédicteur du déchiffrage est le nombre d'heures cumulées à déchiffrer.** Lee (2008). [étude, adultes et adolescents]
   → Beaucoup de petites pièces nouvelles valent mieux qu'une seule pièce longue répétée.
4. **Les jeunes élèves regardent la hauteur et négligent le rythme quand ils lisent.** Guðmundsdóttir (2010, 35 élèves de 6 à 13 ans) et les travaux qu'elle cite. Une autre étude d'Ottawa : chanter en jouant améliore la justesse rythmique, pas la justesse des notes. [étude]
   → Dans une pièce, il faut noter le rythme à part et le montrer à l'enfant, sinon il ne joue que les notes.
5. **Varier les exercices dans une séance fait moins bien sur le moment et mieux à long terme que répéter le même.** Carter et Grahn (2016, clarinettistes avancés) : la pratique entrelacée l'emporte sur la répétition en bloc. Pour le piano débutant, aucune étude d'espacement n'existe. [étude, transposée d'un autre instrument]
   → Mélanger une pièce nouvelle, une ancienne et un défi de notes dans la même séance.
6. **Rythme : aucune syllabe (Takadimi, Kodály, « ti-ti ta ») ne bat les autres.** Seulement de petites études aux résultats nuls ou mitigés. [aucune preuve de supériorité]
7. **Applications (Simply Piano, Flowkey, Yousician, Skoove) : aucune étude d'efficacité indépendante.** Seulement les chiffres d'usage des éditeurs et des anecdotes. [aucune]
8. **Accompagnement en duo et motivation : études de cas et témoignages seulement.** [méthode]

## 2. Ce que font les méthodes

| Méthode | Lecture | Rythme | Quand arrive la première pièce |
|---|---|---|---|
| Faber, Piano Adventures (2e éd.) | Touches noires, puis noms de notes hors portée, puis portée par intervalles à partir de repères | Valeurs enseignées dans les pièces elles-mêmes | Dès la 1re leçon, sur touches noires. Chaque pièce a une partie d'accompagnement pour le professeur |
| Alfred, Premier Piano Course | Positions fixes (Do central) | Dans les pièces | Dès la 1re leçon |
| Piano Safari (Fisher et Knerr) | Pièces « de lecture » très simples (2des, 3ces d'abord) en parallèle de pièces « par imitation » plus riches, apprises à l'oreille | Motifs rythmiques appris par la voix et le corps | Dès la 1re leçon. Les pièces par imitation dépassent ce que l'enfant sait lire, pour la motivation. Elles disparaissent vers le niveau 3 |
| Hoffman Academy | « Le son avant le symbole » : chanter, solfège, jouer à l'oreille, puis lire ce qu'on sait déjà jouer | Par la voix et le mouvement | Dès la 1re leçon, à l'oreille |
| Music Moves for Piano (Gordon) | Vocabulaire de motifs entendus avant la lecture | Rythme et hauteur appris séparément, motifs chantés | À l'oreille d'abord |
| Simply Music | Langue parlée avant l'écrit : 35 à 50 pièces jouées avant toute lecture | Lecture du rythme avant celle des notes | Dès le début, sans partition |
| Hervé et Pouillard (Lemoine) | Notes, valeurs et doigtés introduits peu à peu | Dans les pièces | Petites pièces à chaque chapitre |
| Simply Piano (application) | Cours « Piano Basics » (doigts, position, portée), puis 27 à 28 cours en deux voies (mélodie ou accords) | Dans les chansons | Bibliothèque de chansons ouverte après le premier cours, chansons ralenties à volonté |

[méthode] pour toute la ligne, sauf mention.

**Le point commun qui compte pour DuoPiano : toutes ces méthodes font jouer une pièce dès la première leçon.** Aucune ne fait d'abord une longue série de lectures sans musique. Les moyens varient : touches noires (Faber), oreille (Hoffman, Piano Safari, Simply Music), accompagnement du professeur qui fait sonner trois notes comme une vraie musique (Faber).

## 3. Ce que ça veut dire pour DuoPiano

État actuel : 20 niveaux de lecture et 6 niveaux de rythme, et la première pièce n'arrive qu'à l'unité 6 (prévue dans `PLAN.md`). L'écart avec les méthodes est là.

Pistes, de la plus importante à la moins importante :

1. **Une pièce au bout de chaque niveau, faite seulement des notes et des valeurs déjà ouvertes.** Le niveau sert alors à préparer la pièce. Le moteur existe déjà en morceaux (`recu()` pour la note, `frappe()` pour le moment, voir `PLAN.md`, unité 6).
2. **L'application joue l'accompagnement**, comme les duos du professeur chez Faber : une main gauche simple ou des accords sous la mélodie de l'enfant. Trois notes justes deviennent une musique. Le métronome (`pulsation`) donne déjà l'horloge.
3. **Écouter avant de lire** (Hoffman, Piano Safari) : bouton « Écoute la pièce » avant de la jouer. Pour une chanson connue (Au clair de la lune), l'enfant reconnaît la mélodie, puis la retrouve sur la portée.
4. **Deux notes à l'écran : notes et rythme, séparées** (point 4 de la recherche).
5. **Repérer les motifs** : surligner les mesures qui se répètent (« cette mesure revient 3 fois ») avant de jouer (Leikvoll, Piano Safari).
6. **Beaucoup de pièces courtes plutôt que des longues** : 4 à 8 mesures, plusieurs par niveau (Lee).
7. **Séance mélangée** : une pièce nouvelle, une ancienne, un défi de notes (Carter et Grahn). La révision existante peut servir de base.

## 4. Pièces possibles selon ce qui est appris

Une pièce s'ouvre quand le niveau de notes ET le niveau de rythme sont faits. Notes vérifiées une à une, en Do majeur, main droite sauf mention.

| Après | Notes connues | Pièce | Ce qu'elle contient |
|---|---|---|---|
| s1 + r2 | Do Ré Mi | Au clair de la lune, sans la 3e phrase (« Ma chandelle est morte » descend sous le Do) | Do Do Do Ré · Mi(blanche) Ré(blanche) · Do Mi Ré Ré · Do(ronde). Forme A A B A : on joue les trois A |
| s2 + r1 | Do à Sol | Frère Jacques, deux premières phrases | Do Ré Mi Do (×2) · Mi Fa Sol(blanche) (×2) |
| s2 + r1 | Do à Sol | Ode à la joie (Beethoven), rythme pointé simplifié | Mi Mi Fa Sol · Sol Fa Mi Ré · Do Do Ré Mi · Mi Ré Ré(blanche) |
| s3 + r1 | Do à La | Ah ! vous dirai-je maman (Mozart, thème) | Do Do Sol Sol · La La Sol(blanche) · Fa Fa Mi Mi · Ré Ré Do(blanche) |
| s3 + r5 | Do à La | Frère Jacques, 3e phrase | Sol La Sol Fa (croches) Mi Do (noires) |
| r3 + s2 | | Berceuse de Brahms (3/4) | Liste de `PLAN.md`, à arranger |
| f2 | Do3 à Sol3 | Mêmes pièces, une octave plus bas, main gauche | La même mélodie lue en clé de fa : l'enfant la connaît déjà |
| g1 | Do3 à Do5 | Mélodie partagée entre les deux mains | Comme Faber : la main gauche prend les notes sous le Do central |

Les pièces 6 à 8 de `PLAN.md` (Offenbach, Pachelbel, Bach) restent à la fin, avec les croches, la clé de fa et le Fa dièse.

## 5. Limites

- Une seule étude compare deux approches de lecture chez l'enfant (DiCienzo), sans taille d'échantillon dans le résumé.
- Aucune donnée sur les applications. Ce qui marche chez elles est déduit de leur structure, pas mesuré.
- La Méthode Rose : aucune description de sa progression trouvée en ligne, elle n'est donc pas dans le tableau.
- Détection : jouer une pièce avec accompagnement suppose que le micro distingue le piano de l'enfant du son de l'application. Le filtre anti-voix ne règle pas ça. À tester au banc avant de construire (accompagnement au casque, ou en bruit filtré seulement comme le métronome).

## Sources

- DiCienzo (2019), Middle C vs Mixed Intervallic : https://ruor.uottawa.ca/items/91b91a8b-a32c-4b1c-b5d2-6127d321ef65/full
- Labo de pédagogie du piano, Ottawa (Emond et Comeau 2013, Nassrallah et Comeau 2010) : https://piano.uottawa.ca/?p=8465
- Leikvoll (2017), Stavanger : https://partner.sciencenorway.no/forskningno-learning-norway/how-beginners-can-learn-to-read-music-more-efficiently/1452698
- Guðmundsdóttir (2010), IJME : https://journals.sagepub.com/doi/10.1177/0255761409351342
- Carter et Grahn (2016), Frontiers in Psychology : https://www.frontiersin.org/articles/10.3389/fpsyg.2016.01251/text
- Prédicteurs du déchiffrage (Lee 2008 et autres), revue : https://www.researchgate.net/publication/228347625_Towards_a_general_model_of_skills_involved_in_sight_reading_music
- Piano Safari : https://musicteachermagazine.co.uk/content/features/piano-safari-katherine-fisher-and-julie-knerr
- Hoffman Academy : https://hoffmanacademy.com/teachers
- Music Moves for Piano (Gordon) : https://www.mtna.org/downloads/conference/handouts/2019/MLT.pdf
- Simply Music : https://pianobelloso.squarespace.com/s/SMP_StudentBrochure_2016-17.pdf
- Faber, catalogue : https://issuu.com/halleonardeurope/docs/cat_21-022_faber_uk_catalog
- Simply Piano, structure : https://www.musicradar.com/reviews/simply-piano-review et https://piano-help.hellosimply.com/en/articles/2791299-soloist-and-chords-choosing-a-course-path
- Hervé et Pouillard : https://www.boullard.ch/en/product/bookstore/piano-sheet-music/pianos-methods/childrens-methods-pianos/lemoine-methods/118187-methode-de-piano-debutants-de-herve-et-pouillard-charles-herve-et-jacqueline-pouillard-henry-lemoine/
- Syllabes rythmiques, études : https://takadimi.net/bibliography.html
