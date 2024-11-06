
import BotChat from 'TaffiTools/src/bot/botchat.js';
import { ProcessManager } from 'TaffiTools/src/system/ProcessManager.js';
import { debug } from 'TaffiTools/src/utils/debug.js';
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


//import DialogoRedattore from './src/dialogoredattore.js';
//import domande from './src/formaccoglienza.js';

//import IFTTT from './utils/api/ifttt.js';
//import ChatMarcoTassinari from './src/chatmarcotassinari.js';

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
    const assistantID = "asst_F1wG4u9cROL2mFJCjfZMbSm3"; //l'assistente di questo bot
 
      super(chatGptApiKey, assistantID, botToken); 
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