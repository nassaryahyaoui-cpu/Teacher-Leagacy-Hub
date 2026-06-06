import { useState, useRef } from 'react';

// Gestion de la compatibilité navigateurs (Chrome, Edge, Safari, Android)
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechToText = (langue: 'fr' | 'en') => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur. Utilisez Chrome ou Edge !");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langue === 'fr' ? 'fr-FR' : 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    
    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return { isRecording, transcript, startRecording, stopRecording, setTranscript };
};

export const calculerMotsCorrects = (texteOriginal: string, textePrononce: string): number => {
  const nettoyer = (str: string) => str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()«»]/g, "").trim().split(/\s+/);
  
  const motsOrigine = nettoyer(texteOriginal);
  const motsPrononces = nettoyer(textePrononce);

  // Compter combien de mots attendus sont présents dans l'enregistrement de l'élève
  let motsCorrects = 0;
  motsOrigine.forEach(mot => {
    if (motsPrononces.includes(mot)) {
      motsCorrects++;
    }
  });

  return motsCorrects;
};

export const estimerSyllabesLues = (motsCorrectsCount: number, texteOriginal: string): number => {
  const mots = texteOriginal.toLowerCase().split(/\s+/);
  const totalMots = mots.length;
  if (totalMots === 0) return 0;

  // Calcul du ratio moyen de syllabes par mot sur le texte d'origine
  const totalSyllabesOrigine = mots.reduce((acc, mot) => {
    // Règle simple d'estimation par groupe de voyelles (y compris e muet de fin stabilisé)
    const voyelles = mot.match(/[aeiouyéèàùûâîôûëïü]+/g);
    return acc + (voyelles ? voyelles.length : 1);
  }, 0);

  const ratio = totalSyllabesOrigine / totalMots;
  
  // On renvoie le prorata par rapport au nombre de mots correctement articulés
  return Math.min(totalSyllabesOrigine, Math.round(motsCorrectsCount * ratio));
};


