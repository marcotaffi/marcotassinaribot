
//import { BotChat } from 'TaffiTools/src/bot/botchat.js';
import { BotNews } from 'TaffiTools/src/bot/botnews.js';
//import { Canale } from 'TaffiTools/src/bot/canale.js';
import { ProcessManager } from 'TaffiTools/src/system/processmanager.js';
import { debug } from 'TaffiTools/src/utils/debug.js';
import { Servizi } from "TaffiTools/src/utils/servizi.js";
import { TagManager } from "TaffiTools/src/bot/tagmanager.js";
import { Linkedin } from "TaffiTools/src/api/linkedin.js";
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
    const assistantID = process.env.ASSISTANT_ID; //l'assistente di questo bot. scelto Marco Tassinari
    const iftttKey = process.env.IFTTT_WEBHOOKKEY;
   // const wordpressDipendenzeID = process.env.WORDPRESS_DIPENDENZE_ID


  const propmtLinkedin = {
    postLinkedin: { prompt:`Scrivi un post molto breve per la pagina personale su Linkedin di Marco Tassinari. Il post commenta il testo dato e che riferisce una notizia. 
                  Inizia subito con il commento senza preamboli od introduzioni, e taglia in maniera netta senza conclusioni o rimandi. 
                  Nel commentare tieni presente che Marco in generale ritiene che sia utile mettersi a capofitto a sperimentare sulle nuove possibilità offerte dalle recenti scoperte, dall'innovazione tecnologica e dai progressi dell'umanità, perché è necessario conoscerli per poterli controllare. 
                  Marco è molto attento al rispetto dei diritti umani e alla libertà dell'individuo, cui le macchine dovranno rimanere sottomesse. In particolare le nuove tecnologie presentano rischi di omologazione della società, che può essere utilizzata dai governi per stringere i controlli sulle persone, e calare dall'alto decisioni di cui le persone possono non essere consapevoli. 
                  Pensa che il cambiamento dei prossimi anni sarà repentino; per quanto riguarda le scienze dell'informazione, ritiene che verrà trasformato repentinamente l'attuale flusso di notizie cui siamo abituali; la democrazia dovrà trovare strumenti nuovi per rimanere al passo.`,
                   },
                   params: {assistant_id: assistantID,} 
                  };




//     let socialMarcoLinkedin = new Canale("linkedin_marcot_post","Marco Tassinari",iftttKey,chatGptApiKey)
  
const credenziali = {
  iftttKey: iftttKey,
}

let socialMarcoLinkedin = new Linkedin ("linkedin_marcot", credenziali) 
//definisco sia run che post. comunque chatgpt non lo troverà se non è definito nell'assistente. 
//sennò potrei definire solo linkedin_marcot_run

     .setClassificazioneRichiesta({
      includi: {  //se non specificato prende tutti   
       tags: ["intelligenza artificiale"],
       },
     })
    .setPrompts(propmtLinkedin);

  
    // servizi generici in uso al bot telegram: LI CARICO DALL'ASSISTENTE
   //let serviziPerMArco = new Servizi(["console_info_log", "textedit_url_download"],iftttKey ); //sevizi di esempio; mi passerò hookId. I servizi li saprò facendo una chiamata a chatgpt per sapere l'assistente cosa sa fare
     //serviziPerMArco.registraServizio(socialMarcoLinkedin.servizio);

      super(chatGptApiKey, assistantID, botToken, credenziali); 

    
this.aggiungiCanali([socialMarcoLinkedin]); //aggiunge i contesti al dialogo attuale


    }



}

// ******************************** main **************************************


const tagManager = new TagManager(
  ["famiglia", "solidarietà", "cultura", "mondo", "spiritualità", "ecologia integrale", "scienza", "cronaca"]  //categorie permesse
);

tagManager.addTags(
[]);

const fonti = [];


/**
 * Avvia il bot MarcoTassinariBot.
 */
(async () => {

let bot = null;

  try {
    const DEBUG_LEVEL = process.env.DEBUG_LEVEL;
    ProcessManager.getInstance().setup(this, DEBUG_LEVEL);
   
    debug(0,"Avvio il server...", process.env.DEBUG_LEVEL);
    debug(0, "debug level:", DEBUG_LEVEL);

    bot = new BotMarcoTassinari()
      .addFonti(fonti) //invia le fonti        
      .followFeeds(tagManager.getObject()); //passo le descrizioni dei miei tag e categorie; inizializza anche this.classificazioneRichiesta prendendola dai canali
    
      await bot.start(); // inizializza i canali e avvia il websocket
      console.log("Bot avviato!");



  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }

// bot.test(numerocanale); ABILITARE SE SERVE FARE UNA PROVA DI CANALE SENZA ASPETTARE



})();

//***************************************
