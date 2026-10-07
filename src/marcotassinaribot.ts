
import dotenv from 'dotenv';
import { debug, BotIooo, AIManager, ServiceFactory, ProcessManager,} from "taffitools";
import type {TagProposti, TriggerProposti, Credenziali } from "taffitools";
import { CanaleExtendsServizio } from '../../libraries/taffitools/types/canali/canale.js';

 dotenv.config();

/**
 * La classe MarcoTassinariBot: l'avatar di Marco su Telegram
 */

/** descrizioni comandi per botfather
 *
 * (2026-09-29) Restano solo questi due: tutto il resto passa dalla chat con marcotassinari e dalle
 * sue conferme. Le altre procedure hanno il nome che inizia con "_" e non diventano comandi.
 *
start - Chiacchiero con te
help - Mi presento e ti spiego cosa so fare
 */
  
const botToken = process.env.TELEGRAM_TOKEN||"";
//const chatGptApiKey = process.env.OPENAI_API_KEY||"";
const iftttKey = process.env.IFTTT_WEBHOOKKEY||"";
//const IOOO = process.env.IOOO_WORDPRESS||"";
//const APG23 = process.env.APG23_WORDPRESS||"";

// Demo invio mail via Gmail API (vedi taffitools/src/api/googleapi.ts e
// taffitools/src/servizi/mailservice.ts, usate da data/services/sendmail_generic_post.yml).
const googleClientId = process.env.GOOGLE_CLIENT_ID||"";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET||"";
const googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN||"";

ProcessManager.getInstance().setDebugLevel(process.env.DEBUG_LEVEL);
ProcessManager.getInstance().setModalita(process.env.MODALITA); // reale | sicuro | simulato: senza, il bot non parte


/*
const categoryMapping:  { [key: string]: string } = {
  "*": "44",
};
*/

const credenziali : Credenziali = {  //sempre più inutili.... da rimuovere TODO. Usare i file di configurazione invece.
iftttKey: iftttKey,
googleClientId: googleClientId,
googleClientSecret: googleClientSecret,
googleRefreshToken: googleRefreshToken,
botToken: botToken as string,
//wordpress_sito: "https://iooo.ai",
//wordpress_sito: "https://www.apg23.org",
//wordpress_basic_auth: APG23,
//categoryMapping,

}




let tags : TagProposti[] = [];

let news : TriggerProposti[] = [];

let feeds: TriggerProposti[] = [{
  // FIX ALLA RADICE (2026-09-15, suggerito dall'utente): prima era la pagina tag HTML
  // (…Comunita-Papa-Giovanni-XXIII.html), scansionata scartando i link non pertinenti — un
  // rimedio fragile, sempre esposto a qualunque nuovo link "di contorno" la pagina aggiunga in
  // futuro (privacy_policy.pdf, condizioni_d_uso.pdf, mailto:, tel:, social, voci di menu erano
  // già finiti tutti nella Map dei candidati, vedi il bug corretto in questa stessa giornata).
  // Il sito espone anche il feed RSS reale allo stesso tag (…Comunita-Papa-Giovanni-XXIII.xml,
  // verificato: 60 <item> puliti, ciascuno con <link> a un vero articolo /news/<slug>.html).
  // FeedsManager (taffiserver) riconosce ".xml" e lo instrada al parser RSS vero (rss-parser),
  // un percorso strutturato e non alla scansione euristica dei tag <a> — niente più bisogno di
  // includiLink qui, esattamente come gli altri hook reali già a feed RSS (annabassi.com/feed/,
  // comunicazionenonviolenta.org/eventi/feed/, ecc., nessuno dei quali ha includiLink).
  hooks: ["https://www.semprenews.it/tag/Comunita-Papa-Giovanni-XXIII.xml"],
  categories: ["apg23"],
  lingua: "it",
  intervalloControllo: 3 * 60 * 60 * 1000, // 3 ore: fonte più dinamica della media, la ricontrollo più spesso del default del taffiserver
 },
 {
  // Pagina eventi di apg23.org (HTML statico, verificato): i singoli eventi sono link sotto
  // /eventi/, includiLink filtra via tutto il resto (paginazione, altre voci del menu).
  hooks: ["https://www.apg23.org/news-ed-eventi/?type=eventi"],
  categories: ["apg23"],
  includiLink: ["/eventi/"],
  lingua: "it",
  intervalloControllo: 24 * 60 * 60 * 1000, // una volta al giorno, come richiesto
 },
];

/*
  news = [
    {
     hooks: ['Don Oreste Benzi'],
     categories: ["apg23"],
     lingua: "it"
    },
    ]; 
*/

// ******************************** main **************************************

/**
 * Avvia il bot.
 */
(async () => {

  try {



    // I canali e i servizi del bot non si creano più qui a mano: sono i file di data/services con
    // `registraNelBot: true` (vedi bot.aggiungiServiziDaFile più sotto, e il commento in ciascun file per
    // il perché di ogni servizio). Quali agenti usano un servizio lo decidono i toolNames dei loro file.
    // Storico: sitoIooo (wordpress_iooo) e il caricamento "tradizionale" con new Wordpress/Linkedin e
    // setMyPrompts sono stati tolti il 2026-10-05, restano nella storia git.


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
  
    debug(3, "*Carico canali e servizi del bot dai file*");
     // Dal registro con risoluzione per azione (05/10/2026, TODO.md §9) l'ordine non conta più.
     await bot.aggiungiServiziDaFile(credenziali);


    debug (3, "*Aggiungo le fonti e la conoscenza*");
    
      if (feeds.length>0) bot.addFeeds(feeds); //invia le fonti
      if (news.length>0) bot.addNews(news); //invia le fonti
      if (tags.length>0) bot.setKnowledge(tags); //passo le descrizioni dei miei tag e categorie

     // Incremento 1 del modello di permessi (taffiserver/README.md): anagrafica in
     // taffiserver/data/bot/bot-marcotassinari.yml. Se MARCOTASSINARIBOT_TAFFISERVER_SEGRETO
     // non è impostato, il bot si registra comunque, senza verifica (comportamento invariato).
     if (process.env.MARCOTASSINARIBOT_TAFFISERVER_SEGRETO) bot.setSegreto(process.env.MARCOTASSINARIBOT_TAFFISERVER_SEGRETO);

     //debug (3, "*Aggiorno le funtions dell'assistente online*");
     // await aiManager.uploadServiziToApi();


      debug(3, "*Avvio il bot*");
      bot.start(); // inizializza i canali e avvia il websocket
 


  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }




})();

//***************************************
