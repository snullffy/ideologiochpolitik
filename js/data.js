const NAV_ITEMS = [
  { id: "home", label: "Hem" },
  { id: "learn", label: "Lär dig" },
  { id: "flashcards", label: "Flashcards" },
  { id: "begrepp", label: "Begrepp" },
  { id: "ideologier", label: "Ideologier" },
  { id: "riksdag", label: "Riksdag & regering" },
  { id: "demokrati", label: "Demokrati" },
  { id: "valsystem", label: "Valsystem" },
  { id: "nivaer", label: "Politiska nivåer" },
  { id: "train", label: "Träna" },
  { id: "hard", label: "Mina svåra" },
  { id: "exam", label: "Prov" }
];

const MODE_TITLES = {
  home: "Hem",
  learn: "Lär dig",
  flashcards: "Flashcards",
  begrepp: "Träna begrepp",
  match: "Begreppsmatchning",
  fill: "Fyll i luckan",
  which: "Vilket begrepp?",
  ideologier: "Vilken ideologi?",
  compare: "Jämför ideologier",
  riksdag: "Riksdagen eller regeringen?",
  demokrati: "Demokrati eller diktatur?",
  valsystem: "Valsystemet",
  nivaer: "Politiska nivåer",
  scenario: "Scenario",
  write: "Skrivsvar",
  train: "Träna",
  hard: "Mina svåra",
  exam: "Prov",
  results: "Resultat",
  mix: "Blandat pass"
};

const TOPICS = {
  ideologi: "Ideologier",
  demokrati: "Demokrati",
  riksdag: "Riksdag & regering",
  val: "Valsystem",
  niva: "Politiska nivåer",
  begrepp: "Begrepp"
};

const CONCEPTS = [
  { id: "ideologi", name: "Ideologi", topic: "ideologi", def: "En samling idéer om hur samhället bör se ut och hur det ska styras, till exempel synen på individen, staten, ekonomi och rättvisa." },
  { id: "liberalism", name: "Liberalism", topic: "ideologi", def: "En ideologi som betonar individens frihet och rättigheter, demokrati, yttrandefrihet, rättssäkerhet och marknadsekonomi." },
  { id: "konservatism", name: "Konservatism", topic: "ideologi", def: "En ideologi som betonar tradition, stabilitet, ordning, trygghet och gemenskap, och som vill att förändringar ska ske försiktigt." },
  { id: "socialism", name: "Socialism", topic: "ideologi", def: "En ideologi som betonar jämlikhet, solidaritet, välfärd och att minska stora ekonomiska och sociala skillnader." },
  { id: "demokrati", name: "Demokrati", topic: "demokrati", def: "Folkstyre. Medborgarna har inflytande, bland annat genom fria och rättvisa val, politiska rättigheter och att makten kan granskas." },
  { id: "diktatur", name: "Diktatur", topic: "demokrati", def: "Ett styrelseskick där makten koncentreras till en person eller en liten grupp. Politiska rättigheter, fria val och opposition är begränsade eller saknas." },
  { id: "representativ", name: "Representativ demokrati", topic: "demokrati", def: "Medborgarna väljer politiker som fattar besluten i deras ställe, till exempel ledamöter i riksdagen." },
  { id: "parlamentarism", name: "Parlamentarism", topic: "riksdag", def: "Regeringen måste ha stöd av eller tolereras av riksdagen för att kunna styra. Saknar den riksdagens förtroende kan den tvingas avgå." },
  { id: "monarki", name: "Konstitutionell monarki", topic: "riksdag", def: "Sverige har en kung eller drottning som statschef, men statschefen har inte politisk makt. Den politiska makten utgår från folket och regleras av grundlagarna." },
  { id: "riksdag", name: "Riksdagen", topic: "riksdag", def: "Sveriges folkvalda parlament med 349 ledamöter. Beslutar om lagar och statens budget, kontrollerar regeringen och representerar folket." },
  { id: "regering", name: "Regeringen", topic: "riksdag", def: "Statsministern och ministrarna. Leder och styr landet, lämnar förslag till riksdagen, genomför riksdagens beslut och leder den statliga förvaltningen." },
  { id: "mandat", name: "Mandat", topic: "val", def: "En plats i en politisk församling, till exempel en plats i riksdagen." },
  { id: "proportionella", name: "Proportionella val", topic: "val", def: "Ett valsystem där partiernas antal mandat ungefär motsvarar deras andel av rösterna." },
  { id: "sparr", name: "4-procentsspärren", topic: "val", def: "Den normala spärren för att få mandat i riksdagen är 4 procent av rösterna i hela landet." },
  { id: "val", name: "Allmänna val", topic: "val", def: "I Sverige hålls allmänna val till riksdagen, regionfullmäktige och kommunfullmäktige vart fjärde år." },
  { id: "opposition", name: "Opposition", topic: "riksdag", def: "De partier och ledamöter som inte ingår i regeringen och som granskar och ifrågasätter regeringens politik." },
  { id: "staten", name: "Staten", topic: "niva", def: "Den nationella politiska nivån. Hit hör bland annat riksdag, regering och frågor som gäller hela landet, till exempel lagar." },
  { id: "region", name: "Regionen", topic: "niva", def: "Den regionala politiska nivån. Ansvarar bland annat för sjukvård och kollektivtrafik." },
  { id: "kommun", name: "Kommunen", topic: "niva", def: "Den lokala politiska nivån. Ansvarar bland annat för grundskola, förskola och äldreomsorg." }
];

const LEARN = [
  {
    id: "l-ideologi",
    topic: "ideologi",
    title: "Vad är en ideologi?",
    body: "En ideologi är en samling idéer om hur samhället bör vara och hur det ska styras. Ideologier ger svar på frågor om individens frihet, statens roll, ekonomi och rättvisa. De tre klassiska ideologierna i svensk samhällskunskap på den här nivån är liberalism, konservatism och socialism. Inom varje tradition finns variationer. Här tränar du de grundläggande idéerna, inte att varje person tycker exakt likadant.",
    think: "Varför räcker det inte att säga att en ideologi bara är ett partis namn?",
    explain: "Ett parti kan hämta idéer från en ideologi, men ideologin är den större idétraditionen. Partier anpassar sig efter tid, väljare och kompromisser. Därför kan två liberala partier skilja sig åt, samtidigt som kärnan – individens frihet – är densamma."
  },
  {
    id: "l-lib",
    topic: "ideologi",
    title: "Liberalism",
    body: "Kärna: frihet. Liberalismen betonar individens frihet, rättigheter och möjligheten att själv bestämma över sitt liv. Staten ska skydda rättigheter och rättssäkerhet, men inte i onödan styra människors livsval. Viktiga begrepp: individens frihet, individens rättigheter, yttrandefrihet, demokrati, marknadsekonomi och rättssäkerhet.",
    think: "Varför betonar liberalismen individens frihet?",
    explain: "Liberalismen utgår från att individen har ett värde i sig och bör få forma sitt liv så länge hen inte kränker andras rättigheter. Politisk makt ska därför begränsas av lagar och rättigheter. Ekonomiskt kopplas det ofta till marknadsekonomi, där människor och företag ska kunna agera med stor frihet."
  },
  {
    id: "l-kons",
    topic: "ideologi",
    title: "Konservatism",
    body: "Kärna: tradition och stabilitet. Konservatismen betonar att samhället är mer än lösa individer: traditioner, gemenskap och institutioner håller ihop det. Förändringar ska ske försiktigt så att ordning och trygghet inte raseras. Viktiga begrepp: tradition, stabilitet, ordning, trygghet, gemenskap och försiktiga förändringar.",
    think: "Varför vill konservatismen att förändringar ska ske långsamt?",
    explain: "Tanken är att samhället har byggts upp över tid. Snabba, radikala ingrepp kan slå sönder sådant som fungerar – lagar, familj, institutioner och tillit. Därför ska reformer prövas noga. Det betyder inte att inget får ändras, utan att förändring ska ske med hänsyn till det som redan finns."
  },
  {
    id: "l-soc",
    topic: "ideologi",
    title: "Socialism",
    body: "Kärna: jämlikhet. Socialismen betonar att stora ekonomiska skillnader gör friheten ojämnt fördelad. Staten och politiken ska därför kunna omfördela resurser, bygga välfärd och stärka arbetarnas rättigheter. Viktiga begrepp: jämlikhet, solidaritet, välfärd, arbetarnas rättigheter, omfördelning och minskade ekonomiska skillnader.",
    think: "Hur skiljer sig socialismens syn på frihet från liberalismens?",
    explain: "Liberalismen lyfter ofta frihet som skydd mot statlig inblandning och som rätt att välja. Socialismen menar att formell frihet inte räcker om människor saknar ekonomi, utbildning eller trygghet. Då blir jämlikhet och välfärd förutsättningar för att friheten ska vara reell för fler."
  },
  {
    id: "l-skillnad",
    topic: "ideologi",
    title: "Skillnader mellan ideologierna",
    body: "Liberalism betonar individens frihet och rättigheter. Konservatism betonar tradition, ordning och försiktig förändring. Socialism betonar jämlikhet, solidaritet och att minska ekonomiska skillnader. De kan överlappa: alla tre kan i modern svensk politik acceptera demokrati. Skillnaden syns tydligast i synen på statens roll, förändringstakt och vad som är viktigast – frihet, tradition eller jämlikhet.",
    think: "Vilken konflikt uppstår om man ställer liberalism mot socialism?",
    explain: "Konflikten handlar ofta om hur mycket staten ska ingripa i ekonomin. Liberalismen värnar individens val och marknaden. Socialismen vill använda politik för att utjämna skillnader. Båda kan tala om frihet, men de menar inte samma sak med ordet."
  },
  {
    id: "l-dem",
    topic: "demokrati",
    title: "Vad demokrati betyder",
    body: "Demokrati betyder folkstyre. I en demokrati kan medborgarna påverka politiken, bland annat genom fria och rättvisa val. Politiska rättigheter skyddas: yttrandefrihet, pressfrihet, demonstrationsfrihet och föreningsfrihet. Alla ska vara lika inför lagen. Makten ska kunna granskas, till exempel av riksdag, medier och domstolar.",
    think: "Varför räcker det inte med att det hålls val för att kalla ett land demokratiskt?",
    explain: "Val måste vara fria och rättvisa. Flera partier ska kunna ställa upp, opposition ska tillåtas, och rättigheter som yttrandefrihet måste finnas. Annars kan val användas som kuliss i en diktatur."
  },
  {
    id: "l-principer",
    topic: "demokrati",
    title: "Demokratiska principer",
    body: "Viktiga principer: folkstyre, fria och rättvisa val, flera politiska partier, yttrandefrihet, pressfrihet, demonstrationsfrihet, föreningsfrihet och lika rättigheter inför lagen. Representativ demokrati innebär att folket väljer ombud som beslutar. I Sverige är det bland annat riksdagsledamöterna.",
    think: "Vad menas med representativ demokrati?",
    explain: "Medborgarna styr inte genom att rösta om varje lag själva. De väljer representanter som får förtroendet att besluta. Det gör det möjligt att styra ett stort land, men kräver att representanterna kan avsättas i nästa val och granskas däremellan."
  },
  {
    id: "l-dik",
    topic: "demokrati",
    title: "Demokrati kontra diktatur",
    body: "I en diktatur koncentreras makten till en person eller en liten grupp. Politiska rättigheter begränsas. Yttrandefriheten är svag. Fria val saknas eller är riggade. Opposition kan förbjudas eller förföljas. I en demokrati sprids makten, rättigheter skyddas och regeringen kan bytas ut genom val.",
    think: "Vilken skillnad är viktigast mellan demokrati och diktatur när det gäller opposition?",
    explain: "I en demokrati är opposition tillåten och nödvändig: den granskar makten. I en diktatur ses opposition ofta som ett hot och kan tystas. Utan möjlighet att ifrågasätta makten saknas ett grundläggande demokratiskt skydd."
  },
  {
    id: "l-rik",
    topic: "riksdag",
    title: "Riksdagen",
    body: "Riksdagen är Sveriges folkvalda parlament och har 349 ledamöter. Den representerar folket. Riksdagen beslutar om lagar, beslutar om statens budget och kontrollerar regeringen. Ledamöterna väljs i allmänna val.",
    think: "Varför är det viktigt att riksdagen både stiftar lagar och kontrollerar regeringen?",
    explain: "Om samma grupp både stiftar lagar, styr och granskar sig själv blir makten koncentrerad. Genom att folket väljer riksdagen, och riksdagen granskar regeringen, delas makten. Det är en del av parlamentarismen och den representativa demokratin."
  },
  {
    id: "l-reg",
    topic: "riksdag",
    title: "Regeringen",
    body: "Regeringen består av statsministern och ministrarna. Den leder och styr landet, lämnar förslag till riksdagen, genomför riksdagens beslut och leder den statliga förvaltningen. Regeringen sitter på riksdagens förtroende.",
    think: "Vad händer med makten om regeringen saknar stöd i riksdagen?",
    explain: "Vid parlamentarism kan riksdagen tvinga regeringen att avgå, till exempel genom misstroendeförklaring. Regeringen kan inte styra hur som helst mot riksdagens vilja. Det är skillnaden mot system där den verkställande makten är oberoende av parlamentet."
  },
  {
    id: "l-parl",
    topic: "riksdag",
    title: "Parlamentarism och statsskick",
    body: "Sverige är en representativ demokrati, en parlamentarisk demokrati och en konstitutionell monarki. Parlamentarism betyder att regeringen måste ha stöd av eller tolereras av riksdagen. Konstitutionell monarki betyder att kungen eller drottningen är statschef men saknar politisk makt. Den politiska makten utgår från folket och grundlagarna.",
    think: "Hur kan Sverige både ha kung och vara en demokrati?",
    explain: "Statschefen har en symbolisk och ceremoniell roll. Lagar, budget och regering tillsätts genom politiska processer, inte av kungen. Därför kallas det konstitutionell monarki: monarkin finns, men den är bunden av konstitutionen och saknar styrande makt."
  },
  {
    id: "l-kedja",
    topic: "riksdag",
    title: "Folket – riksdagen – regeringen",
    body: "Folket väljer riksdagen. Riksdagen beslutar om lagar och budget och utser underlag för vem som kan bilda regering. Regeringen styr landet och genomför besluten. Riksdagen kontrollerar sedan regeringen. Kedjan är: folket → riksdagen → regeringen.",
    think: "Vem är ytterst ansvarig inför väljarna?",
    explain: "Riksdagens ledamöter väljs direkt av folket och kan röstas bort. Regeringen är beroende av riksdagen. Därför går den demokratiska kedjan från väljarna via riksdagen till regeringen, inte tvärtom."
  },
  {
    id: "l-val",
    topic: "val",
    title: "Valsystemet",
    body: "Sverige har proportionella val: partiernas mandat ska ungefär motsvara deras andel av rösterna. Riksdagen har 349 mandat. Den normala spärren för att komma in i riksdagen är 4 procent av rösterna i hela landet. Allmänna val till riksdagen, regionfullmäktige och kommunfullmäktige hålls vart fjärde år.",
    think: "Vad betyder det i praktiken om ett parti får omkring 20 procent av rösterna?",
    explain: "I ett proportionellt system kan partiet ungefär räkna med en femtedel av mandaten, alltså i storleksordningen 70 av 349, beroende på hur mandatfördelningen räknas ut och hur rösterna fördelas geografiskt. Poängen är att röstandel och mandatandel ska följas åt, till skillnad från system där vinnaren tar allt."
  },
  {
    id: "l-niva",
    topic: "niva",
    title: "Tre politiska nivåer",
    body: "Sverige har tre folkvalda nivåer. Staten sköter nationell politik: riksdag, regering, lagar. Regionen ansvarar bland annat för sjukvård och kollektivtrafik; väljarna väljer regionfullmäktige. Kommunen ansvarar bland annat för grundskola, förskola och äldreomsorg; väljarna väljer kommunfullmäktige.",
    think: "Varför är det missvisande att säga att riksdagen beslutar om allt som rör skolan?",
    explain: "Riksdagen stiftar lagar som gäller hela landet, även skollag. Men det är kommunen som i praktiken driver grundskolan. Ansvaret är delat: staten sätter ramar, kommunen utför en stor del av välfärden nära invånarna."
  }
];

const FLASHCARDS = CONCEPTS.map(function (c) {
  return { id: c.id, front: "Vad betyder " + c.name + "?", back: c.def, name: c.name, topic: c.topic };
});

const FILL = [
  { id: "f1", concept: "proportionella", topic: "val", text: "Sverige har ett __________ valsystem där partiernas antal mandat ungefär motsvarar deras andel av rösterna.", accepted: ["proportionellt", "proportionella", "proportionellt valsystem"], answer: "proportionellt", explain: "I proportionella val ska mandaten spegla röstfördelningen, till skillnad från system där segraren i en valkrets tar allt." },
  { id: "f2", concept: "sparr", topic: "val", text: "Den normala spärren för att få mandat i riksdagen är __________ procent av rösterna i hela landet.", accepted: ["4", "4%", "4 procent", "fyra", "fyra procent"], answer: "4", explain: "4-procentsspärren gör att mycket små partier normalt inte får mandat. Det ska motverka ett alltför splittrat parlament." },
  { id: "f3", concept: "riksdag", topic: "riksdag", text: "Riksdagen har __________ ledamöter.", accepted: ["349", "trehundrafyrtionio"], answer: "349", explain: "349 är ett udda tal så att omröstningar inte ska sluta lika." },
  { id: "f4", concept: "val", topic: "val", text: "Allmänna val till riksdag, region och kommun hålls vart __________ år.", accepted: ["fjärde", "4", "fyra"], answer: "fjärde", explain: "Valperioden är fyra år. Därefter kan väljarna byta ut sina representanter." },
  { id: "f5", concept: "parlamentarism", topic: "riksdag", text: "Att regeringen måste ha stöd av eller tolereras av riksdagen kallas __________.", accepted: ["parlamentarism"], answer: "parlamentarism", explain: "Utan riksdagens förtroende kan regeringen tvingas avgå." },
  { id: "f6", concept: "mandat", topic: "val", text: "En plats i riksdagen kallas ett __________.", accepted: ["mandat"], answer: "mandat", explain: "Mandat betyder uppdrag eller plats i en vald församling." },
  { id: "f7", concept: "liberalism", topic: "ideologi", text: "Ideologin som särskilt betonar individens frihet och rättigheter kallas __________.", accepted: ["liberalism"], answer: "liberalism", explain: "Liberalismen sätter individen i centrum och vill begränsa godtycklig makt." },
  { id: "f8", concept: "konservatism", topic: "ideologi", text: "Ideologin som betonar tradition, ordning och försiktiga förändringar kallas __________.", accepted: ["konservatism"], answer: "konservatism", explain: "Konservatismen vill bevara det som fungerar och reformera långsamt." },
  { id: "f9", concept: "socialism", topic: "ideologi", text: "Ideologin som betonar jämlikhet, solidaritet och minskade ekonomiska skillnader kallas __________.", accepted: ["socialism"], answer: "socialism", explain: "Socialismen ser politik och omfördelning som verktyg för mer jämlika villkor." },
  { id: "f10", concept: "demokrati", topic: "demokrati", text: "Ordet demokrati betyder __________.", accepted: ["folkstyre", "folkets styre"], answer: "folkstyre", explain: "Demos betyder folk och kratein att styra." },
  { id: "f11", concept: "representativ", topic: "demokrati", text: "När medborgarna väljer politiker som fattar besluten kallas det __________ demokrati.", accepted: ["representativ", "representativ demokrati"], answer: "representativ", explain: "Sverige är en representativ demokrati, inte en direktdemokrati i vardagen." },
  { id: "f12", concept: "regering", topic: "riksdag", text: "__________ leder landet och genomför riksdagens beslut.", accepted: ["regeringen", "regering"], answer: "regeringen", explain: "Regeringen är den verkställande makten." },
  { id: "f13", concept: "riksdag", topic: "riksdag", text: "__________ beslutar om statens budget.", accepted: ["riksdagen", "riksdag"], answer: "riksdagen", explain: "Budgetbeslutet är ett av riksdagens viktigaste uppdrag." },
  { id: "f14", concept: "region", topic: "niva", text: "Sjukvård och kollektivtrafik är främst __________ ansvar.", accepted: ["regionens", "regionen", "regionernas", "region"], answer: "regionens", explain: "Regionerna sköter bland annat hälso- och sjukvård samt kollektivtrafik." },
  { id: "f15", concept: "kommun", topic: "niva", text: "Grundskola, förskola och äldreomsorg är främst __________ ansvar.", accepted: ["kommunens", "kommunen", "kommunernas", "kommun"], answer: "kommunens", explain: "Kommunerna sköter en stor del av välfärden nära invånarna." },
  { id: "f16", concept: "monarki", topic: "riksdag", text: "Sverige är en konstitutionell __________, vilket betyder att statschefen saknar politisk makt.", accepted: ["monarki"], answer: "monarki", explain: "Kungen eller drottningen är statschef, men politiken styrs av folkvalda organ." },
  { id: "f17", concept: "diktatur", topic: "demokrati", text: "När makten koncentreras till en person eller liten grupp och opposition kan förbjudas talar man om __________.", accepted: ["diktatur"], answer: "diktatur", explain: "Diktatur är motsatsen till demokrati när det gäller maktkoncentration och rättigheter." },
  { id: "f18", concept: "ideologi", topic: "ideologi", text: "En samling idéer om hur samhället bör styras kallas en __________.", accepted: ["ideologi"], answer: "ideologi", explain: "Ideologier ger en helhetssyn, inte bara en enstaka åsikt." }
];

const WHICH = [
  { id: "w1", concept: "mandat", topic: "val", prompt: "En plats i riksdagen eller en annan politisk församling.", answer: "Mandat", options: ["Opposition", "Mandat", "Ideologi", "Demokrati"] },
  { id: "w2", concept: "parlamentarism", topic: "riksdag", prompt: "Ett system där regeringens ställning är beroende av riksdagen.", answer: "Parlamentarism", options: ["Diktatur", "Parlamentarism", "Monarki", "Proportionella val"] },
  { id: "w3", concept: "liberalism", topic: "ideologi", prompt: "En ideologi som betonar individens frihet och rättigheter.", answer: "Liberalism", options: ["Konservatism", "Socialism", "Liberalism", "Diktatur"] },
  { id: "w4", concept: "proportionella", topic: "val", prompt: "Ett valsystem där mandat ungefär motsvarar röstandelen.", answer: "Proportionella val", options: ["Diktatur", "Konstitutionell monarki", "Proportionella val", "Kommunfullmäktige"] },
  { id: "w5", concept: "representativ", topic: "demokrati", prompt: "Medborgarna väljer ombud som fattar de politiska besluten.", answer: "Representativ demokrati", options: ["Diktatur", "Representativ demokrati", "Region", "Mandat"] },
  { id: "w6", concept: "sparr", topic: "val", prompt: "Regeln att ett parti normalt behöver 4 procent av rösterna i hela landet för att få mandat i riksdagen.", answer: "4-procentsspärren", options: ["349-regeln", "4-procentsspärren", "Parlamentarism", "Mandat"] },
  { id: "w7", concept: "konservatism", topic: "ideologi", prompt: "En ideologi som betonar tradition, stabilitet och försiktiga förändringar.", answer: "Konservatism", options: ["Liberalism", "Socialism", "Konservatism", "Parlamentarism"] },
  { id: "w8", concept: "socialism", topic: "ideologi", prompt: "En ideologi som betonar jämlikhet, solidaritet och minskade ekonomiska skillnader.", answer: "Socialism", options: ["Liberalism", "Konservatism", "Socialism", "Monarki"] },
  { id: "w9", concept: "regering", topic: "riksdag", prompt: "Statsministern och ministrarna som leder landet och genomför riksdagens beslut.", answer: "Regeringen", options: ["Riksdagen", "Regeringen", "Regionfullmäktige", "Oppositionen"] },
  { id: "w10", concept: "riksdag", topic: "riksdag", prompt: "Sveriges folkvalda parlament som stiftar lagar, beslutar om budget och kontrollerar regeringen.", answer: "Riksdagen", options: ["Regeringen", "Riksdagen", "Kommunen", "Hovet"] },
  { id: "w11", concept: "diktatur", topic: "demokrati", prompt: "Styrelseskick där makten är koncentrerad och politiska rättigheter är begränsade.", answer: "Diktatur", options: ["Demokrati", "Parlamentarism", "Diktatur", "Proportionella val"] },
  { id: "w12", concept: "region", topic: "niva", prompt: "Politisk nivå med ansvar för bland annat sjukvård och kollektivtrafik.", answer: "Regionen", options: ["Kommunen", "Regionen", "Riksdagen", "Hovet"] }
];

const IDEOLOGY_Q = [
  { id: "i1", concept: "liberalism", statement: "Individen bör ha stor frihet att bestämma över sitt eget liv.", answer: "Liberalism" },
  { id: "i2", concept: "socialism", statement: "Samhället bör minska stora ekonomiska skillnader mellan människor.", answer: "Socialism" },
  { id: "i3", concept: "konservatism", statement: "Förändringar i samhället bör ske försiktigt och med hänsyn till traditioner och stabilitet.", answer: "Konservatism" },
  { id: "i4", concept: "liberalism", statement: "Yttrandefrihet och rättssäkerhet är avgörande för att skydda individen mot godtycklig makt.", answer: "Liberalism" },
  { id: "i5", concept: "socialism", statement: "Välfärd och omfördelning behövs för att friheten ska bli verklig även för den som har sämre ekonomi.", answer: "Socialism" },
  { id: "i6", concept: "konservatism", statement: "Gemenskap, ordning och beprövade institutioner håller ihop samhället.", answer: "Konservatism" },
  { id: "i7", concept: "liberalism", statement: "Marknadsekonomi ses ofta som ett sätt att låta människor och företag agera fritt.", answer: "Liberalism" },
  { id: "i8", concept: "socialism", statement: "Arbetarnas rättigheter och solidaritet är centrala värden.", answer: "Socialism" },
  { id: "i9", concept: "konservatism", statement: "Snabba, radikala omvälvningar kan slå sönder sådant i samhället som fungerar.", answer: "Konservatism" },
  { id: "i10", concept: "liberalism", statement: "Staten ska skydda rättigheter, men inte i onödan detaljstyra människors livsval.", answer: "Liberalism" },
  { id: "i11", concept: "socialism", statement: "Politiken ska kunna ingripa i ekonomin för att utjämna villkor.", answer: "Socialism" },
  { id: "i12", concept: "konservatism", statement: "Trygghet och kontinuitet är viktigare än att experimentera med samhället.", answer: "Konservatism" }
];

const COMPARE = [
  {
    id: "c1",
    concept: "liberalism",
    topic: "ideologi",
    title: "Liberalism och socialism",
    prompt: "Vilken skillnad finns mellan liberalismens och socialismens syn på frihet och jämlikhet?",
    points: ["Liberalismens betoning av individens frihet och rättigheter", "Socialismens betoning av jämlikhet och minskade skillnader", "Olika syn på hur mycket staten ska ingripa i ekonomin"],
    model: "Liberalismen betonar framför allt individens frihet och rättigheter. Människan ska kunna forma sitt liv och skyddas mot godtycklig makt. Socialismen lägger större vikt vid jämlikhet och att minska ekonomiska och sociala skillnader. Där liberalismen ofta ser statlig inblandning som en risk mot friheten, ser socialismen politik och omfördelning som nödvändiga för att fler ska få reella möjligheter."
  },
  {
    id: "c2",
    concept: "konservatism",
    topic: "ideologi",
    title: "Liberalism och konservatism",
    prompt: "Jämför liberalismens och konservatismens syn på förändring och individen.",
    points: ["Liberalismens fokus på individens valfrihet", "Konservatismens fokus på tradition, gemenskap och försiktig förändring", "Olika tempo och skäl för reformer"],
    model: "Liberalismen sätter individen i centrum och är mer öppen för att människor ska få bryta mot traditioner så länge andras rättigheter respekteras. Konservatismen ser samhället som en kedja av traditioner och institutioner. Förändring ska ske långsamt så att ordning och trygghet inte går förlorad. Båda kan försvara demokrati och lag, men de värderar frihet mot kontinuitet olika."
  },
  {
    id: "c3",
    concept: "socialism",
    topic: "ideologi",
    title: "Socialism och konservatism",
    prompt: "Jämför socialismens och konservatismens syn på hur samhället bör förändras.",
    points: ["Socialismens vilja att medvetet utjämna skillnader", "Konservatismens försiktighet och betoning av det bestående", "Olika syn på hur snabbt och hur mycket staten ska ingripa"],
    model: "Socialismen vill ofta använda politiken aktivt för att förändra makt- och resursfördelning, med jämlikhet och välfärd som mål. Konservatismen varnar för snabba ingrepp och vill bevara tradition, ordning och gemenskap. Konflikten handlar inte bara om ekonomi utan om huruvida samhället främst ska reformeras efter rättviseideal eller vårdas som ett arv."
  }
];

const RIKSDAG_Q = [
  { id: "r1", concept: "riksdag", prompt: "Vem beslutar om statens budget?", answer: "Riksdagen", explain: "Budgeten antas av riksdagen. Regeringen lägger förslag, men beslutet är riksdagens." },
  { id: "r2", concept: "regering", prompt: "Vem leder landet och genomför riksdagens beslut?", answer: "Regeringen", explain: "Regeringen är den verkställande makten." },
  { id: "r3", concept: "riksdag", prompt: "Vem kontrollerar regeringen?", answer: "Riksdagen", explain: "Riksdagen granskar regeringen, bland annat genom interpellationer, konstitutionsutskottet och misstroendeomröstning." },
  { id: "r4", concept: "riksdag", prompt: "Vem beslutar om Sveriges lagar?", answer: "Riksdagen", explain: "Lagstiftningsmakten ligger hos riksdagen." },
  { id: "r5", concept: "regering", prompt: "Vem lämnar de flesta förslagen till nya lagar?", answer: "Regeringen", explain: "Regeringen lägger propositioner. Riksdagsledamöter kan också väcka motioner." },
  { id: "r6", concept: "regering", prompt: "Vem leder den statliga förvaltningen?", answer: "Regeringen", explain: "Myndigheterna lyder under regeringen, inom de ramar lagarna ger." },
  { id: "r7", concept: "riksdag", prompt: "Vem representerar folket i 349 ledamöter?", answer: "Riksdagen", explain: "Ledamöterna är folkvalda representanter." },
  { id: "r8", concept: "regering", prompt: "Vad kallas statsministern och ministrarna tillsammans i detta sammanhang?", answer: "Regeringen", explain: "Regeringen består av statsministern och övriga ministrar." },
  { id: "r9", concept: "riksdag", prompt: "Vem kan tvinga regeringen att avgå genom att dra tillbaka sitt förtroende?", answer: "Riksdagen", explain: "Det följer av parlamentarismen." },
  { id: "r10", concept: "regering", prompt: "Vem styr landet mellan valen, så länge riksdagen tolererar det?", answer: "Regeringen", explain: "Det dagliga styret sköts av regeringen, men under riksdagens kontroll." }
];

const DEMOCRACY_Q = [
  { id: "d1", concept: "demokrati", topic: "demokrati", prompt: "Vilket alternativ beskriver bäst en demokrati?", answer: "Medborgarna kan delta i fria val och politiska rättigheter skyddas.", options: ["Makten är koncentrerad till en liten grupp och opposition förbjuds.", "Medborgarna kan delta i fria val och politiska rättigheter skyddas.", "Endast ett parti får ställa upp i val.", "Regeringen kan inte granskas."], explain: "Demokrati kräver både val och rättigheter. Utan yttrandefrihet och möjlighet att granska makten blir valen otillräckliga." },
  { id: "d2", concept: "diktatur", topic: "demokrati", prompt: "Vilket alternativ beskriver bäst en diktatur?", answer: "Makten koncentreras och opposition kan tystas eller förbjudas.", options: ["Flera partier konkurrerar i fria val.", "Pressen kan fritt granska makthavarna.", "Makten koncentreras och opposition kan tystas eller förbjudas.", "Alla medborgare har samma politiska rättigheter."], explain: "Kännetecken är maktkoncentration och begränsade politiska rättigheter." },
  { id: "d3", concept: "demokrati", topic: "demokrati", prompt: "Vilken princip hör hemma i en demokrati?", answer: "Lika rättigheter inför lagen", options: ["Ett parti har laglig ensamrätt att styra", "Lika rättigheter inför lagen", "Oppositionen får inte kritisera regeringen", "Valresultatet kan ändras av den som sitter vid makten"], explain: "Rättssäkerhet och likhet inför lagen skyddar medborgarna mot godtycke." },
  { id: "d4", concept: "demokrati", topic: "demokrati", prompt: "Varför är flera politiska partier viktigt i en demokrati?", answer: "Väljarna ska kunna välja mellan alternativ och byta maktinnehavare.", options: ["För att valet ska se ut som en tävling även om utgången är given", "Väljarna ska kunna välja mellan alternativ och byta maktinnehavare.", "För att regeringen inte ska behöva kompromissa", "För att oppositionen ska kunna förbjudas efter valet"], explain: "Utan reella alternativ blir valet meningslöst." },
  { id: "d5", concept: "diktatur", topic: "demokrati", prompt: "Vad är typiskt för begränsad yttrandefrihet i en diktatur?", answer: "Kritik mot makthavarna kan bestraffas.", options: ["Tidningar får publicera vad de vill", "Kritik mot makthavarna kan bestraffas.", "Demonstrationer skyddas av lagen", "Oppositionen har samma sändningstid i statlig media"], explain: "Utan yttrandefrihet kan maktmissbruk inte belysas." },
  { id: "d6", concept: "demokrati", topic: "demokrati", prompt: "Vad innebär fria och rättvisa val?", answer: "Valhemlighet, lika rösträtt och att flera alternativ kan ställa upp.", options: ["Bara de som stöder regeringen får rösta", "Valhemlighet, lika rösträtt och att flera alternativ kan ställa upp.", "Röstsedlar räknas av det styrande partiet utan insyn", "Bara ett namn står på valsedeln"], explain: "Fria val kräver både rätt att välja och att räkningen är korrekt och öppen." }
];

const LEVEL_Q = [
  { id: "n1", concept: "region", prompt: "Sjukvård", answer: "Region" },
  { id: "n2", concept: "region", prompt: "Kollektivtrafik", answer: "Region" },
  { id: "n3", concept: "kommun", prompt: "Grundskola", answer: "Kommun" },
  { id: "n4", concept: "kommun", prompt: "Förskola", answer: "Kommun" },
  { id: "n5", concept: "kommun", prompt: "Äldreomsorg", answer: "Kommun" },
  { id: "n6", concept: "staten", prompt: "Sveriges lagar", answer: "Staten" },
  { id: "n7", concept: "staten", prompt: "Riksdagen och regeringen", answer: "Staten" },
  { id: "n8", concept: "staten", prompt: "Nationell politik som gäller hela landet", answer: "Staten" },
  { id: "n9", concept: "kommun", prompt: "Lokala frågor nära invånarna, till exempel äldreomsorg", answer: "Kommun" },
  { id: "n10", concept: "region", prompt: "Hälso- och sjukvård i ett län/område", answer: "Region" }
];

const ELECTION_Q = [
  { id: "e1", type: "mc", concept: "riksdag", topic: "val", prompt: "Hur många ledamöter har riksdagen?", answer: "349", options: ["299", "349", "400", "151"], explain: "Riksdagen har 349 ledamöter." },
  { id: "e2", type: "mc", concept: "sparr", topic: "val", prompt: "Vilken är den normala spärren för att få mandat i riksdagen?", answer: "4 procent av rösterna i hela landet", options: ["1 procent i en kommun", "10 procent i hela landet", "4 procent av rösterna i hela landet", "Hälften av rösterna i en valkrets"], explain: "4-procentsspärren gäller hela landet." },
  { id: "e3", type: "mc", concept: "val", topic: "val", prompt: "Hur ofta hålls allmänna val till riksdagen?", answer: "Vart fjärde år", options: ["Varje år", "Vartannat år", "Vart fjärde år", "Vart tionde år"], explain: "Valperioden är fyra år." },
  { id: "e4", type: "mc", concept: "proportionella", topic: "val", prompt: "Vad innebär ett proportionellt valsystem?", answer: "Mandaten ska ungefär motsvara partiernas röstandel.", options: ["Det parti som kommer tvåa får inga mandat.", "Mandaten ska ungefär motsvara partiernas röstandel.", "Kungen delar ut mandaten.", "Bara två partier får sitta i riksdagen."], explain: "Röster och platser ska följas åt så långt systemet tillåter." },
  { id: "e5", type: "mc", concept: "mandat", topic: "val", prompt: "Vad är ett mandat i riksdagen?", answer: "En plats och ett uppdrag som ledamot", options: ["En skatt", "En plats och ett uppdrag som ledamot", "Ett förbud mot opposition", "Statsministerns titel"], explain: "Varje ledamot har ett mandat." },
  { id: "e6", type: "mc", concept: "val", topic: "val", prompt: "Vilka församlingar väljs vid de allmänna valen vart fjärde år?", answer: "Riksdagen, regionfullmäktige och kommunfullmäktige", options: ["Bara riksdagen", "Riksdagen, regionfullmäktige och kommunfullmäktige", "Bara regeringen", "Hovrätten och regeringen"], explain: "Tre nivåer väljs samma år." },
  { id: "e7", type: "mc", concept: "proportionella", topic: "val", prompt: "Ett parti får omkring 20 procent av rösterna. Vad är den rimligaste följden i ett proportionellt valsystem?", answer: "Partiet kan ungefär räkna med en femtedel av mandaten.", options: ["Partiet får alla mandat.", "Partiet får noll mandat eftersom det inte vann.", "Partiet kan ungefär räkna med en femtedel av mandaten.", "Kungen avgör hur många mandat partiet får."], explain: "Röstandel och mandatandel ska följas åt, med hänsyn till hur fördelningen räknas och till spärrar." },
  { id: "e8", type: "mc", concept: "riksdag", topic: "val", prompt: "Varför har riksdagen ett udda antal ledamöter, 349?", answer: "Så att omröstningar inte ska sluta lika.", options: ["För att det ska matcha antalet kommuner", "Så att omröstningar inte ska sluta lika.", "För att EU kräver det", "För att kungen ska ha en röst"], explain: "349 är udda, vilket minskar risken för lika röstetal i kammaren." }
];

const SCENARIO = [
  { id: "s1", concept: "proportionella", topic: "val", prompt: "Ett parti får ungefär 20 procent av rösterna i ett riksdagsval. Vad innebär det proportionella valsystemet i detta sammanhang?", points: ["Röstandel och mandatandel ska följas åt", "Partiet kan ungefär räkna med en femtedel av mandaten", "Det är inte ett system där vinnaren tar allt"], model: "I ett proportionellt system ska mandaten ungefär motsvara röstandelen. Ett parti med omkring 20 procent av rösterna kan därför ungefär förväntas få 20 procent av mandaten, med hänsyn till hur mandatfördelningen faktiskt beräknas och till spärrregler. Det betyder inte exakt 69,8 mandat i varje val, men principen är att stödet i valurnan ska synas i riksdagen." },
  { id: "s2", concept: "riksdag", topic: "riksdag", prompt: "Regeringen vill genomföra en ny lag. Vilken roll har riksdagen?", points: ["Riksdagen beslutar om lagar", "Regeringen kan lägga förslag men inte stifta lagen själv", "Parlamentarism: regeringen är beroende av riksdagen"], model: "Regeringen kan lämna ett förslag (proposition), men det är riksdagen som beslutar om lagen. Utan riksdagens ja blir det ingen ny lag. Det följer av att lagstiftningsmakten ligger hos riksdagen." },
  { id: "s3", concept: "sparr", topic: "val", prompt: "Ett nytt parti får 2,8 procent av rösterna i hela landet. Vad händer normalt med partiets chans till mandat i riksdagen?", points: ["4-procentsspärren", "Partiet kommer normalt inte in", "Spärren motverkar mycket små partier"], model: "Den normala spärren är 4 procent av rösterna i hela landet. Med 2,8 procent kommer partiet normalt inte in i riksdagen, även om det har väljare. Syftet är att riksdagen inte ska splittras i alltför många mycket små partier." },
  { id: "s4", concept: "parlamentarism", topic: "riksdag", prompt: "En majoritet i riksdagen har inte längre förtroende för statsministern. Vad betyder parlamentarismen då?", points: ["Regeringen sitter på riksdagens förtroende", "Regeringen kan tvingas avgå", "Folket styr via riksdagen, inte via en oavsättlig regering"], model: "Parlamentarism innebär att regeringen måste tolereras av riksdagen. Om förtroendet saknas kan regeringen tvingas avgå. Makten går därmed tillbaka till de folkvalda ledamöterna." },
  { id: "s5", concept: "kommun", topic: "niva", prompt: "En elev är missnöjd med skolmaten och äldreomsorgen i sin hemkommun. Varför är det missvisande att bara skylla på riksdagen?", points: ["Kommunen ansvarar för skola och äldreomsorg", "Olika nivåer har olika uppgifter", "Riksdagen sätter ramar men utförandet är lokalt"], model: "Grundskola och äldreomsorg är kommunens ansvar. Riksdagen stiftar lagar för hela landet, men den dagliga verksamheten sköts lokalt. Eleven bör därför vända sig till kommunpolitiken, även om nationella lagar sätter ramar." },
  { id: "s6", concept: "demokrati", topic: "demokrati", prompt: "Ett land har val, men bara ett parti får kandidera och kritiska tidningar stängs. Varför är det inte en demokrati bara för att val hålls?", points: ["Valen är inte fria och rättvisa", "Yttrandefrihet och opposition saknas", "Demokrati kräver mer än en valdag"], model: "Demokrati kräver fria alternativ, opposition och rättigheter. Om bara ett parti får ställa upp och medier tystas är valet inte fritt. Då liknar systemet en diktatur med demokratisk fasad." }
];

const WRITE_Q = [
  { id: "wr1", concept: "representativ", topic: "demokrati", prompt: "Förklara vad representativ demokrati innebär.", points: ["Medborgarna väljer ombud", "Ombuden fattar besluten", "Representanterna kan bytas ut i val"], keywords: ["välj", "represent", "ledamot", "ombud", "politiker", "beslut"], model: "I en representativ demokrati styr folket genom att välja politiker som fattar besluten. I Sverige väljs bland annat riksdagsledamöter som stiftar lagar. Väljarna kan byta ut dem i nästa val." },
  { id: "wr2", concept: "riksdag", topic: "riksdag", prompt: "Förklara skillnaden mellan riksdagen och regeringen.", points: ["Riksdagen är folkvald och beslutar om lagar och budget", "Riksdagen kontrollerar regeringen", "Regeringen styr och genomför besluten"], keywords: ["lag", "budget", "kontroll", "styr", "genomför", "statsminister", "ledamot"], model: "Riksdagen representerar folket, beslutar om lagar och budget och kontrollerar regeringen. Regeringen, med statsminister och ministrar, leder landet, lägger förslag och genomför det riksdagen har beslutat." },
  { id: "wr3", concept: "parlamentarism", topic: "riksdag", prompt: "Förklara vad parlamentarism innebär.", points: ["Regeringen beroende av riksdagen", "Stöd eller tolerans krävs", "Kan tvingas avgå"], keywords: ["regering", "riksdag", "stöd", "förtroende", "toler", "avgå"], model: "Parlamentarism betyder att regeringen måste ha stöd av eller tolereras av riksdagen för att styra. Saknas förtroendet kan regeringen tvingas avgå. Den verkställande makten är alltså knuten till parlamentet." },
  { id: "wr4", concept: "liberalism", topic: "ideologi", prompt: "Jämför liberalism och socialism.", points: ["Frihet och rättigheter kontra jämlikhet", "Olika syn på statens roll i ekonomin", "Inte bara ett ord per ideologi"], keywords: ["frihet", "jämlik", "individ", "omfördel", "stat", "skillnad"], model: "Liberalismen betonar individens frihet och rättigheter. Socialismen betonar jämlikhet, solidaritet och att minska ekonomiska skillnader. De skiljer sig i hur mycket staten ska ingripa i ekonomin." },
  { id: "wr5", concept: "proportionella", topic: "val", prompt: "Förklara vad ett proportionellt valsystem innebär.", points: ["Mandat ungefär enligt röstandel", "Kontrast mot vinnaren-tar-allt", "Koppling till 349 mandat"], keywords: ["mandat", "andel", "röst", "proportion"], model: "I ett proportionellt valsystem ska partiernas antal mandat ungefär motsvara deras andel av rösterna. Får ett parti 20 procent av rösterna ska det ungefär få 20 procent av platserna, med hänsyn till hur räkningen och spärrar fungerar." },
  { id: "wr6", concept: "demokrati", topic: "demokrati", prompt: "Förklara skillnaden mellan demokrati och diktatur.", points: ["Folkstyre, val och rättigheter", "Maktkoncentration i diktatur", "Opposition och yttrandefrihet"], keywords: ["folk", "val", "rättighet", "opposition", "makt", "yttrand"], model: "Demokrati är folkstyre med fria val, flera partier och politiska rättigheter. I en diktatur koncentreras makten, rättigheter begränsas och opposition kan tystas. Val kan förekomma i en diktatur utan att de är fria." },
  { id: "wr7", concept: "monarki", topic: "riksdag", prompt: "Förklara vad det betyder att Sverige är en konstitutionell monarki.", points: ["Det finns en kung/drottning som statschef", "Statschefen saknar politisk makt", "Politiken styrs av folkvalda organ och grundlagar"], keywords: ["kung", "drottning", "statschef", "makt", "grundlag", "politisk"], model: "Sverige har en monark som statschef, men den politiska makten ligger inte hos statschefen. Lagar och regering avgörs av folkvalda organ enligt grundlagarna. Därför är monarkin konstitutionell." }
];

const MATCH_PAIRS = [
  { id: "liberalism", left: "Liberalism", right: "En ideologi som betonar individens frihet" },
  { id: "parlamentarism", left: "Parlamentarism", right: "Ett system där regeringens ställning är beroende av riksdagen" },
  { id: "mandat", left: "Mandat", right: "En plats i en politisk församling" },
  { id: "proportionella", left: "Proportionella val", right: "Ett valsystem där mandat ungefär motsvarar röstandelen" },
  { id: "konservatism", left: "Konservatism", right: "En ideologi som betonar tradition och försiktig förändring" },
  { id: "socialism", left: "Socialism", right: "En ideologi som betonar jämlikhet och minskade skillnader" },
  { id: "representativ", left: "Representativ demokrati", right: "Folket väljer ombud som fattar besluten" },
  { id: "sparr", left: "4-procentsspärren", right: "Normal gräns för att få mandat i riksdagen" },
  { id: "riksdag", left: "Riksdagen", right: "Stiftar lagar, beslutar om budget och kontrollerar regeringen" },
  { id: "regering", left: "Regeringen", right: "Styr landet och genomför riksdagens beslut" },
  { id: "region", left: "Regionen", right: "Ansvarar bland annat för sjukvård och kollektivtrafik" },
  { id: "kommun", left: "Kommunen", right: "Ansvarar bland annat för grundskola och äldreomsorg" },
  { id: "diktatur", left: "Diktatur", right: "Makten koncentreras och politiska rättigheter begränsas" },
  { id: "demokrati", left: "Demokrati", right: "Folkstyre med fria val och politiska rättigheter" },
  { id: "monarki", left: "Konstitutionell monarki", right: "Statschef utan politisk makt, bunden av grundlagarna" },
  { id: "ideologi", left: "Ideologi", right: "En samling idéer om hur samhället bör styras" }
];
