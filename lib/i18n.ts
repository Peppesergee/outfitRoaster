import { RoastLanguage } from './types';

const translations = {
  en: {
    appName: 'Outfit Roaster',
    ok: 'OK',
    cancel: 'Cancel',
    delete: 'Delete',
    error: 'Error',

    // Home
    greetingAnon: 'Hey there 👋',
    greeting: (name: string) => `Hey, ${name} 👋`,
    roastsLeftOne: '1 roast left today',
    roastsLeft: (n: number) => `${n} roasts left today`,
    outfitPlaceholder: 'Your outfit goes here',
    takePhoto: 'Take Photo',
    gallery: 'Gallery',
    cameraHint: 'Point the camera at your full outfit for the best roast',
    roastTone: 'ROAST TONE',
    toneBrutal: '🔥 Brutal',
    toneIronic: '😏 Ironic',
    toneKind: '🌱 Kind',
    languageLabel: 'LANGUAGE',
    roastMe: 'Roast Me 🔥',
    cameraPermTitle: 'Camera needed',
    cameraPermBody: 'Please allow camera access in Settings.',
    galleryPermTitle: 'Gallery needed',
    galleryPermBody: 'Please allow photo library access in Settings.',
    dailyLimitTitle: 'Daily limit reached 🔥',
    dailyLimitBody: (n: number) =>
      `Free users get ${n} roasts per day. Upgrade to Roaster Pro for unlimited roasts!`,
    oops: 'Oops',
    somethingWrong: 'Something went wrong. Try again!',

    // History
    myRoasts: 'My Roasts',
    clearAll: 'Clear all',
    clearTitle: 'Clear history',
    clearBody: 'Delete all your roast history?',
    noRoastsTitle: 'No roasts yet',
    noRoastsBody: 'Take a photo of your outfit and get your first roast!',

    // Result
    yourScore: 'Your score',
    share: 'Share 📤',
    styleTip: 'Style Tip',
    savedTitle: 'Saved! 📸',
    savedBody: 'Your roast card has been saved to your photos.',
    shareError: 'Could not share the card. Try saving it first.',
    saveError: 'Could not save the card.',
    permissionNeeded: 'Permission needed',
    photoPermBody: 'Allow photo library access to save your roast card.',

    // Onboarding
    splashSubtitle: 'Your AI fashion judge.\nBrutal. Fun. Shareable.',
    splashBody:
      'Take a photo of your outfit and let AI tell you the truth — the whole truth, nothing but the truth.',
    letsGo: "Let's go 🔥",
    step1of2: 'Step 1 of 2',
    step2of2: 'Step 2 of 2',
    chooseTone: 'Choose your roast tone',
    howBrutal: 'How brutal should the AI be?',
    toneBrutalLabel: 'Brutal',
    toneIronicLabel: 'Ironic',
    toneConstructiveLabel: 'Constructive',
    toneBrutalDesc: 'No mercy. The full, unfiltered truth.',
    toneIronicDesc: 'Sharp, witty, deliciously sarcastic.',
    toneConstructiveDesc: 'Honest feedback with a hopeful spin.',
    continueBtn: 'Continue',
    whatsYourName: "What's your name?",
    nameBody: "We'll personalize your roasts.",
    nameOptional: "(Optional — skip if you're shy)",
    namePlaceholder: 'Your name or nickname',
    startRoasted: 'Start getting roasted',
    skipForNow: 'Skip for now',

    // Loading
    loadingTitle: 'The AI is judging...',
    loadingMessages: [
      'Analyzing the disaster...',
      'Consulting the fashion police...',
      'Calculating your style quotient...',
      'Cross-referencing with Vogue...',
      'Preparing the hard truth...',
      'Judging — but make it fashion...',
      'This might hurt a little...',
    ],

    // Date locale
    dateLocale: 'en-US',
  },

  it: {
    appName: 'Outfit Roaster',
    ok: 'OK',
    cancel: 'Annulla',
    delete: 'Elimina',
    error: 'Errore',

    // Home
    greetingAnon: 'Ciao 👋',
    greeting: (name: string) => `Ciao, ${name} 👋`,
    roastsLeftOne: '1 giudizio rimasto oggi',
    roastsLeft: (n: number) => `${n} giudizi rimasti oggi`,
    outfitPlaceholder: 'Metti qui il tuo outfit',
    takePhoto: 'Scatta Foto',
    gallery: 'Galleria',
    cameraHint: 'Inquadra il tuo outfit completo per il miglior giudizio',
    roastTone: 'TONO DEL GIUDIZIO',
    toneBrutal: '🔥 Brutale',
    toneIronic: '😏 Ironico',
    toneKind: '🌱 Gentile',
    languageLabel: 'LINGUA',
    roastMe: 'Giudicami 🔥',
    cameraPermTitle: 'Fotocamera necessaria',
    cameraPermBody: "Consenti l'accesso alla fotocamera nelle Impostazioni.",
    galleryPermTitle: 'Galleria necessaria',
    galleryPermBody: "Consenti l'accesso alla libreria foto nelle Impostazioni.",
    dailyLimitTitle: 'Limite raggiunto 🔥',
    dailyLimitBody: (n: number) =>
      `Gli utenti gratuiti hanno ${n} giudizi al giorno. Passa a Roaster Pro per giudizi illimitati!`,
    oops: 'Ops',
    somethingWrong: 'Qualcosa è andato storto. Riprova!',

    // History
    myRoasts: 'I Miei Giudizi',
    clearAll: 'Elimina tutto',
    clearTitle: 'Cancella cronologia',
    clearBody: 'Eliminare tutta la cronologia?',
    noRoastsTitle: 'Nessun giudizio ancora',
    noRoastsBody: 'Scatta una foto del tuo outfit e ricevi il tuo primo giudizio!',

    // Result
    yourScore: 'Il tuo punteggio',
    share: 'Condividi 📤',
    styleTip: 'Consiglio di Stile',
    savedTitle: 'Salvato! 📸',
    savedBody: 'La card è stata salvata nelle tue foto.',
    shareError: 'Impossibile condividere. Prova a salvarla prima.',
    saveError: 'Impossibile salvare la card.',
    permissionNeeded: 'Permesso necessario',
    photoPermBody: "Consenti l'accesso alla libreria foto per salvare la card.",

    // Onboarding
    splashSubtitle: 'Il tuo giudice di moda AI.\nBrutale. Divertente. Condivisibile.',
    splashBody:
      "Scatta una foto del tuo outfit e lascia che l'AI ti dica la verità — tutta la verità, nient'altro che la verità.",
    letsGo: 'Iniziamo 🔥',
    step1of2: 'Passaggio 1 di 2',
    step2of2: 'Passaggio 2 di 2',
    chooseTone: 'Scegli il tono del giudizio',
    howBrutal: "Quanto deve essere brutale l'AI?",
    toneBrutalLabel: 'Brutale',
    toneIronicLabel: 'Ironico',
    toneConstructiveLabel: 'Costruttivo',
    toneBrutalDesc: 'Senza pietà. La verità nuda e cruda.',
    toneIronicDesc: 'Pungente, spiritoso, deliziosamente sarcastico.',
    toneConstructiveDesc: 'Feedback onesto con un tocco di speranza.',
    continueBtn: 'Continua',
    whatsYourName: 'Come ti chiami?',
    nameBody: 'Personalizzeremo i tuoi giudizi.',
    nameOptional: '(Opzionale — salta se sei timido/a)',
    namePlaceholder: 'Il tuo nome o soprannome',
    startRoasted: 'Inizia a essere giudicato',
    skipForNow: 'Salta per ora',

    // Loading
    loadingTitle: "L'AI ti sta giudicando...",
    loadingMessages: [
      'Analizzando il disastro...',
      'Consultando la polizia della moda...',
      'Calcolando il tuo quoziente stilistico...',
      'Confrontando con Vogue...',
      'Preparando la dura verità...',
      'Giudicando — ma con stile...',
      "Potrebbe fare un po' male...",
    ],

    // Date locale
    dateLocale: 'it-IT',
  },
} as const;

export type Translations = typeof translations.en;
export type Language = RoastLanguage;
export { translations };
