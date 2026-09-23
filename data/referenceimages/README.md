# Immagini di riferimento per la generazione

Qui stanno i PNG/JPG usati come provini di STILE dai generatori di immagini: vengono passati
al modello insieme al prompt, perché le nuove immagini somiglino a queste.

Si dichiarano nei file `data/photoeditors/*.yml`, con percorsi relativi a `data/`. Si può
indicare un singolo file, un URL http(s) oppure una CARTELLA, che vale per tutte le immagini
`.png/.jpg/.jpeg/.webp` che contiene:

```yaml
referenceImages:
  - referenceimages/apg23
```

Massimo 16 immagini per generazione, come da limite di OpenAI `images.edit`. Ogni provino
costa token in ingresso (circa 1500 a immagine): meglio pochi file davvero rappresentativi.

## apg23/

Stile delle copertine di apg23.org, usato da `photoeditors/cover_apg23.yml`: illustrazione
editoriale contemporanea, forme semplificate con texture, personaggi riconoscibili dai gesti,
comunità diversa per età e provenienza, città sullo sfondo. Palette di azzurri, blu e verde
acqua con pochi accenti caldi.

I due file attuali sono GRIGLIE di illustrazioni, non immagini singole. Va bene come campionario
di tratto, ma il prompt di stile (`prompts/stile_cover_apg23.yml`) deve dire esplicitamente di
produrre UNA scena sola: senza quella riga il modello tende a copiare anche la griglia.

La descrizione testuale completa, quella che viene davvero inviata al modello, sta in
`prompts/stile_cover_apg23.yml`. Per cambiare stile basta aggiungere o togliere file qui.

## Dove sono i file (dal 23/09/2026)

I provini NON stanno più nel progetto né in git: sono pesanti e cambiano spesso.

- **Originali sul Mac di Marco:** `~/srv/provini/<progetto>/`.
- **cloud.taffi.it (produzione):** presenti in questa cartella, più una copia in
  `~/referenceimages-backup/<progetto>/`.
- **Locale e dev.taffi.it:** volutamente ASSENTI, per non pagare i token dei provini a ogni
  prova (circa 0,3 centesimi a immagine invece di 2-4). Le copertine si generano lo stesso, ma
  senza lo stile della casa: quello si giudica solo su una copertina fatta in produzione. Il
  log lo segnala a livello 2.

Per rimetterli dove servono:

```bash
# sul server, dalla copia di sicurezza
cp -a ~/referenceimages-backup/<progetto>/. /srv/<progetto>/data/referenceimages/
# in locale, dagli originali
cp -a ~/srv/provini/<progetto>/. ~/srv/<progetto>/data/referenceimages/
```
