
import dotenv from 'dotenv';
import { debug, BotIooo, Linkedin, Wordpress, ChatGPTAssistant, AIManager, AISessionManager, ChatGptImageGenerator, PromptManager, TelegramInterface, Servizi, CanaliExtendsServizi, BotChat, LinkedinGPTAssistant, WordpressGPTAssistant} from "taffitools";
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
let assistantID = process.env.ASSISTANT_ID||""; 
const iftttKey = process.env.IFTTT_WEBHOOKKEY||"";
const IOOO = process.env.IOOO_WORDPRESS||"";

const TEST_ONLY: boolean = !!process.env['TEST_ONLY'] && process.env['TEST_ONLY'] !== "false";
if (TEST_ONLY) debug(2, "Sono in test e quindi faccio tutto senza pubblicare");


const categoryMapping:  { [key: string]: string } = {
  "*": "44",
};

const credenziali : Credenziali = {
iftttKey: iftttKey, 
test_only:TEST_ONLY,
botToken: botToken,
wordpress_sito: "https://iooo.ai",
wordpress_basic_auth: IOOO,
categoryMapping,

}



async function aggiornaServiziAssistenteAusiliario(assistantToUpdateID:string) {
     debug(2, "Configuro i servizi di un bot ausiliario");
 
    const serviziToUpdate = new Servizi();
    const sessionManagerToUpdate: AISessionManager = new AISessionManager();
    const aiManagerToUpdate = new AIManager(sessionManagerToUpdate);     
    const assistenteAIToUpdate : ChatGPTAssistant = new ChatGPTAssistant(chatGptApiKey, aiManagerToUpdate);
      serviziToUpdate.creaServizi([ "textedit_url_download"], credenziali); //"console_warn_shout",
      aiManagerToUpdate.setServizi(serviziToUpdate);  
      aiManagerToUpdate.setAssistant(assistenteAIToUpdate);
      assistenteAIToUpdate.setDefaultAssistantID(assistantToUpdateID);
   
     // const botToUpdate = new BotIooo(aiManager,sessionManager);
      await aiManagerToUpdate.uploadServiziToApi();
      debug(2, "Ho configurato i servizi di un bot ausiliario");
      process.exit(0);

    }







//await aggiornaServiziAssistenteAusiliario("asst_gQfO45QP2LdXwHyqw26Asu31");

let tags : TagProposti[] = [];
let feeds: TriggerProposti[] = [];
let news : TriggerProposti[] = [];



  news = [
    {
     hooks: ['Don Oreste Benzi'],
     categories: ["apg23"],
     lingua: "it"
    },
    ]; 


// ******************************** main **************************************

/**
 * Avvia il bot.
 */
(async () => {

  try {



    debug(3, "*Creo i canali*");

    const listaPromptFiles : Files = await PromptManager.getInstance().elencaFiles("yml");

    let sitoIooo = new WordpressGPTAssistant ("wordpress_iooo");

    const promptRichiestiSito = sitoIooo.requiredPrompts();
    type PromptIDSito = typeof promptRichiestiSito[number]["id"];


    const promptDisponibiliSito: Record<PromptIDSito, string> = {
      ripubblica_notizia: "rassegna_stampa",
      genera_titoli: "genera_titoli",
      genera_immagine: "genera_immagine",
    };


    sitoIooo
      .addContent({hooks: ["Don Oreste Benzi"], type:"news", flusso:"Instant"})
      //jn alternativa da provare     .addContent({categories: ["apg23"], flusso:"Instant" })
      .removeContent({hooks: ["fondazionedonorestebenzi.org"], type:"urls"})
      .setMyPrompts(promptDisponibiliSito, listaPromptFiles)
      .start(credenziali);

    //---------------


    let socialMarcoLinkedin = new LinkedinGPTAssistant ("linkedin_marcot");
    
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


     
debug (3, "*Definisco le classi AI*");
    
    const sessionManager: AISessionManager = new AISessionManager();
    const aiManager = new AIManager(sessionManager);
    const assistenteAI : ChatGPTAssistant = new ChatGPTAssistant(chatGptApiKey, aiManager)
                         .setDefaultAssistantID(assistantID);
    //const telegram = new TelegramInterface(botToken);
    const photoG = new ChatGptImageGenerator(chatGptApiKey);

    const servizi = new CanaliExtendsServizi();
      servizi.creaServizi(["console_info_log", "textedit_url_download"], credenziali); //"sendmail_generic_post"
    //  servizi.aggiungiServizio(socialMarcoLinkedin); //SE VOGLIO POTER UTILIZZARE UN CANALE ANCHE COME SERVIZIO
    await aiManager.setAssistant(assistenteAI)
                   .setServizi(servizi)
                   .setPhotoGenerator(photoG);

                //   .creaServiziPrevistiDallAssistenteOnline(credenziali); //crea tutti i servizi anche dalle firme lunghe, non va bene

      //    aiManager.uploadServiziToApi(["console_info_log", "textedit_url_download"]); //evito di caricare ad esempio console_info_shout




      debug (3, "*Definisco il bot*")

     const bot = new BotIooo(aiManager,sessionManager);

     debug (3, "*Aggiungo le inferfacce*")

     await bot.addDefaultInterfaces(credenziali);

     debug(3, "*Aggiungo i canali al bot*"); 
     bot.aggiungiCanali([sitoIooo, socialMarcoLinkedin], credenziali);//ritorna un this a servizi
     
    
    debug (3, "*Aggiungo le fonti e la conoscenza*");
    
      if (feeds.length>0) bot.addFeeds(feeds); //invia le fonti       
      if (news.length>0) bot.addNews(news); //invia le fonti       
      if (tags.length>0) bot.setKnowledge(tags); //passo le descrizioni dei miei tag e categorie
 

     debug (3, "*Aggiorno le funtions dell'assistente online*"); 
      await aiManager.uploadServiziToApi();

    
      debug(3, "*Avvio il bot*");
      bot.start(TEST_ONLY); // inizializza i canali e avvia il websocket
 


  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }




})();

//***************************************
