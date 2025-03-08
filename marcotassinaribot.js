
import { BotNews } from 'taffitools/src/bot/botnews.js';
import { ProcessManager } from 'taffitools/src/system/processmanager.js';
import { debug } from 'taffitools/src/utils/debug.js';
import { TagManager } from "taffitools/src/bot/tagmanager.js";
import { Linkedin } from "taffitools/src/api/linkedin.js";
import { ChatGPTAssistant } from "taffitools/src/ai/chatgptassistant.js";
import { ChatGptAIBot } from "taffitools/src/ai/chatgptaibot.js";
import { AIManager } from "taffitools/src/ai/aimanager.js";
import { ChatGptImageGenerator } from "taffitools/src/ai/chatgptimagegenerator.js";
import dotenv from 'dotenv';
 dotenv.config();


// IL CARICAMENTO DEI PROMPT DINAMICI DAL FILE E' GESTITO NELLA BOTCHAT.JS

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
  
const botToken = process.env.TELEGRAM_TAFFIBOT_TOKEN;
const chatGptApiKey = process.env.OPENAI_API_KEY;
const assistantID = process.env.ASSISTANT_ID; //l'assistente di questo bot. scelto Marco Tassinari
const iftttKey = process.env.IFTTT_WEBHOOKKEY;
const DEBUG_LEVEL = process.env.DEBUG_LEVEL;



const propmtLinkedin = {
  postLinkedin: 
{ prompt:
`Scrivi un post molto breve per la pagina personale su Linkedin di Marco Tassinari. Il post è costituito da una o due frasi e può esprimere un commento puntuale e sintetico sul testo dato. 
Lo stile deve essere empatico, colloquiale ed informale, scritto con vocaboli semplici e frasi brevi. Non usare punti esclamativi o toni enfatici, ma preferisci un testo in generale moderato, anche se a tratti impulsivo. 

Puoi scegliere un criterio fra questi per la scrittura del breve commento:

- Marco guada con speranza al futuro, alle novità con cui il genere umano costruirà un mondo più giusto ed umano in cui i propri figli potranno vivere in armonia e realizzare la pace. 
- Marco in generale ritiene che sia utile mettersi a capofitto a sperimentare sulle nuove possibilità offerte dalle recenti scoperte, dall'innovazione tecnologica e dai progressi dell'umanità, perché è necessario conoscerli per poterli controllare. 
- Marco è molto attento al rispetto dei diritti umani e alla libertà dell'individuo, cui le macchine devono rimanere sottomesse. In particolare le nuove tecnologie presentano rischi di omologazione della società, e possono essere utilizzate dai governi per stringere i controlli sulle persone e calare dall'alto decisioni. 
- Le nuove tecnologie rischiano di mettere a rischio le democrazie e di favorire i governi autoritari.
- Marco pensa che il cambiamento dei prossimi anni sarà repentino: ritiene che verrà trasformato repentinamente l'attuale flusso di notizie cui siamo abituali; soprattutto le fasce più fragili della popolazione dovranno dotarsi di strumenti nuovi per rimanere al passo.
- Marco ama le descrizioni tecnologiche. Programma in node.js su Linux Debian chiamando le API di ChatGpt e di molti altri servizi, realizzando bot in AI e creando soluzioni per l'automazione avanzata.
- Eventali altri punti di vista relativi alla biografia di Marco

Inizia subito con il commento senza preamboli od introduzioni, e taglia subito in maniera netta senza conclusioni o rimandi. 

Esempi: 
- Xiaomi ha presentato al MWC 2025 una serie di prodotti che dimostrano la loro forza e visione. Sono curioso di vedere come influenzeranno il nostro modo di informarci e interagire.
- Meta è un'ottima misura per velocità con cui i tempi cambiano, e anche Zuckemberg è pronto a lanciare la sua app generativa. Ogni giorno nel settore piovono novità a ritmo serrato, ma mi chiedo quanto stiano mettendo sempre più a rischio la nostra libertà e i nostri diritti di base. 
- Le nuove regole del Copyright Office degli USA sollevano un bel polverone nel mondo dell'arte e della creatività. L'idea che solo le opere con una "significativa creatività umana" possano essere protette ha implicazioni enormi.  
- L'energia che useranno i nostri figli sarà pulita: mi rincuora vedere ogni giorno sviluppi nelle conoscenze delle tecnologie da fusione nucleare. Il Tokamak italiano è firmato Enea. 
- I video POV generati dall'intelligenza artificiale stanno cambiando il modo in cui interagiamo con i contenuti visivi. Quanto tecnologie sostenute da miliardi di investimenti trasformeranno il nostro modo di vivere?
- L'Europa finirà in secondo piano? La crescente dipendenza dalle infrastrutture digitali americane evidenzia quanto sia urgente investire in un'autonomia tecnologica. Ci serve una strategia di innovazione che salvaguardi la libertà dell'individuo e la sovranità dei dati.
- OpenAI lancia il modello 5: lo aspettavamo tutti. Novità principale è la capacità di elaborazione parallela dei prompt, che supera il concetto di token cui eravamo abituati. Dico subito ai miei bot di testarla.
- Ci sono lavori che l'AI non farà mai: da domani, tutti pasticcieri!
`
},
params: {assistant_id: assistantID,} 
                };


const credenziali = {
iftttKey: iftttKey, 
}

class BotMarcoTassinari extends BotNews {

  /**
   * Crea un'istanza di MarcoTassinariBot.
   */
  constructor(botAI) {


debug (4, "chiamo il costruttore di botNews" ); 

super( botAI, botToken ); //crea un AITagManager on una lista di Canali, //ERA ASSISTANDID

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
    ProcessManager.getInstance().setup(this, DEBUG_LEVEL);
   
    debug(0,"Avvio il server...");
    debug(0, "debug level:", DEBUG_LEVEL);



    debug(2, "definisco il canale linkedin: ");
    let socialMarcoLinkedin = new Linkedin ("linkedin_marcot", credenziali) 
         .setClassificazioneRichiesta({
          includi: {  //se non specificato prende tutti   
           tags: ["intelligenza artificiale"],
           },
         })
        .setPrompts(propmtLinkedin);
  
    


        debug (2, "definisco il generatore di foto");
        const photoG = new ChatGptImageGenerator(chatGptApiKey);

    debug (2, "definisco l'assistenteAI")
    const assistenteAI = new ChatGPTAssistant(chatGptApiKey).setAssistantID(assistantID);
    debug (2, "definisco il managerAI")
    const managerAI = new AIManager(credenziali).setAssistant(assistenteAI).setPhotoGenerator(photoG).newCanali();
        await managerAI.aggiungiCanali([socialMarcoLinkedin]);//ritorna un this a servizi
        await managerAI.avviaServiziAssistente(); //ritorna un this a managerAI
    debug (2, "definisco il bot AI")
    const botAI = new ChatGptAIBot(botToken, managerAI); //POTREI INIZIALIZZARE QUI ASSISTANTID


    bot = new BotMarcoTassinari(botAI);

  //  bot.aggiungiCanali([socialMarcoLinkedin]); //aggiunge i contesti al dialogo attuale. Aggiunge la classificazione all'elenco canali.

    debug (2, "Aggiungo le fonti e la conoscenza");
    
      bot.addFonti(fonti); //invia le fonti        
     
      bot.setKnowledge(tagManager.getObject()); //passo le descrizioni dei miei tag e categorie
    
debug(2, "Avvio il bot!");

      bot.start(); // inizializza i canali e avvia il websocket
      debug(0,"Bot avviato!");



  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }

// bot.test(numerocanale); ABILITARE SE SERVE FARE UNA PROVA DI CANALE SENZA ASPETTARE



})();

//***************************************
