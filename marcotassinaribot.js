//import TaffiBot from './utils/bot/bottaffi.js';
import BotChat from './utils/bot/botchat.js';
import DialogoChat from './utils/bot/dialogochat.js';
import * as cheerio from 'cheerio'; //usata in textedit.js per scaricare una pagina web, lo metto qui per via dei miei link simbolici
export { cheerio };
import yaml from 'js-yaml';
export {yaml}; 
//import fs from "fs";
import fs from 'fs/promises';
import { debug } from './utils/utils.js';



// Funzione per caricare un prompt specifico dal file JSON corrispondente al nome del comando
async function loadPrompt(command) {
  try {
    const filePath = path.join(__dirname, 'prompts', `${command}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    debug(1,"Error loading prompt:", error.message);
    return null;
  }
}


//import DialogoRedattore from './src/dialogoredattore.js';
//import domande from './src/formaccoglienza.js';

//import IFTTT from './utils/api/ifttt.js';
//import ChatMarcoTassinari from './src/chatmarcotassinari.js';

import dotenv from 'dotenv';
dotenv.config();

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
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatGptApiKey = process.env.OPENAI_API_KEY;
    const assistantID = "asst_F1wG4u9cROL2mFJCjfZMbSm3"; //l'assistente di questo bot
   const chat = new DialogoChat(chatGptApiKey, assistantID); //contiene i prompt. questa importazione in botzona è fatta diversa 
   //const chat = new DialogoChat (chatGptApiKey, assistantID, domande)
   //.init(assistantID);
    /*const salvataggio=new IFTTT(                        //salvataggio
      'telegram_bot_form_complete', 
       process.env.IFTTT_WEBHOOKKEY
       ); */
    //const dialogo = new DialogoForm(domande);

    /*super(telegramToken,
      dialogo,                          //array di domande
      salvataggio
      );
 */
 

    super(telegramToken, chat); 
  }

  async generaDomanda(ctx, comando) {//era dialogo.run. Mi serve anticiparlo qui perché qui posso personalizzarlo. bottaffi dovrebbe diventare un più generico botchat. 
    return this.dialogo.run(ctx, comando);

  }
  
  async mostraDomanda(ctx, domandaGenerata) { //posso alterare il comportamento se serve, eg filtrare quando mostrare una domanda

   // if ( ctx?.chat?.type != "supergroup" )
       await super.mostraDomanda(ctx, domandaGenerata);
    
    }


}

// ******************************** main **************************************


/*
const taffiPrompts = [
  { command: "scrivi_articolo", prompt: "Hello! How can I assist you today?" },
  { command: "farewell", prompt: "Goodbye! Have a great day!" },
  { command: "weather", prompt: "What's the weather like in your city?" },
  { command: "news", prompt: "Tell me the latest news." },
  { command: "joke", prompt: "Can you tell me a joke?" }
];
*/
/**
 * Avvia il bot MarcoTassinariBot.
 */
(async () => {
  try {
    debug(0,"Avvio il server...");
    new BotMarcoTassinari().start();
  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }
})();

//***************************************

