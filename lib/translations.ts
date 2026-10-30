import { SupportedLanguage } from './types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  checkEligibilityBtn: string;
  browseSchemesBtn: string;
  askAssistantBtn: string;
  findEligibleSchemes: string;
  eligibilityCheckerTitle: string;
  eligibilityCheckerSub: string;
  ageLabel: string;
  incomeLabel: string;
  genderLabel: string;
  occupationLabel: string;
  stateLabel: string;
  categoryLabel: string;
  calculateButton: string;
  resetButton: string;
  schemesDirectory: string;
  searchPlaceholder: string;
  allCategories: string;
  matchScore: string;
  eligibleBadge: string;
  viewDetails: string;
  checklistButton: string;
  applyNow: string;
  documentsTitle: string;
  mandatoryDocs: string;
  optionalDocs: string;
  chatPlaceholder: string;
  chatWelcome: string;
  quickQuestions: string[];
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'GovGuide AI',
    tagline: 'Your Intelligent Gateway to Government Schemes & Welfare Benefits',
    heroTitle: 'Discover Government Schemes You Are Eligible For in Seconds',
    heroSubtitle: 'Instant eligibility verification, personalized document checklists, step-by-step application guidance, and multi-language AI assistance.',
    checkEligibilityBtn: 'Check My Eligibility',
    browseSchemesBtn: 'Browse All Schemes',
    askAssistantBtn: 'Chat with GovGuide AI',
    findEligibleSchemes: 'Find Eligible Schemes',
    eligibilityCheckerTitle: 'Instant Eligibility Checker',
    eligibilityCheckerSub: 'Provide your basic details to instantly see welfare programs matched for you.',
    ageLabel: 'Age (Years)',
    incomeLabel: 'Annual Household Income (₹)',
    genderLabel: 'Gender',
    occupationLabel: 'Occupation / Status',
    stateLabel: 'State / Union Territory',
    categoryLabel: 'Social Category',
    calculateButton: 'Evaluate My Eligibility',
    resetButton: 'Reset Filters',
    schemesDirectory: 'Government Schemes Directory',
    searchPlaceholder: 'Search schemes by keyword, health, student, farmer, loan...',
    allCategories: 'All Sectors',
    matchScore: 'Match Score',
    eligibleBadge: 'High Eligibility',
    viewDetails: 'Scheme Details',
    checklistButton: 'Document Checklist',
    applyNow: 'Official Portal',
    documentsTitle: 'Required Document Checklist',
    mandatoryDocs: 'Mandatory Documents',
    optionalDocs: 'Optional / Supporting Documents',
    chatPlaceholder: 'Ask anything about schemes, eligibility, or documents in your language...',
    chatWelcome: 'Hello! I am your GovGuide AI Assistant. How can I help you navigate government schemes and benefits today?',
    quickQuestions: [
      'Am I eligible for PM-KISAN ₹6,000 subsidy?',
      'What documents do I need for Ayushman Bharat?',
      'How to get collateral-free Mudra Business Loan?',
      'Scholarships available for college students?'
    ]
  },
  hi: {
    appName: 'गवगाइड एआई (GovGuide AI)',
    tagline: 'सरकारी योजनाओं और कल्याणकारी लाभों के लिए आपका एआई साथी',
    heroTitle: 'जानिए आप किन सरकारी योजनाओं के पात्र हैं, कुछ ही पलों में',
    heroSubtitle: 'त्वरित पात्रता जांच, आवश्यक दस्तावेज़ सूची, चरण-दर-चरण आवेदन मार्गदर्शन और बहुभाषी एआई सहायता।',
    checkEligibilityBtn: 'मेरी पात्रता जांचें',
    browseSchemesBtn: 'सभी योजनाएं देखें',
    askAssistantBtn: 'एआई सहायक से पूछें',
    findEligibleSchemes: 'पात्र योजनाएं खोजें',
    eligibilityCheckerTitle: 'त्वरित पात्रता परीक्षक',
    eligibilityCheckerSub: 'अपने विवरण दर्ज करें और तुरंत अपने लिए उपयुक्त सरकारी योजनाओं की सूची पाएं।',
    ageLabel: 'आयु (वर्ष)',
    incomeLabel: 'वार्षिक पारिवारिक आय (₹)',
    genderLabel: 'लिंग',
    occupationLabel: 'व्यवसाय / स्थिति',
    stateLabel: 'राज्य / केंद्र शासित प्रदेश',
    categoryLabel: 'सामाजिक श्रेणी',
    calculateButton: 'पात्रता की गणना करें',
    resetButton: 'रीसेट करें',
    schemesDirectory: 'सरकारी योजना निर्देशिका',
    searchPlaceholder: 'कीवर्ड, स्वास्थ्य, किसान, छात्र, लोन द्वारा खोजें...',
    allCategories: 'सभी श्रेणियां',
    matchScore: 'पात्रता स्कोर',
    eligibleBadge: 'उच्च पात्रता',
    viewDetails: 'विवरण देखें',
    checklistButton: 'दस्तावेज़ चेकलिस्ट',
    applyNow: 'आधिकारिक पोर्टल',
    documentsTitle: 'आवश्यक दस्तावेज़ चेकलिस्ट',
    mandatoryDocs: 'अनिवार्य दस्तावेज़',
    optionalDocs: 'वैकल्पिक / सहायक दस्तावेज़',
    chatPlaceholder: 'अपनी भाषा में योजनाओं, पात्रता या दस्तावेजों के बारे में पूछें...',
    chatWelcome: 'नमस्ते! मैं आपका गवगाइड एआई सहायक हूं। आज सरकारी योजनाओं में आपकी क्या सहायता कर सकता हूं?',
    quickQuestions: [
      'क्या मैं पीएम-किसान ₹6,000 योजना के पात्र हूँ?',
      'आयुष्मान भारत कार्ड के लिए कौन से दस्तावेज चाहिए?',
      'मुद्रा लोन कैसे प्राप्त करें?',
      'कॉलेज छात्रों के लिए कौन सी छात्रवृत्तियां हैं?'
    ]
  },
  ta: {
    appName: 'கவ்கைட் AI (GovGuide AI)',
    tagline: 'அரசு நலத்திட்டங்களுக்கான உங்கள் நுண்ணறிவு வழிகாட்டி',
    heroTitle: 'நீங்கள் தகுதியான அரசு திட்டங்களை நொடிகளில் கண்டறியுங்கள்',
    heroSubtitle: 'உடனடி தகுதி சரிபார்ப்பு, ஆவண சரிபார்ப்பு பட்டியல் மற்றும் எளிய விண்ணப்ப வழிகாட்டுதல்.',
    checkEligibilityBtn: 'தகுதியை சரிபார்க்கவும்',
    browseSchemesBtn: 'திட்டங்களை உலாவுக',
    askAssistantBtn: 'AI உதவியாளருடன் உரையாடவும்',
    findEligibleSchemes: 'தகுதியான திட்டங்களை கண்டறிக',
    eligibilityCheckerTitle: 'உடனடி தகுதி சரிபார்ப்பான்',
    eligibilityCheckerSub: 'உங்கள் விவரங்களை உள்ளிட்டு உங்களுக்கான அரசு நலத்திட்டங்களை கண்டறியவும்.',
    ageLabel: 'வயது (ஆண்டுகள்)',
    incomeLabel: 'ஆண்டு வருமானம் (₹)',
    genderLabel: 'பாலினம்',
    occupationLabel: 'தொழில் / நிலை',
    stateLabel: 'மாநிலம்',
    categoryLabel: 'பிரிவு',
    calculateButton: 'தகுதியை மதிப்பிடுக',
    resetButton: 'மீட்டமைக்க',
    schemesDirectory: 'அரசு திட்டங்கள் பட்டியல்',
    searchPlaceholder: 'விவசாயி, கல்வி, மருத்துவம், கடன் மூலம் தேடவும்...',
    allCategories: 'அனைத்து பிரிவுகள்',
    matchScore: 'பொருத்த மதிப்பெண்',
    eligibleBadge: 'உயர் தகுதி',
    viewDetails: 'விவரங்கள்',
    checklistButton: 'ஆவண பட்டியல்',
    applyNow: 'அதிகாரப்பூர்வ தளம்',
    documentsTitle: 'தேவையான ஆவணங்கள் பட்டியல்',
    mandatoryDocs: 'கட்டாய ஆவணங்கள்',
    optionalDocs: 'கூடுதல் ஆவணங்கள்',
    chatPlaceholder: 'அரசு திட்டங்கள் குறித்து உங்கள் மொழியில் கேளுங்கள்...',
    chatWelcome: 'வணக்கம்! நான் உங்கள் GovGuide AI உதவியாளர். உங்களுக்கு எவ்வாறு உதவ முடியும்?',
    quickQuestions: [
      'PM-KISAN ₹6,000 பெற நான் தகுதியானவரா?',
      'ஆயுஷ்மான் பாரத் அட்டை பெற என்ன ஆவணங்கள் தேவை?',
      'முத்ரா சிறு தொழில் கடன் பெறுவது எப்படி?',
      'மாணவர்களுக்கான கல்வி உதவித்தொகை என்ன?'
    ]
  },
  te: {
    appName: 'గవ్‌గైడ్ AI (GovGuide AI)',
    tagline: 'ప్రభుత్వ పథకాలు మరియు సంక్షేమ ప్రయోజనాల కోసం మీ AI మార్గదర్శి',
    heroTitle: 'మీరు అర్హత కలిగిన ప్రభుత్వ పథకాలను సెకన్లలో తెలుసుకోండి',
    heroSubtitle: 'తక్షణ అర్హత తనిఖీ, అవసరమైన పత్రాల చెక్‌లిస్ట్ మరియు దరఖాస్తు మార్గదర్శకత్వం.',
    checkEligibilityBtn: 'నా అర్హత తనిఖీ చేయండి',
    browseSchemesBtn: 'అన్ని పథకాలు చూడండి',
    askAssistantBtn: 'AI అసిస్టెంట్‌తో మాట్లాడండి',
    findEligibleSchemes: 'అర్హతగల పథకాలు కనుగొనండి',
    eligibilityCheckerTitle: 'తక్షణ అర్హత తనిఖీ సాధనం',
    eligibilityCheckerSub: 'మీ వివరాలను నమోదు చేసి మీకు సరిపోయే ప్రభుత్వ పథకాలను పొందండి.',
    ageLabel: 'వయస్సు (సంవత్సరాలు)',
    incomeLabel: 'వార్షిక ఆదాయం (₹)',
    genderLabel: 'లింగం',
    occupationLabel: 'వృత్తి / హోదా',
    stateLabel: 'రాష్ట్రం',
    categoryLabel: 'సామాజిక వర్గం',
    calculateButton: 'అర్హతను లెక్కించండి',
    resetButton: 'రీసెట్ చేయండి',
    schemesDirectory: 'ప్రభుత్వ పథకాల డైరెక్టరీ',
    searchPlaceholder: 'రైతు, విద్య, వైద్యం, వ్యాపార రుణం కోసం వెతకండి...',
    allCategories: 'అన్ని రంగాలు',
    matchScore: 'మ్యాచ్ స్కోర్',
    eligibleBadge: 'అధిక అర్హత',
    viewDetails: 'వివరాలు చూడండి',
    checklistButton: 'పత్రాల జాబితా',
    applyNow: 'అధికారిక పోర్టల్',
    documentsTitle: 'అవసరమైన పత్రాల చెక్‌లిస్ట్',
    mandatoryDocs: 'తప్పనిసరి పత్రాలు',
    optionalDocs: 'ఐచ్ఛిక పత్రాలు',
    chatPlaceholder: 'పథకాలు, అర్హత లేదా పత్రాల గురించి మీ భాషలో అడగండి...',
    chatWelcome: 'నమస్కారం! నేను మీ GovGuide AI సహాయకుడిని. నేను మీకు ఎలా సహాయపడగలను?',
    quickQuestions: [
      'నేను PM-KISAN ₹6,000 సహాయానికి అర్హుడనా?',
      'ఆయుష్మాన్ భారత్ హెల్త్ కార్డుకు ఏ పత్రాలు కావాలి?',
      'ముద్రా లోన్ ఎలా దరఖాస్తు చేసుకోవాలి?',
      'కళాశాల విద్యార్థులకు స్కాలర్‌షిప్‌లు ఏమిటి?'
    ]
  },
  bn: {
    appName: 'গভগাইড এআই (GovGuide AI)',
    tagline: 'সরকারি প্রকল্পের জন্য আপনার বিশ্বস্ত এআই সহকারী',
    heroTitle: 'আপনি যে সরকারি প্রকল্পগুলির যোগ্য তা কয়েক সেকেন্ডে খুঁজুন',
    heroSubtitle: 'সহজ যোগ্যতা যাচাই, প্রয়োজনীয় নথির তালিকা এবং ধাপে ধাপে আবেদন নির্দেশিকা।',
    checkEligibilityBtn: 'যোগ্যতা পরীক্ষা করুন',
    browseSchemesBtn: 'সব প্রকল্প দেখুন',
    askAssistantBtn: 'এআই সহকারীর সাথে কথা বলুন',
    findEligibleSchemes: 'যোগ্য প্রকল্প খুঁজুন',
    eligibilityCheckerTitle: 'দ্রুত যোগ্যতা পরীক্ষক',
    eligibilityCheckerSub: 'আপনার তথ্য প্রদান করে আপনার উপযোগী সরকারি কল্যাণ প্রকল্পগুলি দেখুন।',
    ageLabel: 'বয়স (বছর)',
    incomeLabel: 'বার্ষিক পারিবারিক আয় (₹)',
    genderLabel: 'লিঙ্গ',
    occupationLabel: 'পেশা',
    stateLabel: 'রাজ্য',
    categoryLabel: 'শ্রেণি',
    calculateButton: 'যোগ্যতা যাচাই করুন',
    resetButton: 'রিসেট করুন',
    schemesDirectory: 'সরকারি প্রকল্প সূচি',
    searchPlaceholder: 'কৃষি, শিক্ষা, স্বাস্থ্য, লোন লিখে অনুসন্ধান করুন...',
    allCategories: 'সমস্ত বিভাগ',
    matchScore: 'যোগ্যতার স্কোর',
    eligibleBadge: 'উচ্চ যোগ্যতা',
    viewDetails: 'বিস্তারিত দেখুন',
    checklistButton: 'নথিপত্র তালিকা',
    applyNow: 'অফিসিয়াল পোর্টাল',
    documentsTitle: 'প্রয়োজনীয় নথিপত্রের তালিকা',
    mandatoryDocs: 'বাধ্যতামূলক নথিপত্র',
    optionalDocs: 'সহায়ক নথিপত্র',
    chatPlaceholder: 'সরকারি প্রকল্প বা নথিপত্র সম্পর্কে আপনার ভাষায় জিজ্ঞাসা করুন...',
    chatWelcome: 'নমস্কার! আমি আপনার GovGuide AI সহকারী। আজ আপনাকে কীভাবে সাহায্য করতে পারি?',
    quickQuestions: [
      'আমি কি পিএম-কিসান প্রকল্পে যোগ্য?',
      'আয়ুষ্মান ভারত কার্ড পেতে কী কী নথি লাগবে?',
      'মুদ্রা ব্যবসার ঋণ কীভাবে পাওয়া যায়?',
      'কলেজ ছাত্রদের জন্য কী স্কলারশিপ রয়েছে?'
    ]
  },
  mr: {
    appName: 'गव्हगाईड एआय (GovGuide AI)',
    tagline: 'शासकीय योजना आणि लाभांसाठी तुमचा डिजिटल मार्गदर्शक',
    heroTitle: 'तुम्ही कोणत्या शासकीय योजनांसाठी पात्र आहात हे काही सेकंदात जाणा',
    heroSubtitle: 'झटपट पात्रता पडताळणी, आवश्यक कागदपत्रे आणि अर्ज करण्याची संपूर्ण माहिती.',
    checkEligibilityBtn: 'माझी पात्रता तपासा',
    browseSchemesBtn: 'सर्व योजना पहा',
    askAssistantBtn: 'एआय सहाय्यकाशी बोला',
    findEligibleSchemes: 'पात्र योजना शोधा',
    eligibilityCheckerTitle: 'त्वरित पात्रता तपासक',
    eligibilityCheckerSub: 'तुमची माहिती भरा आणि तुमच्यासाठी उपलब्ध योजनांची यादी मिळवा.',
    ageLabel: 'वय (वर्षे)',
    incomeLabel: 'वार्षिक उत्पन्न (₹)',
    genderLabel: 'लिंग',
    occupationLabel: 'व्यवसाय',
    stateLabel: 'राज्य',
    categoryLabel: 'प्रवर्ग',
    calculateButton: 'पात्रता तपासा',
    resetButton: 'रीसेट करा',
    schemesDirectory: 'शासकीय योजना निर्देशिका',
    searchPlaceholder: 'शेतकरी, आरोग्य, शिक्षण, कर्ज यानुसार शोधा...',
    allCategories: 'सर्व प्रवर्ग',
    matchScore: 'पात्रता गुण',
    eligibleBadge: 'उच्च पात्रता',
    viewDetails: 'तपशील पहा',
    checklistButton: 'कागदपत्रे यादी',
    applyNow: 'अधिकृत पोर्टल',
    documentsTitle: 'आवश्यक कागदपत्रांची यादी',
    mandatoryDocs: 'अनिवार्य कागदपत्रे',
    optionalDocs: 'पर्यायी कागदपत्रे',
    chatPlaceholder: 'तुमच्या भाषेत योजनांविषयी प्रश्न विचारा...',
    chatWelcome: 'नमस्कार! मी तुमचा GovGuide AI सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकतो?',
    quickQuestions: [
      'मी पीएम-किसान योजनेसाठी पात्र आहे का?',
      'आयुष्मान भारत कार्डसाठी कोणती कागदपत्रे लागतात?',
      'मुद्रा कर्ज कसे मिळवावे?',
      'विद्यार्थ्यांसाठी कोणत्या शिष्यवृत्ती आहेत?'
    ]
  },
  es: {
    appName: 'GovGuide AI',
    tagline: 'Tu Asistente Inteligente para Programas y Beneficios Públicos',
    heroTitle: 'Descubre los Programas de Asistencia a los que Calificas en Segundos',
    heroSubtitle: 'Verificación instantánea de elegibilidad, listas de documentos y guía paso a paso.',
    checkEligibilityBtn: 'Verificar Mi Elegibilidad',
    browseSchemesBtn: 'Ver Programas',
    askAssistantBtn: 'Chatear con el Asistente',
    findEligibleSchemes: 'Encontrar Beneficios',
    eligibilityCheckerTitle: 'Verificador de Elegibilidad',
    eligibilityCheckerSub: 'Ingresa tus datos básicos para conocer los programas disponibles para ti.',
    ageLabel: 'Edad (Años)',
    incomeLabel: 'Ingreso Anual (₹ / Divisa)',
    genderLabel: 'Género',
    occupationLabel: 'Ocupación',
    stateLabel: 'Estado / Región',
    categoryLabel: 'Categoría Social',
    calculateButton: 'Calcular Elegibilidad',
    resetButton: 'Restablecer',
    schemesDirectory: 'Directorio de Beneficios',
    searchPlaceholder: 'Buscar por salud, estudiante, agricultor, crédito...',
    allCategories: 'Todas las categorías',
    matchScore: 'Nivel de Coincidencia',
    eligibleBadge: 'Alta Elegibilidad',
    viewDetails: 'Ver Detalles',
    checklistButton: 'Lista de Documentos',
    applyNow: 'Portal Oficial',
    documentsTitle: 'Lista de Documentos Requeridos',
    mandatoryDocs: 'Documentos Obligatorios',
    optionalDocs: 'Documentos Opcionales',
    chatPlaceholder: 'Haz cualquier pregunta sobre programas o requisitos...',
    chatWelcome: '¡Hola! Soy tu Asistente GovGuide AI. ¿En qué programa público puedo orientarte hoy?',
    quickQuestions: [
      '¿Califico para apoyos agrícolas?',
      '¿Qué requisitos piden para seguro de salud?',
      '¿Cómo solicitar créditos para pequeños negocios?',
      '¿Becas disponibles para estudiantes?'
    ]
  }
};
