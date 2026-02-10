
Questa cartella contiene definizioni di servizi e canali. I canali sono dei servizi che possono essere attivati in automatico quando 
arriva un contenuto sulla base degli interessi definiti.

Campi:

firma: linkedin_marcot_post //nome del file. Se questo file esiste (si!) non prendo da qui la destinazione e la firma, utilizzabili solo per compatibilità con sistema precedente
servizio: linkedin  //prendo da qui il nome del servizio da attivare 
destinazione: marcot  //prendo da qui: indica a chi rivolgere i contenuti del servizio
procedura: post_linkedin //nome del servizio/canale da lanciare. Lancia il canale se interessi soddisfatti
azione: run //se presente prende da qui i nome del metodo da eseguire per il canale
classificazione:  //descrizione degli interessi di un canale, per servizi non serve
  includi:  //elenco condizioni che devono essere soddisfatte
    - hooks: ["intelligenza artificiale"]
      categories: ["intelligenza artificiale", "scienza"]
      type: "tags"
      flusso: "RaggruppaSimili"
  escludi: []  //elenco condizioni che non devono esseere soddisfatte
opzioni:  //non servono a niente
  descrizioneOpzioni: "Queste opzioni sono solo un demo, usabili se serve in futuro"
  maxPostLength: 1300
  defaultHashtags: ["#AI", "#Scienza"]


