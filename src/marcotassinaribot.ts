
import dotenv from 'dotenv';
import { debug, BotIooo, Linkedin, Wordpress, ChatGPTAssistant, AIManager, AISessionManager, ProcedureManager,} from "taffitools";
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


/*
async function aggiornaServiziAssistenteAusiliario(assistantToUpdateID:string) {
     debug(2, "Configuro i servizi di un bot ausiliario");
 
    const serviziToUpdate = new Servizi();
    const sessionManagerToUpdate: AISessionManager = new AISessionManager();
    const aiManagerToUpdate = new AIManager(sessionManagerToUpdate);     
    const assistenteAIToUpdate : ChatGPTAssistant = new ChatGPTAssistant(aiManagerToUpdate);
      serviziToUpdate.creaServizi([ "textedit_url_download"], credenziali); //"console_warn_shout",
      aiManagerToUpdate.setServizi(serviziToUpdate);  
      aiManagerToUpdate.setAssistant(assistenteAIToUpdate);

      assistenteAIToUpdate.setDefaultAssistantID(assistantToUpdateID);
   
     // const botToUpdate = new BotIooo(aiManager,sessionManager);
      await aiManagerToUpdate.uploadServiziToApi();
      debug(2, "Ho configurato i servizi di un bot ausiliario");
      process.exit(0);

    }
*/
async function aggiornaServiziAssistenteAusiliario(assistantToUpdateID: string) {
  debug(2, "Configuro i servizi di un bot ausiliario");

  // Creo un nuovo session manager e AIManager
  const sessionManagerToUpdate = new AISessionManager();
  const aiManagerToUpdate = new AIManager({
    credenziali,
    sessionManager: sessionManagerToUpdate,
    //servizi: new Servizi(),
    apis: [
      {
        name: "assistant-aux",
        type: "chatgpt-assistants",
        client: "openai-prod",
        clientConfig: { type: "openai", apiKey: chatGptApiKey }
      }
    ]
  });

  // Creo l’assistente associato all’API già registrata nella factory
  const assistenteAIToUpdate = aiManagerToUpdate.getApi("assistant-aux") as ChatGPTAssistant;
  if (!assistenteAIToUpdate) throw new Error("API assistant non trovata");

  assistenteAIToUpdate.setDefaultAssistantID(assistantToUpdateID);

  // Creo e assegno i servizi   DA ABILITARE E PROVARE  E DEBUGGARE
 // const serviziToUpdate = new Servizi();
 // serviziToUpdate.creaServizi(["textedit_url_download"], credenziali);
 // aiManagerToUpdate.setServizi(serviziToUpdate);

  // Carica i servizi nell’API (metodo già presente in AIManager)
  //await aiManagerToUpdate.uploadServiziToApi();

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

    const procedureManager = new ProcedureManager();
    //const listaPromptFiles : Files = await PromptManager.getInstance().elencaFiles("yml");
    const listaPromptFiles : Files = await procedureManager.elencaFiles("yml");

    let sitoIooo = new Wordpress ("wordpress_iooo");

    const promptRichiestiSito = sitoIooo.requiredPrompts();
    type PromptIDSito = typeof promptRichiestiSito[number]["id"];


    const promptDisponibiliSito: Record<PromptIDSito, string> = {
      run: "genera_articolo_completo",
    //  genera_titoli: "genera_titoli",
    //  genera_immagine: "genera_immagine",
    };


    sitoIooo
      .addContent({hooks: ["Don Oreste Benzi"], type:"news", flusso:"Instant"})
      //jn alternativa da provare     .addContent({categories: ["apg23"], flusso:"Instant" })
      .removeContent({hooks: ["fondazionedonorestebenzi.org"], type:"urls"})
      .setMyPrompts(promptDisponibiliSito, listaPromptFiles)
      .start(credenziali);

    //---------------


    let socialMarcoLinkedin = new Linkedin ("linkedin_marcot");
    
    const promptRichiestiLinkedin = socialMarcoLinkedin.requiredPrompts();
    type PromptIDLinkedin = typeof promptRichiestiLinkedin[number]["id"];

    
    const promptDisponibiliLinkedin: Record<PromptIDLinkedin, string> = {
      run: "post_linkedin",
    };

    socialMarcoLinkedin
       .addContent({ hooks:["intelligenza artificiale"], categories:["intelligenza artificiale", "scienza"], type:"tags" , flusso:"RaggruppaSimili"})
       .setMyPrompts(promptDisponibiliLinkedin,listaPromptFiles)
       .start(credenziali);
    

   //tutto il resto


     
debug (3, "*Definisco le classi AI*");
    /*
    const sessionManager: AISessionManager = new AISessionManager();
    const aiManager = new AIManager(sessionManager);
    aiManager.clientManager.createClients({"openai":chatGptApiKey});

   // const assistenteAI : ChatGPTAssistant = new ChatGPTAssistant(chatGptApiKey, aiManager)
    const responseassistantAI : ChatGPTRespond = new ChatGPTRespond(aiManager)
                         .setDefaultAssistantID(assistantID);
 //                        .setDefaultAssistantID(assistantID);

    const photoG = new ChatGptImageGenerator(aiManager);

    const servizi= new CanaliExtendsServizi ();
    
      servizi.creaServizi(
            ["console_info_log", "textedit_url_download", "gestoredate_now_readClock"], 
            credenziali); //"sendmail_generic_post"
  //     aiManager.setAssistant(assistenteAI)
    
      aiManager.setAssistant(responseassistantAI)
                   .setServizi(servizi)
                   .setPhotoGenerator(photoG);
*/
// Creazione di AIManager con sessione, servizi e API
const aiManager = new AIManager({
  credenziali,
 // sessionManager: new AISessionManager(), //già fatto di default
 // servizi: new CanaliExtendsServizi(),  // già fatto di default
  apis: [
    {
      name: "response-assistant",
      type: "chatgpt-respond",
      client: "openai-prod",
      clientConfig: { type: "openai", apiKey: chatGptApiKey }
    },
    {
      name: "dall-e",
      type: "image-generator",             // tipo per ChatGptImageGenerator
      client: "openai-prod",               // riutilizza lo stesso client
      clientConfig: {                       // anche qui se vuoi creare un client separato
        type: "openai",
        apiKey: chatGptApiKey
      }
    }
    // puoi aggiungere altre API qui
  ]
});



// Se vuoi puoi impostare parametri di default per le API
aiManager.setDefaultParams({ 
  assistant_id: assistantID,
  tool_choice: "auto",
}, "response-assistant");


// Creazione dei servizi aggiuntivi !!!DA ABILITARE E DEBUGGARE!!!
aiManager.creaServizi(
  [ "sendmail_generic_send","console_info_log",  "gestoredate_now_readClock", "websearch_italia_low", "scraper_url_download"], 
);

// L'oggetto responseAssistant è già disponibile tramite il manager
//const responseAssistant = aiManager.getApi("response-assistant") as ChatGPTRespond;

// Ora puoi usare responseAssistant e photoManager direttamente
//const photoGenerator = aiManager.photoManager;


      debug (3, "*Definisco il bot*")

     const bot = new BotIooo(aiManager);


                   
   // FORSE NON SERVE  aiManager.aggiungiServizio(socialMarcoLinkedin); //SE VOGLIO POTER UTILIZZARE UN CANALE ANCHE COME SERVIZIO  
   
   //   aiManager.creaServiziPrevistiDallAssistenteOnline(credenziali); //crea tutti i servizi anche dalle firme lunghe, non va bene      
   //   aiManager.uploadServiziToApi(["console_info_log", "textedit_url_download"]); //evito di caricare ad esempio console_info_shout




     debug (3, "*Aggiungo le inferfacce*")

     await bot.addDefaultInterfaces(credenziali);

     debug(3, "*Aggiungo i canali al bot*"); 
     bot.aggiungiCanali([sitoIooo, socialMarcoLinkedin], credenziali); 
     
    
    debug (3, "*Aggiungo le fonti e la conoscenza*");
    
      if (feeds.length>0) bot.addFeeds(feeds); //invia le fonti       
      if (news.length>0) bot.addNews(news); //invia le fonti       
      if (tags.length>0) bot.setKnowledge(tags); //passo le descrizioni dei miei tag e categorie
 

     //debug (3, "*Aggiorno le funtions dell'assistente online*"); 
     // await aiManager.uploadServiziToApi();

    
      debug(3, "*Avvio il bot*");
      bot.start(TEST_ONLY); // inizializza i canali e avvia il websocket
 


  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }




})();

//***************************************
