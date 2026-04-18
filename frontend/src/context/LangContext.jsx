import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    nav: { clayTable: 'Clay Table', scoringEngine: 'Scoring Engine', outreach: 'Top 50 Outreach', abTesting: 'A/B Testing', icp: 'ICP Framework', sender: 'Campaign Send', profile: 'Profile', logout: 'Logout' },
    dashboard: { title: 'Data Synchronization', subtitle: 'Pull enriched leads from Clay.com, Apollo.io, LinkedIn, Crunchbase, BuiltWith, GitHub.', sync: 'Run Multi-Platform Sync', syncing: 'Syncing Platforms...', totalLeads: 'Total Leads', hot: 'Hot', warm: 'Warm', cold: 'Cold', clayTable: 'Clay Enrichment Table', filterCompanies: 'Filter companies...', rows: 'rows', company: 'Company', industry: 'Industry', source: 'Source', funding: 'Funding', techStack: 'Tech Stack', size: 'Size', icp: 'ICP', score: 'Score' },
    profile: { title: 'Your Profile', subtitle: 'Personalize your outreach identity. This data will be used in generated emails and LinkedIn DMs.', name: 'Full Name', role: 'Role / Title', company: 'Company', email: 'Email', age: 'Age', bio: 'Bio', save: 'Save Profile', saved: 'Profile Saved!', uploadPhoto: 'Upload Photo' },
    outreach: { title: 'Personalized Outreach', subtitle: 'Top 50 qualified leads. Generate context-aware cold emails and LinkedIn DMs for each account.', generate: 'Generate', generating: 'Generating...', generated: 'Generated', coldEmail: 'Cold Email', linkedinDM: 'LinkedIn DM', subject: 'Subject', body: 'Body', charCount: 'Character count' },
    landing: { badge: 'Track A · ThinkRoot x Vortex 2026', headline1: 'Outbound,', headline1b: 'Automated.', headline2: 'Intelligence,', headline2b: 'Scaled.', subtitle: '200+ enriched leads from 6 platforms. Explainable ICP scoring. Personalized cold outreach for top 50. A/B tested variants for top 20. All fully automated.', cta: 'Launch Intelligence Console', login: 'Launch Console' },
    common: { online: 'Online', leads: 'leads', platforms: 'platforms' }
  },
  hi: {
    nav: { clayTable: 'क्ले टेबल', scoringEngine: 'स्कोरिंग इंजन', outreach: 'टॉप 50 आउटरीच', abTesting: 'A/B टेस्टिंग', icp: 'ICP फ्रेमवर्क', sender: 'अभियान भेजें', profile: 'प्रोफ़ाइल', logout: 'लॉग आउट' },
    dashboard: { title: 'डेटा सिंक्रोनाइज़ेशन', subtitle: 'Clay.com, Apollo.io, LinkedIn, Crunchbase, BuiltWith, GitHub से समृद्ध लीड्स खींचें।', sync: 'मल्टी-प्लेटफ़ॉर्म सिंक चलाएं', syncing: 'सिंक हो रहा है...', totalLeads: 'कुल लीड्स', hot: 'हॉट', warm: 'वार्म', cold: 'कोल्ड', clayTable: 'क्ले एनरिचमेंट टेबल', filterCompanies: 'कंपनियां खोजें...', rows: 'पंक्तियाँ', company: 'कंपनी', industry: 'उद्योग', source: 'स्रोत', funding: 'फंडिंग', techStack: 'टेक स्टैक', size: 'आकार', icp: 'ICP', score: 'स्कोर' },
    profile: { title: 'आपकी प्रोफ़ाइल', subtitle: 'अपनी आउटरीच पहचान को वैयक्तिकृत करें। यह डेटा जनरेट किए गए ईमेल में उपयोग किया जाएगा।', name: 'पूरा नाम', role: 'भूमिका / शीर्षक', company: 'कंपनी', email: 'ईमेल', age: 'आयु', bio: 'बायो', save: 'प्रोफ़ाइल सहेजें', saved: 'प्रोफ़ाइल सहेजी गई!', uploadPhoto: 'फ़ोटो अपलोड करें' },
    outreach: { title: 'वैयक्तिकृत आउटरीच', subtitle: 'शीर्ष 50 योग्य लीड्स। प्रत्येक खाते के लिए कॉन्टेक्स्ट-अवेयर कोल्ड ईमेल और LinkedIn DM जनरेट करें।', generate: 'जनरेट करें', generating: 'जनरेट हो रहा है...', generated: 'जनरेट हुआ', coldEmail: 'कोल्ड ईमेल', linkedinDM: 'LinkedIn DM', subject: 'विषय', body: 'बॉडी', charCount: 'अक्षर गणना' },
    landing: { badge: 'ट्रैक A · ThinkRoot x Vortex 2026', headline1: 'आउटबाउंड,', headline1b: 'स्वचालित।', headline2: 'बुद्धिमत्ता,', headline2b: 'स्केल्ड।', subtitle: '6 प्लेटफॉर्म से 200+ समृद्ध लीड्स। व्याख्या योग्य ICP स्कोरिंग। शीर्ष 50 के लिए वैयक्तिकृत आउटरीच।', cta: 'इंटेलिजेंस कंसोल लॉन्च करें', login: 'कंसोल लॉन्च करें' },
    common: { online: 'ऑनलाइन', leads: 'लीड्स', platforms: 'प्लेटफॉर्म' }
  },
  es: {
    nav: { clayTable: 'Tabla Clay', scoringEngine: 'Motor de Puntuación', outreach: 'Top 50 Alcance', abTesting: 'Pruebas A/B', icp: 'Marco ICP', sender: 'Enviar Campaña', profile: 'Perfil', logout: 'Cerrar sesión' },
    dashboard: { title: 'Sincronización de Datos', subtitle: 'Obtén leads enriquecidos de Clay.com, Apollo.io, LinkedIn, Crunchbase, BuiltWith, GitHub.', sync: 'Sincronizar Multi-Plataforma', syncing: 'Sincronizando...', totalLeads: 'Total Leads', hot: 'Caliente', warm: 'Tibio', cold: 'Frío', clayTable: 'Tabla de Enriquecimiento Clay', filterCompanies: 'Filtrar empresas...', rows: 'filas', company: 'Empresa', industry: 'Industria', source: 'Fuente', funding: 'Financiación', techStack: 'Stack Técnico', size: 'Tamaño', icp: 'ICP', score: 'Puntuación' },
    profile: { title: 'Tu Perfil', subtitle: 'Personaliza tu identidad de alcance. Estos datos se usarán en correos generados.', name: 'Nombre Completo', role: 'Cargo', company: 'Empresa', email: 'Correo', age: 'Edad', bio: 'Biografía', save: 'Guardar Perfil', saved: '¡Perfil Guardado!', uploadPhoto: 'Subir Foto' },
    outreach: { title: 'Alcance Personalizado', subtitle: 'Top 50 leads calificados. Genera correos fríos y DMs de LinkedIn para cada cuenta.', generate: 'Generar', generating: 'Generando...', generated: 'Generado', coldEmail: 'Correo Frío', linkedinDM: 'LinkedIn DM', subject: 'Asunto', body: 'Cuerpo', charCount: 'Cantidad de caracteres' },
    landing: { badge: 'Track A · ThinkRoot x Vortex 2026', headline1: 'Outbound,', headline1b: 'Automatizado.', headline2: 'Inteligencia,', headline2b: 'Escalada.', subtitle: '200+ leads enriquecidos de 6 plataformas. Puntuación ICP explicable. Alcance personalizado para top 50.', cta: 'Lanzar Consola de Inteligencia', login: 'Lanzar Consola' },
    common: { online: 'En línea', leads: 'leads', platforms: 'plataformas' }
  },
  fr: {
    nav: { clayTable: 'Table Clay', scoringEngine: 'Moteur de Score', outreach: 'Top 50 Outreach', abTesting: 'Tests A/B', icp: 'Cadre ICP', sender: 'Envoi Campagne', profile: 'Profil', logout: 'Déconnexion' },
    dashboard: { title: 'Synchronisation des Données', subtitle: 'Récupérez les leads enrichis depuis Clay.com, Apollo.io, LinkedIn, Crunchbase, BuiltWith, GitHub.', sync: 'Sync Multi-Plateforme', syncing: 'Synchronisation...', totalLeads: 'Total Leads', hot: 'Chaud', warm: 'Tiède', cold: 'Froid', clayTable: 'Table d\'Enrichissement Clay', filterCompanies: 'Filtrer les entreprises...', rows: 'lignes', company: 'Entreprise', industry: 'Industrie', source: 'Source', funding: 'Financement', techStack: 'Stack Tech', size: 'Taille', icp: 'ICP', score: 'Score' },
    profile: { title: 'Votre Profil', subtitle: 'Personnalisez votre identité de prospection. Ces données seront utilisées dans les emails générés.', name: 'Nom Complet', role: 'Rôle / Titre', company: 'Entreprise', email: 'Email', age: 'Âge', bio: 'Bio', save: 'Sauvegarder', saved: 'Profil Sauvegardé!', uploadPhoto: 'Télécharger Photo' },
    outreach: { title: 'Prospection Personnalisée', subtitle: 'Top 50 leads qualifiés. Générez des emails froids et DMs LinkedIn pour chaque compte.', generate: 'Générer', generating: 'Génération...', generated: 'Généré', coldEmail: 'Email Froid', linkedinDM: 'LinkedIn DM', subject: 'Objet', body: 'Corps', charCount: 'Nombre de caractères' },
    landing: { badge: 'Track A · ThinkRoot x Vortex 2026', headline1: 'Outbound,', headline1b: 'Automatisé.', headline2: 'Intelligence,', headline2b: 'Mise à l\'échelle.', subtitle: '200+ leads enrichis de 6 plateformes. Score ICP explicable. Prospection personnalisée pour le top 50.', cta: 'Lancer la Console', login: 'Lancer Console' },
    common: { online: 'En ligne', leads: 'leads', platforms: 'plateformes' }
  }
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('p95_lang') || 'en');

  const switchLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('p95_lang', newLang);
  };

  const t = (path) => {
    const keys = path.split('.');
    let val = translations[lang];
    for (const k of keys) { val = val?.[k]; }
    return val || path;
  };

  return (
    <LangContext.Provider value={{ lang, switchLang, t, languages: Object.keys(translations) }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() { return useContext(LangContext); }
