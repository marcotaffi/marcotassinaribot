
import dotenv from 'dotenv';
import { debug, BotNews, ProcessManager, Linkedin, ChatGPTAssistant, ChatGptAIBot, AIManager, ChatGptImageGenerator  } from "taffitools";
import type {Trigger, TagProposti, TriggerProposti, Credenziali, PromptArticolo} from "taffitools";

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
  
const botToken = process.env.TELEGRAM_TOKEN||"";
const chatGptApiKey = process.env.OPENAI_API_KEY||"";
const assistantID = process.env.ASSISTANT_ID||""; //l'assistente di questo bot. scelto Marco Tassinari
const iftttKey = process.env.IFTTT_WEBHOOKKEY||"";
const DEBUG_LEVEL = process.env.DEBUG_LEVEL||6;
const TEST_ONLY: boolean = !!process.env['TEST_ONLY'] && process.env['TEST_ONLY'] !== "false";
if (TEST_ONLY) debug(2, "Sono in test e quindi faccio tutto senza pubblicare");


const propmtLinkedin : PromptArticolo = {
  postLinkedin: { prompt:
`Scrivi un post discorsivo e molto breve per la pagina personale su Linkedin di Marco Tassinari. Il post è costituito da due o tre frasi e spiega in maniera semplice la notizia data. Può pure commentare la notizia. 
Lo stile deve essere empatico, colloquiale ed informale: meglio i vocaboli semplici e le frasi brevi. Non mi piacciono i punti esclamativi o i toni enfatici; belli i testi moderati, anche se a tratti impulsivi. 

Ecco alcuni criteri per la scrittura del commento:

- Marco guarda con speranza al futuro, un mondo in cui i figli potranno vivere in armonia e realizzare la pace. 
- Bisogna mettersi a capofitto a sperimentare, viste le possibilità offerte dalle recenti scoperte, dall'innovazione tecnologica e dai progressi dell'umanità: bisogna conoscerli per poterli controllare. 
- Occhio al rispetto dei diritti umani e alla libertà dell'individuo: le macchine devono rimanere sottomesse. Le nuove tecnologie presentano rischi di omologazione della società, e possono essere utilizzate dai governi per stringere i controlli sulle persone: è questo il mondo che vogliamo? 
- Le nuove tecnologie rischiano di mettere a rischio le democrazie e di favorire i governi autoritari.
- Marco pensa che il cambiamento dei prossimi anni sarà repentino: l'attuale flusso di notizie cui siamo abituali cambierà di brutto; le fasce più fragili della popolazione dovranno dotarsi di strumenti nuovi per rimanere al passo.
- Marco ama le descrizioni tecnologiche. Programma in node.js su Linux Debian chiamando le API di ChatGpt e di molti altri servizi, realizzando bot in AI e creando soluzioni per l'automazione avanzata.
- Usa pure elemnti della biografia di Marco.

Inizia subito con il commento senza preamboli od introduzioni, e taglia subito in maniera netta senza conclusioni o rimandi. 
`,
params: {assistant_id: assistantID} 
}};

/*

Esempi: 
- Xiaomi ha presentato al MWC 2025 una serie di prodotti che dimostrano la loro forza e visione. Molto interessanti soprattutto i nuovi occhiali in grado di fare traduzioni automatiche. Sono curioso di vedere come influenzeranno il nostro modo di informarci e interagire.
- Meta è un'ottima misura per velocità con cui i tempi cambiano, e anche Zuckemberg è pronto a lanciare la sua app generativa. Si chiama MetaAI ed elabora testi usando il motore DeepSeek, realizzato in Cina. Ogni giorno nel settore piovono novità a ritmo serrato, ma mi chiedo quanto stiano mettendo sempre più a rischio la nostra libertà e i nostri diritti di base. 
- Le nuove regole del Copyright Office degli USA sollevano un bel polverone nel mondo dell'arte e della creatività. Prevedono di multare chi usa l'intelligenza artificiale senza citare le fonti. L'idea che solo le opere con una "significativa creatività umana" possano essere protette ha implicazioni enormi.  
- L'energia che useranno i nostri figli sarà pulita: mi rincuora vedere ogni giorno sviluppi nelle conoscenze delle tecnologie da fusione nucleare. La fusione del plasma è possibile grazie all'idrogeno inserito nei reattori; il Tokamak italiano è firmato Enea. 
- I video POV generati dall'intelligenza artificiale stanno cambiando il modo in cui interagiamo con i contenuti visivi. ChatGPT ha pubblicato Sora, disponibile a pagamento da giovedì. Quanto tecnologie sostenute da miliardi di investimenti trasformeranno il nostro modo di vivere?
- L'Europa finirà in secondo piano? La Presidente Von Der Leyen ne ha parlato a 500 parlamentari esprimendo preoccupazione per i nuovi dazi. La crescente dipendenza dalle infrastrutture digitali americane evidenzia quanto sia urgente investire in un'autonomia tecnologica. Ci serve una strategia di innovazione che salvaguardi la libertà dell'individuo e la sovranità dei dati.
- OpenAI lancia il modello 5: lo aspettavamo tutti. Novità principale è la capacità di elaborazione parallela dei prompt, che supera il concetto di token cui eravamo abituati. Dico subito ai miei bot di testarla.
- Ci sono lavori che l'AI non farà mai: da domani, tutti pasticcieri! Mi vien da pensare questo quando scrpro che il mio computer ha iniziato a lavorare da solo grazie all'AI di Apple. Vi aspetto con un pasticcino!
- Ieri sono sceso dalla mia canoa, insieme a mia figlia, e ho pensato: chissà se le stelle resteranno al loro posto a lungo? Il positrone scoperto al Cern apre strade fino ad oggi impensabili.
*/

const credenziali : Credenziali = {
iftttKey: iftttKey, 
test_only:TEST_ONLY,
}

class BotMarcoTassinari extends BotNews {

  /**
   * Crea un'istanza di MarcoTassinariBot.
   */
  constructor(botAI:any) {


debug (4, "chiamo il costruttore di botNews" ); 

super( botAI, botToken ); //crea un AITagManager on una lista di Canali, //ERA ASSISTANDID

    }



}

// ******************************** main **************************************







let tags : TagProposti[] = [];
let feeds: TriggerProposti[] = [];
let news : TriggerProposti[] = [];


/**
 * Avvia il bot MarcoTassinariBot.
 */
(async () => {

  try {
    ProcessManager.getInstance().setup(this, DEBUG_LEVEL);
   
    debug(0, "debug level:", DEBUG_LEVEL);


    debug(2, "Creo i canali: ");

    let socialMarcoLinkedin = new Linkedin ("linkedin_marcot", credenziali) 
       .addContent({ hooks:["intelligenza artificiale"], categories:["intelligenza artificiale", "scienza"], type:"tags" , flusso:"RaggruppaSimili"})
       .setPrompts(propmtLinkedin);
    

       
    debug (3, "definisco l'assistenteAI")
    const assistenteAI = new ChatGPTAssistant(chatGptApiKey).setDefaultAssistantID(assistantID);
    debug (3, "definisco il managerAI")
    const managerAI = new AIManager(credenziali)
     .setAssistant(assistenteAI)
     .newCanali();
     
     debug (3, "definisco il bot AI")
     const botAI = new ChatGptAIBot(botToken, managerAI); //POTREI INIZIALIZZARE QUI ASSISTANTID
     const bot = new BotMarcoTassinari(botAI);

     debug(2, "Aggiungo i canali al bot"); 

     await bot.aggiungiCanali([socialMarcoLinkedin]);//ritorna un this a servizi

     await managerAI.avviaServiziAssistente(); //ritorna un this a managerAI
    


  //  bot.aggiungiCanali([socialMarcoLinkedin]); //aggiunge i contesti al dialogo attuale. Aggiunge la classificazione all'elenco canali.

    debug (2, "Aggiungo le fonti e la conoscenza");
    
     
      if (feeds.length>0) bot.addFeeds(feeds); //invia le fonti       
      if (news.length>0) bot.addNews(news); //invia le fonti       
      if (tags.length>0) bot.setKnowledge(tags); //passo le descrizioni dei miei tag e categorie
 

    
debug(3, "Avvio il bot!");

      bot.start(TEST_ONLY); // inizializza i canali e avvia il websocket
      debug(0,"Bot avviato!");



  } catch (error) {
    debug(1,`Errore nell'avvio del bot Marco Tassinari:`, error);
  }

// bot.test(numerocanale); ABILITARE SE SERVE FARE UNA PROVA DI CANALE SENZA ASPETTARE



})();

//***************************************
