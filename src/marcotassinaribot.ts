
import dotenv from 'dotenv';
import { debug, BotIooo, Linkedin, Wordpress, ProcedureManager, AISessionManager, AIManager, TelegramInterface, ServiceFactory, ProcessManager,} from "taffitools";
import type {TagProposti, TriggerProposti, Credenziali, Files, ChatGPTAssistant } from "taffitools";
import { CanaleExtendsServizio } from '../../libraries/taffitools/types/canali/canale.js';

 dotenv.config();

/**
 * La classe MarcoTassinariBot: l'avatar di Marco su Telegram
 */

/** descrizioni comandi per botfather

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
genera_articolo_completo - genera un articolo per apg23
post_linkedin - scrivi un post sulla pagina linkedin di Marco T

 */
  
const botToken = process.env.TELEGRAM_TOKEN||"";
const chatGptApiKey = process.env.OPENAI_API_KEY||"";
let assistantID = process.env.ASSISTANT_ID||""; 
const iftttKey = process.env.IFTTT_WEBHOOKKEY||"";
const IOOO = process.env.IOOO_WORDPRESS||"";

ProcessManager.getInstance().setDebugLevel(process.env.DEBUG_LEVEL);

const TEST_ONLY: boolean = !!process.env['TEST_ONLY'] && process.env['TEST_ONLY'] !== "false";
if (TEST_ONLY) debug(2, "Sono in test e quindi faccio tutto senza pubblicare");


const categoryMapping:  { [key: string]: string } = {
  "*": "44",
};

const credenziali : Credenziali = {
iftttKey: iftttKey, 
test_only:TEST_ONLY,
botToken: botToken as string,
wordpress_sito: "https://iooo.ai",
wordpress_basic_auth: IOOO,
categoryMapping,

}




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


//CARICAMENTO TRADIZIONALE

    /*  
        const procedureManager = new ProcedureManager();
    //const listaPromptFiles : Files = await PromptManager.getInstance().elencaFiles("yml");

    const listaPromptFiles : Files = await procedureManager.elencaFiles("yml");

    let sitoIooo = new Wordpress ("wordpress_iooo");

    const promptRichiestiSito = sitoIooo.requiredPrompts();
    type PromptIDSito = typeof promptRichiestiSito[number]["id"];


    const promptDisponibiliSito: Record<PromptIDSito, string> = {
      run: "genera_articolo_completo",
    };


    sitoIooo
      .addContent({hooks: ["Don Oreste Benzi"], type:"news", flusso:"Instant"})
      //jn alternativa da provare     .addContent({categories: ["apg23"], flusso:"Instant" })
      .removeContent({hooks: ["fondazionedonorestebenzi.org"], type:"urls"})
      .setMyPrompts(promptDisponibiliSito, listaPromptFiles)
      .start(credenziali);
*/

//----------
//CARICAMENTO MODERNO

const sitoIooo = await ServiceFactory.create("wordpress_iooo") as CanaleExtendsServizio;
    sitoIooo.start(credenziali);

    //---------------
//CARICAMENTO TRADIZIONALE
/*
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
  */  
//--------------
//CARICAMENTO MODERNO
const socialMarcoLinkedin = await ServiceFactory.create("linkedin_marcot_post") as CanaleExtendsServizio;

// Non serve più definire manualmente promptDisponibiliLinkedin
// Li prende dalla config
socialMarcoLinkedin.start(credenziali);

// La classificazione e i contenuti già vengono caricati dalla factory


//-------------
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

//const apiManager = await AIApiConfigManager.creaApiManagerDaCartelleLocali(aiManager);

const aiManager = new AIManager(credenziali);
    // socialMarcoLinkedin.setManagerAI(aiManager); 
    // sitoIooo.setManagerAI(aiManager); 

await aiManager.creaApiDaCartelleLocali(); //costruisce i servizi dai file degli agenti


// Creazione dei servizi aggiuntivi 
//LO SOSPENDO PERCHE' LO FACCIO NEL FILE DELL'AGENT
//aiManager.creaServizi(
//  [ "sendmail_generic_send","console_info_log",  "gestoredate_now_readClock",  "scraper_url_download", "websearch_italia_low"], //"websearch_italia_low",
//);

// L'oggetto responseAssistant è già disponibile tramite il manager
//const responseAssistant = aiManager.getApi("response-assistant") as ChatGPTRespond;

// Ora puoi usare responseAssistant e photoManager direttamente
//const photoGenerator = aiManager.photoManager;


      debug (3, "*Definisco il bot*")

     const bot = new BotIooo(aiManager, "marcotassinari");


                   
   // FORSE NON SERVE  aiManager.aggiungiServizio(socialMarcoLinkedin); //SE VOGLIO POTER UTILIZZARE UN CANALE ANCHE COME SERVIZIO  
   
   //   aiManager.creaServiziPrevistiDallAssistenteOnline(credenziali); //crea tutti i servizi anche dalle firme lunghe, non va bene      
   //   aiManager.uploadServiziToApi(["console_info_log", "textedit_url_download"]); //evito di caricare ad esempio console_info_shout




     debug (3, "*Aggiungo le inferfacce*")


     
     //await bot.addDefaultInterfaces(credenziali);

     // Aggiunge l'interfaccia e registra i comandi da file
    // prendo i comandi dalla cartella data/procedure: 'genera_articolo_completo', 'post_linkedin'
    // nota, i tools sono definiti nel file dell'agente e qui posso definire anche i tools usati dai canali.
    // potrei definire una procedura comunicato_stampa mentre il tool comunicato_stampa non è definito in taffitools. 
    // potrei definire allora un servizio comunicato_stampa 


    // probabilmente un canale può contenere un servizio di tipo EseguiProcedura, eseguito dalla Run come Redazione 
    // esegue un servizio di tipo Mail. EseguiProcedura poi sarebbe un servizio che potrei usare come tool. 

     //però forse devo creare un nuovo tipo di step che non prenda in ingresso niente ma per toamdni telegram


    await bot.aggiungieInizializzaInterfaccePredefinite(credenziali); 
  
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
