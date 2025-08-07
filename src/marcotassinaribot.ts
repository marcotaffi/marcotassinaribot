
import dotenv from 'dotenv';
import { debug, BotIooo, Linkedin, ChatGPTAssistant, AIManagerSoloServizi, AISessionManager, ChatGptImageGenerator, PromptManager, TelegramInterface, Servizi, CanaliExtendsServizi} from "taffitools";
import type {TagProposti, TriggerProposti, Credenziali, Files } from "taffitools";

 dotenv.config();

/**
 * La classe MarcoTassinariBot: l'avatar di Marco su Telegram
 */

/** descrizioni comandi

start - chiacchiera con Marco 
help - Mi presento e ti spiego cosa so fare
scrivi_articolo - Scrivo un nuovo articolo.
comunicato_stampa - Scrivo un comunicato stampa.
ripubblica_notizia - Preparo il rilancio di una notizia.
correggi_testo - Correggo un testo.
migliora_intervista - Miglioro un'intervista.
impagina_html - Preparo per la pubblicazione in html un articolo.
genera_titoli - Genero i titoli di un articolo per un portale online.
genera_descrizioni_foto - Genero i campi di descrizione per una foto per semprenews.
crea_evento - Creo un evento da pubblicare su semprenews.

 */
  
const botToken = process.env.TELEGRAM_TOKEN||"";
const chatGptApiKey = process.env.OPENAI_API_KEY||"";
const assistantID = process.env.ASSISTANT_ID||""; 
const iftttKey = process.env.IFTTT_WEBHOOKKEY||"";
const TEST_ONLY: boolean = !!process.env['TEST_ONLY'] && process.env['TEST_ONLY'] !== "false";
if (TEST_ONLY) debug(2, "Sono in test e quindi faccio tutto senza pubblicare");

const credenziali : Credenziali = {
iftttKey: iftttKey, 
test_only:TEST_ONLY,
botToken: botToken,
}

// ******************************** main **************************************



let tags : TagProposti[] = [];
let feeds: TriggerProposti[] = [];
let news : TriggerProposti[] = [];


/**
 * Avvia il bot.
 */
(async () => {

  try {



    debug(3, "*Creo i canali*");
    const listaPromptFiles : Files = await PromptManager.getInstance().elencaFiles("yml");

    let socialMarcoLinkedin = new Linkedin ("linkedin_marcot");
    
    const promptRichiestiLinkedin = socialMarcoLinkedin.requiredPrompts();
    type PromptIDLinkedin = typeof promptRichiestiLinkedin[number]["id"];

    
    const promptDisponibiliLinkedin: Record<PromptIDLinkedin, string> = {
      social: "linkedin",
    };

    socialMarcoLinkedin
       .addContent({ hooks:["intelligenza artificiale"], categories:["intelligenza artificiale", "scienza"], type:"tags" , flusso:"RaggruppaSimili"})
       .setMyPrompts(promptDisponibiliLinkedin,listaPromptFiles)
       .start(credenziali);
    

   //tutto il resto


     
    debug (3, "*definisco l'assistenteAI*")
    const sessionManager: AISessionManager = new AISessionManager();
    const aiManager = new AIManagerSoloServizi(sessionManager);
    const assistenteAI : ChatGPTAssistant = new ChatGPTAssistant(chatGptApiKey, aiManager);
      assistenteAI.setDefaultAssistantID(assistantID);
    //const telegram = new TelegramInterface(botToken);
    
    const servizi = new CanaliExtendsServizi();
    await aiManager.setAssistant(assistenteAI)
                   .setServizi(servizi)
                   .creaServiziPrevistiDallAssistenteOnline(credenziali);

      debug (3, "*Definisco il bot*")

     const bot = new BotIooo(aiManager,sessionManager);

     debug (3, "*Aggiungo le inferfacce*")

     await bot.addDefaultInterfaces(credenziali);

     debug(2, "*Aggiungo i canali al bot*"); 
     await bot.aggiungiCanali([socialMarcoLinkedin], credenziali);//ritorna un this a servizi

    
    debug (2, "*Aggiungo le fonti e la conoscenza*");
    
      if (feeds.length>0) bot.addFeeds(feeds); //invia le fonti       
      if (news.length>0) bot.addNews(news); //invia le fonti       
      if (tags.length>0) bot.setKnowledge(tags); //passo le descrizioni dei miei tag e categorie
 

    
      debug(3, "*Avvio il bot*");
      bot.start(TEST_ONLY); // inizializza i canali e avvia il websocket
 


  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }




})();

//***************************************
