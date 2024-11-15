
import BotChat from 'TaffiTools/src/bot/botchat.js';
import { ProcessManager } from 'TaffiTools/src/system/processmanager.js';
import { debug } from 'TaffiTools/src/utils/debug.js';
import { Servizi } from "TaffiTools/src/utils/servizi.js";
import { SendMail, GoogleDrive } from "TaffiTools/src/api/ifttt.js"
import { Console } from "TaffiTools/src/utils/console.js"
import dotenv from 'dotenv';
dotenv.config();


// Funzione per caricare un prompt specifico dal file JSON corrispondente al nome del comando
/*async function loadPrompt(command) {
  try {
    const filePath = path.join(__dirname, 'prompts', `${command}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    debug(1,"Error loading prompt:", error.message);
    return null;
  }
}*/



/**
 * La classe MarcoTassinariBot estende la classe BotChat e rappresenta un bot specifico.
 * Inizializza il bot con il token e il form di accoglienza specifico.
 */
class BotMarcoTassinari extends BotChat {
  /**
   * Crea un'istanza di MarcoTassinariBot.
   */
  constructor() {
    debug(4,"BotMarcoTassinari costruttore");
    
    const botToken = process.env.TELEGRAM_TAFFIBOT_TOKEN;
    const chatGptApiKey = process.env.OPENAI_API_KEY;
    const assistantID = process.env.ASSISTANT_ID; //l'assistente di questo bot
 
    let serviziPerMArco = new Servizi (["sendmail_root" , "sendmail_generic", "googledrive_filetest", "console_warn"], process.env.IFTTT_WEBHOOKKEY ); //sevizi di esempio; mi passerò hookId
 
    
    serviziPerMArco.start();

      super(chatGptApiKey, assistantID, botToken, serviziPerMArco ); 
 
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

    new BotMarcoTassinari().start();
  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }
})();

//***************************************
