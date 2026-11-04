# Banc d'essai des pièces (micro simulé)

Joue une pièce au micro de Chrome à partir d'un enregistrement fabriqué avec les échantillons Steinway de GarageBand.
Les échantillons restent sur le Mac : ne jamais les copier dans le dépôt (licence Apple).

1. Convertir les échantillons dans un dossier de travail `$T/ech/` (V3 et V4, notes 057 à 072 par pas de 3) :
   `ffmpeg -i ".../Steinway V3/Steinway V3  060.aif" -ac 1 -ar 48000 -c:a pcm_f32le $T/ech/V3-060.wav`
2. Fabriquer une interprétation :
   - à mon rythme : `python3 fabrique.py $T "$(node seq.mjs clair 76 $T/clair.wav V3 1)"`
   - au tempo de l'appli (2 mesures par ligne, 0,12 s de retard, irrégularité 0,07 s) :
     `python3 fabrique.py $T "$(node seqtempo.mjs clair 2 $T/clairT.wav 0.12 0.07 6)"`
3. Lancer : `CHROME=<chemin de chrome-headless-shell> node banc.mjs $T/clair.wav clair libre` (ou `tempo`).
   Playwright doit être installé là où on lance le script.

Résultats du 2026-11-03 : 33/33, 42/42 et 30/30 notes détectées, aucune en trop, notes répétées comprises,
de 76 à 110 battements par minute. Au tempo : 33/33 et 42/42 allumées, 9/33 si l'enfant joue un temps entier en retard.
Limite : la batterie sort par les haut-parleurs et n'entre pas dans le micro simulé.
