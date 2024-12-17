
//import { BotChat } from 'TaffiTools/src/bot/botchat.js';
import { BotNews } from 'TaffiTools/src/bot/botnews.js';
import { Canale } from 'TaffiTools/src/bot/canale.js';
import { ProcessManager } from 'TaffiTools/src/system/processmanager.js';
import { debug } from 'TaffiTools/src/utils/debug.js';
import { Servizi } from "TaffiTools/src/utils/servizi.js";
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

 
 
const prompts = {
   ripubblicaNotizia : "Devi scrivere in html un articolo di rilancio di una notizia, partendo da uno o più articoli dati. Scrivi un articolo giornalistico da questo materiale, modificando i contenuti originali secondo queste indicazioni: - non inserire il titolo ma inizia mettendo in evidenza all'inizio del testo la notizia principale cambiando l'attacco;  - modifica l'ordine dei contenuti per raggruppare i temi simili; - adegua il tono di voce allo stile sobrio e moderato di semprenews.it; - evita di ripetere le frasi date, ma modificale utilizzando sinonimi e stili per rendere meno riconoscibile il testo originale; - Voglio un testo lungo: usa tutto il materiale che ti viene fornito, comprendendo la notizia, gli approfondimenti, i dati, le citazioni, le storie e gli esempi riportati. <br>Dove necessario, circa a metà articolo, aggiungi diciture simili a queste: - come spiega [Nome Testata](url) - Leggi anche [Nome Testata](url) - secondo i dati riportati da [Nome Testata](url). Non inserire commenti e conclusioni. Dammi il testo finale formattato: usa <br> per fine riga. Puoi utilizzare tag html come <p> <b> e <i> e titoli intermedi <h2> per inserire grassetti ed altre formattazioni",
   scriviTitoli : "Devi generare dei titoli per il portale online semprenews.it. Genera i titoli per l'articolo dato, che aiutino il lettore a comprendere gli elementi chiave del pezzo. Sono richiesti: titolo breve, occhiello, sommario, meta title, meta description.  I titoli devono essere rispettosi e descrittivi, e introdurre ad aspetti più curiosi e popolari dell'articolo. Voglio i titoli espressi come coppia chiave:valore separati da <br><br> ma scritti tutti come testo normale senza altre formattaziomi. Ad esempio: 'Titolo: Oggi in città piove.'",
   postLinkedin: "Scrivi un post per la pagina personale su Linkedin di Marco Tassinari. Devi commentare il testo dato, che verrà inserito nel link allegato, e che riferisce una notizia in ambiti come tecnologia, intelligenza artificiale, scienza, fisica quantistica. Marco in generale ritiene che sia utile mettersi a capofitto a sperimentare sulle nuove possibilità offerte dalle recenti scoperte, dall'innovazione tecnologica e dai progressi dell'umanità, perché è necessario conoscerli per poterli controllare. Marco è molto attento al rispetto dei diritti umani e alla libertà dell'individuo, cui le macchine dovranno rimanere sottomesse. In particolare le nuove tecnologie presentano rischi di omologazione della società, che può essere utilizzata dai governi per stringere i controlli sulle persone, e calare dall'alto decisioni di cui le persone possono non essere consapevoli. Il cambiamento dei prossimi anni sarà repentino; per quanto riguarda le scienze dell'informazione, trasformerà completamente l'attuale flusso di notizie cui siamo abituali; la democrazia dovrà trovare strumenti per rimanere al passo.",
  }


    //   let sitoDipendenze = new Canale("wordpress_dipendenzepatologiche.apg23.org_creaArticolo", wordpressDipendenzeID, "https://dipendenzepatologiche.apg23.org",chatGptApiKey);
   
      let sitoSempreEcologia = new Canale("sendmail_redazionesempre_mailto","alessiozamboni@apg23.org",iftttKey, chatGptApiKey);
      let sitoSempreMondo = new Canale("sendmail_redazionesempre_mailto", "anna8.03.98@gmail.com",iftttKey,chatGptApiKey);
      let sitoSempreSolidarietà = new Canale("sendmail_redazionesempre_mailto", "chiarabonetto@apg23.org",iftttKey,chatGptApiKey);
      let sitoSempreFamiglia = new Canale("sendmail_redazionesempre_mailto", "marcoscarmagnani@apg23.org",iftttKey,chatGptApiKey);
      let sitoSempreCultura = new Canale("sendmail_redazionesempre_mailto", "nicolettapasqualini@apg23.org",iftttKey,chatGptApiKey);
      let sitoSempreScienza = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey);


      //   let sitoSempreSpiritualità = new Canale("sendmail_redazionesempre_mailto", "nicolettapasqualini@apg23.org",iftttKey,chatGptApiKey);
   //    let socialMarcoLinkedin = new Canale("linkedin_marcot_post", "Marco Tassinari",iftttKey,chatGptApiKey);


        sitoSempreEcologia.setFeed(["economia","ambiente"]).setPrompts(prompts);
        sitoSempreMondo.setFeed(["pace","migranti",]).setPrompts(prompts);
        sitoSempreSolidarietà.setFeed(["alimentazione","diritti umani", "dipendenze", "volontariato","prostituzione","strada"]).setPrompts(prompts);
        sitoSempreFamiglia.setFeed(["disabilità","educazione","infanzia", "salute","famiglia","vita","affido"]).setPrompts(prompts);
        sitoSempreCultura.setFeed(["politica", "spettacoli", "religione"]).setPrompts(prompts);
        sitoSempreScienza.setFeed(["intelligenza artificiale", "fisica quantistica"]).setPrompts(prompts);

  //     sitoSempreSpiritualità.setFeed(["religione"]).setPrompts(prompts);
    //   socialMarcoLinkedin.setFeed(["scienza", "intelligenza artificiale"]).setPrompts(prompts);


/*       sitoSempreSolidarietà.setFeed(["dipendenze", "giustizia", "disabilità", "educazione"]);
       sitoSempre.setFeed(["politica", "sport", "pace", "economia", "infanzia", "religione"]).setAuto().setPrompts(prompts);
  */
      // servizi generici
      // let serviziPerMArco = new Servizi (["sendmail_root" , "sendmail_generic", "googledrive_filetest", "console_info_log",  "textedit_url_download"], process.env.IFTTT_WEBHOOKKEY ); //sevizi di esempio; mi passerò hookId. I servizi li saprò facendo una chiamata a chatgpt per sapere l'assistente cosa sa fare
       let serviziPerMArco = new Servizi (["console_info_log", "textedit_url_download", "googledrive_filetest"], process.env.IFTTT_WEBHOOKKEY ); //sevizi di esempio; mi passerò hookId. I servizi li saprò facendo una chiamata a chatgpt per sapere l'assistente cosa sa fare

       serviziPerMArco.registraServizio(sitoSempreEcologia.servizio); //aggiungo questi due servizi: pubblicazione sui canali
       serviziPerMArco.registraServizio(sitoSempreMondo.servizio);
       serviziPerMArco.registraServizio(sitoSempreSolidarietà.servizio);
       serviziPerMArco.registraServizio(sitoSempreFamiglia.servizio);
       serviziPerMArco.registraServizio(sitoSempreCultura.servizio);
       serviziPerMArco.registraServizio(sitoSempreScienza.servizio);

     //  serviziPerMArco.registraServizio(socialMarcoLinkedin.servizio);

//- Nota: tutti questi servizi devono essere già presenti nell'assistente

       super(chatGptApiKey, assistantID, botToken, serviziPerMArco ); 

    
this.aggiungiCanali([sitoSempreEcologia,sitoSempreMondo,sitoSempreSolidarietà,sitoSempreFamiglia,sitoSempreCultura, sitoSempreScienza]); //aggiunge i contesti al dialogo attuale
//this.aggiungiCanali([socialMarcoLinkedin]); //aggiunge i contesti al dialogo attuale

    }



}

// ******************************** main **************************************


/**
 * Avvia il bot MarcoTassinariBot.
 */
(async () => {
  try {
    const DEBUG_LEVEL = process.env.DEBUG_LEVEL;
    ProcessManager.getInstance().setup(this, DEBUG_LEVEL);
   
    debug(0,"Avvio il server...", process.env.DEBUG_LEVEL);
    debug(0, "debug level:", DEBUG_LEVEL);

    new BotMarcoTassinari().followFeeds().start();
  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }
})();

//***************************************
