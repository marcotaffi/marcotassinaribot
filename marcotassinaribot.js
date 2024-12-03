
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
    const wordpressDipendenzeID = process.env.WORDPRESS_DIPENDENZE_ID

 
 //   let serviziPerMArco = new Servizi (["sendmail_root" , "sendmail_generic", "googledrive_filetest", "console_warn", "textedit_url_download"], process.env.IFTTT_WEBHOOKKEY ); //sevizi di esempio; mi passerò hookId. I servizi li saprò facendo una chiamata a chatgpt per sapere l'assistente cosa sa fare
 
const prompts = {
   ripubblicaNotizia : "Devi scrivere un articolo di rilancio di una notizia. Prima di iniziare chiedi se hai già il materiale necessario oppure se l'utente vuole inviarti contenuti. Riscrivi un articolo giornalistico da questo materiale, modificando il testo originale secondo queste indicazioni: - non riscrivere il titolo, ti serve solo come contesto per l'articolo; - modifica l'ordine dei contenuti per raggruppare i temi simili; - metti in evidenza subito la notizia principale; - adegua il tono di voce allo stile sobrio e moderato di semprenews.it; - evita di ripetere le frasi date, ma modificale utilizzando sinonimi e stile per rendere meno riconoscibile il testo originale; Voglio un testo lungo: usa tutto il materiale che ti viene fornito, comprendendo la notizia, gli approfondimenti, i dati, le citazioni, le storie e gli esempi riportati. Alla fine aggiungi una dicitura simile a questa: Per saperne di più leggi l'articolo originale su [Nome Testata](url).",
   scriviTitoli : "Devi generare dei titoli per il portale online semprenews.it. Prima di iniziare chiedi se hai già il materiale necessario oppure se l'utente vuole inviarti contenuti. Genera un set di titoli che aiutino il lettore a comprendere gli elementi chiave dell'articolo dato. I titoli devono essere rispettosi e descrittivi, e introdurre ad aspetti più curiosi e popolari dell'articolo.",
}


       let sitoDipendenze = new Canale("wordpress_dipendenzepatologiche.apg23.org", wordpressDipendenzeID, "https://dipendenzepatologiche.apg23.org",chatGptApiKey);
       let sitoSempre = new Canale("sendmail_sempreredazione@apg23.org",iftttKey, "sempreredazione@apg23.org",chatGptApiKey);

       sitoDipendenze.setFeed(["dipendenze"]);
       sitoSempre.setFeed(["politica", "sport"]).setAuto().setPrompts(prompts);
       // servizi generici
       let serviziPerMArco = new Servizi (["console_log", "textedit_url_download", "googledrive_filetest"], process.env.IFTTT_WEBHOOKKEY ); //sevizi di esempio; mi passerò hookId. I servizi li saprò facendo una chiamata a chatgpt per sapere l'assistente cosa sa fare

       serviziPerMArco.registraServizio(sitoDipendenze.servizio); //aggiungo questi due servizi: pubblicazione sui canali
       serviziPerMArco.registraServizio(sitoSempre.servizio);
       
//- Nota: tutti questi servizi devono essere già presenti nell'assistente

       super(chatGptApiKey, assistantID, botToken, serviziPerMArco ); 


      this.aggiungiCanali([sitoDipendenze,sitoSempre]); //aggiunge i contesti al dialogo attuale

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
