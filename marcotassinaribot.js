
//import { BotChat } from 'TaffiTools/src/bot/botchat.js';
import { BotNews } from 'TaffiTools/src/bot/botnews.js';
import { Canale } from 'TaffiTools/src/bot/canale.js';
import { ProcessManager } from 'TaffiTools/src/system/processmanager.js';
import { debug } from 'TaffiTools/src/utils/debug.js';
import { Servizi } from "TaffiTools/src/utils/servizi.js";
import { TagManager } from "TaffiTools/src/bot/tagmanager.js";

import dotenv from 'dotenv';
dotenv.config();


// IL CARICAMENTO DEI PROMPT DINAMICI DAL FILE E' GESTITO NELLA BOTCHAT.JS

/**
 * La classe MarcoTassinariBot: l'avatar di Marco su Telegram
 */

class BotMarcoTassinari extends BotNews {

  /**
   * Crea un'istanza di MarcoTassinariBot.
   */
  constructor() {
    debug(4,"BotMarcoTassinari costruttore");
    
    const botToken = process.env.TELEGRAM_TAFFIBOT_TOKEN;
    const chatGptApiKey = process.env.OPENAI_API_KEY;
    const assistantID = process.env.ASSISTANT_ID; //l'assistente di questo bot
    const iftttKey = process.env.IFTTT_WEBHOOKKEY;
   // const wordpressDipendenzeID = process.env.WORDPRESS_DIPENDENZE_ID

 /*
   const promptsArticolo = {
        ripubblicaNotizia: { prompt:`Devi scrivere il testo di un articolo giornalistico di approfondimento di una notizia, senza titolo, partendo da uno o più articoli dati. 
          Voglio un testo lungo: individua la notizia di interesse e usa tutto il materiale pertinente che ti viene fornito per raccontare il fatto, comprendendo i dati, le citazioni, le storie e gli esempi dati. 
        Cambia l'attacco e modifica l'ordine dei contenuti per raggruppare i temi simili, seguendo queste indicazioni: 
        - Inizia direttamente dal testo dell'articolo raccontando a piramide invertita con le 5W del giornalismo la notizia principale; 
        - Evita di ripetere le frasi date, ma modificale utilizzando sinonimi per adeguare il tono di voce allo stile sobrio e moderato di semprenews.it; 
        - Preferisci i verbi attivi, contenuti certi e ben definiti, frasi brevi;
        - Mantieni le dichiarazioni originali dette dai protagonisti in prima persona, fra virgolette « »; 
        - Dove necessario, circa a metà articolo, aggiungi diciture simili a queste: "come spiega [Nome Testata](url):", "Leggi anche [Nome Testata](url)", "secondo i dati riportati da [Nome Testata](url)". 
        - Alla fine chiudi l'articolo bruscamente senza conclusioni o commenti.
        
        Istruzioni di formattazione html: utilizza <b> per sottolineare i concetti importanti e i nomi propri, <i> per nomi di eventi, progetti, enti, inserisci uno o due titoli intermedi formattati in <h2>. 
        Alla fine chiudi l'articolo di netto, senza inserire commenti e conclusioni.`,

        params: {assistant_id:"asst_bHDl6nBPLhF6AyBVddSlnl7C"}
        },
    
        scriviTitoli: { prompt:`Devi generare dei titoli in formato JSON per il portale online semprenews.it, per l'articolo dato, per invogliare alla lettura e aiutare il lettore a comprendere gli elementi chiave. 
        Sono richiesti: titolo, occhiello, sommario, SEO title, SEO description. 
        Il titolo principale deve essere molto breve; contiene una citazione oppure un soggetto ed un verbo ed introdurre uno degli aspetti curiosi e popolari dell'articolo. Nell'occhiello e nel sommario spiega meglio la notizia e verranno introduci i temi trattati. 
        I titoli SEO comprendono la parola chiave principale e servono per il posizionamento, invogliando al click.
        Voglio i titoli scritti come testo normale senza altre formattazioni. Esempio: "Biden:«La guerra è finita»"`,
          params: {assistant_id:"asst_3ivJI6e7wqnQ4rPaGUe1HwoZ"}    
            }
    };
*/
  const propmtLinkedin = {
    postLinkedin: { prompt:`Scrivi un post molto breve per la pagina personale su Linkedin di Marco Tassinari. Il post commenta il testo dato e che riferisce una notizia. 
                  Inizia subito con il commento senza preamboli od introduzioni, e taglia in maniera netta senza conclusioni o rimandi. 
                  Nel commentare tieni presente che Marco in generale ritiene che sia utile mettersi a capofitto a sperimentare sulle nuove possibilità offerte dalle recenti scoperte, dall'innovazione tecnologica e dai progressi dell'umanità, perché è necessario conoscerli per poterli controllare. 
                  Marco è molto attento al rispetto dei diritti umani e alla libertà dell'individuo, cui le macchine dovranno rimanere sottomesse. In particolare le nuove tecnologie presentano rischi di omologazione della società, che può essere utilizzata dai governi per stringere i controlli sulle persone, e calare dall'alto decisioni di cui le persone possono non essere consapevoli. 
                  Pensa che il cambiamento dei prossimi anni sarà repentino; per quanto riguarda le scienze dell'informazione, ritiene che verrà trasformato repentinamente l'attuale flusso di notizie cui siamo abituali; la democrazia dovrà trovare strumenti nuovi per rimanere al passo.`,
                   },
                   params: {} 
                  };

    //   let sitoDipendenze = new Canale("wordpress_dipendenzepatologiche.apg23.org_creaArticolo", wordpressDipendenzeID, "https://dipendenzepatologiche.apg23.org",chatGptApiKey);
   
    /*  let sitoSempreEcologia = new Canale("sendmail_redazionesempre_mailto","marcotassinari@apg23.org",iftttKey, chatGptApiKey)
              .setClassificazioneRichiesta({
                 includi: {  //se non specificato prende tutti  
                  tags: ["economia","ambiente"],
                  categorie: ["ambiente"], // gruppi di tag
                  rubriche: ["ecologia integrale"], //provenienti dai feed
             //     fonti: ["ansa.it"]   //TODO MIGLIORARE PERCHE ORA SERVE URL COMPLETO E NON SO SE VA
                  },
                 escludi: { //se non specificato non esclude nulla 
                  fonti: ["semprenews.it"],    
                  lingue: ["en"],            
                 }
                })
              .setPrompts(promptsArticolo);

      let sitoSempreMondo = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["pace","migranti","volontariato","diritti umani"],
         categorie: ["mondo"], // gruppi di tag
         rubriche: ["mondo"], //provenienti dai feed
         },
        escludi: { //se non specificato non esclude nulla 
         fonti: ["semprenews.it"],    
         lingue: ["en"],            
        }
       })
     .setPrompts(promptsArticolo);





      let sitoSempre_ChiaraBonetto = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["salute", "religione", "tecnologia", "giustizia", "rom","alimentazione","missioni", "dipendenze",  "strada"],
         },
       })
     .setPrompts(promptsArticolo);


    
    
      let sitoSempreFamiglia = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["disabilità","educazione","infanzia", "salute","famiglia","vita","affido"],
         },
       })
     .setPrompts(promptsArticolo);
  
      
      let sitoSempreCultura = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["politica", "spettacoli", "religione"],
         },
       })
     .setPrompts(promptsArticolo);

      let sitoSempreScienza = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["intelligenza artificiale", "fisica quantistica"],
         },
       })
     .setPrompts(promptsArticolo);


      let sitoSempre_IreneCiambezi = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["prostituzione"],
         },
       })
     .setPrompts(promptsArticolo);


 */

     //constructor(richiesta, address, accesso, apiKey){
//la stringa address qui è usata solo nei debug
     let socialMarcoLinkedin = new Canale("linkedin_marcot_post","Marco Tassinari",iftttKey,chatGptApiKey)
     .setClassificazioneRichiesta({
      includi: {  //se non specificato prende tutti  
       tags: ["intelligenza artificiale"],
       },
     })
   .setPrompts(propmtLinkedin);

  
    // servizi generici
      // let serviziPerMArco = new Servizi (["sendmail_root" , "sendmail_generic", "googledrive_filetest", "console_info_log",  "textedit_url_download"], process.env.IFTTT_WEBHOOKKEY ); //sevizi di esempio; mi passerò hookId. I servizi li saprò facendo una chiamata a chatgpt per sapere l'assistente cosa sa fare
      let serviziPerMArco = new Servizi (["console_info_log", "textedit_url_download", "googledrive_filetest"], process.env.IFTTT_WEBHOOKKEY ); //sevizi di esempio; mi passerò hookId. I servizi li saprò facendo una chiamata a chatgpt per sapere l'assistente cosa sa fare

/*      serviziPerMArco.registraServizio(sitoSempreEcologia.servizio); //aggiungo questi due servizi: pubblicazione sui canali
      serviziPerMArco.registraServizio(sitoSempreMondo.servizio);
      serviziPerMArco.registraServizio(sitoSempre_ChiaraBonetto.servizio);
      serviziPerMArco.registraServizio(sitoSempreFamiglia.servizio);
      serviziPerMArco.registraServizio(sitoSempreCultura.servizio);
      serviziPerMArco.registraServizio(sitoSempreScienza.servizio);
      serviziPerMArco.registraServizio(sitoSempre_IreneCiambezi.servizio);
*/
     serviziPerMArco.registraServizio(socialMarcoLinkedin.servizio);

//- Nota: tutti questi servizi devono essere già presenti nell'assistente

      super(chatGptApiKey, assistantID, botToken, serviziPerMArco ); 

    
//this.aggiungiCanali([sitoSempreEcologia,sitoSempreMondo,sitoSempre_ChiaraBonetto,sitoSempreFamiglia,sitoSempreCultura, sitoSempreScienza, sitoSempre_IreneCiambezi]); //aggiunge i contesti al dialogo attuale
this.aggiungiCanali([socialMarcoLinkedin]); //aggiunge i contesti al dialogo attuale


    }



}

// ******************************** main **************************************


const tagManager = new TagManager(
  ["famiglia", "solidarietà", "cultura", "mondo", "spiritualità", "ecologia integrale", "scienza", "cronaca"]  //categorie permesse
);

//risultato = tagManager.getObject();


tagManager.addTags(
[]);


const fonti = [];


/**
 * Avvia il bot MarcoTassinariBot.
 */
(async () => {

let bot = null;

  try {
    const DEBUG_LEVEL = process.env.DEBUG_LEVEL;
    ProcessManager.getInstance().setup(this, DEBUG_LEVEL);
   
    debug(0,"Avvio il server...", process.env.DEBUG_LEVEL);
    debug(0, "debug level:", DEBUG_LEVEL);

    bot = new BotMarcoTassinari()
      .addFonti(fonti) //invia le fonti        
      .followFeeds(tagManager.getObject()); //passo le descrizioni dei miei tag e categorie; inizializza anche this.classificazioneRichiesta prendendola dai canali
    
      await bot.start(); // inizializza i canali e avvia il websocket
      console.log("Bot avviato!");



  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }

// bot.test(numerocanale); ABILITARE SE SERVE FARE UNA PROVA DI CANALE SENZA ASPETTARE



})();

//***************************************
