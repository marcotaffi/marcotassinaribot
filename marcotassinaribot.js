
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

 
 //   let serviziPerMArco = new Servizi (["sendmail_root" , "sendmail_generic", "googledrive_filetest", "console_warn", "textedit_url_download"], process.env.IFTTT_WEBHOOKKEY ); //sevizi di esempio; mi passerò hookId. I servizi li saprò facendo una chiamata a chatgpt per sapere l'assistente cosa sa fare
 
const prompts = {
   ripubblicaNotizia : "Devi scrivere un articolo di rilancio di una notizia, partendo da uno o più articoli dati. Scrivi un articolo giornalistico da questo materiale, modificando i contenuti originali secondo queste indicazioni: - metti in evidenza subito la notizia principale cambiando l'attacco;  - modifica l'ordine dei contenuti per raggruppare i temi simili; - adegua il tono di voce allo stile sobrio e moderato di semprenews.it; - evita di ripetere le frasi date, ma modificale utilizzando sinonimi e stili per rendere meno riconoscibile il testo originale; Voglio un testo lungo: usa tutto il materiale che ti viene fornito, comprendendo la notizia, gli approfondimenti, i dati, le citazioni, le storie e gli esempi riportati. Dove necessario aggiungi diciture simili a queste: - come spiega [Nome Testata](url) - Leggi anche [Nome Testata](url) - secondo i dati riportati da [Nome Testata](url). Non inserire commenti ma dammi solo il testo finale. Utilizza tag html come <b> e </b> per inserire alcuni grassetti ed eventuali altre formattazioni. Usa <br><br> come fine riga.",
   scriviTitoli : "Devi generare dei titoli per il portale online semprenews.it. Genera i titoli per l'articolo dato, che aiutino il lettore a comprendere gli elementi chiave del pezzo. Sono richiesti: titolo breve, occhiello, sommario, titolo SEO, meta description.  I titoli devono essere rispettosi e descrittivi, e introdurre ad aspetti più curiosi e popolari dell'articolo. Voglio i titoli espressi come coppia chiave:valore separati da <br><br>",
}


    //   let sitoDipendenze = new Canale("wordpress_dipendenzepatologiche.apg23.org_creaArticolo", wordpressDipendenzeID, "https://dipendenzepatologiche.apg23.org",chatGptApiKey);
      // let sitoSempre = new Canale("sendmail_sempreredazione@apg23.org_mailto",iftttKey, "sempreredazione@apg23.org",chatGptApiKey);
      let sitoSempreEcologia = new Canale("sendmail_redazionesempre_mailto","marcotassinari@apg23.org",iftttKey, chatGptApiKey);
      let sitoSempreMondo = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey);
      let sitoSempreSolidarietà = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey);
      let sitoSempreFamiglia = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey);
       let sitoSempreCultura = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey);
       let sitoSempreSpiritualità = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey);

       sitoSempreEcologia.setFeed(["economia","ambiente","scienza", "tecnologia"]).setPrompts(prompts);
       sitoSempreMondo.setFeed(["pace"]).setPrompts(prompts);
       sitoSempreSolidarietà.setFeed(["dipendenze", "giustizia", "volontariato","migranti","prostituzione","strada"]).setPrompts(prompts);
       sitoSempreFamiglia.setFeed(["disabilità","educazione","infanzia", "salute","famiglia","vita","affido"]).setPrompts(prompts);
       sitoSempreCultura.setFeed(["politica", "sport", "diritti umani", "spettacoli","alimentazione"]).setPrompts(prompts);
       sitoSempreSpiritualità.setFeed(["religione"]).setPrompts(prompts);

/*       sitoSempreSolidarietà.setFeed(["dipendenze", "giustizia", "disabilità", "educazione"]);
       sitoSempre.setFeed(["politica", "sport", "pace", "economia", "infanzia", "religione"]).setAuto().setPrompts(prompts);
  */
      // servizi generici
       let serviziPerMArco = new Servizi (["console_log", "textedit_url_download", "googledrive_filetest"], process.env.IFTTT_WEBHOOKKEY ); //sevizi di esempio; mi passerò hookId. I servizi li saprò facendo una chiamata a chatgpt per sapere l'assistente cosa sa fare

       serviziPerMArco.registraServizio(sitoSempreEcologia.servizio); //aggiungo questi due servizi: pubblicazione sui canali
       serviziPerMArco.registraServizio(sitoSempreMondo.servizio);
       serviziPerMArco.registraServizio(sitoSempreSolidarietà.servizio);
       serviziPerMArco.registraServizio(sitoSempreFamiglia.servizio);
       serviziPerMArco.registraServizio(sitoSempreCultura.servizio);
       serviziPerMArco.registraServizio(sitoSempreSpiritualità.servizio);

//- Nota: tutti questi servizi devono essere già presenti nell'assistente

       super(chatGptApiKey, assistantID, botToken, serviziPerMArco ); 


      this.aggiungiCanali([sitoSempreEcologia,sitoSempreMondo,sitoSempreSolidarietà,sitoSempreFamiglia,sitoSempreCultura,sitoSempreSpiritualità]); //aggiunge i contesti al dialogo attuale

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
