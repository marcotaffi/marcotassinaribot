
//import { BotChat } from 'TaffiTools/src/bot/botchat.js';
import { BotNews } from 'TaffiTools/src/bot/botnews.js';
import { Canale } from 'TaffiTools/src/bot/canale.js';
import { ProcessManager } from 'TaffiTools/src/system/processmanager.js';
import { debug } from 'TaffiTools/src/utils/debug.js';
import { Servizi } from "TaffiTools/src/utils/servizi.js";
import { TagManager } from "TaffiTools/src/bot/tagmanager.js";

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
    const assistantID = process.env.ASSISTANT_ID; //l'assistente di questo bot
    const iftttKey = process.env.IFTTT_WEBHOOKKEY;
   // const wordpressDipendenzeID = process.env.WORDPRESS_DIPENDENZE_ID

 
   const promptsArticolo = {
        ripubblicaNotizia: { prompt:`Devi scrivere il testo di un articolo giornalistico di approfondimento di una notizia, senza titolo, partendo da uno o più articoli dati. 
          Voglio un testo lungo: individua la notizia di interesse e usa tutto il materiale pertinente che ti viene fornito per raccontare il fatto, comprendendo i dati, le citazioni, le storie e gli esempi dati. 
        Cambia l'attacco e modifica l'ordine dei contenuti per raggruppare i temi simili, seguendo queste indicazioni: 
        - Inizia direttamente dal testo dell'articolo raccontando a piramide invertita con le 5W del giornalismo la notizia principale; 
        - Evita di ripetere le frasi date, ma modificale utilizzando sinonimi per adeguare il tono di voce allo stile sobrio e moderato di semprenews.it; 
        - Preferisci i verbi attivi, contenuti certi e ben definiti, frasi brevi;
        - Mantieni le dichiarazioni originali dette dai protagonisti in prima persona, fra virgolette « »; 
        - Dove necessario, circa a metà articolo, aggiungi diciture simili a queste: "come spiega [Nome Testata](url):", "Leggi anche [Nome Testata](url)", "secondo i dati riportati da [Nome Testata](url)". 
        - Alla fine chiudi l'articolo bruscamente senza conclusioni o commenti.
        
        Istruzioni di formattazione html: utilizza <b> per sottolineare i concetti importanti e i nomi propri, <i> per nomi di eventi, progetti, enti, inserisci uno o due titoli intermedi formattati in <h2>. 
        Alla fine chiudi l'articolo di netto, senza inserire commenti e conclusioni.`,

        params: {assistant_id:"asst_bHDl6nBPLhF6AyBVddSlnl7C"}
        },
    
        scriviTitoli: { prompt:`Devi generare dei titoli in formato JSON per il portale online semprenews.it, per l'articolo dato, per invogliare alla lettura e aiutare il lettore a comprendere gli elementi chiave. 
        Sono richiesti: titolo, occhiello, sommario, SEO title, SEO description. 
        Il titolo principale deve essere molto breve; contiene una citazione oppure un soggetto ed un verbo ed introdurre uno degli aspetti curiosi e popolari dell'articolo. Nell'occhiello e nel sommario spiega meglio la notizia e verranno introduci i temi trattati. 
        I titoli SEO comprendono la parola chiave principale e servono per il posizionamento, invogliando al click.
        Voglio i titoli scritti come testo normale senza altre formattazioni. Esempio: "Biden:«La guerra è finita»"`,
          params: {assistant_id:"asst_3ivJI6e7wqnQ4rPaGUe1HwoZ"}    
            }
    };

  const propmtLinkedin = {
    postLinkedin: { prompt:`Scrivi un post molto breve per la pagina personale su Linkedin di Marco Tassinari. Il post commenta il testo dato e che riferisce una notizia. 
                  Inizia subito con il commento senza preamboli od introduzioni, e taglia in maniera netta senza conclusioni o rimandi. 
                  Nel commentare tieni presente che Marco in generale ritiene che sia utile mettersi a capofitto a sperimentare sulle nuove possibilità offerte dalle recenti scoperte, dall'innovazione tecnologica e dai progressi dell'umanità, perché è necessario conoscerli per poterli controllare. 
                  Marco è molto attento al rispetto dei diritti umani e alla libertà dell'individuo, cui le macchine dovranno rimanere sottomesse. In particolare le nuove tecnologie presentano rischi di omologazione della società, che può essere utilizzata dai governi per stringere i controlli sulle persone, e calare dall'alto decisioni di cui le persone possono non essere consapevoli. 
                  Pensa che il cambiamento dei prossimi anni sarà repentino; per quanto riguarda le scienze dell'informazione, ritiene che verrà trasformato repentinamente l'attuale flusso di notizie cui siamo abituali; la democrazia dovrà trovare strumenti nuovi per rimanere al passo.`,
                   },
                   params: {} 
                  };

    //   let sitoDipendenze = new Canale("wordpress_dipendenzepatologiche.apg23.org_creaArticolo", wordpressDipendenzeID, "https://dipendenzepatologiche.apg23.org",chatGptApiKey);
   
      let sitoSempreEcologia = new Canale("sendmail_redazionesempre_mailto","marcotassinari@apg23.org",iftttKey, chatGptApiKey)
              .setClassificazioneRichiesta({
                 includi: {  //se non specificato prende tutti  
                  tags: ["economia","ambiente"],
                  categorie: ["ambiente"], // gruppi di tag
                  rubriche: ["ecologia integrale"], //provenienti dai feed
             //     fonti: ["ansa.it"]   //TODO MIGLIORARE PERCHE ORA SERVE URL COMPLETO E NON SO SE VA
                  },
                 escludi: { //se non specificato non esclude nulla 
                  fonti: ["semprenews.it"],    
                  lingue: ["en"],            
                 }
                })
              .setPrompts(promptsArticolo);

      let sitoSempreMondo = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["pace","migranti","volontariato","diritti umani"],
         categorie: ["mondo"], // gruppi di tag
         rubriche: ["mondo"], //provenienti dai feed
         },
        escludi: { //se non specificato non esclude nulla 
         fonti: ["semprenews.it"],    
         lingue: ["en"],            
        }
       })
     .setPrompts(promptsArticolo);





      let sitoSempre_ChiaraBonetto = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["salute", "religione", "tecnologia", "giustizia", "rom","alimentazione","missioni", "dipendenze",  "strada"],
         },
       })
     .setPrompts(promptsArticolo);


    
    
      let sitoSempreFamiglia = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["disabilità","educazione","infanzia", "salute","famiglia","vita","affido"],
         },
       })
     .setPrompts(promptsArticolo);
  
      
      let sitoSempreCultura = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["politica", "spettacoli", "religione"],
         },
       })
     .setPrompts(promptsArticolo);

      let sitoSempreScienza = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["intelligenza artificiale", "fisica quantistica"],
         },
       })
     .setPrompts(promptsArticolo);


      let sitoSempre_IreneCiambezi = new Canale("sendmail_redazionesempre_mailto", "marcotassinari@apg23.org",iftttKey,chatGptApiKey)
      .setClassificazioneRichiesta({
        includi: {  //se non specificato prende tutti  
         tags: ["prostituzione"],
         },
       })
     .setPrompts(promptsArticolo);



      //   let sitoSempreSpiritualità = new Canale("sendmail_redazionesempre_mailto", "nicolettapasqualini@apg23.org",iftttKey,chatGptApiKey);
   //    let socialMarcoLinkedin = new Canale("linkedin_marcot_post", "Marco Tassinari",iftttKey,chatGptApiKey);


//        sitoSempreEcologia


  //     sitoSempreSpiritualità.setClassificazioneRichiesta(["religione"]).setPrompts(prompts);
    //   socialMarcoLinkedin.setClassificazioneRichiesta(["scienza", "intelligenza artificiale"]).setPrompts(prompts);


/*       sitoSempreSolidarietà.setClassificazioneRichiesta(["dipendenze", "giustizia", "disabilità", "educazione"]);
       sitoSempre.setClassificazioneRichiesta(["politica", "sport", "pace", "economia", "infanzia", "religione"]).setAuto().setPrompts(prompts);
  */
      // servizi generici
      // let serviziPerMArco = new Servizi (["sendmail_root" , "sendmail_generic", "googledrive_filetest", "console_info_log",  "textedit_url_download"], process.env.IFTTT_WEBHOOKKEY ); //sevizi di esempio; mi passerò hookId. I servizi li saprò facendo una chiamata a chatgpt per sapere l'assistente cosa sa fare
      let serviziPerMArco = new Servizi (["console_info_log", "textedit_url_download", "googledrive_filetest"], process.env.IFTTT_WEBHOOKKEY ); //sevizi di esempio; mi passerò hookId. I servizi li saprò facendo una chiamata a chatgpt per sapere l'assistente cosa sa fare

      serviziPerMArco.registraServizio(sitoSempreEcologia.servizio); //aggiungo questi due servizi: pubblicazione sui canali
      serviziPerMArco.registraServizio(sitoSempreMondo.servizio);
      serviziPerMArco.registraServizio(sitoSempre_ChiaraBonetto.servizio);
      serviziPerMArco.registraServizio(sitoSempreFamiglia.servizio);
      serviziPerMArco.registraServizio(sitoSempreCultura.servizio);
      serviziPerMArco.registraServizio(sitoSempreScienza.servizio);
      serviziPerMArco.registraServizio(sitoSempre_IreneCiambezi.servizio);

    //  serviziPerMArco.registraServizio(socialMarcoLinkedin.servizio);

//- Nota: tutti questi servizi devono essere già presenti nell'assistente

      super(chatGptApiKey, assistantID, botToken, serviziPerMArco ); 

    
this.aggiungiCanali([sitoSempreEcologia,sitoSempreMondo,sitoSempre_ChiaraBonetto,sitoSempreFamiglia,sitoSempreCultura, sitoSempreScienza, sitoSempre_IreneCiambezi]); //aggiunge i contesti al dialogo attuale
//this.aggiungiCanali([socialMarcoLinkedin]); //aggiunge i contesti al dialogo attuale


    }



}

// ******************************** main **************************************


const tagManager = new TagManager(
  ["famiglia", "solidarietà", "cultura", "mondo", "spiritualità", "ecologia integrale", "scienza", "cronaca"]  //categorie permesse
);

//risultato = tagManager.getObject();


tagManager.addTags(
[ 
  /*
  { tag: "infanzia", categorie: ["famiglia"], descrizioni: { it: "Argomenti che riguardano i bambini, la loro crescita, l'educazione, la salute, i diritti e la protezione, con particolare attenzione ai minori vulnerabili. Accoglienza di minori più piccoli, fra i 0 e i 6 anni, inseriti negli asili nido e nelle scuole dell'infanzia, anche in affido."} },
  { tag: "volontariato", categorie: ["solidarietà"], descrizioni: { it:  "Attività svolte da volontari per aiutare la comunità, sostenere gruppi in difficoltà, promuovere l'inclusione sociale e partecipare a iniziative solidali."} },
  { tag: "educazione", categorie: ["famiglia"], descrizioni: { it: "Temi legati all'insegnamento, alla scuola, all'apprendimento, alla formazione professionale e all'accesso all'istruzione per tutte le fasce d'età. La pedagogia moderna propone agli insegnanti di non utilizzare i voti nella valutazione degli alunni e degli studenti." }},
  { tag: "politica", categorie: ["cultura", "cronaca"], descrizioni: { it:  "Commissione Ue: in Parlamento, alla Camera dei Deputati e al Senato, la maggioranza di sindaci sostiene l'opposizione in politica nazionale. Le votazioni in commissione e nelle elezioni dei partiti, di centro-destra e di sinistra, hanno deciso lo stanziamento dei fondi per un accordo di parte. Il Presidente del Consiglio nelle istituzioni europee i contributi del Presidente della Repubblica e del voto in Consiglio dei Ministri portano a decisioni legislative rilevanti. Duri i commenti politici dei leader delle coalizioni, mentre il premier regionale appoggia il Governo uscente." }},
  { tag: "pace", categorie: ["mondo"], descrizioni: { it:  "Esplodono i combattimenti che reprimono il dissenso: promozione della pace con mine antiuomo, droni e truppe; risoluzione dei conflitti, iniziative contro la guerra e mediazione internazionale. Il dittatore del regime ha inviato droni sulle basi militari prese d'assalto, missili e bombe provocano morte e distruzione; manifestazioni nella nonviolenza contro le armi atomiche. Militari nelle piazze chiedono il cessate il fuoco." }},
  { tag: "migranti", categorie: ["solidarietà"], descrizioni: { it:  "Argomenti legati alle migrazioni, alle politiche di accoglienza, alle crisi umanitarie, al traffico di esseri umani e ai diritti dei rifugiati. Nei campi profughi MSNA viaggiano soli a volte trafficati nei gommoni sul mare Mediterraneo o attraverso i balcani. Dal Messico agli Stati Uniti persone in fuga trovano un muro." }},
  { tag: "ambiente", categorie: ["ecologia integrale"], descrizioni: { it:  "Temi legati alla sostenibilità, alla protezione dell'ambiente, ai cambiamenti climatici e alla gestione responsabile delle risorse naturali. Le foreste che respirano trasformano l'ossigeno e l'energia in acqua pura e in paesaggi verdi ed incontaminati quando l'inquinamento non distrugge gli ambienti naturali." }},
  { tag: "diritti umani", categorie: ["solidarietà"], descrizioni: { it:  "Argomenti legati alla tutela dei diritti fondamentali, all'uguaglianza, alla lotta contro le discriminazioni e alla giustizia sociale." }},
  { tag: "salute", categorie: ["cultura"], descrizioni: { it:  "Articoli sulle mammografie e gli esami istologici dalle aziende sanitarie riguardanti la salute pubblica, il benessere fisico e mentale del sangue, le politiche sanitarie e le iniziative mediche riguardo al cuore e ai polmoni. Secondo l'Ulss 1 in ospedale e nelle ASL, nelle cliniche pubbliche e private, medici, infermieri e pediatri praticano cure olistiche o prescrivono farmaci per il benessere della persona." }},
//attenzione la segurente mi aggiunge solidarietà ad articolo con accuse a salvini
  { tag: "giustizia", categorie: ["solidarietà", "cronaca"], descrizioni: { it:  "Misure alternative alla detenzione: l'avvocato della procura, sentito il parere legale, ha consultato il giudice per condannare l'imputato alla pena di anni 2 ma la requisitoria del prefetto porta il caso alla corte costituzionale e la sentenza potrà essere impugnata. Sul posto è interventuta la polizia. Il GIP, sentito il Pubblico Ministero, preferisce portarlo in tribunale, sentito il parere legale del Ministro di Grazia e Giustizia." }},
  { tag: "spettacoli", categorie: ["cultura"], descrizioni: { it:  "Lo spettacolo artistico in esposizione nei padiglioni della mostra prevede momenti di musica, ballo, teatro, cinema e che ospiterà l'autore, porta sul palco e mette in scena la performance visiva di arte astratta con gli artisti della Scala. Il concerto è tratto dall'album pubblicato e già distribuito. Alla rappresentazione parteciperà il famoso musicista e compositore invitato per l'evento, con aperi-cena." }},
  { tag: "disabilità", categorie: ["famiglia"], descrizioni: { it:  "Approfondimenti sulla tutela dei diritti delle persone con disabilità fisiche, intellettive o sensoriali, e sul loro accesso all’istruzione, al lavoro e ai servizi pubblici. Particolare attenzione è data a iniziative di abbattimento delle barriere architettoniche, alle tecnologie assistive come software vocali e ausili motori, e alle testimonianze di persone che affrontano ogni giorno queste sfide." }},
  { tag: "dipendenze", categorie: ["solidarietà"], descrizioni: { it:  "Tematiche relative alle dipendenze da alcol, droghe, gioco d’azzardo e tecnologia, con approfondimenti sui percorsi di riabilitazione e prevenzione. Include dati statistici sulle fasce di popolazione più a rischio, descrizioni di campagne di sensibilizzazione promosse da enti locali e nazionali, e interviste a esperti di psichiatria e psicoterapia che trattano queste patologie." }},
  { tag: "economia", categorie: ["ecologia integrale"], descrizioni: { it:  "Tematiche economiche, finanziarie, di mercato, innovazione tecnologica e lavoro." }},
  { tag: "tecnologia", categorie: ["cultura", "scienza"], descrizioni: { it:  "Novità tecnologiche, innovazioni, sviluppo digitale e temi legati all'intelligenza artificiale. Ambienti di sviluppo Windows, Linux e Mac e grandi aziende tech come Google, Microsoft, con soluzioni bluethoot o wireless. Innovazione tecnologica applicata all'automazione e alla robotica, con visori hi-tech." }},
  { tag: "sport", categorie: ["cronaca"], descrizioni: { it:  "Sport: le squadre scendono in campo per disputare la partita di coppa. Dalle competizioni internazionali di calcio, tennis, volley e hokey agli eventi locali, sia di ciclismo che pallavolo che nuoto acrobatico. I giocatori grazie al doping si allenano duramente per partecipare al gioco e vincere. Doppietta in centrocampo del match Milan Juventus, in casa Inter" }},
  { tag: "scienza", categorie: ["cultura"], descrizioni: { it:  "Articoli legati a scoperte scientifiche, ricerca, progresso tecnologico e temi ambientali. La ricerca e gli esperimenti degli scienziati nel cervello della frutta o con animali esotici scoprirà le proprietà della luce." }},
  { tag: "religione", categorie: ["spiritualità"], descrizioni: { it:  "Il Nunzio Apostolico del dicastero del Vaticano in udienza generale con San Francesco a Roma: voci di fede, e di religioni, che parlando di Gesù Cristo, di spiritualità dell'anima e delle iniziative religiose del Pontefice. La preghiera della Chiesa e di Papa Francesco, insieme ai Santi e ai Beati. La recita del Santo Rosario a Santa Marta in Vaticano condotta dal Cardinale o dal Vescovo della diocesi nella Santa Sede." }},
  { tag: "prostituzione", categorie: ["solidarietà"], descrizioni: { it:  "La tratta delle donne ai fini di sfruttamento lavorativo o della prostituzione legalizzata con Santa Backita e le reti antitratta propongono unità di strada e contrasto alla violenza di genere." }},
  { tag: "strada", categorie: ["solidarietà"], descrizioni: { it:  "Gli homeless vivono sulla strada elemosinando il cibo dei poveri. L'emarginazione, piaga sociale, è vissuta nelle Capanne di Betlemme e nei centri di accoglienza per l'emergenza freddo. Eppure a volte muoiono sulle panchine, nelle stazioni." }},
  { tag: "alimentazione", categorie: ["cultura"], descrizioni: { it:  "Produzione e consumo di cibo sano e sostenibile. Temi come l'agricoltura biologica, la lotta allo spreco alimentare, le politiche per garantire la sicurezza alimentare e la promozione di diete equilibrate. Particolare attenzione è data agli impatti della globalizzazione sul settore alimentare."}}, 
  { tag: "famiglia", categorie: ["famiglia"],  descrizioni: { it:  "La famiglia tradizionale è composta da una mamma ed un papà che fondano l'esistenza nel matrimonio, per avere dei figli. Non si riconoscono nei modelli di gender, ma utilizzano metodi di procreazione naturale."}}, 
  { tag: "vita", categorie: ["famiglia"],  descrizioni: { it:  "Le leggi sull'aborto e sulla pillola anticoncezionale RU486 tutelano la donna che vuole interrompere una gravidanza: le neo-mamme piangono davanti agli ospedali la scomparsa del feto. La legge 194 regola l'interruzione volontaria di gravidanza in Italia."}}, 
  { tag: "affido",  categorie: ["famiglia"], descrizioni: { it:  "L'affidamento familiare e l'accoglienza nelle case famiglia di minori a rischio: i servizi sociali e il tribunale per i minorenni dispongono l'affido fino ai 18 anni"}}, 
  { tag: "intelligenza artificiale",  categorie: ["cultura", "scienza"], descrizioni: { it:  "L'AI (intelligenza artificiale) di ChatGpt fondata da OpenAI, passa alla versione Gemini 4.0. I due modelli semantici di DeepMind propongono testi auto-generati ed immagini veritiere che paiono falsificate, attraveso i server innovativi di Claude AI e del riconoscimento facciale. La rete neurale NVidia permetterà l'analisi automatizzata via IA delle procedure."}}, 
  { tag: "fisica quantistica", categorie: ["cultura", "scienza"],  descrizioni: { it:  "La fisica quantistica delle particelle con lo spin dell'elettrone permetterà ai computer quantici attraverso i fotoni di specchiarsi nello spazio-tempo relativo curvando le dimensioni dell'universo. Al Cern l'entanglement di Einstain verso una nuova percezione"}},
  { tag: "missioni", categorie: ["mondo"],  descrizioni: { it:  "Le missioni dei missionari all'estero nei Paesi emergenti dell'Africa, del Sud America, dell'Asia nel terzo mondo per il diritto allo sviluppo dei popoli africani con i comboniani, i francescani, la Comunità Papa Giovanni XXIII, e le suore. La siccità e le guerre oltre alle inondazioni dei monsoni mietono vittime nella povertà e nella fame, con la sanità e l'accesso ai diritti per i più poveri della Terra e del Mondo, fra le baraccopoli e le favelas" }}, 
  
  { tag: "rom",  categorie: ["solidarietà"], descrizioni: { it:  "Campi Rom balcanici discriminati per antiziganismo. l'integrazione delle comunità nomadi gipsy. Le roulotte degli zingari gitani poveri accusati di rubare e chiedere l'elemosina. Bambino di origine Sinti nella società romanì, denuncia l'UNAR."}}, 
*/
  ]);



  /*
  { tag: "infanzia", descrizioni: { it:  "Topics related to children, their growth, education, health, rights, and protection, with particular attention to vulnerable minors. Includes the care of younger children, aged 0 to 6, placed in nurseries and kindergartens, including foster care." },
  { tag: "volontariato", descrizioni: { it:  "Activities carried out by volunteers to help the community, support groups in difficulty, promote social inclusion, and participate in solidarity initiatives." },
  { tag: "educazione", descrizioni: { it:  "Topics related to teaching, schools, learning, vocational training, and access to education for all age groups. Modern pedagogy encourages teachers to avoid using grades in evaluating students." },
  { tag: "politica", descrizioni: { it:  "EU Commission: in Parliament, at the Chamber of Deputies and the Senate, the majority of mayors support the opposition in national politics. Voting in committees and party elections, from center-right to left-wing, have decided the allocation of funds for an agreement. The Prime Minister in European institutions, the contributions of the President of the Republic, and voting in the Council of Ministers lead to significant legislative decisions. Strong political comments from coalition leaders, while the regional prime minister supports the outgoing government." },
  { tag: "pace", descrizioni: { it:  "Fighting erupts to suppress dissent: promotion of peace through anti-personnel mines, drones, and troops; conflict resolution, anti-war initiatives, and international mediation. The dictator of the regime sent drones to military bases under attack, missiles and bombs cause death and destruction; demonstrations for nonviolence against nuclear weapons. Military personnel in the streets demand a ceasefire." },
  { tag: "migranti", descrizioni: { it:  "Topics related to migration, asylum policies, humanitarian crises, human trafficking, and refugees' rights. In refugee camps, UAMs often travel alone, trafficked on rubber boats across the Mediterranean or through the Balkans. From Mexico to the United States, people fleeing find a wall." },
  { tag: "ambiente", descrizioni: { it:  "Topics related to sustainability, environmental protection, climate change, and responsible management of natural resources. Forests that breathe turn oxygen and energy into pure water and green, unspoiled landscapes when pollution does not destroy natural habitats." },
  { tag: "diritti umani", descrizioni: { it:  "Topics related to the protection of fundamental rights, equality, the fight against discrimination, and social justice." },
  { tag: "salute", descrizioni: { it:  "Articles from healthcare organizations regarding public health, physical and mental well-being, healthcare policies, and medical initiatives. According to Ulss 1, in hospitals and ASLs, in public and private clinics, doctors, nurses, and pediatricians practice holistic care or prescribe medications." },
  { tag: "giustizia", descrizioni: { it:  "Alternative measures to detention: the prosecutor's lawyer, after legal consultation, consulted the judge to sentence the defendant to 2 years, but the prosecutor's statement brings the case to the constitutional court, and the verdict can be appealed. The police intervened on site. The GIP, after hearing the Public Prosecutor, prefers to bring it to court after consulting the Minister of Justice's legal opinion." },
  { tag: "spettacoli", descrizioni: { it:  "The artistic performance displayed in exhibition pavilions features moments of music, dance, theater, cinema, and will host the author, bringing the abstract visual performance on stage with the artists from La Scala. The concert is based on the album already released and distributed. The famous musician and composer invited for the event will attend with an aperitif-dinner." },
  { tag: "disabilità", descrizioni: { it:  "Insights into the protection of the rights of people with physical, intellectual, or sensory disabilities, and their access to education, employment, and public services. Special attention is given to initiatives for overcoming architectural barriers, assistive technologies such as voice software and motor aids, and testimonies from individuals facing these challenges daily." },
  { tag: "dipendenze", descrizioni: { it:  "Topics related to addictions such as alcohol, drugs, gambling, and technology, with insights into rehabilitation and prevention programs. Includes statistical data on high-risk populations, descriptions of awareness campaigns promoted by local and national agencies, and interviews with psychiatry and psychotherapy experts treating these conditions." },
  { tag: "economia", descrizioni: { it:  "Economic topics, financial markets, technological innovation, and employment." },
  { tag: "tecnologia", descrizioni: { it:  "Technological innovations, digital development, and topics related to artificial intelligence. Development environments for Windows, Linux, and Mac, and major tech companies like Google and Microsoft, offering Bluetooth or wireless solutions. Technological innovation applied to automation and robotics, with high-tech headsets." },
  { tag: "sport", descrizioni: { it:  "Sports: teams take the field for the cup match. From international football, tennis, volleyball, and hockey competitions to local events such as cycling, volleyball, and acrobatic swimming. Players train hard with doping to participate in the game and win. A midfield double during the Milan Juventus match, at Inter's home." },
  { tag: "scienza", descrizioni: { it:  "Articles related to scientific discoveries, research, technological progress, and environmental topics. Research and experiments by scientists in fruit brains or with exotic animals to uncover the properties of light." },
  { tag: "religione", descrizioni: { it:  "The Apostolic Nuncio of the Vatican dicastery in a general audience with St. Francis in Rome: voices of faith and religions discussing Jesus Christ, the spirituality of the soul, and the religious initiatives of the Pope. The prayer of the Church and of Pope Francis, together with the Saints and Blesseds. The recitation of the Holy Rosary at Santa Marta in the Vatican led by the Cardinal or Bishop of the diocese in the Holy See." },
  { tag: "prostituzione", descrizioni: { it:  "The trafficking of women for labor exploitation or legalized prostitution with Santa Backita, and anti-trafficking networks proposing street units and combating gender violence." },
  { tag: "strada", descrizioni: { it:  "Homeless people live on the street, begging for food from the poor. Marginalization, a social plague, is experienced in the Bethlehem huts and in emergency cold-weather shelters. Yet, sometimes, they die on benches or in stations." },
  { tag: "alimentazione", descrizioni: { it:  "Production and consumption of healthy and sustainable food. Topics such as organic farming, the fight against food waste, policies to ensure food security, and promoting balanced diets. Special attention is given to the impacts of globalization on the food sector." },
  { tag: "famiglia", descrizioni: { it:  "The traditional family consists of a mother and a father who found their existence in marriage to have children. They do not recognize gender models, but use natural procreation methods." },
  { tag: "vita", descrizioni: { it:  "Laws on abortion and the RU486 contraceptive pill protect women who wish to terminate a pregnancy: new mothers cry at hospitals over the loss of a fetus. Law 194 regulates voluntary abortion in Italy." },
  { tag: "affido", descrizioni: { it:  "Foster care and welcoming children at risk in family homes:..." }
*/


const fonti = [{ 
  url: "https://www.agensir.it/feed/",
  rubriche: [],  //qui ci salvo la sezione del feed, eg esteri, cronaca...
  lingua: "it"
},
{ url: "https://www.adnkronos.com/RSS_Ultimora.xml", 
rubriche:[],
},
{ url: "http://feeds.feedburner.com/acistampa/notizie",
rubriche:[],
},
{ url: "https://www.vaticannews.va/it.rss.xml",
rubriche: [],
}, 
{ url: "https://www.ansa.it/sito/ansait_rss.xml",
rubriche: [],
}, 
{ url: "http://www.famigliacristiana.it/_rss/di-cosa-parliamo---articoli.aspx",
rubriche:[],
},
{ url: "http://www.atlanteguerre.it/feed/",
rubriche:["pace"],
},
{ url: "http://www.lescienze.it/rss/all/rss2.0.xml",
rubriche: ["scienza"],
},
{
url: "http://www.galileonet.it/rss/",
rubriche: ["scienza"],
},
{
url: "http://www.repubblica.it/rss/ambiente/rss2.0.xml",
rubriche: ["scienza"],
},
];




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
