import { useSpeechToText, calculerMotsCorrects, estimerSyllabesLues } from '../../hooks/useSpeechToText';

const CONFIG_VOIX_THEMES_ENGINE: Record<string, { fr: string[]; en: string[]; pitch: number; rate: number }> = {
  'theme-default': {
    fr: ['hortense', 'google unissund', 'microsoft julie'],
    en: ['google us english', 'microsoft david', 'siri'],
    pitch: 1.0,
    rate: 0.95
  },
  'theme-pink': {
    fr: ['amelie', 'amélie', 'google femme', 'clara'], 
    en: ['google uk english female', 'microsoft zira'],
    pitch: 1.05,
    rate: 0.9
  },
  'theme-hp': {
    fr: ['thomas', 'google homme', 'microsoft paul'],
    en: ['microsoft hazel', 'google uk english male'],
    pitch: 0.9,
    rate: 0.95
  },
  'theme-bikini': {
    fr: ['google unissund', 'paul', 'microsoft unknown'],
    en: ['google us english', 'microsoft david'],
    pitch: 1.15,
    rate: 1.0
  },
  'theme-hotel': {
    fr: ['stefan', 'google homme', 'microsoft paul'],
    en: ['google uk english male', 'microsoft david'],
    pitch: 0.85,
    rate: 0.9
  }
};

export const lancerLectureVocale = (text: string, lang: 'fr' | 'en', currentTheme: string) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'en' ? 'en-US' : 'fr-FR';

  const themeKey = currentTheme.startsWith('theme-') ? currentTheme : `theme-${currentTheme}`;
  const config = CONFIG_VOIX_THEMES_ENGINE[themeKey] || CONFIG_VOIX_THEMES_ENGINE['theme-default'];

  utterance.pitch = config.pitch;
  utterance.rate = config.rate;

  const voices = window.speechSynthesis.getVoices();
  const langKey = lang;
  const preferredNames = config[langKey];
  const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langKey));

  let selectedVoice: SpeechSynthesisVoice | null = null;
  for (const prefName of preferredNames) {
    const found = langVoices.find(v => v.name.toLowerCase().includes(prefName.toLowerCase()));
    if (found) {
      selectedVoice = found;
      break;
    }
  }

  if (!selectedVoice) {
    for (const prefName of preferredNames) {
      const found = voices.find(v => v.name.toLowerCase().includes(prefName.toLowerCase()));
      if (found) {
        selectedVoice = found;
        break;
      }
    }
  }

  if (!selectedVoice && langVoices.length > 0) {
    if (langKey === 'fr') {
      selectedVoice = langVoices.find(v => v.name.toLowerCase().includes('denise') || v.name.toLowerCase().includes('henri')) ||
                      langVoices.find(v => v.name.toLowerCase().includes('google') && v.lang.toLowerCase() === 'fr-fr') ||
                      langVoices.find(v => v.name.toLowerCase().includes('hortense')) ||
                      langVoices[0];
    } else {
      selectedVoice = langVoices.find(v => v.name.toLowerCase().includes('google') && v.lang.toLowerCase().startsWith('en')) ||
                      langVoices[0];
    }
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export { useSpeechToText, calculerMotsCorrects, estimerSyllabesLues };
