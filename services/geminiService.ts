import { CompatibilityResult, SignData, ElementType } from '../types';

/**
 * Calculates a fixed, deterministic score for any pair of signs.
 * This ensures that Aries + Aries is always the same score for the same pair.
 */
const calculateDeterministicScore = (signA: SignData, signB: SignData): number => {
  // 1. Sort signs alphabetically by ID to ensure order doesn't matter (Aries+Leo == Leo+Aries)
  const [s1, s2] = [signA, signB].sort((a, b) => a.id.localeCompare(b.id));

  // 2. Base Score based on Astrological Elements
  let baseScore = 50;
  const el1 = s1.element;
  const el2 = s2.element;

  const FIRE = ElementType.FIRE;
  const EARTH = ElementType.EARTH;
  const AIR = ElementType.AIR;
  const WATER = ElementType.WATER;

  if (s1.id === s2.id) {
    baseScore = 75; // Same sign
  } else if (el1 === el2) {
    baseScore = 90; // Trine (Same element)
  } else {
    // Check Compatible Elements (Fire+Air or Earth+Water)
    const fireAir = (el1 === FIRE && el2 === AIR) || (el1 === AIR && el2 === FIRE);
    const earthWater = (el1 === EARTH && el2 === WATER) || (el1 === WATER && el2 === EARTH);

    if (fireAir || earthWater) {
      baseScore = 85; // Sextile/Opposition usually positive
    } else {
      baseScore = 45; // Square/Quincunx usually challenging
    }
  }

  // 3. Add Deterministic Variance (-12 to +12) based on name hash
  const comboId = s1.id + s2.id;
  let hash = 0;
  for (let i = 0; i < comboId.length; i++) {
    hash = comboId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const variance = (Math.abs(hash) % 25) - 12;

  // Clamp between 15 and 99
  return Math.min(Math.max(baseScore + variance, 15), 99);
};

// --- DADOS ÚNICOS DE AMOR (78 COMBINAÇÕES) ---
export const UNIQUE_LOVE: Record<string, CompatibilityResult> = {
  // 🔥 ÁRIES COM...

  "aries-aries": {
    resumo: "Dois fogos juntos: relação intensa, apaixonada e cheia de atitude, mas com chances de guerra de egos.",
    combina: [
      "Muito desejo, química e iniciativa",
      "Vida a dois nada monótona, cheia de aventuras"
    ],
    nao_combina: [
      "Brigas explosivas por orgulho",
      "Pouca tolerância a críticas e limites"
    ],
    dicas: [
      "Aprendam a não disputar quem manda: sejam aliados, não rivais."
    ],
    compatibilidade: 82
  },

  "aries-taurus": {
    resumo: "Áries acelera, Touro freia: relação de ritmos opostos que pode ser complementar ou irritante.",
    combina: [
      "Touro traz segurança emocional e material",
      "Áries traz entusiasmo e movimento para a relação"
    ],
    nao_combina: [
      "Teimosia dos dois em não ceder",
      "Impaciência de Áries com a lentidão de Touro"
    ],
    dicas: [
      "Áries precisa aprender a esperar; Touro precisa topar sair da zona de conforto."
    ],
    compatibilidade: 64
  },

  "aries-gemini": {
    resumo: "Relação leve, divertida e mentalmente estimulante, com alta dose de movimento e zero tédio.",
    combina: [
      "Muito papo, improviso e risadas",
      "Abertura para novas experiências e aventuras"
    ],
    nao_combina: [
      "Falta de profundidade emocional em alguns momentos",
      "Impulsividade de Áries x indecisão de Gêmeos"
    ],
    dicas: [
      "Criem alguns combinados mínimos para evitar sumiços, atrasos e promessas vazias."
    ],
    compatibilidade: 78
  },

  "aries-cancer": {
    resumo: "Coração sensível encontra impulso bruto: conexão forte, mas cheia de atritos emocionais.",
    combina: [
      "Cancer oferece cuidado e acolhimento",
      "Áries traz coragem e proteção à relação"
    ],
    nao_combina: [
      "Áries pode ser duro demais com a sensibilidade de Câncer",
      "Câncer pode se magoar fácil e guardar ressentimentos"
    ],
    dicas: [
      "Áries: pegue leve nas palavras; Câncer: comunique o que sente em vez de apenas se fechar."
    ],
    compatibilidade: 58
  },

  "aries-leo": {
    resumo: "Combinação super fogosa, dramática e apaixonada, com muito brilho, orgulho e cenas de novela.",
    combina: [
      "Química física intensa e admiração mútua",
      "Os dois gostam de viver grande e com emoção"
    ],
    nao_combina: [
      "Competição por atenção e protagonismo",
      "Brigas por orgulho e falta de pedido de desculpas"
    ],
    dicas: [
      "Aprendam a elogiar mais do que criticar e celebrar juntos as vitórias individuais."
    ],
    compatibilidade: 86
  },

  "aries-virgo": {
    resumo: "Espontaneidade encontra perfeccionismo: relação que pode gerar evolução, mas também irritação mútua.",
    combina: [
      "Virgem ajuda Áries a organizar a vida",
      "Áries incentiva Virgem a arriscar mais"
    ],
    nao_combina: [
      "Críticas constantes de Virgem podem frustrar Áries",
      "Impulsividade de Áries incomoda o lado metódico de Virgem"
    ],
    dicas: [
      "Equilibrem: um traz o plano, o outro traz a coragem de executar sem paralisar nos detalhes."
    ],
    compatibilidade: 55
  },

  "aries-libra": {
    resumo: "Eixo dos relacionamentos: atração forte entre ação (Áries) e diplomacia (Libra), com necessidade de equilíbrio.",
    combina: [
      "Libra traz charme, elegância e visão do outro",
      "Áries traz decisão e iniciativa para o relacionamento andar"
    ],
    nao_combina: [
      "Áries pode achar Libra indeciso demais",
      "Libra pode achar Áries grosso e pouco delicado"
    ],
    dicas: [
      "Juntem o melhor dos dois: coragem com empatia, sinceridade com tato."
    ],
    compatibilidade: 75
  },

  "aries-scorpio": {
    resumo: "Relação intensa, magnética e profunda, com potencial para paixão avassaladora e conflitos pesados.",
    combina: [
      "Muita química sexual e magnetismo",
      "Os dois são diretos e não têm medo de intensidade"
    ],
    nao_combina: [
      "Ciúmes e jogos de poder podem dominar",
      "Brigas podem ser destrutivas e difíceis de resolver"
    ],
    dicas: [
      "Estabeleçam segurança emocional e confiança, evitando manipulações e testes de lealdade."
    ],
    compatibilidade: 70
  },

  "aries-sagittarius": {
    resumo: "Fogo com fogo, mas com mais leveza: parceria divertida, aventureira e cheia de histórias.",
    combina: [
      "Amor por liberdade, viagens e novidades",
      "Sinceridade e espontaneidade entre os dois"
    ],
    nao_combina: [
      "Falta de paciência para dramas emocionais",
      "Promessas feitas no calor do momento e não cumpridas"
    ],
    dicas: [
      "Criem objetivos em comum e não esqueçam de cuidar também da parte emocional, não só da aventura."
    ],
    compatibilidade: 88
  },

  "aries-capricorn": {
    resumo: "Impulso encontra estratégia: relação que pode construir muito, mas com choque de estilos de vida.",
    combina: [
      "Capricórnio dá estrutura e foco",
      "Áries traz energia e coragem para começar projetos"
    ],
    nao_combina: [
      "Capricórnio pode achar Áries imaturo",
      "Áries pode achar Capricórnio frio ou rígido demais"
    ],
    dicas: [
      "Unam ambição e ação: façam planos realistas, mas sem matar o entusiasmo."
    ],
    compatibilidade: 60
  },

  "aquarius-aries": {
    resumo: "Par elétrico e original: relação mentalmente estimulante, cheia de liberdade e autenticidade.",
    combina: [
      "Os dois apreciam independência e novidade",
      "Boa conexão intelectual e estilo meio fora do padrão"
    ],
    nao_combina: [
      "Dificuldade em lidar com vulnerabilidades emocionais",
      "Teimosia e necessidade de ter razão"
    ],
    dicas: [
      "Conversem sobre liberdade e compromisso de forma clara, sem jogos ou suposições."
    ],
    compatibilidade: 80
  },

  "aries-pisces": {
    resumo: "Força bruta encontra sensibilidade profunda: relação que pode ser poética ou dolorosa.",
    combina: [
      "Peixes traz empatia, romance e imaginação",
      "Áries protege, incentiva e impulsiona os sonhos de Peixes"
    ],
    nao_combina: [
      "Áries pode ser duro demais com a fragilidade de Peixes",
      "Peixes pode se vitimizar e fugir dos conflitos"
    ],
    dicas: [
      "Áries: seja mais gentil; Peixes: seja mais claro sobre o que sente e precisa."
    ],
    compatibilidade: 57
  },

  // 🌱 TOURO COM...

  "taurus-taurus": {
    resumo: "Dois amantes do conforto e estabilidade: relação lenta, firme e muito sensual, mas resistente a mudanças.",
    combina: [
      "Valorizam segurança, lealdade e rotina",
      "Prazer em construir uma vida concreta juntos"
    ],
    nao_combina: [
      "Teimosia elevada ao quadrado",
      "Dificuldade em adaptar e negociar mudanças"
    ],
    dicas: [
      "Cultivem flexibilidade: pequenas mudanças podem manter a relação viva sem perder segurança."
    ],
    compatibilidade: 84
  },

  "gemini-taurus": {
    resumo: "Touro quer paz, Gêmeos quer variedade: relação que pede paciência e ajustes dos dois lados.",
    combina: [
      "Gêmeos traz humor e leveza ao dia a dia",
      "Touro oferece estabilidade e presença"
    ],
    nao_combina: [
      "Touro pode sentir insegurança com a instabilidade de Gêmeos",
      "Gêmeos pode achar Touro previsível e inflexível"
    ],
    dicas: [
      "Negociem espaço para novidade e espaço para rotina, sem desqualificar o que o outro valoriza."
    ],
    compatibilidade: 59
  },

  "cancer-taurus": {
    resumo: "Combinação doce, afetiva e muito voltada para casa, família e cuidado mútuo.",
    combina: [
      "Ambos buscam segurança emocional",
      "Valorizam gestos de carinho concretos e constância"
    ],
    nao_combina: [
      "Dificuldade em lidar com mudanças rápidas",
      "Tendência a guardar mágoas em silêncio"
    ],
    dicas: [
      "Conversem sobre sentimentos com mais clareza e não deixem os ressentimentos se acumularem."
    ],
    compatibilidade: 90
  },

  "leo-taurus": {
    resumo: "Luxo, prazer e orgulho: relação sensual e vaidosa, mas com teimosia de sobra.",
    combina: [
      "Gostam de conforto, beleza e boa vida",
      "Podem construir uma relação sólida e muito física"
    ],
    nao_combina: [
      "Disputa por quem manda ou tem razão",
      "Dificuldade em pedir desculpas ou ceder"
    ],
    dicas: [
      "Valorize o ego do outro sem esquecer o próprio, e escolham batalhas que realmente importam."
    ],
    compatibilidade: 68
  },

  "taurus-virgo": {
    resumo: "Terra com terra: relação prática, leal e confiável, com foco em estabilidade e construção.",
    combina: [
      "Visão realista sobre dinheiro, trabalho e futuro",
      "Compromisso e responsabilidade afetiva"
    ],
    nao_combina: [
      "Excesso de crítica e cobrança",
      "Rotina pode ficar previsível demais"
    ],
    dicas: [
      "Reservem espaço para prazer, criatividade e romantismo, não só dever e obrigação."
    ],
    compatibilidade: 88
  },

  "libra-taurus": {
    resumo: "Ambos regidos por Vênus: amor à beleza, conforto e relacionamentos, mas com estilos diferentes.",
    combina: [
      "Apreciam estética, harmonia e bons momentos",
      "Valorizam relacionamentos a longo prazo"
    ],
    nao_combina: [
      "Touro é mais direto; Libra evita confronto",
      "Pode haver insegurança com indecisões de Libra"
    ],
    dicas: [
      "Libra: seja mais claro; Touro: seja menos possessivo e mais flexível."
    ],
    compatibilidade: 72
  },

  "scorpio-taurus": {
    resumo: "Eixo de possessividade e intensidade: relação magnética, profunda e muitas vezes obsessiva.",
    combina: [
      "Lealdade extrema quando se comprometem",
      "Conexão sexual forte e profunda"
    ],
    nao_combina: [
      "Ciúmes, controle e ressentimentos",
      "Dificuldade em perdoar e soltar o passado"
    ],
    dicas: [
      "Trabalhem confiança e aprendam a dialogar antes de explodir ou se fechar."
    ],
    compatibilidade: 76
  },

  "sagittarius-taurus": {
    resumo: "Touro quer raízes, Sagitário quer asas: visão de mundo diferente, mas com possibilidade de troca rica.",
    combina: [
      "Touro oferece base e segurança",
      "Sagitário traz aventura e expansão"
    ],
    nao_combina: [
      "Conflitos sobre liberdade x estabilidade",
      "Ritmo e prioridades bem diferentes"
    ],
    dicas: [
      "Alinhem expectativas: até onde cada um está disposto a ceder sem perder a essência."
    ],
    compatibilidade: 52
  },

  "capricorn-taurus": {
    resumo: "Combinação altamente estável e focada em construção material e projetos de longo prazo.",
    combina: [
      "Visão de futuro realista e estruturada",
      "Compromisso com responsabilidade e lealdade"
    ],
    nao_combina: [
      "Possível rigidez emocional",
      "Relutância em falar sobre sentimentos mais profundos"
    ],
    dicas: [
      "Tragam leveza e vulnerabilidade, não vivam só para trabalhar e acumular segurança."
    ],
    compatibilidade: 89
  },

  "aquarius-taurus": {
    resumo: "Tradição encontra rebeldia: Taurus quer estabilidade, Aquarius quer liberdade e inovação.",
    combina: [
      "Aquário pode abrir a mente de Touro",
      "Touro pode ensinar consistência e presença"
    ],
    nao_combina: [
      "Conflito entre previsibilidade e imprevisibilidade",
      "Jeitos muito diferentes de expressar afeto"
    ],
    dicas: [
      "Estabeleçam regras claras que protejam tanto a liberdade quanto a segurança da relação."
    ],
    compatibilidade: 50
  },

  "pisces-taurus": {
    resumo: "Afeto doce e sensível: relação romântica, acolhedora e com potencial de porto seguro.",
    combina: [
      "Touro oferece estrutura e proteção",
      "Peixes traz empatia, sonho e espiritualidade"
    ],
    nao_combina: [
      "Peixes pode evitar conflitos demais",
      "Touro pode ser bruto com a sensibilidade de Peixes"
    ],
    dicas: [
      "Cultivem diálogo honesto sobre necessidades emocionais e não usem silêncio como fuga."
    ],
    compatibilidade: 85
  },

  // 💬 GÊMEOS COM...

  "gemini-gemini": {
    resumo: "Dois cerebrais inquietos: conexão mental forte, muita conversa e zero tédio, mas com risco de instabilidade.",
    combina: [
      "Humor, curiosidade e troca de ideias",
      "Abertos a experimentar coisas novas"
    ],
    nao_combina: [
      "Dificuldade em aprofundar emoções",
      "Oscilações de humor e de interesse"
    ],
    dicas: [
      "Criem alguns compromissos sólidos para não virar uma relação baseada só em papo e planos."
    ],
    compatibilidade: 77
  },

  "cancer-gemini": {
    resumo: "Razão mutável encontra emoção profunda: relação que exige tato e adaptação.",
    combina: [
      "Gêmeos traz leveza aos dramas de Câncer",
      "Câncer traz profundidade aos sentimentos de Gêmeos"
    ],
    nao_combina: [
      "Câncer pode se sentir não levado a sério",
      "Gêmeos pode se sentir sufocado por demandas emocionais"
    ],
    dicas: [
      "Equilibrem: momentos de conversa leve e momentos de vulnerabilidade real, sem ironia."
    ],
    compatibilidade: 56
  },

  "gemini-leo": {
    resumo: "Par social, comunicativo e expressivo: ótimo para vida pública, festas e projetos criativos.",
    combina: [
      "Os dois gostam de atenção e diversão",
      "Boa química em conversas e encontros sociais"
    ],
    nao_combina: [
      "Possíveis joguinhos de ego e vaidade",
      "Ciúmes com amizades ou contatos externos"
    ],
    dicas: [
      "Alimentem a admiração mútua, não a competição sobre quem brilha mais."
    ],
    compatibilidade: 79
  },

  "gemini-virgo": {
    resumo: "Ambos regidos por Mercúrio: mente afiada, mas com focos diferentes (flexível x prático).",
    combina: [
      "Boa comunicação e troca intelectual",
      "Capacidade de analisar situações com lógica"
    ],
    nao_combina: [
      "Virgem acha Gêmeos disperso",
      "Gêmeos acha Virgem controlador ou crítico demais"
    ],
    dicas: [
      "Definam metas conjuntas: um foca em estruturar, o outro em adaptar e comunicar."
    ],
    compatibilidade: 63
  },

  "gemini-libra": {
    resumo: "Ar com ar: par sociável, charmoso e comunicativo, que ama conexões e estímulos mentais.",
    combina: [
      "Conversas que fluem por horas",
      "Interesse em pessoas, cultura e experiências"
    ],
    nao_combina: [
      "Dificuldade em tomar decisões firmes",
      "Evitar conflitos pode acumular frustrações"
    ],
    dicas: [
      "Assumam decisões em conjunto e não fujam de conversas difíceis por medo de desagradar."
    ],
    compatibilidade: 87
  },

  "gemini-scorpio": {
    resumo: "Gêmeos quer leveza, Escorpião quer profundidade: tensão entre brincar e levar tudo a sério.",
    combina: [
      "Escorpião pode ensinar intensidade emocional",
      "Gêmeos pode aliviar a carga dramática"
    ],
    nao_combina: [
      "Escorpião desconfia da instabilidade de Gêmeos",
      "Gêmeos se sente pressionado por tanta intensidade"
    ],
    dicas: [
      "Conversem sobre limites: até onde a profundidade é saudável e até onde a leveza vira fuga."
    ],
    compatibilidade: 48
  },

  "gemini-sagittarius": {
    resumo: "Eixo do conhecimento: relação expansiva, curiosa e inquieta, com fome de mundo.",
    combina: [
      "Amor por viagens, estudos e aventuras",
      "Ambos valorizam liberdade e honestidade"
    ],
    nao_combina: [
      "Compromisso pode assustar",
      "Sinceridade pode ser brutal às vezes"
    ],
    dicas: [
      "Criem um tipo de compromisso que respeite a liberdade e ainda assim dê segurança mínima."
    ],
    compatibilidade: 83
  },

  "capricorn-gemini": {
    resumo: "Capricórnio quer resultado, Gêmeos quer experiência: visões diferentes sobre tempo e prioridade.",
    combina: [
      "Capricórnio traz foco e disciplina",
      "Gêmeos traz flexibilidade e networking"
    ],
    nao_combina: [
      "Capricórnio pode achar Gêmeos imaturo",
      "Gêmeos pode achar Capricórnio duro ou pessimista"
    ],
    dicas: [
      "Unam o útil ao agradável: projetos sérios, mas com espaço para criatividade e movimento."
    ],
    compatibilidade: 54
  },

  "aquarius-gemini": {
    resumo: "Conexão mental forte, estilo moderno e mente aberta: relação muito racional e livre.",
    combina: [
      "Interesse em ideias novas e causas",
      "Valorizam liberdade e autenticidade"
    ],
    nao_combina: [
      "Possível dificuldade em expressar emoções profundas",
      "Tendência a racionalizar tudo"
    ],
    dicas: [
      "Criem espaços para vulnerabilidade, mesmo que pareça desconfortável ou 'brega'."
    ],
    compatibilidade: 88
  },

  "gemini-pisces": {
    resumo: "Pensamento rápido encontra imaginação profunda: relação inspiradora, mas confusa.",
    combina: [
      "Muita criatividade e fantasia a dois",
      "Capacidade de enxergar várias perspectivas"
    ],
    nao_combina: [
      "Dificuldade em definir limites e compromissos claros",
      "Possíveis mal-entendidos emocionais"
    ],
    dicas: [
      "Sejam claros sobre expectativas e aprendam a checar se entenderam o outro de verdade."
    ],
    compatibilidade: 53
  },

  // 🦀 CÂNCER COM...

  "cancer-cancer": {
    resumo: "Dois corações sensíveis: relação extremamente afetiva, protetora e também cheia de altos e baixos emocionais.",
    combina: [
      "Intuição forte sobre o que o outro sente",
      "Valorizam família, casa e segurança"
    ],
    nao_combina: [
      "Tendência a se magoar e se fechar",
      "Dificuldade em lidar com críticas"
    ],
    dicas: [
      "Falarem sobre o que dói antes de virar ressentimento silencioso é essencial."
    ],
    compatibilidade: 88
  },

  "cancer-leo": {
    resumo: "Câncer busca segurança emocional, Leão busca reconhecimento: relação dramática, mas calorosa.",
    combina: [
      "Câncer oferece cuidado e carinho",
      "Leão traz alegria, proteção e orgulho do parceiro"
    ],
    nao_combina: [
      "Câncer pode se sentir ignorado quando Leão busca atenção externa",
      "Leão pode se irritar com oscilações de humor"
    ],
    dicas: [
      "Reforcem o amor em gestos e elogios, não apenas esperem que o outro adivinhe."
    ],
    compatibilidade: 67
  },

  "cancer-virgo": {
    resumo: "Virgem organiza, Câncer cuida: relação prática e afetiva, ótima para construir vida juntos.",
    combina: [
      "Comprometimento real com o bem-estar do outro",
      "Capacidade de cuidar de detalhes da vida a dois"
    ],
    nao_combina: [
      "Virgem pode parecer frio com emoções de Câncer",
      "Câncer pode se magoar com críticas diretas"
    ],
    dicas: [
      "Virgem: suavize as palavras; Câncer: não leve tudo para o lado pessoal."
    ],
    compatibilidade: 82
  },

  "cancer-libra": {
    resumo: "Câncer sente fundo, Libra racionaliza: relação que pode ser delicada, mas charmosa.",
    combina: [
      "Libra traz equilíbrio e diplomacia",
      "Câncer traz profundidade e acolhimento"
    ],
    nao_combina: [
      "Câncer pode sentir falta de postura firme",
      "Libra pode se sentir sobrecarregado com dramas emocionais"
    ],
    dicas: [
      "Trabalhem a comunicação para que emoção e razão tenham espaço igual."
    ],
    compatibilidade: 58
  },

  "cancer-scorpio": {
    resumo: "Água com água profunda: conexão emocional intensa, leal e às vezes possessiva.",
    combina: [
      "Empatia e compreensão silenciosa",
      "Capacidade de criar laço emocional muito forte"
    ],
    nao_combina: [
      "Ciúmes e medo de abandono",
      "Tendência a reter mágoas por muito tempo"
    ],
    dicas: [
      "Cultivem transparência: falem sobre medos em vez de testar o outro."
    ],
    compatibilidade: 91
  },

  "cancer-sagittarius": {
    resumo: "Câncer quer raiz, Sagitário quer horizonte: choque entre estabilidade e aventura.",
    combina: [
      "Sagitário pode trazer leveza ao emocional de Câncer",
      "Câncer pode oferecer porto seguro para Sagitário"
    ],
    nao_combina: [
      "Visões diferentes sobre compromisso",
      "Câncer pode se sentir abandonado; Sagitário, sufocado"
    ],
    dicas: [
      "Negociem espaço para viajar e espaço para construir, sem invalidar o desejo do outro."
    ],
    compatibilidade: 49
  },

  "cancer-capricorn": {
    resumo: "Eixo família x carreira: combinação clássica de construção a longo prazo.",
    combina: [
      "Câncer cuida do emocional, Capricórnio cuida da estrutura",
      "Os dois levam relacionamento a sério"
    ],
    nao_combina: [
      "Capricórnio pode parecer distante afetivamente",
      "Câncer pode dramatizar carências"
    ],
    dicas: [
      "Valorizem tanto o trabalho quanto o tempo juntos; nenhum dos dois deve ser negligenciado."
    ],
    compatibilidade: 83
  },

  "aquarius-cancer": {
    resumo: "Câncer vibra no emocional, Aquário no mental: linguagens muito diferentes.",
    combina: [
      "Aquário pode desafiar Câncer a ver o mundo além da zona de conforto",
      "Câncer pode ensinar Aquário sobre empatia e intimidade"
    ],
    nao_combina: [
      "Câncer pode sentir Aquário frio",
      "Aquário pode se incomodar com dependência emocional"
    ],
    dicas: [
      "Respeitem o tempo emocional de um e o espaço mental do outro."
    ],
    compatibilidade: 45
  },

  "cancer-pisces": {
    resumo: "Dois signos de água sensíveis e intuitivos: relação romântica, espiritual e altamente empática.",
    combina: [
      "Entendem o não-dito com facilidade",
      "Valorizam carinho, poesia e conexão emocional"
    ],
    nao_combina: [
      "Possível fuga de problemas concretos",
      "Oscilações de humor e vitimização"
    ],
    dicas: [
      "Estabeleçam limites saudáveis e lidem com a realidade prática juntos."
    ],
    compatibilidade: 89
  },

  // 🦁 LEÃO COM...

  "leo-leo": {
    resumo: "Dois reis no mesmo trono: relação quente, dramática e cheia de paixão e orgulho.",
    combina: [
      "Muita atração e vida social intensa",
      "Celebram um ao outro quando estão bem"
    ],
    nao_combina: [
      "Competição de ego e vaidade",
      "Dificuldade em admitir erros"
    ],
    dicas: [
      "Pratiquem a arte de elogiar e pedir desculpas, sem perder a dignidade."
    ],
    compatibilidade: 81
  },

  "leo-virgo": {
    resumo: "Leão quer brilho, Virgem quer eficiência: relação de complementos e críticas.",
    combina: [
      "Virgem pode ajudar Leão a organizar projetos",
      "Leão inspira Virgem a se expor mais"
    ],
    nao_combina: [
      "Virgem pode podar o entusiasmo de Leão com críticas",
      "Leão pode achar Virgem seco e exigente demais"
    ],
    dicas: [
      "Equilibrem admiração com feedback sincero, sem humilhar ou diminuir."
    ],
    compatibilidade: 57
  },

  "leo-libra": {
    resumo: "Par charmoso, social e estético: ótima combinação para romance e vida pública.",
    combina: [
      "Gostam de beleza, encontros e vida social",
      "Clima romântico e com gestos de afeto"
    ],
    nao_combina: [
      "Libra pode evitar confrontos",
      "Leão pode ser dramático quando não se sente valorizado"
    ],
    dicas: [
      "Aprendam a falar de frustrações antes de virar ressentimento silencioso ou cena exagerada."
    ],
    compatibilidade: 85
  },

  "leo-scorpio": {
    resumo: "Leão é fogo solto, Escorpião é água intensa: paixão forte, mas com disputas de poder.",
    combina: [
      "Magnetismo e forte atração física",
      "Lealdade quando comprometidos"
    ],
    nao_combina: [
      "Ciúmes, orgulho e teimosia",
      "Conflitos podem virar jogos de controle"
    ],
    dicas: [
      "Transformem o poder em união, não em disputa; confiança é central aqui."
    ],
    compatibilidade: 69
  },

  "leo-sagittarius": {
    resumo: "Fogo que se entende: relação energética, divertida e cheia de entusiasmo.",
    combina: [
      "Compartilham otimismo e vontade de aproveitar a vida",
      "Boa conexão em viagens, festas e projetos criativos"
    ],
    nao_combina: [
      "Impaciência com emoções mais densas",
      "Possível dificuldade em assumir responsabilidades chatas"
    ],
    dicas: [
      "Criem metas em comum para além da diversão, cuidando também do lado prático."
    ],
    compatibilidade: 90
  },

  "capricorn-leo": {
    resumo: "Capricórnio é sério, Leão é performático: relação que pode equilibrar ambição com brilho.",
    combina: [
      "Ambos querem sucesso e reconhecimento",
      "Capricórnio planeja; Leão lidera e inspira"
    ],
    nao_combina: [
      "Capricórnio pode achar Leão dramático",
      "Leão pode achar Capricórnio frio ou pessimista"
    ],
    dicas: [
      "Usem o orgulho para crescer juntos, não para provar quem tem razão."
    ],
    compatibilidade: 61
  },

  "aquarius-leo": {
    resumo: "Eixo do eu x o coletivo: relação intensa, diferente e muitas vezes nada convencional.",
    combina: [
      "Admiração por autenticidade e originalidade",
      "Podem ser um casal marcante e inspirador"
    ],
    nao_combina: [
      "Conflito entre necessidade de atenção (Leão) e de independência (Aquário)",
      "Teimosia e opiniões fortes dos dois lados"
    ],
    dicas: [
      "Conversem sobre liberdade, parceria e visibilidade de forma direta e honesta."
    ],
    compatibilidade: 74
  },

  "leo-pisces": {
    resumo: "Leão quer palco, Peixes quer sonho: relação sensível, mas com linguagens diferentes.",
    combina: [
      "Peixes traz romantismo e delicadeza",
      "Leão traz segurança, presença e calor"
    ],
    nao_combina: [
      "Peixes pode se sentir ofuscado ou não ouvido",
      "Leão pode não entender as fugas emocionais de Peixes"
    ],
    dicas: [
      "Cultivem a escuta: um precisa de validação, o outro de acolhimento."
    ],
    compatibilidade: 55
  },

  // 🌾 VIRGEM COM...

  "virgo-virgo": {
    resumo: "Dois analíticos: relação eficiente, organizada e um pouco crítica demais.",
    combina: [
      "Cuidado com detalhes e responsabilidade",
      "Valorizam estabilidade e rotina estruturada"
    ],
    nao_combina: [
      "Autocrítica e crítica ao parceiro em excesso",
      "Dificuldade em relaxar e curtir o momento"
    ],
    dicas: [
      "Reservem espaços sem pauta, sem meta, só para sentir e aproveitar."
    ],
    compatibilidade: 80
  },

  "libra-virgo": {
    resumo: "Virgem é prático, Libra é relacional: equilíbrio delicado entre eficiência e harmonia.",
    combina: [
      "Virgem cuida da parte prática",
      "Libra cuida da diplomacia e do clima"
    ],
    nao_combina: [
      "Virgem pode achar Libra superficial",
      "Libra pode achar Virgem duro e crítico demais"
    ],
    dicas: [
      "Juntem elegância com funcionalidade, sem diminuir o estilo do outro."
    ],
    compatibilidade: 58
  },

  "scorpio-virgo": {
    resumo: "Virgem observa, Escorpião aprofunda: relação intensa, investigativa e exigente.",
    combina: [
      "Capacidade de perceber nuances e detalhes",
      "Foco em evolução e melhoria contínua"
    ],
    nao_combina: [
      "Possível excesso de cobrança",
      "Dificuldade em relaxar emocionalmente"
    ],
    dicas: [
      "Façam pausas para prazer e leveza, não vivam só consertando coisas."
    ],
    compatibilidade: 72
  },

  "sagittarius-virgo": {
    resumo: "Virgem quer previsibilidade, Sagitário quer liberdade: choque de ritmos.",
    combina: [
      "Sagitário amplia horizontes de Virgem",
      "Virgem ajuda Sagitário a concretizar planos"
    ],
    nao_combina: [
      "Virgem pode criticar demais a espontaneidade de Sagitário",
      "Sagitário pode achar Virgem controlador"
    ],
    dicas: [
      "Façam acordos claros, mas deixem espaço para improviso e aventura."
    ],
    compatibilidade: 51
  },

  "capricorn-virgo": {
    resumo: "Par altamente funcional, focado em resultados, estabilidade e planejamento de longo prazo.",
    combina: [
      "Visão realista e disciplinada da vida",
      "Compromisso e responsabilidade no amor"
    ],
    nao_combina: [
      "Pouca demonstração afetiva espontânea",
      "Possível foco excessivo em trabalho e problemas"
    ],
    dicas: [
      "Lembrem que romance e carinho também fazem parte da produtividade emocional."
    ],
    compatibilidade: 87
  },

  "aquarius-virgo": {
    resumo: "Virgem organiza o micro, Aquário pensa no macro: visão diferente do mundo e da rotina.",
    combina: [
      "Podem criar projetos inovadores e bem estruturados",
      "Troca intelectual interessante"
    ],
    nao_combina: [
      "Virgem pode achar Aquário caótico",
      "Aquário pode achar Virgem engessado"
    ],
    dicas: [
      "Respeitem as diferenças: um cuida do detalhe, o outro da visão geral."
    ],
    compatibilidade: 52
  },

  "pisces-virgo": {
    resumo: "Eixo razão x emoção: relação de cura, mas também de desafios.",
    combina: [
      "Virgem traz praticidade às ilusões de Peixes",
      "Peixes traz sensibilidade à rigidez de Virgem"
    ],
    nao_combina: [
      "Virgem pode ser cruel sem querer com a sensibilidade de Peixes",
      "Peixes pode se fazer de vítima e fugir da realidade"
    ],
    dicas: [
      "Conversem com empatia: façam críticas com carinho e sonhos com pés no chão."
    ],
    compatibilidade: 73
  },

  // ⚖️ LIBRA COM...

  "libra-libra": {
    resumo: "Dois diplomatas: relação harmoniosa na superfície, mas que pode evitar conflitos demais.",
    combina: [
      "Valorizam parceria, estética e respeito",
      "Bom gosto para programas e ambiente"
    ],
    nao_combina: [
      "Dificuldade em tomar decisões firmes",
      "Tendência a varrer problemas para debaixo do tapete"
    ],
    dicas: [
      "Conflito saudável também é amor: falem o que incomoda sem medo de perder aprovação."
    ],
    compatibilidade: 82
  },

  "libra-scorpio": {
    resumo: "Libra busca equilíbrio, Escorpião quer intensidade: relação com muita química e tensão.",
    combina: [
      "Forte atração e magnetismo",
      "Possibilidade de aprofundar temas emocionais"
    ],
    nao_combina: [
      "Libra pode evitar confrontos que Escorpião exige",
      "Escorpião pode ser intenso demais para Libra"
    ],
    dicas: [
      "Libra: seja mais objetivo; Escorpião: pegue leve nos testes emocionais."
    ],
    compatibilidade: 60
  },

  "libra-sagittarius": {
    resumo: "Relação leve, aventureira e sociável: ótima para viagens e experiências a dois.",
    combina: [
      "Ambos gostam de liberdade e movimento",
      "Boa sintonia em conversas e interesses"
    ],
    nao_combina: [
      "Evitam lidar com emoções densas",
      "Compromisso pode ser um tema delicado"
    ],
    dicas: [
      "Definam o que compromisso significa para os dois, sem pressão, mas com honestidade."
    ],
    compatibilidade: 79
  },

  "capricorn-libra": {
    resumo: "Capricórnio é objetivo, Libra pondera: relação que mistura pragmatismo com diplomacia.",
    combina: [
      "Libra suaviza a rigidez de Capricórnio",
      "Capricórnio dá direção e concretude às ideias de Libra"
    ],
    nao_combina: [
      "Conflitos entre racionalidade e idealismo",
      "Capricórnio pode achar Libra indeciso demais"
    ],
    dicas: [
      "Estabeleçam prioridades em comum, dividindo tarefas de decisão e negociação."
    ],
    compatibilidade: 56
  },

  "aquarius-libra": {
    resumo: "Ar com ar: relação moderna, mental e cheia de troca de ideias.",
    combina: [
      "Valorizam liberdade e respeito",
      "Gostam de conversar e explorar conceitos"
    ],
    nao_combina: [
      "Tendência a intelectualizar sentimentos",
      "Possível dificuldade em lidar com dramas emocionais"
    ],
    dicas: [
      "Lembrem-se de perguntar: 'o que você está sentindo?' e não só 'o que você pensa sobre isso?'."
    ],
    compatibilidade: 86
  },

  "libra-pisces": {
    resumo: "Dois signos que buscam conexão e sensibilidade, mas podem se perder em indecisões.",
    combina: [
      "Empatia e delicadeza no trato com o outro",
      "Romantismo e idealização do amor"
    ],
    nao_combina: [
      "Dificuldade em colocar limites claros",
      "Tendência a evitar conflitos de qualquer forma"
    ],
    dicas: [
      "Tragam mais estrutura para a relação: combinados, limites e decisões concretas."
    ],
    compatibilidade: 66
  },

  // 🦂 ESCORPIÃO COM...

  "scorpio-scorpio": {
    resumo: "Intensidade máxima: relação profunda, transformadora e às vezes explosiva.",
    combina: [
      "Lealdade e profundidade emocional",
      "Forte ligação física e espiritual"
    ],
    nao_combina: [
      "Ciúmes, controle e paranoia",
      "Dificuldade em perdoar traições e mentiras"
    ],
    dicas: [
      "Transparência total e terapia de casal podem ser grandes aliadas aqui."
    ],
    compatibilidade: 84
  },

  "sagittarius-scorpio": {
    resumo: "Escorpião investiga, Sagitário ri: tensão entre profundidade e leveza.",
    combina: [
      "Sagitário traz humor para densidade de Escorpião",
      "Escorpião traz compromisso e foco para Sagitário"
    ],
    nao_combina: [
      "Escorpião pode sentir falta de entrega emocional",
      "Sagitário pode se sentir controlado"
    ],
    dicas: [
      "Respeitem o espaço um do outro e conversem sobre o que significa lealdade."
    ],
    compatibilidade: 55
  },

  "capricorn-scorpio": {
    resumo: "Par estratégico e intenso: ótimo para construir algo forte e duradouro.",
    combina: [
      "Capricórnio traz planejamento",
      "Escorpião traz paixão e profundidade emocional"
    ],
    nao_combina: [
      "Rigidez e dificuldade em mostrar vulnerabilidade",
      "Possível dureza nas discussões"
    ],
    dicas: [
      "Tragam mais expressão afetiva e momentos de leveza para equilibrar a seriedade."
    ],
    compatibilidade: 82
  },

  "aquarius-scorpio": {
    resumo: "Escorpião sente, Aquário analisa: linguagens muito diferentes de lidar com a vida.",
    combina: [
      "Podem se fascinar pelas diferenças",
      "Boa troca em temas complexos e psicológicos"
    ],
    nao_combina: [
      "Escorpião pode achar Aquário frio",
      "Aquário pode achar Escorpião dramático"
    ],
    dicas: [
      "Negociem a forma de discutir problemas: sem desaparecer e sem explodir."
    ],
    compatibilidade: 47
  },

  "pisces-scorpio": {
    resumo: "Água profunda com água sensível: relação intensa, espiritual e muito emocional.",
    combina: [
      "Forte conexão intuitiva",
      "Capacidade de suporte emocional mútuo"
    ],
    nao_combina: [
      "Ciúmes, idealização e medo de abandono",
      "Dificuldade em lidar com realidade dura"
    ],
    dicas: [
      "Manter pé no chão e cuidar de saúde mental é essencial nessa combinação."
    ],
    compatibilidade: 88
  },

  // 🎯 SAGITÁRIO COM...

  "sagittarius-sagittarius": {
    resumo: "Dois aventureiros: relação cheia de movimento, riso e liberdade.",
    combina: [
      "Amor por viagens, experiências e novidades",
      "Sinceridade e honestidade (às vezes brutal)"
    ],
    nao_combina: [
      "Apego baixo à rotina e à estabilidade",
      "Medo de compromissos e responsabilidades chatas"
    ],
    dicas: [
      "Criem um tipo de compromisso que faça sentido para os dois, sem amarras excessivas."
    ],
    compatibilidade: 86
  },

  "capricorn-sagittarius": {
    resumo: "Sagitário quer explorar, Capricórnio quer consolidar: visões diferentes sobre vida e tempo.",
    combina: [
      "Sagitário inspira Capricórnio a arriscar mais",
      "Capricórnio ensina Sagitário a planejar"
    ],
    nao_combina: [
      "Capricórnio pode achar Sagitário irresponsável",
      "Sagitário pode achar Capricórnio rígido e pessimista"
    ],
    dicas: [
      "Definam metas que incluam aventura e segurança, sem invalidar o estilo do outro."
    ],
    compatibilidade: 53
  },

  "aquarius-sagittarius": {
    resumo: "Par livre, mental e visionário: ótima combinação para relacionamentos não convencionais.",
    combina: [
      "Valorizam independência e autenticidade",
      "Gostam de conversar sobre ideias e futuro"
    ],
    nao_combina: [
      "Dificuldade em lidar com demandas emocionais profundas",
      "Tendência a racionalizar tudo"
    ],
    dicas: [
      "Criem momentos para contato emocional real, sem piadas ou fuga."
    ],
    compatibilidade: 84
  },

  "pisces-sagittarius": {
    resumo: "Sagitário é direto, Peixes é sensível: mistura de inspiração e possíveis mágoas.",
    combina: [
      "Ambos podem sonhar alto juntos",
      "Sagitário motiva, Peixes sensibiliza"
    ],
    nao_combina: [
      "Sinceridade de Sagitário pode ferir Peixes",
      "Peixes pode ser visto como dramático ou confuso"
    ],
    dicas: [
      "Sagitário: meça as palavras; Peixes: comunique de forma clara o que te machuca."
    ],
    compatibilidade: 59
  },

  // 🪨 CAPRICÓRNIO COM...

  "capricorn-capricorn": {
    resumo: "Dois estrategistas: relação séria, focada e altamente comprometida, mas com risco de frieza.",
    combina: [
      "Respeito, lealdade e responsabilidade",
      "Foco em objetivos de longo prazo"
    ],
    nao_combina: [
      "Pouca demonstração emocional espontânea",
      "Possível excesso de cobrança e autocobrança"
    ],
    dicas: [
      "Incluam lazer e carinho na agenda, não só trabalho e metas."
    ],
    compatibilidade: 88
  },

  "aquarius-capricorn": {
    resumo: "Capricórnio estrutura, Aquário inova: relação que pode ser muito produtiva.",
    combina: [
      "Podem construir projetos sólidos e modernos",
      "Capricórnio traz disciplina, Aquário criatividade"
    ],
    nao_combina: [
      "Visões diferentes sobre regras e tradições",
      "Capricórnio pode achar Aquário rebelde demais"
    ],
    dicas: [
      "Negociem o que é inegociável e onde dá para experimentar coisas novas."
    ],
    compatibilidade: 62
  },

  "capricorn-pisces": {
    resumo: "Capricórnio é terra, Peixes é água: relação de apoio mútuo entre realidade e sonho.",
    combina: [
      "Capricórnio oferece base e direção",
      "Peixes traz empatia, arte e inspiração"
    ],
    nao_combina: [
      "Capricórnio pode invalidar emoções de Peixes",
      "Peixes pode fugir de conversas difíceis"
    ],
    dicas: [
      "Capricórnio: acolha antes de corrigir; Peixes: encare a realidade com apoio, não sozinho."
    ],
    compatibilidade: 78
  },

  // 🌬️ AQUÁRIO COM...

  "aquarius-aquarius": {
    resumo: "Dois independentes: relação mental, livre e pouco tradicional.",
    combina: [
      "Respeitam espaço e individualidade",
      "Interesse em ideias novas e causas"
    ],
    nao_combina: [
      "Pouca expressão emocional direta",
      "Tendência a evitar conversas muito íntimas"
    ],
    dicas: [
      "Vulnerabilidade também é revolucionária: falem sobre sentimentos de vez em quando."
    ],
    compatibilidade: 85
  },

  "aquarius-pisces": {
    resumo: "Aquário pensa, Peixes sente: relação que pode ser espiritual e confusa ao mesmo tempo.",
    combina: [
      "Interesse em temas coletivos e humanos",
      "Podem sonhar com um mundo melhor juntos"
    ],
    nao_combina: [
      "Falhas na comunicação emocional",
      "Aquário pode minimizar a sensibilidade de Peixes"
    ],
    dicas: [
      "Traduzam sentimentos em palavras claras e respeitem as diferenças de expressão."
    ],
    compatibilidade: 57
  },

  // 🌊 PEIXES COM...

  "pisces-pisces": {
    resumo: "Dois sonhadores: relação romântica, intuitiva e altamente emocional, mas pouco prática.",
    combina: [
      "Empatia profunda e conexão espiritual",
      "Muito romantismo e imaginação"
    ],
    nao_combina: [
      "Fuga da realidade e das responsabilidades",
      "Dificuldade em lidar com conflitos claros"
    ],
    dicas: [
      "Criem rotinas mínimas e acordos práticos para não se perderem no mundo das ideias."
    ],
    compatibilidade: 82
  }
};

// --- ESTRUTURA PARA AMIZADE (Preencha conforme desejar) ---
export const UNIQUE_FRIENDSHIP: Record<string, CompatibilityResult> = {
  // Use a mesma chave 'aries-aries', etc.
};

// --- TEMPLATES FALLBACK (Apenas se não houver texto único) ---
const TEMPLATES_FRIENDSHIP = {
  high: [
    {
      resumo: "Irmãos de alma! A conexão entre {A} e {B} é imediata. A lealdade é o ponto forte dessa amizade. Vocês funcionam como um time perfeito e se defendem contra tudo.",
      combina: ["Humor idêntico e piadas internas", "Lealdade absoluta"],
      nao_combina: ["Podem excluir outras pessoas", "Dificuldade em ouvir verdades duras"],
      dicas: ["Aproveitem essa conexão rara, mas não se fechem para o mundo."],
      compatibilidade: 0 // Será substituído pelo cálculo
    }
  ],
  medium: [
    {
      resumo: "Bons parceiros de rolê. {A} e {B} se dão bem em momentos de diversão, mas podem ter divergências em assuntos sérios. É uma amizade leve e sem muitas cobranças.",
      combina: ["Ótimos para festas e viagens", "Respeito mútuo"],
      nao_combina: ["Falta de profundidade em conversas", "Valores diferentes"],
      dicas: ["Foquem no que une vocês e evitem polêmicas desnecessárias."],
      compatibilidade: 0
    }
  ],
  low: [
    {
      resumo: "Diplomacia é chave. {A} e {B} são muito diferentes. A amizade exige esforço e paciência, pois o modo de ver a vida é oposto. Respeito é fundamental para funcionar.",
      combina: ["Aprendizado pela diferença", "Possibilidade de expandir horizontes"],
      nao_combina: ["Mal-entendidos frequentes", "Energias que não batem"],
      dicas: ["Mantenham a cordialidade e não tentem mudar o jeito do outro."],
      compatibilidade: 0
    }
  ]
};

const TEMPLATES_LOVE_FALLBACK = {
    high: [
        {
             resumo: "Encontro de almas! {A} e {B} têm uma sintonia incrível. A relação flui com naturalidade e paixão.",
             combina: ["Química forte", "Valores alinhados"],
             nao_combina: ["Risco de isolamento do mundo", "Idealização"],
             dicas: ["Aproveitem o amor, mas mantenham os pés no chão."],
             compatibilidade: 0
        }
    ],
    medium: [
        {
             resumo: "Atração e desafio. {A} e {B} se atraem, mas precisam ajustar arestas para a convivência fluir.",
             combina: ["Paixão intensa", "Aprendizado mútuo"],
             nao_combina: ["Teimosias de ambos os lados", "Comunicação ruidosa"],
             dicas: ["Tenham paciência e saibam ceder quando necessário."],
             compatibilidade: 0
        }
    ],
    low: [
        {
             resumo: "Desafio de crescimento. {A} e {B} são opostos. A relação exige muito trabalho e compreensão.",
             combina: ["Atração pelo diferente", "Quebra de rotina"],
             nao_combina: ["Incompatibilidade de gênios", "Rotinas diferentes"],
             dicas: ["O respeito às diferenças é o único caminho para o sucesso."],
             compatibilidade: 0
        }
    ]
}


export const getCompatibility = async (
  signA: SignData, 
  signB: SignData,
  mode: 'love' | 'friendship' = 'love'
): Promise<CompatibilityResult> => {
  
  // 1. Generate Key (Alphabetical Order)
  const [s1, s2] = [signA, signB].sort((a, b) => a.id.localeCompare(b.id));
  const key = `${s1.id}-${s2.id}`;

  // 2. Check Unique Dictionary
  if (mode === 'love' && UNIQUE_LOVE[key]) {
      return UNIQUE_LOVE[key];
  }
  
  if (mode === 'friendship' && UNIQUE_FRIENDSHIP[key]) {
      return UNIQUE_FRIENDSHIP[key];
  }

  // 3. Fallback to Calculation & Templates if Unique Text Missing
  const score = calculateDeterministicScore(signA, signB);
  let category: 'high' | 'medium' | 'low' = 'low';
  if (score >= 80) category = 'high';
  else if (score >= 50) category = 'medium';

  const templateSource = mode === 'love' ? TEMPLATES_LOVE_FALLBACK : TEMPLATES_FRIENDSHIP;
  const templates = templateSource[category];
  const selectedTemplate = templates[0]; // Simple fallback, just take first

  const formatText = (text: string) => {
    return text.replace(/{A}/g, signA.name).replace(/{B}/g, signB.name);
  };

  return {
    resumo: formatText(selectedTemplate.resumo),
    combina: selectedTemplate.combina,
    nao_combina: selectedTemplate.nao_combina,
    dicas: selectedTemplate.dicas,
    compatibilidade: score
  };
};