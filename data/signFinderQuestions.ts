export interface QuestionOption {
  id: string;
  texto: string;
  signos: string[];
}

export interface Question {
  id: number;
  pergunta: string;
  opcoes: QuestionOption[];
}

export const SIGN_FINDER_QUESTIONS: Question[] = [
  {
    id: 1,
    pergunta: "Quando surge um problema inesperado, você tende a:",
    opcoes: [
      { id: "A", texto: "Agir imediatamente.", signos: ["aries", "leao", "sagitario"] },
      { id: "B", texto: "Parar, observar e planejar antes.", signos: ["touro", "virgem", "capricornio"] },
      { id: "C", texto: "Conversar para entender perspectivas.", signos: ["gemeos", "libra", "aquario"] },
      { id: "D", texto: "Sentir primeiro, decidir depois.", signos: ["cancer", "escorpiao", "peixes"] }
    ]
  },
  {
    id: 2,
    pergunta: "O que te move no dia a dia?",
    opcoes: [
      { id: "A", texto: "Adrenalina e novidade.", signos: ["aries", "sagitario", "gemeos"] },
      { id: "B", texto: "Segurança, rotina e estabilidade.", signos: ["touro", "cancer", "capricornio"] },
      { id: "C", texto: "Criatividade e curiosidade.", signos: ["leao", "aquario", "virgem"] },
      { id: "D", texto: "Emoção, conexão e significado profundo.", signos: ["peixes", "escorpiao", "libra"] }
    ]
  },
  {
    id: 3,
    pergunta: "Quando alguém te critica, você:",
    opcoes: [
      { id: "A", texto: "Rebato na hora.", signos: ["aries", "leao", "escorpiao"] },
      { id: "B", texto: "Penso sozinho e absorvo.", signos: ["touro", "virgem", "capricornio"] },
      { id: "C", texto: "Dialogo para entender melhor.", signos: ["libra", "gemeos", "aquario"] },
      { id: "D", texto: "Sinto muito, mesmo que não demonstre.", signos: ["cancer", "peixes", "sagitario"] }
    ]
  },
  {
    id: 4,
    pergunta: "Na vida social, você:",
    opcoes: [
      { id: "A", texto: "Ama gente nova e interações.", signos: ["gemeos", "leao", "libra"] },
      { id: "B", texto: "Prefere grupos pequenos e profundos.", signos: ["cancer", "escorpiao", "capricornio"] },
      { id: "C", texto: "Alterna entre social e recluso.", signos: ["touro", "virgem", "peixes"] },
      { id: "D", texto: "Observa mais do que participa.", signos: ["aquario", "sagitario", "aries"] }
    ]
  },
  {
    id: 5,
    pergunta: "Decisões importantes são tomadas com base em:",
    opcoes: [
      { id: "A", texto: "Impulso.", signos: ["aries", "leao", "peixes"] },
      { id: "B", texto: "Lógica fria.", signos: ["virgem", "capricornio", "aquario"] },
      { id: "C", texto: "Troca de ideias com outras pessoas.", signos: ["gemeos", "libra", "sagitario"] },
      { id: "D", texto: "Intuição e sensibilidade.", signos: ["cancer", "escorpiao", "touro"] }
    ]
  },
  {
    id: 6,
    pergunta: "Em conflitos, você geralmente:",
    opcoes: [
      { id: "A", texto: "Bate de frente.", signos: ["aries", "leao", "escorpiao"] },
      { id: "B", texto: "Evita ao máximo.", signos: ["libra", "peixes", "cancer"] },
      { id: "C", texto: "Usa lógica para resolver.", signos: ["aquario", "virgem", "capricornio"] },
      { id: "D", texto: "Se afasta ou silencia.", signos: ["touro", "sagitario", "gemeos"] }
    ]
  },
  {
    id: 7,
    pergunta: "Rotina para você é:",
    opcoes: [
      { id: "A", texto: "Chata, prefiro liberdade.", signos: ["sagitario", "aries", "aquario"] },
      { id: "B", texto: "Necessária e segura.", signos: ["touro", "virgem", "capricornio"] },
      { id: "C", texto: "Um equilíbrio entre rotina e novidade.", signos: ["libra", "leao", "gemeos"] },
      { id: "D", texto: "Algo que muda conforme minhas emoções.", signos: ["cancer", "peixes", "escorpiao"] }
    ]
  },
  {
    id: 8,
    pergunta: "Seu estilo de humor é:",
    opcoes: [
      { id: "A", texto: "Caótico e rápido.", signos: ["gemeos", "sagitario", "aries"] },
      { id: "B", texto: "Sarcástico e inteligente.", signos: ["aquario", "escorpiao", "capricornio"] },
      { id: "C", texto: "Dramático e teatral.", signos: ["leao", "libra", "peixes"] },
      { id: "D", texto: "Calmo e sensível.", signos: ["cancer", "touro", "virgem"] }
    ]
  },
  {
    id: 9,
    pergunta: "Seu estilo de se envolver em relacionamentos:",
    opcoes: [
      { id: "A", texto: "Rápido, intenso e direto.", signos: ["escorpiao", "aries", "leao"] },
      { id: "B", texto: "Devagar e com cautela.", signos: ["touro", "virgem", "capricornio"] },
      { id: "C", texto: "Leve, fluido e comunicativo.", signos: ["gemeos", "libra", "aquario"] },
      { id: "D", texto: "Apenas quando sinto conexão profunda.", signos: ["peixes", "cancer", "sagitario"] }
    ]
  },
  {
    id: 10,
    pergunta: "Como você lida com mudanças?",
    opcoes: [
      { id: "A", texto: "Mudo tudo de uma vez.", signos: ["aries", "sagitario", "escorpiao"] },
      { id: "B", texto: "Resisto o máximo possível.", signos: ["touro", "cancer", "capricornio"] },
      { id: "C", texto: "Aceito, mas preciso entender o motivo.", signos: ["aquario", "virgem", "libra"] },
      { id: "D", texto: "Sinto a mudança antes de agir.", signos: ["peixes", "leao", "gemeos"] }
    ]
  },
  {
    id: 11,
    pergunta: "No trabalho, você é:",
    opcoes: [
      { id: "A", texto: "Líder natural.", signos: ["leao", "capricornio", "aries"] },
      { id: "B", texto: "Executor técnico e dedicado.", signos: ["virgem", "touro", "escorpiao"] },
      { id: "C", texto: "Criativo e cheio de ideias.", signos: ["aquario", "sagitario", "gemeos"] },
      { id: "D", texto: "Acolhedor e diplomata.", signos: ["cancer", "libra", "peixes"] }
    ]
  },
  {
    id: 12,
    pergunta: "O que você mais confia?",
    opcoes: [
      { id: "A", texto: "Intuição.", signos: ["peixes", "cancer", "escorpiao"] },
      { id: "B", texto: "Lógica.", signos: ["virgem", "capricornio", "aquario"] },
      { id: "C", texto: "Experiência prática.", signos: ["touro", "leao", "aries"] },
      { id: "D", texto: "Conversas e referências externas.", signos: ["gemeos", "sagitario", "libra"] }
    ]
  },
  {
    id: 13,
    pergunta: "Em grupos grandes, você:",
    opcoes: [
      { id: "A", texto: "Vira o centro das atenções.", signos: ["leao", "sagitario", "aries"] },
      { id: "B", texto: "Procura um cantinho seguro.", signos: ["touro", "cancer", "virgem"] },
      { id: "C", texto: "Circula conversando com muita gente.", signos: ["gemeos", "libra", "aquario"] },
      { id: "D", texto: "Observa tudo em silêncio.", signos: ["escorpiao", "peixes", "capricornio"] }
    ]
  },
  {
    id: 14,
    pergunta: "Você se enxerga como alguém:",
    opcoes: [
      { id: "A", texto: "Intenso e marcante.", signos: ["escorpiao", "leao", "aries"] },
      { id: "B", texto: "Calmo e confiável.", signos: ["touro", "virgem", "capricornio"] },
      { id: "C", texto: "Criativo e curioso.", signos: ["gemeos", "peixes", "aquario"] },
      { id: "D", texto: "Sensível e amoroso.", signos: ["cancer", "libra", "sagitario"] }
    ]
  },
  {
    id: 15,
    pergunta: "Qual frase combina mais com você?",
    opcoes: [
      { id: "A", texto: "A vida é agora.", signos: ["aries", "leao", "sagitario"] },
      { id: "B", texto: "Devagar e sempre.", signos: ["touro", "virgem", "capricornio"] },
      { id: "C", texto: "Tudo depende do ponto de vista.", signos: ["gemeos", "libra", "aquario"] },
      { id: "D", texto: "Eu sinto, logo existo.", signos: ["cancer", "escorpiao", "peixes"] }
    ]
  }
];

// Mapeamento de ID interno para nome em português
export const SIGN_NAMES: Record<string, string> = {
  aries: "Áries",
  touro: "Touro",
  gemeos: "Gêmeos",
  cancer: "Câncer",
  leao: "Leão",
  virgem: "Virgem",
  libra: "Libra",
  escorpiao: "Escorpião",
  sagitario: "Sagitário",
  capricornio: "Capricórnio",
  aquario: "Aquário",
  peixes: "Peixes"
};

// Descrições dos signos para o resultado
export const SIGN_DESCRIPTIONS: Record<string, string> = {
  aries: "Você é pura energia, coragem e iniciativa! Áries não espera a vida acontecer — vai lá e faz. Líder nato, impulsivo e apaixonado, você inspira os outros com sua força e determinação.",
  touro: "Você valoriza estabilidade, conforto e as coisas boas da vida. Touro é leal, persistente e sensorial — aprecia beleza, sabores e momentos de paz. Quando ama, é pra sempre.",
  gemeos: "Sua mente nunca para! Gêmeos é curioso, comunicativo e versátil. Você consegue falar sobre qualquer assunto e se adapta a qualquer situação. A vida com você nunca é entediante.",
  cancer: "Você sente tudo intensamente e cuida de quem ama como ninguém. Câncer é protetor, intuitivo e emocional. Sua casa e família são seu porto seguro.",
  leao: "Você nasceu para brilhar! Leão é carismático, generoso e dramático na medida certa. Onde você chega, as pessoas notam. Seu coração é grande e sua presença é magnética.",
  virgem: "Você enxerga detalhes que os outros ignoram. Virgem é analítico, dedicado e busca a perfeição. Seu cuidado e atenção fazem toda a diferença para quem está ao seu redor.",
  libra: "Você busca harmonia, beleza e equilíbrio em tudo. Libra é diplomático, charmoso e adora conexões. Relacionamentos são sua especialidade — você faz tudo parecer elegante.",
  escorpiao: "Você sente tudo no extremo e não aceita superficialidade. Escorpião é intenso, magnético e transformador. Quando você se conecta, é de corpo e alma.",
  sagitario: "Você vive pela liberdade, aventura e expansão! Sagitário é otimista, filosófico e sempre em busca de novos horizontes. A vida é uma grande jornada para você.",
  capricornio: "Você é ambicioso, focado e constrói para o longo prazo. Capricórnio é responsável, estratégico e não desiste fácil. Seu sucesso é questão de tempo e dedicação.",
  aquario: "Você pensa diferente e não tem medo de ser único. Aquário é inovador, humanitário e valoriza a liberdade. Suas ideias podem mudar o mundo.",
  peixes: "Você sente o mundo de forma profunda e artística. Peixes é intuitivo, sonhador e compassivo. Sua sensibilidade te conecta com dimensões que outros não alcançam."
};
