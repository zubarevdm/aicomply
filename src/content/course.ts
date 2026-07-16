import type { Locale } from "@/i18n/config";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string };

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  blocks: Block[];
}

export interface Question {
  id: string;
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface CourseContent {
  lessons: Lesson[];
  quiz: Question[];
}

export const COURSE = {
  slug: "ai-literacy-article-4",
  version: "2026.1",
  passMark: 80,
  titleByLocale: {
    en: "AI Literacy — EU AI Act, Article 4",
    nl: "AI-geletterdheid — EU AI-verordening, Artikel 4",
    de: "KI-Kompetenz — EU-KI-Verordnung, Artikel 4",
  } as Record<Locale, string>,
};

const en: CourseContent = {
  lessons: [
    {
      id: "why",
      title: "Why this matters: the EU AI Act & Article 4",
      minutes: 4,
      blocks: [
        { type: "p", text: "The EU Artificial Intelligence Act (Regulation (EU) 2024/1689) is the world's first comprehensive law on AI. It applies across the European Union and reaches any organisation that develops, deploys or simply uses AI systems in its work." },
        { type: "p", text: "Article 4 sets out the AI literacy obligation. Since 2 February 2025 it has required providers and deployers of AI systems to take measures to ensure, to their best extent, a sufficient level of AI literacy among their staff and anyone operating AI on their behalf." },
        { type: "callout", title: "What this means for your company", text: "If your employees use AI tools at work — even a general assistant like ChatGPT — your organisation must be able to show it has trained them to understand and use AI responsibly. This course plus the certificate is that evidence." },
        { type: "list", items: [
          "Applies regardless of company size — there is no small-business exemption from Article 4.",
          "There was no transition period: the literacy duty took effect in February 2025.",
          "Serious breaches of the AI Act can attract fines up to €35 million or 7% of worldwide annual turnover.",
        ] },
      ],
    },
    {
      id: "what-is-ai",
      title: "What is AI, really?",
      minutes: 5,
      blocks: [
        { type: "p", text: "'AI' covers a family of techniques that let software perform tasks we associate with human intelligence — recognising patterns, generating language, making predictions. Most modern systems are built on machine learning: instead of being explicitly programmed with rules, they learn statistical patterns from large amounts of data." },
        { type: "h", text: "Generative AI and large language models" },
        { type: "p", text: "Tools like ChatGPT, Copilot and Gemini are large language models (LLMs). They are trained to predict the most likely next piece of text given everything before it. That single mechanism is powerful enough to draft emails, summarise documents and write code — but it is prediction, not understanding." },
        { type: "callout", title: "Key idea", text: "An LLM does not 'know' facts the way a database does. It produces text that is statistically plausible. Plausible and correct are not the same thing — which is why human judgement stays essential." },
      ],
    },
    {
      id: "limits",
      title: "Capabilities and limits",
      minutes: 4,
      blocks: [
        { type: "p", text: "Understanding where AI fails is the core of AI literacy. The same model that writes a flawless paragraph can also state something false with complete confidence." },
        { type: "list", items: [
          "Hallucination: the model invents facts, citations or figures that look credible but are wrong.",
          "Bias: models reflect patterns in their training data, which can embed unfair or discriminatory assumptions.",
          "No live knowledge: a model only knows what it was trained on unless it is connected to live data or search.",
          "Confident errors: AI rarely signals uncertainty — wrong answers are delivered in the same authoritative tone as right ones.",
        ] },
        { type: "callout", title: "Practical rule", text: "Treat AI output as a capable draft from a fast but unreliable junior colleague: useful, but always checked by a competent human before it is used or sent." },
      ],
    },
    {
      id: "safe-use",
      title: "Using AI safely at work",
      minutes: 5,
      blocks: [
        { type: "h", text: "Protect data and confidentiality" },
        { type: "p", text: "Anything you paste into a public AI tool may leave your organisation's control and, depending on the service, be used to improve the model. Never enter personal data of customers or colleagues, trade secrets, credentials, or anything covered by confidentiality or the GDPR into a tool that is not approved for it." },
        { type: "h", text: "Good prompting hygiene" },
        { type: "list", items: [
          "Use approved, business-tier tools where your data is not used for training.",
          "Strip or anonymise sensitive details before asking for help.",
          "Verify every fact, number, name and citation independently before relying on it.",
          "Keep a human decision-maker accountable for any output that affects people.",
        ] },
        { type: "callout", title: "If in doubt, don't paste it", text: "When you are unsure whether information is safe to share with an AI tool, treat it as confidential and ask before proceeding." },
      ],
    },
    {
      id: "risk-tiers",
      title: "Risk classification and transparency",
      minutes: 4,
      blocks: [
        { type: "p", text: "The AI Act regulates systems according to the risk they pose. Knowing which tier a use case falls into tells you what obligations apply." },
        { type: "list", items: [
          "Unacceptable risk: practices that are banned outright, such as social scoring or manipulative systems.",
          "High risk: AI used in sensitive areas like recruitment, credit, education or critical infrastructure — heavy obligations apply.",
          "Limited risk: systems like chatbots or generative tools — mainly transparency duties, e.g. telling people they are dealing with AI or that content is AI-generated.",
          "Minimal risk: most everyday tools, such as spam filters — few specific obligations.",
        ] },
        { type: "callout", title: "Transparency in practice", text: "If your team uses AI to interact with customers or to create content shown to the public, you generally must make clear that AI is involved. When in doubt, disclose." },
      ],
    },
    {
      id: "responsibilities",
      title: "Your responsibilities and staying compliant",
      minutes: 3,
      blocks: [
        { type: "p", text: "AI literacy is not a one-off. Tools, risks and rules keep changing — including the 2026 Omnibus revisions that adjusted timelines and obligations. Staying compliant means keeping habits and records up to date." },
        { type: "list", items: [
          "Maintain human oversight: a person remains responsible for AI-assisted decisions.",
          "Escalate edge cases and anything affecting someone's rights, safety or money to a human owner.",
          "Follow your organisation's AI usage policy and report incidents or misuse.",
          "Keep records — your certificate and the company dashboard are part of your audit trail.",
        ] },
        { type: "callout", title: "You're almost there", text: "Complete the short quiz to confirm your understanding and receive your AI literacy compliance certificate." },
      ],
    },
  ],
  quiz: [
    { id: "q1", q: "Since when has the Article 4 AI literacy obligation applied?", options: ["It is not yet in force", "Since 2 February 2025", "Only from 2027", "Only for companies over 250 staff"], correct: 1, explanation: "The AI literacy obligation under Article 4 has applied since 2 February 2025, with no transition period and no size exemption." },
    { id: "q2", q: "Which companies must ensure staff AI literacy?", options: ["Only large enterprises", "Only AI developers", "Any organisation whose staff use AI systems at work", "Only public bodies"], correct: 2, explanation: "Article 4 applies to providers and deployers — any organisation whose staff use AI in the course of work, regardless of size." },
    { id: "q3", q: "What does it mean when a language model 'hallucinates'?", options: ["It crashes", "It refuses to answer", "It produces confident but false information", "It works offline"], correct: 2, explanation: "Hallucination is when a model generates plausible-sounding but incorrect content — a key reason human verification is required." },
    { id: "q4", q: "What should you never paste into a public, non-approved AI tool?", options: ["A grammar question", "Personal data, secrets or confidential information", "A maths problem", "A public news headline"], correct: 1, explanation: "Personal data, credentials, trade secrets and confidential information must not be entered into tools not approved for them — this protects the GDPR and confidentiality." },
    { id: "q5", q: "How should you treat the factual claims in AI output?", options: ["Trust them fully", "Verify them independently before relying on them", "Ignore them", "Forward them without reading"], correct: 1, explanation: "AI delivers wrong and right answers in the same confident tone, so every fact, figure and citation must be verified by a competent human." },
    { id: "q6", q: "Under the AI Act, a customer-facing chatbot is typically which risk tier?", options: ["Unacceptable risk", "High risk", "Limited risk (transparency duties)", "No regulation applies"], correct: 2, explanation: "Chatbots and generative tools usually fall under limited risk, where the main duty is transparency — making clear that people are dealing with AI." },
    { id: "q7", q: "Which is an example of a high-risk AI use case?", options: ["A spam filter", "AI screening job applicants", "An email autocomplete", "A weather app"], correct: 1, explanation: "AI used in recruitment, credit, education or critical infrastructure is high-risk and carries heavy obligations under the AI Act." },
    { id: "q8", q: "What is the role of human oversight in compliant AI use?", options: ["It is optional", "A person stays accountable for AI-assisted decisions", "It only applies to developers", "It was removed by the 2026 Omnibus"], correct: 1, explanation: "Human oversight means a responsible person remains accountable for decisions made with AI assistance — especially where rights, safety or money are involved." },
  ],
};

const nl: CourseContent = {
  lessons: [
    {
      id: "why",
      title: "Waarom dit telt: de EU AI-verordening & Artikel 4",
      minutes: 4,
      blocks: [
        { type: "p", text: "De EU-verordening inzake artificiële intelligentie (Verordening (EU) 2024/1689) is 's werelds eerste alomvattende AI-wet. Ze geldt in de hele Europese Unie en raakt elke organisatie die AI-systemen ontwikkelt, inzet of simpelweg gebruikt in haar werk." },
        { type: "p", text: "Artikel 4 bevat de verplichting tot AI-geletterdheid. Sinds 2 februari 2025 verplicht het aanbieders en gebruiksverantwoordelijken van AI-systemen om maatregelen te nemen die, zo veel mogelijk, zorgen voor voldoende AI-geletterdheid bij hun personeel en wie namens hen AI bedient." },
        { type: "callout", title: "Wat dit voor je bedrijf betekent", text: "Als je medewerkers AI-tools gebruiken op het werk — zelfs een algemene assistent als ChatGPT — moet je organisatie kunnen aantonen dat ze getraind zijn om AI verantwoord te begrijpen en gebruiken. Deze cursus plus het certificaat is dat bewijs." },
        { type: "list", items: [
          "Geldt ongeacht de bedrijfsgrootte — er is geen vrijstelling voor kleine bedrijven onder Artikel 4.",
          "Er was geen overgangsperiode: de geletterdheidsplicht ging in februari 2025 in.",
          "Ernstige inbreuken op de AI-verordening kunnen boetes tot €35 miljoen of 7% van de wereldwijde jaaromzet opleveren.",
        ] },
      ],
    },
    {
      id: "what-is-ai",
      title: "Wat is AI eigenlijk?",
      minutes: 5,
      blocks: [
        { type: "p", text: "'AI' omvat een familie van technieken waarmee software taken uitvoert die we met menselijke intelligentie associëren — patronen herkennen, taal genereren, voorspellingen doen. De meeste moderne systemen draaien op machine learning: ze worden niet expliciet met regels geprogrammeerd, maar leren statistische patronen uit grote hoeveelheden data." },
        { type: "h", text: "Generatieve AI en grote taalmodellen" },
        { type: "p", text: "Tools als ChatGPT, Copilot en Gemini zijn grote taalmodellen (LLM's). Ze zijn getraind om het meest waarschijnlijke volgende stukje tekst te voorspellen op basis van alles ervoor. Dat ene mechanisme volstaat om e-mails op te stellen, documenten samen te vatten en code te schrijven — maar het is voorspelling, geen begrip." },
        { type: "callout", title: "Kerngedachte", text: "Een LLM 'kent' feiten niet zoals een database dat doet. Het produceert tekst die statistisch plausibel is. Plausibel en correct zijn niet hetzelfde — daarom blijft menselijk oordeel essentieel." },
      ],
    },
    {
      id: "limits",
      title: "Mogelijkheden en grenzen",
      minutes: 4,
      blocks: [
        { type: "p", text: "Begrijpen waar AI faalt is de kern van AI-geletterdheid. Hetzelfde model dat een vlekkeloze alinea schrijft, kan ook iets onjuists met volledige overtuiging beweren." },
        { type: "list", items: [
          "Hallucinatie: het model verzint feiten, bronnen of cijfers die geloofwaardig lijken maar fout zijn.",
          "Bias: modellen weerspiegelen patronen in hun trainingsdata, die oneerlijke of discriminerende aannames kunnen bevatten.",
          "Geen actuele kennis: een model weet alleen waarop het is getraind, tenzij het verbonden is met live data of zoekfunctie.",
          "Zelfverzekerde fouten: AI signaleert zelden onzekerheid — foute antwoorden klinken even stellig als juiste.",
        ] },
        { type: "callout", title: "Praktische regel", text: "Behandel AI-output als een sterke concepttekst van een snelle maar onbetrouwbare junior collega: nuttig, maar altijd gecontroleerd door een bekwaam mens voordat ze gebruikt of verstuurd wordt." },
      ],
    },
    {
      id: "safe-use",
      title: "AI veilig gebruiken op het werk",
      minutes: 5,
      blocks: [
        { type: "h", text: "Bescherm data en vertrouwelijkheid" },
        { type: "p", text: "Alles wat je in een publieke AI-tool plakt, kan de controle van je organisatie verlaten en, afhankelijk van de dienst, gebruikt worden om het model te verbeteren. Voer nooit persoonsgegevens van klanten of collega's, bedrijfsgeheimen, inloggegevens of iets dat onder vertrouwelijkheid of de AVG valt in een tool die daar niet voor is goedgekeurd." },
        { type: "h", text: "Goede prompt-hygiëne" },
        { type: "list", items: [
          "Gebruik goedgekeurde zakelijke tools waar je data niet voor training wordt gebruikt.",
          "Verwijder of anonimiseer gevoelige details voordat je om hulp vraagt.",
          "Verifieer elk feit, getal, naam en bron onafhankelijk voordat je erop vertrouwt.",
          "Houd een menselijke beslisser verantwoordelijk voor output die mensen raakt.",
        ] },
        { type: "callout", title: "Bij twijfel: niet plakken", text: "Weet je niet zeker of informatie veilig met een AI-tool gedeeld kan worden, behandel het dan als vertrouwelijk en vraag het na voordat je verdergaat." },
      ],
    },
    {
      id: "risk-tiers",
      title: "Risicoclassificatie en transparantie",
      minutes: 4,
      blocks: [
        { type: "p", text: "De AI-verordening reguleert systemen naar het risico dat ze vormen. Weten in welke categorie een toepassing valt, vertelt je welke verplichtingen gelden." },
        { type: "list", items: [
          "Onaanvaardbaar risico: praktijken die volledig verboden zijn, zoals social scoring of manipulatieve systemen.",
          "Hoog risico: AI in gevoelige gebieden als werving, krediet, onderwijs of kritieke infrastructuur — zware verplichtingen gelden.",
          "Beperkt risico: systemen als chatbots of generatieve tools — vooral transparantieplichten, bv. mensen vertellen dat ze met AI te maken hebben of dat content door AI is gemaakt.",
          "Minimaal risico: de meeste alledaagse tools, zoals spamfilters — weinig specifieke verplichtingen.",
        ] },
        { type: "callout", title: "Transparantie in de praktijk", text: "Gebruikt je team AI om met klanten te communiceren of om content te maken die publiek wordt getoond, dan moet je doorgaans duidelijk maken dat AI betrokken is. Bij twijfel: vermeld het." },
      ],
    },
    {
      id: "responsibilities",
      title: "Je verantwoordelijkheden en compliant blijven",
      minutes: 3,
      blocks: [
        { type: "p", text: "AI-geletterdheid is geen eenmalige zaak. Tools, risico's en regels blijven veranderen — inclusief de Omnibus-herzieningen van 2026 die termijnen en verplichtingen aanpasten. Compliant blijven betekent gewoontes en dossiers actueel houden." },
        { type: "list", items: [
          "Behoud menselijk toezicht: een persoon blijft verantwoordelijk voor AI-ondersteunde beslissingen.",
          "Escaleer grensgevallen en alles wat iemands rechten, veiligheid of geld raakt naar een menselijke eigenaar.",
          "Volg het AI-gebruiksbeleid van je organisatie en meld incidenten of misbruik.",
          "Houd dossiers bij — je certificaat en het bedrijfsdashboard zijn deel van je audittrail.",
        ] },
        { type: "callout", title: "Je bent er bijna", text: "Maak de korte toets om je begrip te bevestigen en je AI-geletterdheidscertificaat te ontvangen." },
      ],
    },
  ],
  quiz: [
    { id: "q1", q: "Sinds wanneer geldt de AI-geletterdheidsplicht van Artikel 4?", options: ["Nog niet van kracht", "Sinds 2 februari 2025", "Pas vanaf 2027", "Alleen voor bedrijven met 250+ medewerkers"], correct: 1, explanation: "De AI-geletterdheidsplicht onder Artikel 4 geldt sinds 2 februari 2025, zonder overgangsperiode en zonder vrijstelling op basis van grootte." },
    { id: "q2", q: "Welke bedrijven moeten AI-geletterdheid van personeel waarborgen?", options: ["Alleen grote ondernemingen", "Alleen AI-ontwikkelaars", "Elke organisatie waarvan personeel AI-systemen gebruikt op het werk", "Alleen overheidsinstanties"], correct: 2, explanation: "Artikel 4 geldt voor aanbieders en gebruiksverantwoordelijken — elke organisatie waarvan personeel AI gebruikt in het werk, ongeacht grootte." },
    { id: "q3", q: "Wat betekent het als een taalmodel 'hallucineert'?", options: ["Het crasht", "Het weigert te antwoorden", "Het produceert zelfverzekerde maar onjuiste informatie", "Het werkt offline"], correct: 2, explanation: "Hallucinatie is wanneer een model plausibel klinkende maar onjuiste inhoud genereert — een kernreden waarom menselijke verificatie nodig is." },
    { id: "q4", q: "Wat mag je nooit in een publieke, niet-goedgekeurde AI-tool plakken?", options: ["Een grammaticavraag", "Persoonsgegevens, geheimen of vertrouwelijke informatie", "Een rekensom", "Een publieke nieuwskop"], correct: 1, explanation: "Persoonsgegevens, inloggegevens, bedrijfsgeheimen en vertrouwelijke informatie horen niet in tools die daar niet voor zijn goedgekeurd — dit beschermt de AVG en vertrouwelijkheid." },
    { id: "q5", q: "Hoe behandel je de feitelijke beweringen in AI-output?", options: ["Volledig vertrouwen", "Onafhankelijk verifiëren voordat je erop vertrouwt", "Negeren", "Doorsturen zonder lezen"], correct: 1, explanation: "AI levert foute en juiste antwoorden in dezelfde zelfverzekerde toon, dus elk feit, getal en bron moet door een bekwaam mens worden geverifieerd." },
    { id: "q6", q: "Onder de AI-verordening valt een klantgerichte chatbot meestal in welke risicocategorie?", options: ["Onaanvaardbaar risico", "Hoog risico", "Beperkt risico (transparantieplichten)", "Geen regulering van toepassing"], correct: 2, explanation: "Chatbots en generatieve tools vallen meestal onder beperkt risico, waar de hoofdplicht transparantie is — duidelijk maken dat mensen met AI te maken hebben." },
    { id: "q7", q: "Wat is een voorbeeld van een AI-toepassing met hoog risico?", options: ["Een spamfilter", "AI die sollicitanten screent", "Een e-mail-autocomplete", "Een weer-app"], correct: 1, explanation: "AI in werving, krediet, onderwijs of kritieke infrastructuur is hoog risico en draagt zware verplichtingen onder de AI-verordening." },
    { id: "q8", q: "Wat is de rol van menselijk toezicht bij compliant AI-gebruik?", options: ["Het is optioneel", "Een persoon blijft verantwoordelijk voor AI-ondersteunde beslissingen", "Het geldt alleen voor ontwikkelaars", "Het is geschrapt door de Omnibus 2026"], correct: 1, explanation: "Menselijk toezicht betekent dat een verantwoordelijke persoon aansprakelijk blijft voor beslissingen met AI-hulp — vooral waar rechten, veiligheid of geld in het spel zijn." },
  ],
};

const de: CourseContent = {
  lessons: [
    {
      id: "why",
      title: "Warum das zählt: die EU-KI-Verordnung & Artikel 4",
      minutes: 4,
      blocks: [
        { type: "p", text: "Die EU-Verordnung über künstliche Intelligenz (Verordnung (EU) 2024/1689) ist das weltweit erste umfassende KI-Gesetz. Sie gilt in der gesamten Europäischen Union und betrifft jede Organisation, die KI-Systeme entwickelt, einsetzt oder in ihrer Arbeit schlicht nutzt." },
        { type: "p", text: "Artikel 4 enthält die Pflicht zur KI-Kompetenz. Seit dem 2. Februar 2025 verpflichtet er Anbieter und Betreiber von KI-Systemen, Maßnahmen zu ergreifen, die nach besten Kräften ein ausreichendes Maß an KI-Kompetenz ihres Personals und aller, die KI in ihrem Auftrag bedienen, sicherstellen." },
        { type: "callout", title: "Was das für Ihr Unternehmen bedeutet", text: "Wenn Ihre Mitarbeitenden bei der Arbeit KI-Tools nutzen — auch nur einen allgemeinen Assistenten wie ChatGPT — muss Ihre Organisation nachweisen können, dass sie geschult wurden, KI verantwortungsvoll zu verstehen und zu nutzen. Dieser Kurs samt Zertifikat ist dieser Nachweis." },
        { type: "list", items: [
          "Gilt unabhängig von der Unternehmensgröße — es gibt keine Ausnahme für Kleinunternehmen unter Artikel 4.",
          "Es gab keine Übergangsfrist: Die Kompetenzpflicht trat im Februar 2025 in Kraft.",
          "Schwere Verstöße gegen die KI-Verordnung können Bußgelder bis zu 35 Mio. € oder 7% des weltweiten Jahresumsatzes nach sich ziehen.",
        ] },
      ],
    },
    {
      id: "what-is-ai",
      title: "Was ist KI eigentlich?",
      minutes: 5,
      blocks: [
        { type: "p", text: "'KI' umfasst eine Familie von Techniken, mit denen Software Aufgaben übernimmt, die wir mit menschlicher Intelligenz verbinden — Muster erkennen, Sprache erzeugen, Vorhersagen treffen. Die meisten modernen Systeme beruhen auf maschinellem Lernen: Statt explizit mit Regeln programmiert zu werden, lernen sie statistische Muster aus großen Datenmengen." },
        { type: "h", text: "Generative KI und große Sprachmodelle" },
        { type: "p", text: "Tools wie ChatGPT, Copilot und Gemini sind große Sprachmodelle (LLMs). Sie sind darauf trainiert, das wahrscheinlichste nächste Textstück auf Basis von allem Vorhergehenden vorherzusagen. Dieser eine Mechanismus genügt, um E-Mails zu verfassen, Dokumente zusammenzufassen und Code zu schreiben — doch es ist Vorhersage, kein Verstehen." },
        { type: "callout", title: "Kerngedanke", text: "Ein LLM 'kennt' Fakten nicht wie eine Datenbank. Es erzeugt statistisch plausiblen Text. Plausibel und korrekt sind nicht dasselbe — deshalb bleibt menschliches Urteil unverzichtbar." },
      ],
    },
    {
      id: "limits",
      title: "Fähigkeiten und Grenzen",
      minutes: 4,
      blocks: [
        { type: "p", text: "Zu verstehen, wo KI versagt, ist der Kern der KI-Kompetenz. Dasselbe Modell, das einen makellosen Absatz schreibt, kann auch etwas Falsches mit voller Überzeugung behaupten." },
        { type: "list", items: [
          "Halluzination: Das Modell erfindet Fakten, Quellen oder Zahlen, die glaubwürdig wirken, aber falsch sind.",
          "Verzerrung (Bias): Modelle spiegeln Muster ihrer Trainingsdaten, die unfaire oder diskriminierende Annahmen enthalten können.",
          "Kein aktuelles Wissen: Ein Modell kennt nur, worauf es trainiert wurde, sofern es nicht mit Live-Daten oder Suche verbunden ist.",
          "Selbstsichere Fehler: KI signalisiert selten Unsicherheit — falsche Antworten kommen im selben überzeugten Ton wie richtige.",
        ] },
        { type: "callout", title: "Praktische Regel", text: "Behandeln Sie KI-Ausgaben wie einen starken Entwurf einer schnellen, aber unzuverlässigen Nachwuchskraft: nützlich, aber stets von einem kompetenten Menschen geprüft, bevor er genutzt oder versendet wird." },
      ],
    },
    {
      id: "safe-use",
      title: "KI sicher bei der Arbeit nutzen",
      minutes: 5,
      blocks: [
        { type: "h", text: "Daten und Vertraulichkeit schützen" },
        { type: "p", text: "Alles, was Sie in ein öffentliches KI-Tool einfügen, kann die Kontrolle Ihrer Organisation verlassen und — je nach Dienst — zur Verbesserung des Modells genutzt werden. Geben Sie niemals personenbezogene Daten von Kunden oder Kolleg:innen, Geschäftsgeheimnisse, Zugangsdaten oder etwas, das der Vertraulichkeit oder der DSGVO unterliegt, in ein dafür nicht freigegebenes Tool ein." },
        { type: "h", text: "Gute Prompt-Hygiene" },
        { type: "list", items: [
          "Nutzen Sie freigegebene Business-Tools, bei denen Ihre Daten nicht zum Training verwendet werden.",
          "Entfernen oder anonymisieren Sie sensible Details, bevor Sie um Hilfe bitten.",
          "Prüfen Sie jeden Fakt, jede Zahl, jeden Namen und jede Quelle unabhängig, bevor Sie sich darauf verlassen.",
          "Halten Sie eine menschliche Entscheidungsinstanz für jede Ausgabe verantwortlich, die Menschen betrifft.",
        ] },
        { type: "callout", title: "Im Zweifel nicht einfügen", text: "Wenn Sie unsicher sind, ob Informationen sicher mit einem KI-Tool geteilt werden können, behandeln Sie sie als vertraulich und fragen Sie nach, bevor Sie fortfahren." },
      ],
    },
    {
      id: "risk-tiers",
      title: "Risikoklassifizierung und Transparenz",
      minutes: 4,
      blocks: [
        { type: "p", text: "Die KI-Verordnung reguliert Systeme nach dem Risiko, das sie darstellen. Zu wissen, in welche Stufe ein Anwendungsfall fällt, sagt Ihnen, welche Pflichten gelten." },
        { type: "list", items: [
          "Unannehmbares Risiko: vollständig verbotene Praktiken wie Social Scoring oder manipulative Systeme.",
          "Hohes Risiko: KI in sensiblen Bereichen wie Personalauswahl, Kredit, Bildung oder kritischer Infrastruktur — es gelten umfangreiche Pflichten.",
          "Begrenztes Risiko: Systeme wie Chatbots oder generative Tools — vor allem Transparenzpflichten, z. B. Menschen mitteilen, dass sie mit KI zu tun haben oder dass Inhalte KI-erzeugt sind.",
          "Minimales Risiko: die meisten Alltagstools wie Spamfilter — kaum spezifische Pflichten.",
        ] },
        { type: "callout", title: "Transparenz in der Praxis", text: "Nutzt Ihr Team KI, um mit Kunden zu interagieren oder öffentlich gezeigte Inhalte zu erstellen, müssen Sie in der Regel kenntlich machen, dass KI beteiligt ist. Im Zweifel offenlegen." },
      ],
    },
    {
      id: "responsibilities",
      title: "Ihre Verantwortung und compliant bleiben",
      minutes: 3,
      blocks: [
        { type: "p", text: "KI-Kompetenz ist keine einmalige Sache. Tools, Risiken und Regeln ändern sich laufend — einschließlich der Omnibus-Revisionen 2026, die Fristen und Pflichten anpassten. Compliant zu bleiben heißt, Gewohnheiten und Nachweise aktuell zu halten." },
        { type: "list", items: [
          "Menschliche Aufsicht wahren: Eine Person bleibt für KI-gestützte Entscheidungen verantwortlich.",
          "Grenzfälle und alles, was Rechte, Sicherheit oder Geld einer Person betrifft, an eine:n menschliche:n Verantwortliche:n eskalieren.",
          "Die KI-Nutzungsrichtlinie Ihrer Organisation befolgen und Vorfälle oder Missbrauch melden.",
          "Nachweise führen — Ihr Zertifikat und das Unternehmens-Dashboard gehören zu Ihrem Prüfpfad.",
        ] },
        { type: "callout", title: "Fast geschafft", text: "Absolvieren Sie das kurze Quiz, um Ihr Verständnis zu bestätigen und Ihr KI-Kompetenz-Zertifikat zu erhalten." },
      ],
    },
  ],
  quiz: [
    { id: "q1", q: "Seit wann gilt die KI-Kompetenzpflicht aus Artikel 4?", options: ["Noch nicht in Kraft", "Seit dem 2. Februar 2025", "Erst ab 2027", "Nur für Unternehmen über 250 Mitarbeitende"], correct: 1, explanation: "Die KI-Kompetenzpflicht nach Artikel 4 gilt seit dem 2. Februar 2025, ohne Übergangsfrist und ohne Größenausnahme." },
    { id: "q2", q: "Welche Unternehmen müssen die KI-Kompetenz des Personals sicherstellen?", options: ["Nur Großunternehmen", "Nur KI-Entwickler", "Jede Organisation, deren Personal bei der Arbeit KI-Systeme nutzt", "Nur Behörden"], correct: 2, explanation: "Artikel 4 gilt für Anbieter und Betreiber — jede Organisation, deren Personal KI bei der Arbeit nutzt, unabhängig von der Größe." },
    { id: "q3", q: "Was bedeutet es, wenn ein Sprachmodell 'halluziniert'?", options: ["Es stürzt ab", "Es verweigert die Antwort", "Es erzeugt selbstsichere, aber falsche Informationen", "Es arbeitet offline"], correct: 2, explanation: "Halluzination ist, wenn ein Modell plausibel klingende, aber falsche Inhalte erzeugt — ein Hauptgrund, warum menschliche Prüfung nötig ist." },
    { id: "q4", q: "Was sollten Sie niemals in ein öffentliches, nicht freigegebenes KI-Tool einfügen?", options: ["Eine Grammatikfrage", "Personenbezogene Daten, Geheimnisse oder vertrauliche Informationen", "Eine Rechenaufgabe", "Eine öffentliche Schlagzeile"], correct: 1, explanation: "Personenbezogene Daten, Zugangsdaten, Geschäftsgeheimnisse und vertrauliche Informationen gehören nicht in dafür nicht freigegebene Tools — das schützt DSGVO und Vertraulichkeit." },
    { id: "q5", q: "Wie sollten Sie die Tatsachenbehauptungen in KI-Ausgaben behandeln?", options: ["Voll vertrauen", "Unabhängig prüfen, bevor Sie sich darauf verlassen", "Ignorieren", "Ungelesen weiterleiten"], correct: 1, explanation: "KI liefert falsche und richtige Antworten im selben überzeugten Ton, daher muss jeder Fakt, jede Zahl und jede Quelle von einem kompetenten Menschen geprüft werden." },
    { id: "q6", q: "Ein kundenorientierter Chatbot fällt nach der KI-Verordnung meist in welche Risikostufe?", options: ["Unannehmbares Risiko", "Hohes Risiko", "Begrenztes Risiko (Transparenzpflichten)", "Keine Regulierung anwendbar"], correct: 2, explanation: "Chatbots und generative Tools fallen meist unter begrenztes Risiko, wo die Hauptpflicht Transparenz ist — kenntlich machen, dass Menschen mit KI zu tun haben." },
    { id: "q7", q: "Was ist ein Beispiel für einen KI-Anwendungsfall mit hohem Risiko?", options: ["Ein Spamfilter", "KI, die Bewerber:innen vorselektiert", "Eine E-Mail-Autovervollständigung", "Eine Wetter-App"], correct: 1, explanation: "KI in Personalauswahl, Kredit, Bildung oder kritischer Infrastruktur ist hochriskant und trägt umfangreiche Pflichten unter der KI-Verordnung." },
    { id: "q8", q: "Welche Rolle spielt menschliche Aufsicht bei compliantem KI-Einsatz?", options: ["Sie ist optional", "Eine Person bleibt für KI-gestützte Entscheidungen verantwortlich", "Sie gilt nur für Entwickler", "Sie wurde durch die Omnibus 2026 abgeschafft"], correct: 1, explanation: "Menschliche Aufsicht bedeutet, dass eine verantwortliche Person für mit KI getroffene Entscheidungen haftbar bleibt — besonders wo Rechte, Sicherheit oder Geld betroffen sind." },
  ],
};

export const COURSE_CONTENT: Record<Locale, CourseContent> = { en, nl, de };

export function getCourseContent(locale: Locale): CourseContent {
  return COURSE_CONTENT[locale] ?? COURSE_CONTENT.en;
}
