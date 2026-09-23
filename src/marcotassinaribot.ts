
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
start - Chiacchiero con te
help - Mi presento e ti spiego cosa so fare
comunicatostampa - Scrivo un comunicato stampa
crea_evento - Creo un evento per il sito apg23


start - chiacchiera con Marco 
help - Mi presento e ti spiego cosa so fare
scrivi_articolo - Scrivo un nuovo articolo.
comunicato_stampa - Scrivo un comunicato stampa.
correggi_testo - Correggo un testo.
migliora_interviste - Miglioro un'intervista.
impagina_html - Preparo per la pubblicazione in html un articolo.
genera_titoli - Genero i titoli di un articolo per un portale online.
genera_descrizioni_foto - Genero i campi di descrizione per una foto per semprenews.
crea_evento - Creo un evento da pubblicare su semprenews.
genera_articolo_completo - genera un articolo per apg23
post_linkedin - scrivi un post sulla pagina linkedin di Marco T

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

const TEST_ONLY: boolean = !!process.env['TEST_ONLY'] && process.env['TEST_ONLY'] !== "false";
if (TEST_ONLY) debug(2, "Sono in test e quindi faccio tutto senza pubblicare");

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
test_only:TEST_ONLY,
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



    debug(3, "*Creo i canali*");
 const NotizieApg23 = await ServiceFactory.create("wordpress_apg23") as CanaleExtendsServizio;
// const NotizieApg23 = await ServiceFactory.create("ripubblicaconorchestratore") as CanaleExtendsServizio;

 NotizieApg23.start(credenziali);

// ripubblica_apg23 (CanaleFlusso): dal 2026-09-18 è l'unico percorso feed/chat per scrivere e
// pubblicare su apg23.org (vedi data/services/ripubblica_apg23.yml per lo storico completo
// della migrazione). NotizieApg23 (sopra) resta avviato e registrato: "run"/"post" restano
// metodi veri, richiamati internamente dagli step wordpress_scrivi/wordpress_pubblica, ma non
// più esposti come tool a sé in chat (vedi Wordpress.azioniNonEsposteAllAI in taffitools) — solo
// "elencaArticoli" resta raggiungibile direttamente da quell'istanza.
 const ripubblicaApg23Flusso = await ServiceFactory.create("ripubblica_apg23") as CanaleExtendsServizio;
 ripubblicaApg23Flusso.start(credenziali);

 

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

//const sitoIooo = await ServiceFactory.create("wordpress_iooo") as CanaleExtendsServizio;
//    sitoIooo.start(credenziali);

//const sitoIooo = await ServiceFactory.create("wordpress_apg23") as CanaleExtendsServizio;
//    sitoIooo.start(credenziali);

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


//--------------
// Canale generico (CanaleFlusso, vedi taffitools/src/canali/canaleflusso.ts): segue gli eventi
// apg23 e manda le mail di segnalazione/rilancio (vedi data/procedure/segnalazioneeventi.yml).
// I servizi "semplici" che il suo flusso chiama per firma (cercatesto, componimessaggio,
// sendmail) non sono canali: vanno registrati a parte con bot.aggiungiServizi, non con
// bot.aggiungiCanali, altrimenti uno step "servizio" della procedura non li troverebbe.
const segnalazioneEventiApg23 = await ServiceFactory.create("segnalazioneeventi_apg23") as CanaleExtendsServizio;
segnalazioneEventiApg23.start(credenziali);

const cercaTestoSemprenews = await ServiceFactory.create("cercatesto_semprenews");
cercaTestoSemprenews.start(credenziali);

const componiMessaggioLuccitelli = await ServiceFactory.create("componimessaggio_luccitelli");
componiMessaggioLuccitelli.start(credenziali);

const sendmailLuccitelli = await ServiceFactory.create("sendmail_luccitelli");
sendmailLuccitelli.start(credenziali);

const sendmailRedattori = await ServiceFactory.create("sendmail_redattori");
sendmailRedattori.start(credenziali);

// Notifica a Mattia (sitonews@apg23.org, cc marco@taffi.it) quando wordpress_apg23_pubblica
// (step invia_notifica_sitonews, vedi data/procedure/wordpress_apg23_invia.yml e
// wordpress_apg23_pubblica.yml) carica un articolo in bozza su apg23.org — stesso schema di
// componiMessaggioLuccitelli/sendmailLuccitelli qui sopra.
const componiMessaggioNotificaSitonews = await ServiceFactory.create("componimessaggio_notificasitonews");
componiMessaggioNotificaSitonews.start(credenziali);

const sendmailSitonews = await ServiceFactory.create("sendmail_sitonews");
sendmailSitonews.start(credenziali);


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
     bot.aggiungiCanali([socialMarcoLinkedin,NotizieApg23,segnalazioneEventiApg23,ripubblicaApg23Flusso], credenziali); //sitoIooo

     debug(3, "*Aggiungo i servizi semplici al bot*"); // non sono canali: niente feed/classificazione, solo azioni chiamabili per firma da uno step "servizio"
     bot.aggiungiServizi([cercaTestoSemprenews, componiMessaggioLuccitelli, sendmailLuccitelli, sendmailRedattori, componiMessaggioNotificaSitonews, sendmailSitonews]);


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
      bot.start(TEST_ONLY); // inizializza i canali e avvia il websocket
 


  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }




})();

//***************************************
