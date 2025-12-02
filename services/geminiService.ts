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
    resumo:
      "Dois fogos juntos criam uma relação intensa, apaixonada e cheia de atitude, em que ninguém tem medo de tomar iniciativa. Mas se não houver maturidade, essa paixão facilmente vira guerra de egos e disputas intermináveis.",
    combina: [
      "Muita energia, desejo e atração física",
      "Parceria perfeita para aventuras, projetos ousados e grandes mudanças",
      "Sinceridade brutal que impede a relação de virar algo morno ou sem graça"
    ],
    nao_combina: [
      "Competição exagerada para ver quem manda mais ou tem mais razão",
      "Explosões de raiva e brigas impulsivas por coisas pequenas",
      "Dificuldade em ceder e pedir desculpas quando erram"
    ],
    dicas: [
      "Lembrem que vocês estão no mesmo time: usem o fogo para proteger a relação, não para destruir um ao outro.",
      "Criem regras de combate justo: podem discordar, mas sem humilhar, desrespeitar ou jogar passado na cara."
    ],
    compatibilidade: 82
  },
  "aries-taurus": {
    resumo:
      "Áries acelera tudo, enquanto Touro prefere ir com calma e segurança, criando uma relação de ritmos opostos que pode ser supercomplementar. Se os dois se respeitarem, o fogo de Áries e a constância de Touro constroem algo sólido e duradouro.",
    combina: [
      "Touro traz estabilidade emocional e material para os impulsos de Áries",
      "Áries inspira Touro a se arriscar mais e sair da zona de conforto",
      "Os dois apreciam lealdade e podem formar um casal muito fiel"
    ],
    nao_combina: [
      "Teimosia dos dois quando se sentem contrariados",
      "Impaciência de Áries com a lentidão e o apego às rotinas de Touro",
      "Conflitos sobre mudanças, onde um quer ação rápida e o outro quer pensar por semanas"
    ],
    dicas: [
      "Áries precisa aprender a respeitar o tempo de Touro, sem forçar decisões na base da pressão.",
      "Touro, por sua vez, ganha muito quando cede um pouco e mostra flexibilidade para experimentar o novo junto com Áries."
    ],
    compatibilidade: 64
  },
  "aries-gemini": {
    resumo:
      "Áries e Gêmeos formam uma dupla elétrica, cheia de movimento, conversas e improviso, criando uma relação em que o tédio praticamente não existe. O desafio é transformar tanta leveza e espontaneidade em compromisso real e presença genuína.",
    combina: [
      "Os dois gostam de variedade, novidade e aventuras inesperadas",
      "Conexão mental forte, com muita conversa, risadas e piadas internas",
      "Facilidade em perdoar rápido e seguir em frente depois de pequenas brigas"
    ],
    nao_combina: [
      "Falta de profundidade emocional em alguns momentos importantes",
      "Impulsividade de Áries versus indecisão e mudanças de ideia de Gêmeos",
      "Dificuldade em manter a consistência em planos de longo prazo"
    ],
    dicas: [
      "Criem alguns combinados básicos (como respeito a horários, mensagens e acordos) para dar estrutura à relação sem engessá-la.",
      "Lembrem que compromisso não precisa matar a liberdade: é possível ter aventura com responsabilidade emocional."
    ],
    compatibilidade: 78
  },
  "aries-cancer": {
    resumo:
      "Áries chega com força, impulso e franqueza, enquanto Câncer traz sensibilidade, cuidado e profundidade emocional. Essa combinação pode ser uma história de cura e proteção, ou um campo de batalha entre dureza e mágoas silenciosas.",
    combina: [
      "Câncer oferece acolhimento e carinho que tocam o coração de Áries",
      "Áries traz coragem, defesa e postura de proteção para Câncer",
      "Os dois levam relacionamento a sério quando se comprometem de verdade"
    ],
    nao_combina: [
      "Áries pode ser bruto nas palavras e atitudes, ferindo a sensibilidade de Câncer",
      "Câncer tende a guardar ressentimentos e relembrar feridas antigas",
      "Diferenças na forma de lidar com conflitos: um quer resolver rápido, o outro precisa de tempo"
    ],
    dicas: [
      "Áries: escolha melhor as palavras, principalmente em momentos de irritação; nem tudo precisa ser dito na hora da raiva.",
      "Câncer: em vez de se fechar e esperar que o outro adivinhe, comunique o que sente e o que precisa de forma direta e honesta."
    ],
    compatibilidade: 58
  },
  "aries-leo": {
    resumo:
      "Áries e Leão formam um casal de fogo em todos os sentidos, com muita paixão, presença e vontade de viver intensamente. A relação é épica, cheia de histórias, mas também repleta de cenas dramáticas quando o orgulho entra em cena.",
    combina: [
      "Química física intensa e atração imediata entre os dois",
      "Ambos têm energia, coragem e gostam de viver grandes experiências",
      "Admiram a força, a autenticidade e o jeito decidido um do outro"
    ],
    nao_combina: [
      "Competição por protagonismo, atenção e reconhecimento",
      "Dificuldade enorme em admitir erros e dar o braço a torcer",
      "Brigas que podem virar espetáculos de orgulho ferido, com palavras duras"
    ],
    dicas: [
      "Aprendam a elogiar e reconhecer as qualidades do outro com generosidade, em vez de comparar quem brilha mais.",
      "Decidam juntos que o ego não vai comandar o relacionamento: às vezes ganhar é ceder, para não perder a conexão."
    ],
    compatibilidade: 86
  },
  "aries-virgo": {
    resumo:
      "Áries age primeiro e pensa depois, enquanto Virgem analisa tudo dez vezes antes de se mover, criando uma dinâmica de choque entre impulso e perfeccionismo. Se houver respeito, essa diferença pode virar um grande motor de evolução para os dois.",
    combina: [
      "Virgem ajuda Áries a planejar melhor e evitar erros desnecessários",
      "Áries motiva Virgem a agir, mesmo sem ter tudo 100% perfeito",
      "Os dois podem se apoiar na vida prática e no dia a dia de forma eficiente"
    ],
    nao_combina: [
      "Críticas constantes de Virgem podem minar a confiança de Áries",
      "Áries pode ignorar conselhos importantes por achar tudo 'frescura'",
      "Virgem pode se frustrar com a desorganização e o improviso de Áries"
    ],
    dicas: [
      "Virgem: foque em críticas construtivas e reconheça quando Áries acerta; isso fortalece a parceria.",
      "Áries: tente ouvir antes de reagir; às vezes, um pouco de planejamento evita muito desgaste depois."
    ],
    compatibilidade: 55
  },
  "aries-libra": {
    resumo:
      "Áries é direto e impulsivo, Libra é diplomático e busca harmonia, formando um casal que representa dois lados do mesmo eixo: o eu e o outro. Quando conseguem se equilibrar, essa combinação é muito rica em crescimento emocional e relacional.",
    combina: [
      "Libra traz empatia, charme e visão de ambos os lados da história",
      "Áries traz decisão, ação e coragem de falar o que ninguém diz",
      "Os dois podem aprender muito sobre equilíbrio entre individualidade e parceria"
    ],
    nao_combina: [
      "Áries pode achar Libra indeciso e excessivamente preocupado com a opinião alheia",
      "Libra pode achar Áries grosso, precipitado e pouco sensível",
      "Conflitos sobre a forma de discutir: um vai reto ao ponto, o outro rodeia para evitar briga"
    ],
    dicas: [
      "Unam o melhor dos dois mundos: sinceridade de Áries com o tato de Libra, sem excluir nenhum dos dois.",
      "Falarem abertamente sobre como gostam de receber críticas e pedidos ajuda muito a evitar ressentimentos."
    ],
    compatibilidade: 75
  },
  "aries-scorpio": {
    resumo:
      "Áries e Escorpião trazem uma energia de intensidade, desejo e confrontos profundos, com um magnetismo difícil de ignorar. Porém, essa mesma força pode virar jogos de poder, ciúmes e testes emocionais pesados se não houver maturidade.",
    combina: [
      "Muita química sexual e atração quase irresistível",
      "Os dois são corajosos e não fogem de temas difíceis",
      "Lealdade forte quando decidem se comprometer de verdade"
    ],
    nao_combina: [
      "Ciúmes, possessividade e disputas por controle",
      "Discussões que facilmente viram confrontos destrutivos",
      "Tendência a testar o outro para ver até onde ele vai"
    ],
    dicas: [
      "Estabeleçam confiança como prioridade máxima, evitando jogos mentais e provocações desnecessárias.",
      "Trabalhem a vulnerabilidade: abrir o coração é mais poderoso do que atacar primeiro para não se machucar."
    ],
    compatibilidade: 70
  },
  "aries-sagittarius": {
    resumo:
      "Áries e Sagitário formam um casal fogoso, espontâneo e sempre pronto para a próxima aventura, viagem ou loucura. A relação é cheia de risadas, sinceridade e movimento, mas pode pecar por falta de profundidade emocional em certos momentos.",
    combina: [
      "Ambos valorizam liberdade, autenticidade e sinceridade",
      "Gostam de desafios, ação e experiências intensas juntos",
      "Têm facilidade para superar pequenos conflitos e seguir em frente"
    ],
    nao_combina: [
      "Pouca tolerância para dramas emocionais prolongados",
      "Dificuldade em lidar com rotinas, responsabilidades e cobranças",
      "Possibilidade de prometer coisas no calor do momento e não sustentar depois"
    ],
    dicas: [
      "Criem espaço para conversas mais profundas, falando de medos e vulnerabilidades sem piada ou fuga.",
      "Mesmo amando liberdade, estabeleçam acordos mínimos de respeito e presença, para a relação não virar algo solto demais."
    ],
    compatibilidade: 88
  },
  "aries-capricorn": {
    resumo:
      "Áries é impulso e urgência, Capricórnio é estratégia e paciência, compondo um casal que pode construir muito se aprender a jogar no mesmo time. O choque entre espontaneidade e seriedade é grande, mas também extremamente produtivo quando bem dirigido.",
    combina: [
      "Capricórnio dá estrutura, foco e planejamento para as ideias de Áries",
      "Áries traz energia, ousadia e iniciativa para sair da inércia",
      "Os dois podem se admirar pela força, pela determinação e pela honestidade"
    ],
    nao_combina: [
      "Capricórnio pode achar Áries imaturo, irresponsável ou precipitado",
      "Áries pode achar Capricórnio frio, pessimista ou controlador demais",
      "Conflitos sobre tempo e prioridades: um quer agora, o outro quer fazer direito"
    ],
    dicas: [
      "Estabeleçam objetivos em comum, unindo a coragem de começar com a disciplina de terminar.",
      "Capricórnio: reconheça o valor do entusiasmo; Áries: enxergue o quanto a visão de longo prazo protege o relacionamento."
    ],
    compatibilidade: 60
  },
  "aquarius-aries": {
    resumo:
      "Áries e Aquário formam uma dupla explosiva e original, com muita independência, autenticidade e debates intensos. O relacionamento tende a fugir do padrão, mas pode esbarrar em teimosia e dificuldade para lidar com emoções mais profundas.",
    combina: [
      "Os dois apreciam liberdade, novidade e experiências diferentes",
      "Conexão mental forte, com muitas conversas francas e sem tabu",
      "Respeito pela individualidade e pelo espaço pessoal de cada um"
    ],
    nao_combina: [
      "Teimosia elevada: ambos acham que estão certos",
      "Dificuldade em lidar com inseguranças e vulnerabilidades emocionais",
      "Possibilidade de racionalizar demais sentimentos importantes"
    ],
    dicas: [
      "Lembrem que sentir não é fraqueza: abrir o jogo sobre emoções aproxima mais do que qualquer discurso perfeito.",
      "Criem acordos claros sobre liberdade, compromisso e exclusividade para ninguém ficar interpretando sozinho."
    ],
    compatibilidade: 80
  },
  "aries-pisces": {
    resumo:
      "Áries é direto e contundente, enquanto Peixes é delicado e emocional, criando um contraste entre força e sensibilidade. Se ambos estiverem dispostos a aprender um com o outro, a relação pode ser profundamente transformadora.",
    combina: [
      "Peixes traz romantismo, imaginação e compaixão para a relação",
      "Áries oferece proteção, coragem e a sensação de que 'dá pra ir' atrás dos sonhos",
      "Os dois podem se inspirar mutuamente a crescer em áreas que sozinhos não iriam"
    ],
    nao_combina: [
      "Áries pode atropelar a sensibilidade de Peixes com palavras duras",
      "Peixes pode se vitimizar ou fugir dos conflitos em vez de enfrentá-los",
      "Diferenças na forma de lidar com frustrações: um explode, o outro se dissolve"
    ],
    dicas: [
      "Áries: seja firme, mas gentil; escolha momentos e formas mais suaves para falar verdades difíceis.",
      "Peixes: pratique a honestidade emocional direta; dizer o que dói é melhor do que esperar que o outro adivinhe."
    ],
    compatibilidade: 57
  },
  // 🌱 TOURO COM...
  "taurus-taurus": {
    resumo:
      "Dois taurinos juntos criam uma relação estável, sensual e muito voltada para conforto, segurança e prazer. Porém, se não houver flexibilidade, essa mesma estabilidade pode virar estagnação e resistência quase absoluta a mudanças.",
    combina: [
      "Lealdade, constância e compromisso real com a relação",
      "Apreço por conforto, boa comida, bons lugares e tempo de qualidade",
      "Forte química física, com foco em carinho, contato e sensualidade tranquila"
    ],
    nao_combina: [
      "Teimosia em dobro, com pouca vontade de ceder quando há divergências",
      "Dificuldade em mudar hábitos, rotinas e perspectivas mesmo quando necessário",
      "Possibilidade de ficar preso em zonas de conforto que não fazem mais sentido"
    ],
    dicas: [
      "Incluam pequenas novidades na rotina para não deixar o relacionamento ficar previsível demais.",
      "Lembrem que ceder um pouco não ameaça a segurança de vocês; muitas vezes, é isso que renova a relação."
    ],
    compatibilidade: 84
  },
  "gemini-taurus": {
    resumo:
      "Touro busca estabilidade, previsibilidade e certezas, enquanto Gêmeos busca movimento, troca e mudança constante. Essa relação pode ser muito enriquecedora, trazendo tanto segurança quanto leveza — ou virar uma eterna fonte de frustração mútua.",
    combina: [
      "Gêmeos traz humor, curiosidade e novos temas para a vida de Touro",
      "Touro oferece presença, segurança e um porto seguro para Gêmeos",
      "Os dois podem aprender a equilibrar rotina e novidade de forma inteligente"
    ],
    nao_combina: [
      "Touro pode se sentir inseguro com a instabilidade e as mudanças de humor de Gêmeos",
      "Gêmeos pode achar Touro previsível, rígido ou dramático demais com mudanças",
      "Descompasso entre necessidade de controle (Touro) e necessidade de liberdade (Gêmeos)"
    ],
    dicas: [
      "Definam juntos quais áreas podem ter improviso e quais precisam de estabilidade para ninguém surtar.",
      "Touro ganha ao flexibilizar um pouco; Gêmeos cresce ao honrar compromissos e cuidar da confiança do outro."
    ],
    compatibilidade: 59
  },
  "cancer-taurus": {
    resumo:
      "Touro e Câncer formam um casal extremamente acolhedor, carinhoso e voltado para laços duradouros, família e aconchego. Essa é uma combinação clássica de amor que cuida, protege e constrói, com um clima de porto seguro para ambos.",
    combina: [
      "Ambos valorizam segurança emocional e relacionamentos estáveis",
      "Gostam de cuidar um do outro através de gestos concretos, comida, toque e presença",
      "Têm facilidade para construir uma vida tranquila, com foco em casa, família e intimidade"
    ],
    nao_combina: [
      "Dificuldade em lidar com mudanças repentinas ou situações imprevisíveis",
      "Tendência a guardar mágoas e não falar abertamente sobre incômodos",
      "Possível apego excessivo, com ciúmes ou medo de abandono"
    ],
    dicas: [
      "Criem o hábito de conversar sobre sentimentos antes que eles virem silêncio duro ou afastamento.",
      "Lembrem que segurança não é ficar parado, e sim se movimentar juntos de forma honesta e alinhada."
    ],
    compatibilidade: 90
  },
  "leo-taurus": {
    resumo:
      "Touro e Leão formam uma dupla sensual, vaidosa e muito ligada ao prazer e ao conforto, mas também incrivelmente teimosa. Quando se entendem, viram um casal poderoso; quando entram em rota de colisão, ninguém quer ceder um centímetro.",
    combina: [
      "Os dois apreciam coisas boas: boa comida, bons ambientes e certa dose de luxo",
      "Forte atração física e química quando há admiração mútua",
      "Podem formar uma relação estável, leal e cheia de momentos marcantes"
    ],
    nao_combina: [
      "Disputa velada ou explícita por controle e poder dentro da relação",
      "Orgulho ferido de ambos quando se sentem desvalorizados",
      "Rigidez para mudar de opinião, de planos ou de dinâmica"
    ],
    dicas: [
      "Trabalhem a arte do elogio sincero: alimentar o ego saudável do outro ajuda a reduzir as disputas.",
      "Escolham bem as batalhas: nem toda divergência precisa virar uma guerra por quem está certo."
    ],
    compatibilidade: 68
  },
  "taurus-virgo": {
    resumo:
      "Touro e Virgem são dois signos de terra que buscam estabilidade, segurança e praticidade, formando um casal extremamente confiável. A relação tende a ser calma, realista e focada em construir uma vida sólida, mas precisa de doses de prazer e espontaneidade para não ficar séria demais.",
    combina: [
      "Valores semelhantes sobre dinheiro, trabalho e compromisso",
      "Boa capacidade de organizar a vida material e o dia a dia juntos",
      "Apoio mútuo em momentos de dificuldade, com atitudes concretas e não só palavras"
    ],
    nao_combina: [
      "Possibilidade de excesso de crítica, perfeccionismo e cobrança",
      "Risco de rotina previsível demais e pouco espaço para romance, jogo e novidade",
      "Dificuldade em lidar com situações fora do planejado"
    ],
    dicas: [
      "Reservem momentos para o amor leve: encontros, surpresas simples, elogios e carinho gratuito.",
      "Lembrem que a relação não é só um projeto de eficiência; é também lugar de prazer e vulnerabilidade."
    ],
    compatibilidade: 88
  },
  "libra-taurus": {
    resumo:
      "Touro e Libra compartilham o regente Vênus, o que traz uma forte conexão com beleza, prazer e relações. Esse casal costuma ser estético, charmoso e muito ligado à ideia de parceria, mas precisa alinhar expectativas sobre compromisso e mudança.",
    combina: [
      "Os dois apreciam ambientes agradáveis, bons lugares e certa sofisticação",
      "Valorizam relacionamentos duradouros e não gostam de jogar seus vínculos fora por qualquer coisa",
      "Têm potencial para uma relação cheia de carinho, toques, presentes e gestos românticos"
    ],
    nao_combina: [
      "Libra pode demorar demais para decidir, irritando a objetividade de Touro",
      "Touro pode ser possessivo, gerando desconforto na sociabilidade de Libra",
      "Conflitos quando Libra tenta evitar brigas e Touro quer resolver direto"
    ],
    dicas: [
      "Libra: seja mais claro sobre o que quer; Touro precisa de segurança, não de sinais confusos.",
      "Touro: lembre que Libra precisa de leveza e circulação; controle em excesso sufoca o relacionamento."
    ],
    compatibilidade: 72
  },
  "scorpio-taurus": {
    resumo:
      "Touro e Escorpião formam um eixo de intensidade, possessividade e lealdade extrema. A relação é profunda, carnal e emocional, com forte apego, tanto para o bem quanto para o caos, se o ciúme e o controle tomarem conta.",
    combina: [
      "Os dois levam o relacionamento a sério e não gostam de coisas superficiais",
      "Há forte atração física e emocional, com sensação de 'é tudo ou nada'",
      "Capacidade de construir laços muito consistentes e quase inquebráveis"
    ],
    nao_combina: [
      "Ciúmes, controle e necessidade de 'provar' lealdade o tempo todo",
      "Teimosia dos dois, com dificuldade em recuar em discussões",
      "Possibilidade de relacionamentos que se tornam intensos demais e pouco saudáveis"
    ],
    dicas: [
      "Trabalhem confiança com transparência, não com testes e provocações.",
      "Lembrem que amor não precisa ser guerra emocional constante; estabilidade também pode ser intensa."
    ],
    compatibilidade: 76
  },
  "sagittarius-taurus": {
    resumo:
      "Touro quer raízes, enquanto Sagitário quer horizontes, resultando numa relação em que um puxa para dentro e o outro puxa para fora. Isso pode gerar um equilíbrio interessante ou uma sensação de que estão sempre em direções opostas.",
    combina: [
      "Touro oferece estabilidade e cuidado concreto para Sagitário",
      "Sagitário traz leveza, aventura e entusiasmo para a vida de Touro",
      "Os dois podem se complementar em visão de mundo, mesclando segurança e expansão"
    ],
    nao_combina: [
      "Sagitário pode sentir que Touro é controlador e resistente a mudanças",
      "Touro pode ver Sagitário como irresponsável, instável ou distante",
      "Conflitos frequentes sobre liberdade, viagens, rolês e rotina"
    ],
    dicas: [
      "Conversem com clareza sobre o que cada um espera de compromisso e liberdade.",
      "Encontrar rituais fixos (Touro) e espaços de improviso (Sagitário) ajuda a relação a não pender demais para um lado só."
    ],
    compatibilidade: 52
  },
  "capricorn-taurus": {
    resumo:
      "Touro e Capricórnio formam uma combinação altamente estável, comprometida e focada em resultados práticos. Juntos, podem construir uma vida estruturada e sólida, mas correm o risco de deixar o romance em segundo plano se só olharem para deveres.",
    combina: [
      "Valores parecidos sobre trabalho, responsabilidade e comprometimento",
      "Capacidade de planejar o futuro e cumprir o que combinam",
      "Relação leal, confiável e resistente a crises externas"
    ],
    nao_combina: [
      "Excesso de seriedade e pouco espaço para brincadeiras, romance e leveza",
      "Possível tendência ao pessimismo e à preocupação constante",
      "Dificuldade em falar sobre sentimentos com naturalidade"
    ],
    dicas: [
      "Criem momentos para celebrar conquistas e também para simplesmente se curtirem, sem pauta.",
      "Abrir espaço para vulnerabilidade é tão importante quanto pagar boletos e bater metas."
    ],
    compatibilidade: 89
  },
  "aquarius-taurus": {
    resumo:
      "Aquário quer inovação, mudança e liberdade, enquanto Touro gosta do que é conhecido, seguro e previsível. Essa combinação pode ser uma grande aula de flexibilidade e estabilidade, se os dois estiverem abertos a aprender.",
    combina: [
      "Aquário expande a visão de mundo de Touro, apresentando novas ideias e estilos de vida",
      "Touro mostra para Aquário o valor da constância, do compromisso e da construção passo a passo",
      "Os dois podem criar uma relação única, com base em respeito às diferenças"
    ],
    nao_combina: [
      "Conflitos sobre mudanças abruptas versus apego a hábitos antigos",
      "Aquário pode achar Touro rígido ou retrógrado",
      "Touro pode perceber Aquário como frio, distante ou imprevisível demais"
    ],
    dicas: [
      "Explorem novidades em doses: nem tudo precisa mudar de uma vez, nem tudo precisa ficar igual para sempre.",
      "Respeitem o modo de amar do outro: o amor de Touro é presença; o de Aquário é liberdade com lealdade."
    ],
    compatibilidade: 50
  },
  "pisces-taurus": {
    resumo:
      "Touro e Peixes se encontram num terreno de carinho, romantismo e desejo de proteção. É uma relação doce, calma e acolhedora, com potencial de se tornar um verdadeiro refúgio para ambos, se não caírem na fuga da realidade.",
    combina: [
      "Touro oferece segurança, presença física e apoio concreto para Peixes",
      "Peixes traz imaginação, empatia e sensibilidade para o mundo de Touro",
      "Os dois prezam por gestos de carinho, toque e momentos íntimos"
    ],
    nao_combina: [
      "Peixes pode evitar conflitos, deixando problemas sem solução",
      "Touro pode ser direto e frio demais em situações sensíveis",
      "Possível tendência a se fechar em uma bolha e ignorar questões práticas importantes"
    ],
    dicas: [
      "Touro: exercite a escuta sensível, não só a solução prática; às vezes o outro só precisa ser ouvido.",
      "Peixes: seja honesto sobre o que te incomoda e participe das decisões, em vez de só seguir o fluxo."
    ],
    compatibilidade: 85
  },
  // 💬 GÊMEOS COM...
  "gemini-gemini": {
    resumo:
      "Dois geminianos juntos criam uma relação cheia de conversas, risadas, mudanças de planos e redescobertas constantes. A conexão mental é forte, mas o desafio é manter profundidade e constância num mar de possibilidades.",
    combina: [
      "Conversas infinitas sobre qualquer assunto, com muito humor e curiosidade",
      "Capacidade de se adaptar com facilidade a mudanças e imprevistos",
      "Ambiente leve, divertido e inteligente, sem espaço para tédio"
    ],
    nao_combina: [
      "Dificuldade em manter compromissos emocionais firmes",
      "Mudanças rápidas de humor, planos e prioridades",
      "Tendência a fugir de problemas mais densos com piada ou distração"
    ],
    dicas: [
      "Criem alguns pilares emocionais inegociáveis, mesmo que o resto seja flexível.",
      "Abram espaço para conversas profundas de vez em quando, para não ficarem só na superfície da relação."
    ],
    compatibilidade: 77
  },
  "cancer-gemini": {
    resumo:
      "Gêmeos traz leveza e movimento, enquanto Câncer traz profundidade e clima de 'casa', criando uma dinâmica que pode equilibrar razão e emoção. Se não souberem respeitar as diferenças, porém, acaba virando uma relação de mágoas e mal-entendidos.",
    combina: [
      "Gêmeos ajuda Câncer a rir mais das situações e tirar peso de pequenas coisas",
      "Câncer oferece acolhimento, cuidado e um senso de pertencimento a Gêmeos",
      "Podem aprender muito sobre comunicação emocional e verbal juntos"
    ],
    nao_combina: [
      "Câncer pode se sentir não levado a sério, achando que Gêmeos banaliza sentimentos",
      "Gêmeos pode se sentir sufocado com demandas emocionais intensas",
      "Tendência a falhas de comunicação, onde um fala e o outro sente outra coisa"
    ],
    dicas: [
      "Gêmeos: dedique atenção total quando Câncer abrir o coração; isso vale ouro pra ele.",
      "Câncer: tente não interpretar tudo como rejeição; pergunte antes de tirar conclusões."
    ],
    compatibilidade: 56
  },
  "gemini-leo": {
    resumo:
      "Gêmeos e Leão formam um casal carismático, expressivo e cheio de histórias para contar. A relação é vibrante e social, mas precisa de doses de sinceridade emocional para não virar só um espetáculo sem bastidor sólido.",
    combina: [
      "Os dois gostam de diversão, socialização e momentos marcantes",
      "Gêmeos traz humor e flexibilidade mental para a relação",
      "Leão traz calor, presença e orgulho de estar com o parceiro"
    ],
    nao_combina: [
      "Possível tendência a competir por atenção e brilho",
      "Dificuldade em lidar com momentos emocionalmente mais densos",
      "Gêmeos pode irritar Leão com mudanças de humor ou falta de foco"
    ],
    dicas: [
      "Reservem momentos longe dos holofotes para conversar sobre sentimentos reais.",
      "Valorizem o que o outro oferece: o show é incrível, mas o bastidor é o que sustenta a relação."
    ],
    compatibilidade: 79
  },
  "gemini-virgo": {
    resumo:
      "Gêmeos e Virgem são regidos por Mercúrio, o planeta da mente, mas o usam de formas bem diferentes: um é flexível e múltiplo, o outro é analítico e detalhista. A relação pode ser intelectualmente estimulante, mas também cheia de críticas e cobranças.",
    combina: [
      "Boa comunicação e capacidade de falar sobre quase tudo",
      "Virgem pode ajudar Gêmeos a organizar ideias e planos",
      "Gêmeos pode ajudar Virgem a pensar fora da caixa e relativizar algumas preocupações"
    ],
    nao_combina: [
      "Virgem pode achar Gêmeos irresponsável, disperso ou superficial",
      "Gêmeos pode sentir que Virgem critica demais e elogia de menos",
      "Diferenças no ritmo: um quer experimentar, o outro quer garantir que está perfeito"
    ],
    dicas: [
      "Virgem: ofereça orientação sem humilhar ou diminuir o jeito leve de Gêmeos.",
      "Gêmeos: aprenda a receber feedback sem interpretar tudo como controle; há sabedoria em alguns detalhes."
    ],
    compatibilidade: 63
  },
  "gemini-libra": {
    resumo:
      "Gêmeos e Libra formam um casal leve, social e mentalmente conectado, com muita conversa e afinidade em gostos. A relação tem tudo para ser harmoniosa, desde que alguém tope encarar os conflitos que ambos tendem a evitar.",
    combina: [
      "Conversas que fluem naturalmente, com trocas inteligentes e divertidas",
      "Facilidade para socializar em casal, ampliar círculo social e fazer coisas juntos",
      "Valor compartilhado pela liberdade e pela leveza nas trocas"
    ],
    nao_combina: [
      "Dificuldade em tomar decisões importantes a dois",
      "Tendência a evitar conversas mais difíceis para não estragar o clima",
      "Possibilidade de promessas vagas e expectativas não alinhadas"
    ],
    dicas: [
      "Decidam em quais temas alguém precisa assumir postura firme, mesmo que não agrade todo mundo.",
      "Incluam momentos onde vulnerabilidade é bem-vinda, sem piadas ou racionalizações demais."
    ],
    compatibilidade: 87
  },
  "gemini-scorpio": {
    resumo:
      "Gêmeos quer leveza, variedade e movimento, enquanto Escorpião busca profundidade, entrega total e verdades intensas. Essa combinação pode ser fascinante, mas também exaustiva se não houver respeito ao tempo emocional de cada um.",
    combina: [
      "Escorpião ajuda Gêmeos a encarar temas mais profundos e transformadores",
      "Gêmeos traz humor e ar fresco para os dramas de Escorpião",
      "Os dois podem se atrair pela diferença, com uma curiosidade mútua muito forte"
    ],
    nao_combina: [
      "Escorpião pode desconfiar da instabilidade e das mudanças de humor de Gêmeos",
      "Gêmeos pode sentir o peso do ciúme, das cobranças e da intensidade escorpiana",
      "Possíveis mal-entendidos quando um leva algo a sério e o outro trata com leveza"
    ],
    dicas: [
      "Gêmeos: não transforme tudo em piada quando Escorpião estiver vulnerável; isso machuca.",
      "Escorpião: nem toda leveza é falta de amor; às vezes é só o jeito do outro se proteger também."
    ],
    compatibilidade: 48
  },
  "gemini-sagittarius": {
    resumo:
      "Gêmeos e Sagitário formam o eixo do conhecimento, da curiosidade e da expansão, criando um relacionamento cheio de histórias, viagens, conversas filosóficas e risadas. O desafio é transformar tanta liberdade em algo que também ofereça segurança.",
    combina: [
      "Amor por novidades, viagens, estudos e experiências diferentes",
      "Valorização de sinceridade, mesmo quando é um pouco direta demais",
      "Capacidade de reinventar a relação várias vezes ao longo do tempo"
    ],
    nao_combina: [
      "Medo de compromissos que pareçam limitar a liberdade individual",
      "Tendência a minimizar sentimentos mais densos com piada ou racionalização",
      "Possibilidade de inconsistência na presença: aparece muito em alguns momentos, some em outros"
    ],
    dicas: [
      "Definam juntos o que é compromisso para vocês, sem copiar modelos tradicionais se eles não fizerem sentido.",
      "Lembrem que liberdade verdadeira não é fugir, mas escolher ficar mesmo podendo ir embora."
    ],
    compatibilidade: 83
  },
  "capricorn-gemini": {
    resumo:
      "Capricórnio olha para resultado, estrutura e responsabilidade, enquanto Gêmeos olha para possibilidades, trocas e experiências. A relação é um choque entre pragmatismo e curiosidade, que pode ser complementar ou irritante, dependendo da maturidade de ambos.",
    combina: [
      "Capricórnio traz foco, direção e senso de responsabilidade",
      "Gêmeos traz networking, versatilidade e adaptabilidade",
      "Podem se ajudar muito em projetos concretos, misturando estratégia com criatividade"
    ],
    nao_combina: [
      "Capricórnio pode julgar Gêmeos como infantil ou volátil demais",
      "Gêmeos pode achar Capricórnio duro, frio e pesado",
      "Diferenças na forma de lidar com compromissos e horários"
    ],
    dicas: [
      "Capricórnio: reconheça o valor da flexibilidade e da comunicação leve; isso também produz resultados.",
      "Gêmeos: mostrar consistência em pequenas coisas ajuda Capricórnio a confiar mais em você."
    ],
    compatibilidade: 54
  },
  "aquarius-gemini": {
    resumo:
      "Gêmeos e Aquário formam uma união de mentes inquietas, criativas e fora do padrão. A relação tende a ser muito mental e livre, com uma parceria que funciona bem quando ninguém exige demonstrações emocionais 'tradicionais'.",
    combina: [
      "Interesse por assuntos diferentes, ideias novas e visões alternativas de vida",
      "Valorização da liberdade individual e do respeito ao espaço do outro",
      "Capacidade de conversar por horas sem cair na mesmice"
    ],
    nao_combina: [
      "Dificuldade em lidar com demandas emocionais intensas",
      "Tendência a racionalizar demais sentimentos importantes",
      "Sumiços ou distanciamentos que podem ser mal interpretados"
    ],
    dicas: [
      "Criem momentos onde o foco não seja só ideia, mas também emoção: perguntar como o outro se sente faz diferença.",
      "Pequenos gestos de carinho e presença já equilibram o lado mais desapegado dessa dupla."
    ],
    compatibilidade: 88
  },
  "gemini-pisces": {
    resumo:
      "Gêmeos pensa rápido e muda de direção com facilidade, enquanto Peixes sente profundamente e se deixa levar pelas emoções. A relação é criativa, poética e cheia de possibilidades, mas também suscetível a confusões e desencontros.",
    combina: [
      "Muita imaginação, criatividade e potencial para projetos artísticos ou viagens",
      "Capacidade de enxergar diferentes perspectivas de uma mesma situação",
      "Ambiente de liberdade para conversar sobre temas subjetivos e espirituais"
    ],
    nao_combina: [
      "Comunicação confusa, com ruídos, intenções mal interpretadas e indiretas",
      "Gêmeos pode parecer frio ou descompromissado para Peixes",
      "Peixes pode parecer dramático, confuso ou vitimista para Gêmeos"
    ],
    dicas: [
      "Evitem suposições: perguntem explicitamente o que o outro quis dizer ou pretende fazer.",
      "Criem acordos claros sobre presença e compromisso, mesmo que o estilo da relação seja mais fluido."
    ],
    compatibilidade: 53
  },
  // 🦀 CÂNCER COM...
  "cancer-cancer": {
    resumo:
      "Dois cancerianos juntos criam uma relação extremamente emocional, intuitiva e cheia de delicadezas. Há muito cuidado, romantismo e profundidade, mas também grande vulnerabilidade a mágoas e mudanças de humor.",
    combina: [
      "Entendem o olhar, o silêncio e os gestos sutis um do outro",
      "Valorizam família, segurança afetiva e lealdade",
      "Têm facilidade em criar um ambiente acolhedor, romântico e íntimo"
    ],
    nao_combina: [
      "Tendência a guardar mágoas por muito tempo sem falar sobre elas",
      "Oscilações emocionais que podem se amplificar no outro",
      "Possível vitimização mútua e dificuldade em assumir responsabilidade"
    ],
    dicas: [
      "Façam pactos de sinceridade amorosa: falar sobre o que dói com carinho é melhor do que só se afastar.",
      "Lembrem que vulnerabilidade é um ponto forte da relação, mas não precisa virar autoabandono."
    ],
    compatibilidade: 88
  },
  "cancer-leo": {
    resumo:
      "Câncer busca segurança emocional e intimidade, enquanto Leão busca reconhecimento, alegria e expressão. Juntos, formam uma relação calorosa, dramática e cheia de cenas intensas, tanto de amor quanto de conflito.",
    combina: [
      "Câncer oferece cuidado, carinho e um espaço seguro para Leão desarmar a pose",
      "Leão traz luz, entusiasmo e orgulho do parceiro, estimulando Câncer a brilhar também",
      "Os dois têm grande capacidade de demonstrar afeto através de gestos e presença"
    ],
    nao_combina: [
      "Câncer pode se sentir em segundo plano quando Leão busca muita atenção externa",
      "Leão pode se irritar com as oscilações emocionais e carências de Câncer",
      "Conflitos quando um quer recolhimento e o outro quer festa e exposição"
    ],
    dicas: [
      "Valorizem a forma do outro amar: Câncer cuida no detalhe; Leão mostra no palco.",
      "Criem espaços para ambos: momentos tranquilos de intimidade e momentos de brilho social compartilhado."
    ],
    compatibilidade: 67
  },
  "cancer-virgo": {
    resumo:
      "Câncer e Virgem combinam sensibilidade com praticidade, criando uma relação que cuida tanto do alma quanto da vida concreta. Quando bem equilibrada, é uma parceria muito protetora, mas pode se tornar crítica demais se não houver gentileza.",
    combina: [
      "Virgem ajuda a organizar a vida de Câncer e lidar melhor com o dia a dia",
      "Câncer oferece acolhimento, carinho e compreensão emocional para Virgem",
      "Ambos gostam de ser úteis e cuidar de quem amam de forma prática"
    ],
    nao_combina: [
      "Virgem pode ser excessivamente crítico com a sensibilidade de Câncer",
      "Câncer pode interpretar feedback como rejeição ou falta de amor",
      "Possível dificuldade em falar abertamente sobre frustrações sem ferir o outro"
    ],
    dicas: [
      "Virgem: suavize as palavras e reforce o carinho antes das críticas.",
      "Câncer: tente ouvir a intenção por trás da cobrança; às vezes é cuidado, não rejeição."
    ],
    compatibilidade: 82
  },
  "cancer-libra": {
    resumo:
      "Câncer sente profundamente e busca vínculos intensos, enquanto Libra busca equilíbrio, leveza e harmonia. A relação pode ser charmosa e bonita, mas exige cuidado para que a diplomacia não vire superficialidade emocional.",
    combina: [
      "Libra traz equilíbrio, gentileza e habilidade em lidar com pessoas",
      "Câncer traz profundidade emocional e um afeto genuíno",
      "Ambos gostam de estar em relacionamento e valorizam parceria"
    ],
    nao_combina: [
      "Câncer pode sentir que Libra evita conflitos importantes, preferindo manter a aparência de paz",
      "Libra pode se incomodar com o excesso de intensidade ou carência de Câncer",
      "Diferenças na velocidade de decisão: Câncer decide pelo sentimento, Libra pondera demais"
    ],
    dicas: [
      "Libra: seja mais claro sobre o que sente, não apenas o que pensa ser equilibrado.",
      "Câncer: nem todo desacordo é abandono; Libra precisa de tempo para avaliar antes de mergulhar."
    ],
    compatibilidade: 58
  },
  "cancer-scorpio": {
    resumo:
      "Câncer e Escorpião são dois signos de água que mergulham fundo nas emoções, criando uma relação intensa, leal e transformadora. A conexão é forte, mas também suscetível a ciúmes, silêncio e dramas prolongados.",
    combina: [
      "Empatia e intuição muito fortes, quase telepáticas",
      "Lealdade e compromisso emocional profundo",
      "Capacidade de crescer juntos em temas de cura, psicologia e espiritualidade"
    ],
    nao_combina: [
      "Ciúmes, medo de abandono e necessidade de controle emocional",
      "Risco de guardar ressentimentos por muito tempo sem resolver",
      "Possibilidade de relações que se tornam dependentes ou tóxicas se não houver limites"
    ],
    dicas: [
      "Cultivem transparência: digam quando algo incomoda, antes de virar veneno silencioso.",
      "Lembrem que amor intenso não precisa significar sofrimento constante; terapia e autoconhecimento ajudam muito aqui."
    ],
    compatibilidade: 91
  },
  "cancer-sagittarius": {
    resumo:
      "Câncer deseja raiz, intimidade e segurança, enquanto Sagitário deseja horizonte, liberdade e aventura. A relação pode ser uma troca rica entre casa e mundo, ou um desencontro contínuo de expectativas.",
    combina: [
      "Sagitário traz leveza, humor e novas experiências para a vida de Câncer",
      "Câncer oferece acolhimento, carinho e um porto seguro para Sagitário",
      "Os dois podem expandir a noção de amor: nem só lar, nem só estrada"
    ],
    nao_combina: [
      "Câncer pode se sentir abandonado se Sagitário precisar de muito espaço e movimento",
      "Sagitário pode se sentir sufocado por cobranças emocionais",
      "Diferenças na forma de encarar compromisso, rotina e família"
    ],
    dicas: [
      "Conversem abertamente sobre o que cada um espera de presença, mensagens, planos e futuro.",
      "Câncer ganha ao permitir mais espaço; Sagitário amadurece ao entender que liberdade não exclui cuidado e constância."
    ],
    compatibilidade: 49
  },
  "cancer-capricorn": {
    resumo:
      "Câncer e Capricórnio representam o eixo família–carreira, emoção–estrutura, criando uma relação com grande potencial de construção. Juntos, podem formar um casal que cuida tanto do lar quanto do futuro material.",
    combina: [
      "Câncer oferece acolhimento, carinho e suporte emocional",
      "Capricórnio oferece estabilidade, planejamento e responsabilidade",
      "Os dois levam compromisso a sério e não entram em relacionamento à toa"
    ],
    nao_combina: [
      "Capricórnio pode parecer frio, distante ou excessivamente focado em trabalho",
      "Câncer pode dramatizar carências, interpretando ausência como desamor",
      "Diferenças na forma de expressar amor: um mostra fazendo, o outro mostrando sentir"
    ],
    dicas: [
      "Capricórnio: expresse mais verbalmente e fisicamente seu carinho; não confie só nos atos implícitos.",
      "Câncer: reconheça o esforço prático de Capricórnio; cuidado também aparece como responsabilidade."
    ],
    compatibilidade: 83
  },
  "aquarius-cancer": {
    resumo:
      "Câncer vive pela emoção e pela intuição, enquanto Aquário vive pela lógica, ideias e visão ampla. A relação é cheia de aprendizado, mas exige paciência para que ninguém se sinta invalidado.",
    combina: [
      "Aquário pode ampliar a visão de mundo de Câncer e tirá-lo da bolha emocional",
      "Câncer ensina Aquário sobre intimidade, afeto e conexão familiar",
      "Os dois podem se complementar em temas sociais, emocionais e humanitários"
    ],
    nao_combina: [
      "Câncer pode sentir Aquário frio, distante ou indiferente às emoções",
      "Aquário pode ver Câncer como dramático e preso ao passado",
      "Diferenças profundas na forma de reagir a problemas: um sente, o outro analisa"
    ],
    dicas: [
      "Aquário: valide os sentimentos de Câncer, mesmo que você não os entenda totalmente.",
      "Câncer: lembre que o jeito racional de Aquário também é uma forma de cuidar, não necessariamente desamor."
    ],
    compatibilidade: 45
  },
  "cancer-pisces": {
    resumo:
      "Câncer e Peixes são dois signos de água, sensíveis, românticos e altamente empáticos. A relação tende a ser muito afetuosa, espiritual e intuitiva, mas precisa de chão firme para não se perder em emoções e fantasias.",
    combina: [
      "Entendimento profundo sem necessidade de muitas palavras",
      "Romantismo, imaginação e capacidade de criar um mundo só dos dois",
      "Apoio emocional mútuo em momentos difíceis, com muita empatia"
    ],
    nao_combina: [
      "Possível tendência à fuga da realidade e dos problemas práticos",
      "Oscilações emocionais que podem se amplificar no relacionamento",
      "Dificuldade em estabelecer limites claros com família, ex, amigos, etc."
    ],
    dicas: [
      "Tragam rotinas, planos e um mínimo de organização para sustentar toda essa sensibilidade.",
      "Lembrem que dizer 'não' e colocar limites também é um ato de amor, inclusive com o próprio relacionamento."
    ],
    compatibilidade: 89
  },
  // 🦁 LEÃO COM...
  "leo-leo": {
    resumo:
      "Dois leoninos juntos criam uma relação calorosa, dramática e cheia de presença. Há generosidade, orgulho, paixão e uma grande necessidade de reconhecimento mútuo, o que pode fortalecer o amor ou alimentar guerras de ego se não houver cuidado.",
    combina: [
      "Muito carisma, química e vontade de viver histórias grandiosas",
      "Generosidade afetiva, com demonstrações claras de amor e admiração",
      "Capacidade de motivar o outro a brilhar, conquistar e se destacar"
    ],
    nao_combina: [
      "Competição velada ou explícita por atenção e protagonismo",
      "Dificuldade em admitir erros e pedir desculpas de forma sincera",
      "Brigas de orgulho que podem se prolongar mais do que o necessário"
    ],
    dicas: [
      "Lembrem que elogiar o outro não diminui o próprio brilho, apenas fortalece a relação.",
      "Criem um espaço seguro para vulnerabilidade, onde não seja vergonhoso dizer 'errei' ou 'senti ciúmes'."
    ],
    compatibilidade: 81
  },
  "leo-virgo": {
    resumo:
      "Leão gosta de se expressar com intensidade e confiança, enquanto Virgem prefere a discrição, a análise e a cautela. A relação mistura brilho com pragmatismo, podendo ser uma parceria muito eficiente se houver respeito aos estilos diferentes.",
    combina: [
      "Leão traz entusiasmo, coragem e autoestima para a vida de Virgem",
      "Virgem oferece senso de realidade, organização e cuidado prático a Leão",
      "Os dois podem construir juntos uma rotina funcional, mas não entediante"
    ],
    nao_combina: [
      "Virgem pode criticar demais o jeito expansivo de Leão",
      "Leão pode se ofender com feedbacks sinceros, mas pouco delicados",
      "Diferença entre foco em detalhes (Virgem) e foco em impacto (Leão)"
    ],
    dicas: [
      "Virgem: escolha bem as batalhas e elogie mais, especialmente o esforço de Leão.",
      "Leão: leve as críticas como oportunidade de ajuste, não como ataque à sua pessoa."
    ],
    compatibilidade: 62
  },
  "leo-libra": {
    resumo:
      "Leão e Libra formam um casal elegante, social e cheio de charme, com grande potencial de ser admirado como dupla. Há beleza, romance e sintonia social, mas é preciso cuidar para que a relação não fique apenas na aparência.",
    combina: [
      "Ambos gostam de bons ambientes, encontros agradáveis e um certo luxo",
      "Libra aprecia o carisma de Leão, e Leão se encanta com o charme de Libra",
      "Facilidade para brilhar em público e criar uma estética marcante como casal"
    ],
    nao_combina: [
      "Libra pode evitar conflitos que precisam ser encarados de frente",
      "Leão pode exigir mais atenção e validação do que Libra consegue dar",
      "Possíveis mal-entendidos quando um sente que o outro está flertando demais"
    ],
    dicas: [
      "Conversem sobre ciúmes e limites com clareza, sem joguinhos ou indiretas.",
      "Lembrem que a relação precisa ser bonita por dentro também, não só nas fotos e nos momentos públicos."
    ],
    compatibilidade: 84
  },
  "leo-scorpio": {
    resumo:
      "Leão e Escorpião formam uma combinação intensa, magnética e cheia de mistério, onde orgulho e profundidade se encontram. A atração é forte, mas as disputas de poder e o ciúme podem desafiar bastante a convivência.",
    combina: [
      "Os dois são leais e não gostam de relações mornas ou superficiais",
      "Há forte atração física e emocional, com sensação de intensidade constante",
      "Capacidade de se protegerem mutuamente e enfrentar desafios juntos"
    ],
    nao_combina: [
      "Escorpião pode desconfiar de qualquer coisa que ameace a exclusividade",
      "Leão pode se sentir controlado ou sufocado com ciúmes e jogos emocionais",
      "Brigas podem virar disputas para ver quem dói mais o outro"
    ],
    dicas: [
      "Trabalhem confiança com diálogo, não com testes e provocações.",
      "Reconheçam a sensibilidade por trás do orgulho e do controle: os dois têm medo de se machucar."
    ],
    compatibilidade: 72
  },
  "leo-sagittarius": {
    resumo:
      "Leão e Sagitário se encontram num terreno de fogo, entusiasmo e liberdade, formando um casal divertido, aventureiro e cheio de histórias. A relação tende a ser leve e sincera, mas precisa de responsabilidade para não virar um eterno 'tanto faz'.",
    combina: [
      "Ambos valorizam autenticidade e detestam falsidade",
      "Gostam de viagens, experiências novas e rolês cheios de vida",
      "Conseguem rir juntos, mesmo de situações difíceis, com bom humor"
    ],
    nao_combina: [
      "Pouca paciência para lidar com vulnerabilidades mais profundas",
      "Possibilidade de negligenciar conversas sérias em nome da diversão",
      "Sagitário pode ser mais desapegado do que Leão tolera em algumas fases"
    ],
    dicas: [
      "Reservem momentos para falar de medo, ciúmes e expectativas sem zoação.",
      "Lembrem que responsabilidade afetiva não limita a liberdade; ela dá base para que ela exista."
    ],
    compatibilidade: 90
  },
  "capricorn-leo": {
    resumo:
      "Leão quer brilho e reconhecimento, enquanto Capricórnio quer resultados e estabilidade. A relação pode ser uma grande sociedade afetiva, capaz de construir muito na vida prática, se conseguir equilibrar vaidade e disciplina.",
    combina: [
      "Capricórnio ajuda Leão a estruturar sonhos e transformá-los em metas reais",
      "Leão traz entusiasmo, visibilidade e energia para os planos de Capricórnio",
      "Os dois podem se admirar pela força, pela resiliência e pela capacidade de realizar"
    ],
    nao_combina: [
      "Capricórnio pode julgar Leão dramático ou superficial demais",
      "Leão pode sentir Capricórnio frio, crítico e pouco demonstrativo",
      "Diferenças na forma de lidar com dinheiro, risco e exposição"
    ],
    dicas: [
      "Capricórnio: demonstre mais reconhecimento e elogio, não só correção e ajuste.",
      "Leão: respeite o tempo de Capricórnio e mostre que consegue ser responsável além de brilhante."
    ],
    compatibilidade: 61
  },
  "aquarius-leo": {
    resumo:
      "Leão e Aquário formam um eixo que fala de amor próprio e amor ao coletivo, de ego e de causa. A relação é instigante, original e muitas vezes pouco convencional, mas precisa de equilíbrio entre atenção e liberdade.",
    combina: [
      "Ambos valorizam autenticidade e odeiam hipocrisia",
      "Leão traz calor, afeto e presença marcante para Aquário",
      "Aquário oferece visão ampla, ideias diferentes e admiração pela individualidade de Leão"
    ],
    nao_combina: [
      "Leão pode sentir que Aquário é distante, frio ou desapegado demais",
      "Aquário pode achar Leão carente de atenção e validação constante",
      "Diferenças na forma de demonstrar amor: um é teatral, o outro mais racional"
    ],
    dicas: [
      "Conversem sobre o que cada um entende como prova de amor: gesto, palavra, tempo, liberdade...",
      "Lembrem que dá para ser um casal e ainda assim preservar espaço individual e causas pessoais."
    ],
    compatibilidade: 74
  },
  "leo-pisces": {
    resumo:
      "Leão é sol, presença e clareza, enquanto Peixes é mar, sonho e sensibilidade. A relação é poética e afetuosa, mas precisa de cuidados para que nenhum dos dois se sinta invisível dentro da dinâmica.",
    combina: [
      "Leão traz segurança, coragem e proteção para Peixes",
      "Peixes oferece carinho, compreensão e apoio emocional para Leão",
      "Os dois podem viver um romance muito imaginativo, criativo e cheio de gestos simbólicos"
    ],
    nao_combina: [
      "Peixes pode se magoar com brincadeiras ou comentários diretos de Leão",
      "Leão pode se irritar com indecisão, fuga ou vitimização de Peixes",
      "Diferenças na forma de lidar com conflito: um enfrenta, o outro evita"
    ],
    dicas: [
      "Leão: escolha momentos e palavras com mais delicadeza quando o assunto for sensível.",
      "Peixes: fale claramente sobre o que doeu, em vez de apenas se recolher esperando que o outro perceba."
    ],
    compatibilidade: 64
  },
  // 🌾 VIRGEM COM...
  "virgo-virgo": {
    resumo:
      "Dois virginianos juntos tendem a criar uma relação organizada, responsável e bastante comprometida com a melhoria constante. Há cuidado, dedicação e vontade de acertar, mas o perfeccionismo pode pesar e minar a leveza.",
    combina: [
      "Compromisso real em fazer a relação funcionar na prática",
      "Boa parceria no dia a dia, dividindo tarefas e responsabilidades",
      "Apoio mútuo em momentos difíceis, com soluções concretas"
    ],
    nao_combina: [
      "Críticas excessivas, muitas vezes motivadas por preocupação",
      "Dificuldade em relaxar e apenas curtir o momento sem avaliar tudo",
      "Autocobrança em dobro, que pode transformar divergências em ataques pessoais"
    ],
    dicas: [
      "Lembrem de elogiar explicitamente, não só corrigir o que não está perfeito.",
      "Reservem espaços para diversão sem pauta de produtividade ou melhoria."
    ],
    compatibilidade: 86
  },
  "libra-virgo": {
    resumo:
      "Virgem é objetividade, análise e praticidade; Libra é diplomacia, estética e harmonia. A relação pode ser muito equilibrada, desde que consigam alinhar o desejo de eficiência com a necessidade de leveza.",
    combina: [
      "Virgem ajuda Libra a tomar decisões mais claras e firmes",
      "Libra suaviza a rigidez de Virgem com charme e tato",
      "Os dois podem construir uma vida bem organizada e socialmente agradável"
    ],
    nao_combina: [
      "Libra pode achar Virgem crítico, duro ou frio em algumas situações",
      "Virgem pode ver Libra como indeciso, superficial ou evasivo",
      "Possibilidade de conversas que giram em torno de 'como deveria ser' sem ação"
    ],
    dicas: [
      "Virgem: aja com carinho ao apontar problemas; a forma importa tanto quanto o conteúdo.",
      "Libra: assuma posicionamentos claros quando o assunto for importante para o relacionamento."
    ],
    compatibilidade: 60
  },
  "scorpio-virgo": {
    resumo:
      "Virgem observa detalhes e busca lógica; Escorpião sente intensamente e busca profundidade. Juntos, podem formar um casal que enxerga o que muita gente não vê, mas que também pode cair em desconfiança e controle excessivos.",
    combina: [
      "Capacidade de ler nuances e perceber mudanças sutis no outro",
      "Boa parceria para enfrentar problemas complexos de forma racional e emocional",
      "Los dois valorizam lealdade, compromisso e discrição"
    ],
    nao_combina: [
      "Escorpião pode achar Virgem frio ou racional demais diante de certas dores",
      "Virgem pode sentir o peso do intensidade emocional de Escorpião",
      "Possível tendência a remoer o passado e analisar tudo em excesso"
    ],
    dicas: [
      "Procurem equilibrar análise com sensação: nem tudo precisa ser dissecado, nem tudo precisa ser sentido no extremo.",
      "Façam acordos de confiança claros para que ninguém se sinta testado o tempo todo."
    ],
    compatibilidade: 73
  },
  "sagittarius-virgo": {
    resumo:
      "Virgem gosta de planejar e reduzir riscos; Sagitário gosta de improvisar e ampliar horizontes. A relação é um choque entre controle e liberdade, mas pode ser um aprendizado valioso para ambos.",
    combina: [
      "Virgem oferece estrutura para os planos de Sagitário acontecerem de verdade",
      "Sagitário traz leveza, humor e novas perspectivas para a vida de Virgem",
      "Podem crescer muito se aprenderem a negociar responsabilidade e aventura"
    ],
    nao_combina: [
      "Virgem pode ver Sagitário como irresponsável ou imaturo",
      "Sagitário pode sentir Virgem pesado, controlador ou excessivamente crítico",
      "Conflitos sobre dinheiro, rotina, viagens e prioridades"
    ],
    dicas: [
      "Criem regras mínimas para compromissos e prazos que respeitem a necessidade de ambos.",
      "Virgem: permita um pouco de improviso; Sagitário: mostre que sabe cumprir o que promete."
    ],
    compatibilidade: 52
  },
  "capricorn-virgo": {
    resumo:
      "Virgem e Capricórnio, dois signos de terra, tendem a formar um casal sério, comprometido e focado em construir uma vida sólida. Há responsabilidade, disciplina e cuidado, mas precisam lembrar que amor também é diversão.",
    combina: [
      "Objetivos parecidos em relação a estabilidade, trabalho e futuro",
      "Capacidade de se apoiar mutuamente em crises financeiras ou profissionais",
      "Respeito ao esforço e à dedicação do outro"
    ],
    nao_combina: [
      "Possível excesso de preocupação, transformando a vida a dois em 'projeto' constante",
      "Dificuldade em falar de emoções abertamente",
      "Tendência a negligenciar romance, surpresa e brincadeira"
    ],
    dicas: [
      "Planejem o futuro, mas também agendem momentos de leveza e conexão sem pauta prática.",
      "Abram-se mais sobre medos, inseguranças e desejos; vulnerabilidade fortalece a parceria."
    ],
    compatibilidade: 90
  },
  "aquarius-virgo": {
    resumo:
      "Virgem busca ordem, previsibilidade e clareza, enquanto Aquário busca inovação, liberdade e ruptura de padrões. A relação é desafiadora, mas pode ser uma grande fonte de expansão mental e prática para ambos.",
    combina: [
      "Aquário traz ideias novas e perspectivas diferentes para Virgem",
      "Virgem ajuda Aquário a tirar projetos do plano teórico e torná-los concretos",
      "Os dois podem se unir em causas ou projetos que exigem tanto visão quanto detalhe"
    ],
    nao_combina: [
      "Virgem pode achar Aquário imprevisível, distante ou incoerente",
      "Aquário pode ver Virgem como rígido, controlador ou pessimista",
      "Conflitos sobre rotina, liberdade e quebra de tradições"
    ],
    dicas: [
      "Respeitem o estilo do outro: um organiza, o outro reinventa.",
      "Façam acordos flexíveis: algumas áreas da vida podem seguir planilha, outras podem seguir intuição."
    ],
    compatibilidade: 49
  },
  "pisces-virgo": {
    resumo:
      "Virgem olha para fatos e detalhes, enquanto Peixes olha para sentimentos e significados. Essa relação une razão e sensibilidade, podendo ser muito curativa se não virar uma dinâmica de salvador e crítico.",
    combina: [
      "Virgem ajuda Peixes a se organizar e lidar melhor com a realidade concreta",
      "Peixes ensina Virgem sobre empatia, fé e entrega emocional",
      "Os dois podem se completar em temas de saúde, autocuidado e espiritualidade prática"
    ],
    nao_combina: [
      "Virgem pode ser duro demais com as confusões de Peixes",
      "Peixes pode se vitimizar ou fugir de responsabilidades, irritando Virgem",
      "Conflitos sobre limites, promessas e expectativas emocionais"
    ],
    dicas: [
      "Virgem: pratique críticas mais gentis e reconheça o esforço emocional de Peixes.",
      "Peixes: assuma sua parte nas situações e comunique o que sente sem esperar que o outro adivinhe tudo."
    ],
    compatibilidade: 75
  },
  // ⚖️ LIBRA COM...
  "libra-libra": {
    resumo:
      "Dois librianos juntos criam uma relação harmoniosa, sociável e cheia de gentileza, com muita preocupação em agradar e manter o clima leve. Porém, a dificuldade em tomar decisões e enfrentar conflitos pode acumular problemas invisíveis.",
    combina: [
      "Valorizam diálogo, respeito e diplomacia",
      "Apreciam beleza, cultura, bons ambientes e uma certa estética a dois",
      "Gostam de parceria e evitam atitudes grosseiras ou brutais"
    ],
    nao_combina: [
      "Indecisão em dobro, especialmente em questões importantes",
      "Tendência a evitar conversas difíceis para não gerar desconforto",
      "Possibilidade de guardar ressentimentos por falta de posicionamento firme"
    ],
    dicas: [
      "Estabeleçam momentos para falar de temas mais espinhosos com honestidade e carinho.",
      "Aceitem que discordar não é quebrar a harmonia, e sim fortalecê-la com verdade."
    ],
    compatibilidade: 82
  },
  "libra-scorpio": {
    resumo:
      "Libra busca equilíbrio, sociabilidade e suavidade; Escorpião busca intensidade, profundidade e verdade crua. A relação é um encontro entre leveza e profundidade, capaz de transformar ambos, mas também de gerar atrito.",
    combina: [
      "Libra ajuda Escorpião a suavizar e ver nuances nas situações",
      "Escorpião ajuda Libra a encarar verdades que ele preferiria evitar",
      "Os dois se interessam por psicologia, amor e relações de forma séria"
    ],
    nao_combina: [
      "Libra pode sentir Escorpião pesado, ciumento ou controlador",
      "Escorpião pode achar Libra superficial, indeciso ou pouco comprometido",
      "Choques entre a necessidade de paz (Libra) e de catarse (Escorpião)"
    ],
    dicas: [
      "Libra: não minimize os sentimentos intensos de Escorpião com frases do tipo 'não é tudo isso'.",
      "Escorpião: pratique falar o que sente sem dramatizar ou ameaçar a relação o tempo todo."
    ],
    compatibilidade: 57
  },
  "libra-sagittarius": {
    resumo:
      "Libra e Sagitário formam um casal leve, curioso e aberto a novas experiências. Há bom humor, socialização e vontade de aprender juntos, mas é preciso cuidar para que o relacionamento não fique apenas no plano do prazer.",
    combina: [
      "Ambos gostam de conhecer lugares, pessoas e culturas diferentes",
      "Têm diálogo fluido e geralmente evitam grosserias",
      "Valorizam liberdade, amizade e um clima de parceria divertida"
    ],
    nao_combina: [
      "Sagitário pode ser direto demais para a sensibilidade diplomática de Libra",
      "Libra pode parecer indeciso e depender demais da opinião do outro",
      "Risco de fugir de conversas mais profundas para não 'pesar o clima'"
    ],
    dicas: [
      "Equilibrem os momentos de diversão com conversas sobre expectativas e futuro.",
      "Pratiquem sinceridade gentil: falar a verdade não precisa ferir, mas precisa ser dito."
    ],
    compatibilidade: 80
  },
  "capricorn-libra": {
    resumo:
      "Libra se orienta por relações, estética e harmonia; Capricórnio por resultados, estrutura e responsabilidade. A relação pode trazer equilíbrio entre vida social e vida prática, se ninguém desqualificar a prioridade do outro.",
    combina: [
      "Libra ajuda Capricórnio a se conectar mais com pessoas e prazeres da vida",
      "Capricórnio oferece segurança, estabilidade e confiança a Libra",
      "Podem formar um casal respeitado, com boa imagem pública e solidez"
    ],
    nao_combina: [
      "Capricórnio pode achar Libra superficial, indeciso ou preocupado demais com opinião alheia",
      "Libra pode ver Capricórnio como rígido, frio ou autoritário",
      "Conflitos sobre tempo: um quer socializar, o outro quer produzir ou descansar"
    ],
    dicas: [
      "Valorizem o que o outro equilibra em vocês, em vez de tentar transformá-lo em cópia própria.",
      "Façam acordos sobre agenda social, trabalho e descanso, respeitando limites individuais."
    ],
    compatibilidade: 59
  },
  "aquarius-libra": {
    resumo:
      "Libra e Aquário são signos de ar e valorizam diálogo, ideias e conexões sociais. A relação tende a ser leve, mental e companheira, com visão moderna sobre amor, mas precisa incluir espaço para sentimentos mais crus.",
    combina: [
      "Gostam de conversar sobre sociedade, relações e temas abstratos",
      "Valorizam liberdade, respeito e uma convivência pouco controladora",
      "Podem construir uma relação baseada em amizade, parceria e visão de futuro"
    ],
    nao_combina: [
      "Tendência a evitar drama, mesmo quando é necessário encarar feridas",
      "Dificuldade em lidar com ciúmes, inseguranças e demandas emocionais intensas",
      "Possibilidade de racionalizar demais questões afetivas"
    ],
    dicas: [
      "Reservem tempo para falar de medos, dores e vulnerabilidades sem julgamentos.",
      "Lembrem que carinho, toque e presença também são parte importante da equação, não só conversa."
    ],
    compatibilidade: 86
  },
  "libra-pisces": {
    resumo:
      "Libra e Peixes são românticos, idealistas e cheios de empatia, criando uma relação doce e sensível. Porém, a dificuldade de ambos em estabelecer limites e tomar decisões pode complicar a vida prática do casal.",
    combina: [
      "Os dois valorizam gentileza, delicadeza e cuidado com o outro",
      "Há potencial para muito romantismo, imaginação e conexão emocional",
      "Tendem a evitar grosserias e prezar por um ambiente tranquilo"
    ],
    nao_combina: [
      "Indefinição em questões importantes de futuro, dinheiro ou compromisso",
      "Fuga de conversas difíceis para não magoar o outro",
      "Possibilidade de se perderem em idealizações e frustrações silenciosas"
    ],
    dicas: [
      "Façam acordos claros sobre expectativas, mesmo que pareça desconfortável no começo.",
      "Lembrem que dizer 'não' e se posicionar também é um ato de amor com a relação."
    ],
    compatibilidade: 71
  },
  // 🦂 ESCORPIÃO COM...
  "scorpio-scorpio": {
    resumo:
      "Dois escorpianos juntos criam uma relação intensa, profunda e cheia de magnetismo. Há lealdade, entrega e verdade, mas também grande risco de conflito pesado se a confiança for abalada.",
    combina: [
      "Compromisso emocional sério, sem espaço para superficialidade",
      "Intuição aguçada, entendendo o outro em camadas muito profundas",
      "Capacidade de enfrentar crises juntos com muita força"
    ],
    nao_combina: [
      "Ciúmes, controle e paranoias sobre traição ou abandono",
      "Dificuldade em perdoar e realmente soltar o passado",
      "Discussões que podem se tornar destrutivas se virarem guerra de poder"
    ],
    dicas: [
      "Aprendam a comunicar inseguranças sem atacar ou testar o outro.",
      "Trabalhem em terapia, espiritualidade ou autoconhecimento para que a relação não carregue todos os pesos individuais."
    ],
    compatibilidade: 84
  },
  "sagittarius-scorpio": {
    resumo:
      "Escorpião mergulha nas profundezas emocionais, enquanto Sagitário gosta de enxergar o lado leve e expandir horizontes. A relação é um choque entre densidade e liberdade, mas pode ser extremamente transformadora.",
    combina: [
      "Escorpião aprofunda temas que Sagitário costuma tratar de forma filosófica",
      "Sagitário traz humor e movimento para os dramas de Escorpião",
      "Ambos são sinceros e detestam falsidade, cada um à sua maneira"
    ],
    nao_combina: [
      "Sagitário pode sentir Escorpião controlador, ciumento ou intenso demais",
      "Escorpião pode ver Sagitário como irresponsável ou pouco comprometido",
      "Conflitos sobre liberdade, espaço e necessidade de conversa emocional longa"
    ],
    dicas: [
      "Respeitem a diferença de estilo: um precisa de profundidade, o outro de leveza.",
      "Façam acordos sobre o que é aceitável em termos de liberdade, contato e transparência com outras pessoas."
    ],
    compatibilidade: 55
  },
  "capricorn-scorpio": {
    resumo:
      "Escorpião e Capricórnio formam um casal sério, leal e focado em resultados, tanto emocionais quanto materiais. É uma relação com potencial de ser duradoura, sólida e transformadora, mas pouco leve se não houver espaço para respiro.",
    combina: [
      "Ambos levam compromisso e responsabilidade muito a sério",
      "Capacidade de enfrentar desafios e crises com muita determinação",
      "Discrição e respeito à intimidade do relacionamento"
    ],
    nao_combina: [
      "Pouca espontaneidade e humor em alguns momentos",
      "Possibilidade de endurecer demais brincadeiras, tornando tudo pesado",
      "Dificuldade em demonstrar afeto de forma leve e aberta"
    ],
    dicas: [
      "Criem momentos intencionais de diversão, não só de planejamento e resolução de problemas.",
      "Pratiquem elogios, carinhos e demonstrações claras de admiração um pelo outro."
    ],
    compatibilidade: 79
  },
  "aquarius-scorpio": {
    resumo:
      "Escorpião vive intensidade emocional, Aquário vive intensidade mental. A relação é complexa, interessante e desafiadora, pedindo maturidade de ambos para não virar um campo de guerra entre razão e sentimento.",
    combina: [
      "Podem ter conversas muito profundas sobre vida, morte, psicologia e sociedade",
      "Ambos têm personalidade forte e não se contentam com superficialidade",
      "Capacidade de criar vínculos únicos, pouco convencionais e marcantes"
    ],
    nao_combina: [
      "Aquário pode parecer frio ou distante para a necessidade emocional de Escorpião",
      "Escorpião pode parecer controlador, dramático ou obcecado para Aquário",
      "Conflitos quando um quer falar de dores e o outro quer racionalizar tudo"
    ],
    dicas: [
      "Aquário: valide a emoção de Escorpião, mesmo que você prefira analisá-la.",
      "Escorpião: tente não interpretar toda necessidade de espaço como rejeição."
    ],
    compatibilidade: 47
  },
  "pisces-scorpio": {
    resumo:
      "Escorpião e Peixes, ambos signos de água, criam uma relação intuitiva, profunda e cheia de nuances emocionais. Há muita empatia, romantismo e magnetismo, mas também risco de dramas prolongados se faltarem limites.",
    combina: [
      "Conexão emocional intensa, com sensação de compreensão mútua",
      "Interesse por temas espirituais, psicológicos ou misteriosos",
      "Capacidade de apoiar o outro em momentos de crise real"
    ],
    nao_combina: [
      "Possibilidade de relações codependentes ou muito fechadas ao mundo exterior",
      "Ciúmes e medos projetados um no outro",
      "Dificuldade em lidar com frustrações sem dramatizar ou se vitimizar"
    ],
    dicas: [
      "Tragam clareza para a relação, falando de limites, necessidades e desejos com honestidade.",
      "Cuidem para não se isolar completamente do resto da vida em nome da intensidade desse vínculo."
    ],
    compatibilidade: 88
  },
  // 🎯 SAGITÁRIO COM...
  "sagittarius-sagittarius": {
    resumo:
      "Dois sagitarianos juntos criam uma relação expansiva, divertida e cheia de histórias, em que a sinceridade costuma vir antes do filtro. Há muita liberdade, mas o desafio é construir profundidade e responsabilidade afetiva.",
    combina: [
      "Amor por viagens, aventuras e experiências novas",
      "Senso de humor forte, com capacidade de rir de si mesmos",
      "Valorização de honestidade, mesmo quando ela é meio brutal"
    ],
    nao_combina: [
      "Falta de paciência com dramas e conversas emocionais longas",
      "Tendência a prometer mais do que conseguem cumprir",
      "Possibilidade de evitar responsabilidade em nome da liberdade"
    ],
    dicas: [
      "Lembrem que compromisso pode ser escolhido, não imposto, e isso não diminui a liberdade.",
      "Criem alguns combinados mínimos de respeito e presença, para que ninguém se sinta largado."
    ],
    compatibilidade: 87
  },
  "capricorn-sagittarius": {
    resumo:
      "Sagitário quer explorar o mundo; Capricórnio quer construir algo duradouro. A relação é uma grande aula de equilíbrio entre sonho e disciplina, otimismo e realismo, se ninguém tentar anular o outro.",
    combina: [
      "Sagitário traz leveza, esperança e visão mais ampla para Capricórnio",
      "Capricórnio oferece estrutura, foco e segurança para Sagitário",
      "Podem crescer juntos, ampliando horizontes sem perder o pé no chão"
    ],
    nao_combina: [
      "Capricórnio pode ver Sagitário como inconsequente ou disperso",
      "Sagitário pode achar Capricórnio pessimista, controlador ou rígido demais",
      "Choques sobre dinheiro, carreira, viagens e responsabilidades domésticas"
    ],
    dicas: [
      "Capricórnio: reconheça o valor da alegria e do improviso na manutenção do vínculo.",
      "Sagitário: mostrar constância em alguns pontos fortalece a liberdade que você tanto preza."
    ],
    compatibilidade: 58
  },
  "aquarius-sagittarius": {
    resumo:
      "Sagitário e Aquário formam uma combinação livre, idealista e mentalmente estimulante. A relação tende a ser de grande amizade, flexibilidade e espírito de aventura, mas pode faltar cuidado com necessidades emocionais mais delicadas.",
    combina: [
      "Ambos valorizam autenticidade, liberdade e experiências fora do óbvio",
      "Gostam de conversar sobre ideias, futuro, sociedade e crenças",
      "Pouca tendência a controlar o outro, com respeito ao espaço individual"
    ],
    nao_combina: [
      "Dificuldade em lidar com ciúmes, inseguranças ou demandas emocionais intensas",
      "Tendência a minimizar problemas com frases como 'tá tudo bem, segue o baile'",
      "Possibilidade de se afastar em silêncio quando algo pesa, em vez de conversar"
    ],
    dicas: [
      "Criem um código de 'agora é assunto sério' para sinalizar quando o tema precisa de mais profundidade.",
      "Lembrem que acolher o outro não ameaça a liberdade, apenas fortalece a confiança."
    ],
    compatibilidade: 85
  },
  "pisces-sagittarius": {
    resumo:
      "Sagitário vê o mundo como uma aventura; Peixes vê o mundo como um grande campo de emoções e significados. A relação é inspiradora, criativa e exagerada, para o bem e para o caos, se não houver alinhamento.",
    combina: [
      "Podem sonhar juntos com viagens, projetos criativos e novas possibilidades de vida",
      "Sagitário ajuda Peixes a sair da bolha e enxergar mais horizonte",
      "Peixes ajuda Sagitário a se conectar com a sensibilidade própria e dos outros"
    ],
    nao_combina: [
      "Sagitário pode ser direto demais para a delicadeza de Peixes",
      "Peixes pode esperar mais segurança e constância do que Sagitário consegue oferecer",
      "Ruídos quando um leva algo na brincadeira e o outro sente profundamente"
    ],
    dicas: [
      "Falem claramente sobre o que é sério e o que é só brincadeira, para ninguém sair ferido à toa.",
      "Sagitário: pratique empatia; Peixes: pratique limites e clareza no que você aceita ou não."
    ],
    compatibilidade: 63
  },
  // 🪨 CAPRICÓRNIO COM...
  "capricorn-capricorn": {
    resumo:
      "Dois capricornianos juntos criam uma relação séria, focada e muito comprometida com o futuro. Há responsabilidade e lealdade, mas precisam lembrar que amor não é só trabalho, meta e planejamento.",
    combina: [
      "Ambos valorizam estabilidade, respeito e crescimento a longo prazo",
      "Compromisso real com a construção de uma vida sólida",
      "Capacidade de enfrentar crises com disciplina e estratégia"
    ],
    nao_combina: [
      "Pouca espontaneidade, romance e brincadeira em alguns períodos",
      "Tendência a reprimir emoções para 'não atrapalhar' a rotina",
      "Autoexigência forte que pode respingar na relação"
    ],
    dicas: [
      "Incluam rituais de diversão, mimo e celebração no calendário, não só obrigações.",
      "Dizer 'eu te amo', elogiar e demonstrar carinho também é produtividade emocional."
    ],
    compatibilidade: 88
  },
  "aquarius-capricorn": {
    resumo:
      "Capricórnio valoriza tradição, estrutura e prudência; Aquário valoriza inovação, liberdade e ruptura de padrões. A relação é um encontro entre passado e futuro, que pode ser brilhante se houver respeito mútuo.",
    combina: [
      "Capricórnio traz execução, consistência e responsabilidade",
      "Aquário traz ideias novas, visão moderna e flexibilidade",
      "Juntos podem construir algo sólido e ao mesmo tempo inovador"
    ],
    nao_combina: [
      "Capricórnio pode achar Aquário imprevisível ou rebelde sem causa",
      "Aquário pode achar Capricórnio conservador ou rígido demais",
      "Diferenças marotas em relação a regras, horários, família e estilo de vida"
    ],
    dicas: [
      "Capricórnio: abra espaço para o novo, mesmo que em doses controladas.",
      "Aquário: mostre que sua liberdade não exclui compromisso e confiabilidade."
    ],
    compatibilidade: 64
  },
  "capricorn-pisces": {
    resumo:
      "Capricórnio traz chão; Peixes traz mar. A relação é um convite a equilibrar realidade e sonho, concreto e sensível, podendo ser muito bonita quando ninguém tenta invalidar o mundo do outro.",
    combina: [
      "Capricórnio ajuda Peixes a se organizar, se proteger e realizar projetos",
      "Peixes inspira Capricórnio a sentir mais, relaxar e acreditar em possibilidades",
      "Os dois podem formar um casal que une responsabilidade com carinho"
    ],
    nao_combina: [
      "Capricórnio pode achar Peixes confuso, dramático ou pouco prático",
      "Peixes pode ver Capricórnio como frio, duro ou pouco receptivo",
      "Conflitos sobre tempo para trabalho, descanso e romance"
    ],
    dicas: [
      "Capricórnio: experimente demonstrar afeto de forma mais explícita; isso fortalece muito Peixes.",
      "Peixes: honre os combinados e cuide para que Capricórnio se sinta apoiado na vida prática também."
    ],
    compatibilidade: 76
  },
  // 🌬️ AQUÁRIO COM...
  "aquarius-aquarius": {
    resumo:
      "Dois aquarianos juntos criam uma relação livre, diferente e baseada em amizade, respeito e espaço individual. É um vínculo mentalmente estimulante, mas que precisa de espaço para sentimentos mais claros.",
    combina: [
      "Respeito à individualidade e às escolhas pessoais",
      "Interesse por ideias novas, causas sociais ou estilos de vida alternativos",
      "Pouca tendência a jogos de controle e ciúmes possessivos"
    ],
    nao_combina: [
      "Dificuldade em falar de emoções de forma aberta e vulnerável",
      "Possibilidade de afastamentos longos sem explicação",
      "Risco de priorizar amizade, trabalho ou causas acima da relação, sem alinhar isso"
    ],
    dicas: [
      "Pratiquem comunicar o que sentem, mesmo que seja estranho no começo.",
      "Lembrem que proximidade emocional não anula liberdade; ela pode fortalecer o vínculo e a autonomia."
    ],
    compatibilidade: 86
  },
  "aquarius-pisces": {
    resumo:
      "Aquário vive no campo das ideias e da visão ampla; Peixes, no campo das emoções e da sensibilidade. A relação pode ser muito espiritual, idealista e artística, mas também confusa se faltarem acordos claros.",
    combina: [
      "Ambos têm interesse em temas humanitários, coletivos ou espirituais",
      "Peixes traz empatia e intuição para os ideais de Aquário",
      "Aquário ajuda Peixes a pensar com mais distância e clareza em alguns momentos"
    ],
    nao_combina: [
      "Aquário pode parecer frio ou distante para a profundidade emocional de Peixes",
      "Peixes pode parecer confuso ou dramático para o estilo lógico de Aquário",
      "Comunicação pode oscilar entre racional demais e emotiva demais sem síntese"
    ],
    dicas: [
      "Traduzam o que sentem e pensam em palavras simples e diretas, evitando suposições.",
      "Aceitem que cada um processa o mundo de um jeito: um sente primeiro, o outro pensa primeiro."
    ],
    compatibilidade: 62
  },
  // 🌊 PEIXES COM...
  "pisces-pisces": {
    resumo:
      "Dois piscianos juntos criam uma relação altamente sensível, emocional e imaginativa, quase de conto de fadas. Há muita empatia, romantismo e conexão espiritual, mas é fácil se perder em fantasias e fugir da realidade prática.",
    combina: [
      "Entendem nuances emocionais um do outro como poucas pessoas",
      "Capacidade de criar um universo próprio cheio de símbolos, músicas e significados",
      "Apoio mútuo em momentos de dor, com acolhimento autêntico e afetuoso"
    ],
    nao_combina: [
      "Possibilidade de escapismo mútuo diante de problemas concretos",
      "Dificuldade em lidar com dinheiro, prazos e responsabilidades sem estresse",
      "Oscilações emocionais que podem intensificar a instabilidade do relacionamento"
    ],
    dicas: [
      "Criem rotinas, planos e estruturas que sustentem toda essa sensibilidade sem sufocá-la.",
      "Busquem pé no chão: conversar sobre finanças, saúde e limites também é um ato de amor."
    ],
    compatibilidade: 80
  }
};

// --- ESTRUTURA PARA AMIZADE ---
export const UNIQUE_FRIENDSHIP: Record<string, CompatibilityResult> = {
  // ÁRIES COM...

  "aries-aries": {
    resumo:
      "Dois arianos juntos criam uma amizade intensa, agitada e cheia de histórias mal contadas. Vocês se entendem no impulso e na coragem, mas também podem brigar feio por besteira.",
    combina: [
      "Rolês espontâneos e cheios de adrenalina",
      "Sinceridade direta, sem rodeios",
      "Apoio quando é hora de tomar atitude",
      "Capacidade de recomeçar depois das brigas"
    ],
    nao_combina: [
      "Competição por quem manda mais no rolê",
      "Explosões de raiva desnecessárias",
      "Pouca paciência para conversas profundas",
      "Tendência a desistir da amizade em momentos de orgulho"
    ],
    dicas: [
      "Lembrem que vocês estão do mesmo lado, não em lados opostos de uma disputa.",
      "Respirem antes de responder na raiva; às vezes é só fome ou cansaço.",
      "Criem um código de paz para saber quando é hora de parar a discussão."
    ],
    compatibilidade: 88
  },

  "aries-taurus": {
    resumo:
      "Áries e Touro formam uma amizade de ritmo diferente, mas complementar. Um puxa para a ação, o outro puxa para a calma e o conforto.",
    combina: [
      "Touro segura Áries quando ele quer chutar o balde",
      "Áries incentiva Touro a sair da zona de conforto",
      "Bons rolês com comida, risada e histórias",
      "Lealdade forte quando a amizade se consolida"
    ],
    nao_combina: [
      "Teimosia dos dois quando ninguém quer ceder",
      "Áries se irritando com a lentidão de Touro",
      "Touro achando Áries impulsivo e sem noção",
      "Discussões sobre dinheiro, horários e planejamento"
    ],
    dicas: [
      "Áries: respeite o tempo de Touro, nem tudo precisa ser imediato.",
      "Touro: às vezes vale confiar no impulso do amigo e ir junto.",
      "Conversem antes de marcar algo importante para alinhar expectativa."
    ],
    compatibilidade: 78
  },

  "aries-gemini": {
    resumo:
      "Áries e Gêmeos criam uma amizade elétrica, cheia de piada interna e planos de última hora. Difícil é manter foco em uma coisa só.",
    combina: [
      "Conversas rápidas, engraçadas e sem filtro",
      "Rolês improvisados e viagens relâmpago",
      "Capacidade de se animarem em segundos",
      "Facilidade para fazer as pazes depois de tretas pequenas"
    ],
    nao_combina: [
      "Planos que nunca se concretizam",
      "Impulsividade x indecisão",
      "Promessas feitas no calor do momento e esquecidas depois",
      "Pouca profundidade em certos assuntos importantes"
    ],
    dicas: [
      "Criem pelo menos alguns combinados que vocês realmente vão cumprir.",
      "Quando algo for sério, avisem: ‘agora é papo de verdade’.",
      "Equilibrem o caos com um mínimo de organização nos planos."
    ],
    compatibilidade: 90
  },

  "aries-cancer": {
    resumo:
      "Áries e Câncer formam uma amizade de proteção e contraste: um é armadura, o outro é colo. Se não houver cuidado, o jeito direto de um machuca o jeito sensível do outro.",
    combina: [
      "Áries defende Câncer quando alguém passa do limite",
      "Câncer oferece ouvido e afeto quando Áries desaba",
      "Fidelidade forte quando a confiança é criada",
      "Capacidade de se motivarem em momentos difíceis"
    ],
    nao_combina: [
      "Palavras duras demais para um coração sensível",
      "Câncer se fechando e sumindo quando se magoa",
      "Áries achando drama onde Câncer só está sentindo",
      "Mal-entendidos por falta de explicação sincera"
    ],
    dicas: [
      "Áries: seja direto, mas um pouco mais gentil com o amigo de Câncer.",
      "Câncer: fale quando algo te ferir, não suma esperando que ele adivinhe.",
      "Transformem a diferença em parceria: um protege por fora, o outro por dentro."
    ],
    compatibilidade: 75
  },

  "aries-leo": {
    resumo:
      "Áries e Leão juntos viram aquela dupla barulhenta do grupo, cheia de atitude e presença. A amizade é divertida, mas também é cheia de ego.",
    combina: [
      "Muita energia e disposição para rolês",
      "Apoio mútuo em conquistas e metas",
      "Senso de humor parecido, meio exagerado",
      "Coragem para defender um ao outro"
    ],
    nao_combina: [
      "Competição constante por atenção",
      "Brigas quando um sente que o outro não o valorizou",
      "Pouca vontade de pedir desculpa primeiro",
      "Orgulho atrapalhando reconciliações simples"
    ],
    dicas: [
      "Lembrem de elogiar um ao outro com sinceridade, não só disputar palco.",
      "Nem toda situação é sobre quem está certo, às vezes é só sobre ouvir.",
      "Criem um pacto de não levar tudo para o lado pessoal."
    ],
    compatibilidade: 92
  },

  "aries-virgo": {
    resumo:
      "Áries e Virgem têm jeitos bem diferentes, mas que podem se complementar. Um é impulso, o outro é análise.",
    combina: [
      "Virgem ajuda Áries a não fazer tanta cagada por impulso",
      "Áries incentiva Virgem a não travar na perfeição",
      "Boa parceria para executar ideias com ação e método",
      "Lealdade discreta, mas presente"
    ],
    nao_combina: [
      "Virgem criticando demais o jeito de Áries",
      "Áries ignorando conselhos importantes",
      "Discussões sobre organização, horários e compromissos",
      "Impaciência de um com o ritmo do outro"
    ],
    dicas: [
      "Virgem: escolha bem o que realmente precisa criticar.",
      "Áries: ouvir um pouco mais pode salvar seus planos.",
      "Usem a combinação ‘ideia + plano + ação’ a favor da amizade."
    ],
    compatibilidade: 70
  },

  "aries-libra": {
    resumo:
      "Áries e Libra são opostos complementares na amizade: um vai reto, o outro suaviza. Quando alinhados, formam uma dupla poderosa.",
    combina: [
      "Áries fala o que ninguém quer falar, Libra sabe como falar",
      "Bons conselhos sobre amor e relacionamentos dos dois lados",
      "Equilíbrio entre ação e diplomacia",
      "Proteção ativa quando alguém injustiça o amigo"
    ],
    nao_combina: [
      "Áries achando Libra indeciso demais",
      "Libra achando Áries bruto e grosso",
      "Conflitos na forma de lidar com tretas",
      "Risco de Libra evitar assuntos que Áries quer resolver logo"
    ],
    dicas: [
      "Áries: segure um pouco o modo ‘soco na mesa’ em temas delicados.",
      "Libra: pare de fugir de conflitos importantes com esse amigo.",
      "Conversem sobre o que cada um espera da amizade, sem rodeios."
    ],
    compatibilidade: 82
  },

  "aries-scorpio": {
    resumo:
      "A amizade entre Áries e Escorpião é intensa, leal e às vezes meio tensa. É aquela dupla que ninguém mexe, mas que entre si vive testando limites.",
    combina: [
      "Lealdade forte e proteção mútua",
      "Capacidade de falar de assuntos sérios sem frescura",
      "Energia alta quando se juntam para um objetivo",
      "Respeito pela coragem um do outro"
    ],
    nao_combina: [
      "Ciúmes de amizade e controle de agenda",
      "Testes desnecessários para ver se o outro é leal mesmo",
      "Brigas pesadas quando se sentem traídos",
      "Dificuldade em admitir vulnerabilidade"
    ],
    dicas: [
      "Parem de testar o outro o tempo todo, conversem direto.",
      "Lembrem que vocês são aliados, não inimigos estratégicos.",
      "Equilibrem intensidade com momentos simples e leves."
    ],
    compatibilidade: 80
  },

  "aries-sagittarius": {
    resumo:
      "Áries e Sagitário são amigos perfeitos para aventuras, viagens e ideias malucas. A amizade é honesta, barulhenta e pouco formal.",
    combina: [
      "Rolês intensos e histórias engraçadas",
      "Pouca frescura para falar o que pensam",
      "Apoio quando alguém quer arriscar algo novo",
      "Facilidade em voltar ao normal depois de pequenas tretas"
    ],
    nao_combina: [
      "Falta de tato em momentos sensíveis",
      "Promessas furadas feitas na empolgação",
      "Pouco espaço para conversas profundas quando alguém está mal",
      "Tendência a sumir e voltar como se nada tivesse acontecido"
    ],
    dicas: [
      "Separem alguns momentos para serem mais sérios com o outro.",
      "Lembrem que ouvir também faz parte da amizade, não só brincar.",
      "Combinem melhor o que é importante cumprir e o que é apenas ‘ver no dia’."
    ],
    compatibilidade: 93
  },

  "aries-capricorn": {
    resumo:
      "Áries e Capricórnio formam uma amizade de trabalho em equipe: um é motor, o outro é freio inteligente. Quando se respeitam, realizam muito juntos.",
    combina: [
      "Áries traz coragem, Capricórnio traz estratégia",
      "Boa dupla para projetos, negócios e objetivos concretos",
      "Senso de responsabilidade, cada um do seu jeito",
      "Respeito pela força e persistência do outro"
    ],
    nao_combina: [
      "Áries achando Capricórnio sério demais",
      "Capricórnio achando Áries imaturo e imediatista",
      "Discussões sobre dinheiro, prazo e risco",
      "Pouca paciência de um com o estilo do outro"
    ],
    dicas: [
      "Áries: aprenda a valorizar o planejamento do amigo.",
      "Capricórnio: dê um pouco de espaço para o improviso dele.",
      "Definam metas juntos: um empurra, o outro organiza."
    ],
    compatibilidade: 72
  },

  "aries-aquarius": {
    resumo:
      "Áries e Aquário criam uma amizade diferente, cheia de ideias e posicionamentos fortes. É a dupla que discute, se provoca, mas se admira.",
    combina: [
      "Conversas sinceras e sem tabu",
      "Apoio em decisões ousadas ou pouco convencionais",
      "Muito estímulo mental e movimento",
      "Respeito pela autenticidade de cada um"
    ],
    nao_combina: [
      "Teimosia dos dois ao defender ponto de vista",
      "Discussões que viram debate eterno",
      "Dificuldade em lidar com carências emocionais",
      "Possibilidade de um sumir quando acha que o outro exagerou"
    ],
    dicas: [
      "Lembrem que não é sempre sobre quem está certo, e sim sobre manter o vínculo.",
      "Podem discordar sem cortar a amizade.",
      "Criem regras básicas para conflitos: sem ataques pessoais, só ideias."
    ],
    compatibilidade: 85
  },

  "aries-pisces": {
    resumo:
      "Áries e Peixes constroem uma amizade que mistura força e sensibilidade. Um puxa para o mundo real, o outro puxa para o mundo emocional.",
    combina: [
      "Áries protege Peixes em situações difíceis",
      "Peixes traz empatia e escuta para Áries",
      "Boa troca entre ação e intuição",
      "Capacidade de se inspirarem mutuamente"
    ],
    nao_combina: [
      "Áries sendo grosso sem perceber",
      "Peixes se magoando e se afastando em silêncio",
      "Diferenças sobre o que é ‘exagero’ emocional",
      "Falta de explicação clara de ambos"
    ],
    dicas: [
      "Áries: ajuste o tom quando seu amigo estiver fragilizado.",
      "Peixes: fale quando doer, não suma apenas.",
      "Transformem a amizade em espaço seguro para força e vulnerabilidade."
    ],
    compatibilidade: 73
  },

  // TOURO COM...

  "taurus-taurus": {
    resumo:
      "Dois taurinos fazem aquela amizade firme, previsível e cheia de conforto. Quem vê de fora acha parada, mas por dentro é leal e segura.",
    combina: [
      "Rolês com comida boa e lugares confortáveis",
      "Lealdade e constância no dia a dia",
      "Ajuda prática em momentos de aperto",
      "Paciência com o jeito do outro"
    ],
    nao_combina: [
      "Teimosia em dobro nas divergências",
      "Dificuldade em perdoar algumas coisas",
      "Resistência a mudanças de rotina",
      "Guardar incômodo sem falar nada"
    ],
    dicas: [
      "Conversem mais sobre o que incomoda, não deixem acumular.",
      "Testem coisas novas juntos de vez em quando.",
      "Lembrem que ceder às vezes não ameaça a amizade, fortalece."
    ],
    compatibilidade: 89
  },

  "gemini-taurus": {
    resumo:
      "Touro e Gêmeos formam uma amizade que mistura estabilidade com movimento. Um é base, o outro é vento.",
    combina: [
      "Gêmeos traz novidade e informação para Touro",
      "Touro oferece presença constante e confiável",
      "Podem equilibrar rotina com diversão",
      "Troca sinceras quando se conectam"
    ],
    nao_combina: [
      "Touro achando Gêmeos instável demais",
      "Gêmeos achando Touro devagar e resistente",
      "Burburinho por causa de mudanças de planos",
      "Insegurança quando um some demais"
    ],
    dicas: [
      "Touro: aceite que alguns planos vão mudar no meio do caminho.",
      "Gêmeos: honre um pouco mais o que marcar com esse amigo.",
      "Definam quais coisas são inegociáveis para nenhum se frustrar."
    ],
    compatibilidade: 71
  },

  "cancer-taurus": {
    resumo:
      "Touro e Câncer constroem uma amizade acolhedora, caseira e protetora. É a dupla do ‘tá tudo bem, vem aqui’.",
    combina: [
      "Conversas longas em ambientes confortáveis",
      "Cuidado com detalhes e com o bem-estar do outro",
      "Ajuda real em momentos de crise emocional ou material",
      "Vínculo duradouro, mesmo com pouco contato diário"
    ],
    nao_combina: [
      "Dificuldade em lidar com mudanças nos laços",
      "Ciúmes de outras amizades ou prioridades",
      "Guardar tristeza sem comentar",
      "Teimosia quando há mágoa envolvida"
    ],
    dicas: [
      "Marquem de se falar de tempos em tempos, mesmo na correria.",
      "Falarem sobre o que sentem evita distanciamentos estranhos.",
      "Valorizem o jeitinho cuidadoso que ambos têm."
    ],
    compatibilidade: 94
  },

  "leo-taurus": {
    resumo:
      "Touro e Leão constroem uma amizade cheia de presença e teimosia. Quando se dão bem, viram dupla poderosa; quando batem de frente, ninguém cede.",
    combina: [
      "Gostam de conforto, prazer e coisas boas",
      "Sabem se defender mutuamente",
      "Podem criar uma imagem forte como dupla",
      "Lealdade quando escolhem estar próximos"
    ],
    nao_combina: [
      "Teimosia e orgulho em discussões",
      "Touro achando Leão exagerado",
      "Leão achando Touro parado demais",
      "Disputa por quem decide o rolê"
    ],
    dicas: [
      "Escolham bem as brigas, nem tudo precisa ser levado ao extremo.",
      "Reconheçam o esforço um do outro em vez de só apontar defeitos.",
      "Alternem quem escolhe o plano da vez."
    ],
    compatibilidade: 74
  },

  "taurus-virgo": {
    resumo:
      "Touro e Virgem criam uma amizade prática, confiável e leal. Às vezes parece séria demais, mas é extremamente sólida.",
    combina: [
      "Ajuda concreta em problemas reais",
      "Conselhos objetivos, sem muita enrolação",
      "Compromisso com o que prometem",
      "Cuidado com trabalho, saúde e organização"
    ],
    nao_combina: [
      "Crítica em excesso de ambos os lados",
      "Pouco espaço para brincadeiras em alguns momentos",
      "Dificuldade em mudar planos rígidos",
      "Acúmulo de pequenas irritações"
    ],
    dicas: [
      "Reservem espaço para dar risada e não só resolver coisa séria.",
      "Elogiem mais o esforço do outro, não só corrijam.",
      "Planejem rolês leves, sem pauta de produtividade."
    ],
    compatibilidade: 91
  },

  "libra-taurus": {
    resumo:
      "Touro e Libra têm em comum o gosto por conforto e beleza. A amizade pode ser cheia de bons momentos, mas precisa alinhar ritmo e expectativas.",
    combina: [
      "Rolês em lugares agradáveis e bonitos",
      "Conversas sobre relacionamentos, estilo e vida",
      "Cuidado em não ser grosseiro com o outro",
      "Valorização da lealdade e presença"
    ],
    nao_combina: [
      "Libra indeciso x Touro decidido e teimoso",
      "Conflitos sobre dinheiro e gastos com prazer",
      "Evitar conversas difíceis para não estragar o clima",
      "Ficar insistindo em agradar todo mundo e esquecendo de si"
    ],
    dicas: [
      "Touro: aceite um pouco da diplomacia de Libra.",
      "Libra: seja mais claro com o que quer, Touro gosta de certeza.",
      "Combinar antes o que esperam do rolê evita frustração."
    ],
    compatibilidade: 76
  },

  "scorpio-taurus": {
    resumo:
      "Touro e Escorpião formam uma amizade intensa, profunda e às vezes silenciosa. Não é uma amizade leve, mas é muito leal.",
    combina: [
      "Proteção mútua em qualquer situação",
      "Capacidade de guardar segredos",
      "Conexão forte mesmo sem falar todo dia",
      "Suporte em fases difíceis da vida"
    ],
    nao_combina: [
      "Ciúmes e possessividade na amizade",
      "Dificuldade em conversar quando algo quebra a confiança",
      "Teimosia em dobro para ceder",
      "Ficar remoendo o passado"
    ],
    dicas: [
      "Se algo pesar, conversem antes de cortar laços.",
      "Valorizem o vínculo em vez de provar quem tem razão.",
      "Criem momentos mais leves para quebrar o tom sério da amizade."
    ],
    compatibilidade: 82
  },

  "sagittarius-taurus": {
    resumo:
      "Touro e Sagitário têm estilos bem diferentes: um quer conforto, o outro quer estrada. A amizade funciona quando há respeito por isso.",
    combina: [
      "Touro oferece um porto seguro",
      "Sagitário traz histórias, humor e aventura",
      "Troca de perspectivas sobre vida e escolhas",
      "Equilíbrio entre ficar e se jogar"
    ],
    nao_combina: [
      "Touro achando Sagitário instável e sumido",
      "Sagitário achando Touro preguiçoso ou controlador",
      "Discussões sobre compromissos e horários",
      "Frustração quando um quer sair e o outro quer ficar"
    ],
    dicas: [
      "Touro: aceite que esse amigo às vezes precisa sumir um pouco.",
      "Sagitário: avise, nem que seja rapidamente, para não passar a sensação de abandono.",
      "Alternem entre rolês tranquilos e rolês mais intensos."
    ],
    compatibilidade: 67
  },

  "capricorn-taurus": {
    resumo:
      "Touro e Capricórnio constroem uma amizade séria, confiável e focada em crescer na vida. Não é a mais caótica, mas é das mais firmes.",
    combina: [
      "Valores parecidos em relação a trabalho e dinheiro",
      "Apoio pragmático em decisões difíceis",
      "Respeito pelos limites e responsabilidades do outro",
      "Pouca paciência para drama gratuito"
    ],
    nao_combina: [
      "Falta de espaço para vulnerabilidade emocional",
      "Possível rigidez nos planos",
      "Dificuldade em falar de sentimentos diretamente",
      "Cansaço quando só falam de problema e nunca de coisa boa"
    ],
    dicas: [
      "Se permitam celebrar e relaxar, não só reclamar de responsabilidades.",
      "Abrir o jogo sobre emoções fortalece ainda mais a confiança.",
      "Planejem não só metas, mas também recompensas juntas."
    ],
    compatibilidade: 92
  },

  "aquarius-taurus": {
    resumo:
      "Touro e Aquário têm visões bem diferentes de vida. A amizade é aprendizado, choque e boas discussões.",
    combina: [
      "Aquário traz ideias novas e diferentes",
      "Touro traz estabilidade e base",
      "Troca honesta de opiniões",
      "Possibilidade de ver o mundo por outro ângulo"
    ],
    nao_combina: [
      "Touro achando Aquário distante ou frio",
      "Aquário achando Touro rígido e fechado",
      "Conflitos sobre mudanças e novidades",
      "Falta de paciência com o jeito do outro"
    ],
    dicas: [
      "Touro: aceite testar pequenas mudanças de vez em quando.",
      "Aquário: tenha um pouco mais de cuidado com o apego de Touro.",
      "Tratem as diferenças como material de conversa, não de briga."
    ],
    compatibilidade: 60
  },

  "pisces-taurus": {
    resumo:
      "Touro e Peixes constroem uma amizade doce e protetora. Um é chão, o outro é mar.",
    combina: [
      "Touro traz segurança e constância",
      "Peixes oferece empatia e compreensão",
      "Bons momentos de conversa profunda",
      "Cuidado genuíno com o bem-estar do outro"
    ],
    nao_combina: [
      "Peixes sumindo quando está mal",
      "Touro sendo duro demais em certas respostas",
      "Falta de organização em planos importantes",
      "Dificuldade em lidar com mudanças emocionais"
    ],
    dicas: [
      "Touro: seja um pouco mais gentil nas palavras.",
      "Peixes: não espere que o outro adivinhe tudo, fale.",
      "Mantenham a amizade como espaço seguro para sentir e descansar."
    ],
    compatibilidade: 88
  },

  // GÊMEOS COM...

  "gemini-gemini": {
    resumo:
      "Dois geminianos formam uma amizade caótica, engraçada e cheia de assunto. Difícil é lembrar de tudo que combinaram.",
    combina: [
      "Conversas infinitas sobre qualquer tema",
      "Adaptação rápida a qualquer rolê",
      "Bom humor em quase todas as situações",
      "Facilidade em fazer novas conexões juntos"
    ],
    nao_combina: [
      "Planos furados por desorganização",
      "Mudança de ideia de um minuto para o outro",
      "Falta de profundidade em alguns assuntos sérios",
      "Sumiços repentinos sem explicação"
    ],
    dicas: [
      "Criem lembretes e combinados bem claros.",
      "Separar ‘brincadeira’ de ‘assunto sério’ ajuda muito.",
      "Uma mensagem sincera de vez em quando já sustenta a amizade."
    ],
    compatibilidade: 89
  },

  "cancer-gemini": {
    resumo:
      "Gêmeos e Câncer têm ritmos emocionais diferentes. Um quer leveza, o outro quer profundidade, mas isso pode se complementar.",
    combina: [
      "Gêmeos ajuda Câncer a rir mais das situações",
      "Câncer dá senso de pertencimento a Gêmeos",
      "Boa mistura de conversa e acolhimento",
      "Capacidade de aprender com o estilo do outro"
    ],
    nao_combina: [
      "Câncer se sentindo não levado a sério",
      "Gêmeos se sentindo cobrado demais",
      "Ruídos por mensagens mal interpretadas",
      "Um se fecha, o outro tenta ignorar o clima"
    ],
    dicas: [
      "Gêmeos: leve a sério quando o amigo abrir o coração.",
      "Câncer: pergunte antes de supor que ele não liga.",
      "Criem um jeito de sinalizar quando é papo leve x papo sério."
    ],
    compatibilidade: 68
  },

  "gemini-leo": {
    resumo:
      "Gêmeos e Leão fazem amizade animada, social e expressiva. É aquela dupla que anima o ambiente.",
    combina: [
      "Muita história, piada e palco",
      "Facilidade em socializar em grupo",
      "Troca de elogios e motivação",
      "Criatividade para inventar rolês"
    ],
    nao_combina: [
      "Disputa por atenção",
      "Gêmeos se distraindo demais com outras pessoas",
      "Leão sentindo falta de lealdade em certos momentos",
      "Dificuldade em aprofundar conversas delicadas"
    ],
    dicas: [
      "Reservem momentos só de vocês para conversar sem plateia.",
      "Gêmeos: cuide um pouco mais do ego do seu amigo de Leão.",
      "Leão: entenda que Gêmeos varia de foco, não é desamor."
    ],
    compatibilidade: 86
  },

  "gemini-virgo": {
    resumo:
      "Gêmeos e Virgem compartilham regente mental, mas pensam diferente: um é multi, o outro é detalhista. A amizade pode ser muito produtiva.",
    combina: [
      "Boa troca de ideias",
      "Capacidade de analisar situações por ângulos diferentes",
      "Ajuda em estudos, projetos e decisões",
      "Curiosidade em comum sobre o mundo"
    ],
    nao_combina: [
      "Virgem criticando demais a bagunça de Gêmeos",
      "Gêmeos se irritando com o perfeccionismo de Virgem",
      "Discussões sobre responsabilidade e prazos",
      "Sensação de julgamento de ambos os lados"
    ],
    dicas: [
      "Virgem: pegue mais leve na cobrança pessoal.",
      "Gêmeos: mostre que também consegue ser confiável.",
      "Juntem o melhor dos dois: criatividade + organização."
    ],
    compatibilidade: 77
  },

  "gemini-libra": {
    resumo:
      "Gêmeos e Libra formam uma amizade leve, social e cheia de conversa boa. Tendem a se entender com facilidade.",
    combina: [
      "Interesse por pessoas, ideias e histórias",
      "Pouca disposição para briga pesada",
      "Capacidade de ver vários lados de uma situação",
      "Rolês em lugares agradáveis e diferentes"
    ],
    nao_combina: [
      "Indecisão em dobro em alguns momentos",
      "Falta de firmeza para tratar certos temas",
      "Tendência a fingir que está tudo bem mesmo incomodando",
      "Deixar assuntos sérios para depois demais"
    ],
    dicas: [
      "Escolham momentos para falar do que incomoda de verdade.",
      "Definam juntos algumas prioridades e limites.",
      "Lembrem que amizade forte aguenta sinceridade."
    ],
    compatibilidade: 91
  },

  "gemini-scorpio": {
    resumo:
      "Gêmeos e Escorpião têm linguagens bem diferentes. Um é leve e múltiplo, o outro é intenso e profundo.",
    combina: [
      "Gêmeos traz ar fresco para o drama de Escorpião",
      "Escorpião traz profundidade para a visão de Gêmeos",
      "Conversas interessantes sobre temas sérios",
      "Curiosidade mútua sobre como o outro funciona"
    ],
    nao_combina: [
      "Escorpião achando Gêmeos raso ou inconstante",
      "Gêmeos achando Escorpião pesado demais",
      "Ciúmes de amizades e contatos",
      "Mal-entendidos quando um brinca e o outro sente"
    ],
    dicas: [
      "Gêmeos: respeite quando o amigo estiver sensível.",
      "Escorpião: nem toda leveza é desinteresse.",
      "Combinar o que machuca ajuda a evitar desgastes."
    ],
    compatibilidade: 58
  },

  "gemini-sagittarius": {
    resumo:
      "Gêmeos e Sagitário formam uma amizade viajante, curiosa e cheia de histórias. É a dupla que está sempre olhando para o próximo capítulo.",
    combina: [
      "Interesse por aprender e explorar",
      "Humor afiado e sinceridade",
      "Facilidade em retomar contato como se nada tivesse mudado",
      "Liberdade mútua sem muito drama"
    ],
    nao_combina: [
      "Pouca paciência para drama emocional",
      "Algumas promessas feitas e não cumpridas",
      "Dificuldade em se fazer presente em fases difíceis",
      "Sumiços longos de ambos"
    ],
    dicas: [
      "Criem um mínimo de constância, nem que seja uma mensagem de vez em quando.",
      "Se um dia o assunto for sério, deixem claro isso desde o início.",
      "Lembrem que amizade também sustenta momentos pesados."
    ],
    compatibilidade: 92
  },

  "capricorn-gemini": {
    resumo:
      "Capricórnio e Gêmeos parecem opostos, mas se ajudam: um organiza, o outro flexibiliza. A amizade funciona quando há respeito pelo ritmo do outro.",
    combina: [
      "Capricórnio oferece pé no chão",
      "Gêmeos traz leveza e criatividade",
      "Boa dupla para projetos que precisem de mente e execução",
      "Troca real de visões de mundo"
    ],
    nao_combina: [
      "Capricórnio achando Gêmeos irresponsável",
      "Gêmeos achando Capricórnio duro e chato",
      "Conflitos sobre compromisso com horários e planos",
      "Falta de compreensão do estilo do outro"
    ],
    dicas: [
      "Capricórnio: deixe algum espaço para improviso.",
      "Gêmeos: honre o básico do combinado.",
      "Enxerguem a utilidade de cada estilo na amizade."
    ],
    compatibilidade: 69
  },

  "aquarius-gemini": {
    resumo:
      "Gêmeos e Aquário constroem uma amizade mentalmente agitada e fora da caixa. É muita ideia, meme e debate.",
    combina: [
      "Conversas sobre tudo, de besteira a temas sérios",
      "Respeito à liberdade do outro",
      "Pouca cobrança de presença diária",
      "Afinidade em humor e visão de mundo"
    ],
    nao_combina: [
      "Dificuldade em lidar com emoções intensas",
      "Sumiços sem explicação que podem ser mal interpretados",
      "Excesso de racionalização em situações sensíveis",
      "Falta de demonstração clara de afeto"
    ],
    dicas: [
      "De vez em quando, mandem algo que mostre cuidado real.",
      "Se algo pegar, falem direto, não só teorizem.",
      "Lembrem que sentir não atrapalha a amizade, aprofunda."
    ],
    compatibilidade: 94
  },

  "gemini-pisces": {
    resumo:
      "Gêmeos e Peixes criam uma amizade cheia de imaginação e confusão. Muito potencial criativo, mas também muitos mal-entendidos.",
    combina: [
      "Idéias criativas, artísticas ou viajadas",
      "Capacidade de conversar horas sobre temas subjetivos",
      "Liberdade para ser estranho sem julgamento",
      "Empatia em momentos certos"
    ],
    nao_combina: [
      "Peixes se magoando com brincadeiras de Gêmeos",
      "Gêmeos se irritando com drama ou vitimização",
      "Comunicação cheia de indiretas ou ruídos",
      "Falta de clareza sobre o que está acontecendo"
    ],
    dicas: [
      "Perguntem mais: ‘o que você quis dizer com isso?’.",
      "Evitem suposição e falem com mais objetividade.",
      "Separar piada de verdade ajuda a manter a amizade saudável."
    ],
    compatibilidade: 64
  },

  // CÂNCER COM...

  "cancer-cancer": {
    resumo:
      "Dois cancerianos constroem uma amizade muito afetiva e leal, mas também muito sensível. É a amizade de se sentir em casa, com risco de dramas.",
    combina: [
      "Apoio emocional poderoso",
      "Memória afetiva forte dos momentos vividos",
      "Cuidado real com a vida um do outro",
      "Conexão profunda mesmo em silêncio"
    ],
    nao_combina: [
      "Mágoas guardadas sem conversa",
      "Oscilações de humor pesadas",
      "Expectativa alta sobre presença e atenção",
      "Tendência à vitimização quando algo dói"
    ],
    dicas: [
      "Aprendam a falar do que machuca sem atacar.",
      "Não esperem que o outro adivinhe tudo sozinho.",
      "Criem rituais de amizade que façam os dois se sentirem seguros."
    ],
    compatibilidade: 93
  },

  "cancer-leo": {
    resumo:
      "Câncer e Leão formam uma amizade calorosa e dramática. Um é carinho, o outro é palco.",
    combina: [
      "Troca de apoio emocional e motivacional",
      "Gestos grandes de amizade e cuidado",
      "Presença em momentos importantes",
      "Proteção mútua com unhas e dentes"
    ],
    nao_combina: [
      "Câncer se sentindo esquecido quando Leão brilha demais fora",
      "Leão se irritando com oscilações emocionais",
      "Ciúmes de outras relações",
      "Briguinhas por falta de validação"
    ],
    dicas: [
      "Valorize o jeito do outro demonstrar carinho.",
      "Conversem sobre expectativas de presença e resposta.",
      "Lembrem que os dois sentem muito, só expressam de forma diferente."
    ],
    compatibilidade: 79
  },

  "cancer-virgo": {
    resumo:
      "Câncer e Virgem criam uma amizade cuidadosa e discreta. Um cuida das emoções, o outro cuida da vida prática.",
    combina: [
      "Apoio prático e emocional equilibrado",
      "Conselhos sensatos e bem-intencionados",
      "Presença em momentos difíceis",
      "Lealdade silenciosa, mas firme"
    ],
    nao_combina: [
      "Virgem sendo duro demais nas críticas",
      "Câncer interpretando tudo como rejeição",
      "Dificuldade em lidar com diferenças de sensibilidade",
      "Acúmulo de ressentimento"
    ],
    dicas: [
      "Virgem: suavize o tom sem perder o conteúdo.",
      "Câncer: pergunte a intenção antes de concluir que foi ataque.",
      "Usem a amizade como espaço de cura, não de cobrança."
    ],
    compatibilidade: 88
  },

  "cancer-libra": {
    resumo:
      "Câncer e Libra constroem uma amizade gentil, mas às vezes confusa. Um quer profundidade, o outro quer equilíbrio.",
    combina: [
      "Boa escuta e vontade de ajudar",
      "Rolês agradáveis e ambientes harmônicos",
      "Conselhos amorosos sobre relações",
      "Empatia real, mesmo com jeitos diferentes"
    ],
    nao_combina: [
      "Libra evitando conflitos emocionais pesados",
      "Câncer sentindo falta de profundidade",
      "Indefinição sobre o que incomoda",
      "Pequenos incômodos acumulados"
    ],
    dicas: [
      "Libra: permita conversas um pouco mais pesadas às vezes.",
      "Câncer: aceite que às vezes o amigo prefere leveza, não é desamor.",
      "Combinar momentos de papo leve e papo profundo ajuda muito."
    ],
    compatibilidade: 72
  },

  "cancer-scorpio": {
    resumo:
      "Câncer e Escorpião formam uma amizade profunda, intensa e poderosa. Quase telepática, mas pesada se não houver limite.",
    combina: [
      "Entendimento emocional raro",
      "Lealdade quase inabalável",
      "Ajuda em processos de cura e transformação",
      "Confiança em conversas profundas"
    ],
    nao_combina: [
      "Ciúmes de outras relações",
      "Dramas longos e difíceis de encerrar",
      "Excesso de lembrança do passado",
      "Dificuldade em dizer ‘não’ dentro do vínculo"
    ],
    dicas: [
      "Mantenham limites saudáveis, mesmo na intimidade.",
      "Falarem de incômodos antes de virarem nó na garganta ajuda.",
      "Busquem doses de leveza na convivência para não pesar demais."
    ],
    compatibilidade: 95
  },

  "cancer-sagittarius": {
    resumo:
      "Câncer e Sagitário parecem opostos em amizade: um quer raiz, o outro quer estrada. Se se respeitam, aprendem muito um com o outro.",
    combina: [
      "Sagitário anima Câncer em fases difíceis",
      "Câncer oferece porto seguro para o outro voltar",
      "Visões diferentes de vida que se complementam",
      "Histórias, viagens e memórias afetivas"
    ],
    nao_combina: [
      "Câncer se sentindo deixado de lado",
      "Sagitário se sentindo sufocado por cobrança",
      "Mensagens não respondidas gerando mágoa",
      "Ruído sobre o que a amizade significa"
    ],
    dicas: [
      "Conversem sobre ritmo de contato e expectativa.",
      "Câncer: aceite um pouco do espírito livre do amigo.",
      "Sagitário: um ‘tô vivo’ de vez em quando já acalma muito."
    ],
    compatibilidade: 63
  },

  "cancer-capricorn": {
    resumo:
      "Câncer e Capricórnio criam uma amizade que mistura cuidado emocional com estrutura. É maturidade com afeto.",
    combina: [
      "Capricórnio ajuda Câncer a se organizar",
      "Câncer ajuda Capricórnio a sentir mais",
      "Apoio em questões familiares e profissionais",
      "Respeito pela história um do outro"
    ],
    nao_combina: [
      "Capricórnio sendo seco demais às vezes",
      "Câncer dramatizando ausência como desamor",
      "Diferença de prioridades no dia a dia",
      "Falta de comunicação sobre expectativa"
    ],
    dicas: [
      "Capricórnio: demonstre um pouco mais, mesmo que em gestos simples.",
      "Câncer: reconheça o cuidado prático que o amigo oferece.",
      "Criem rotinas leves de contato que não pesem para ninguém."
    ],
    compatibilidade: 86
  },

  "aquarius-cancer": {
    resumo:
      "Câncer e Aquário têm linguagens opostas: emoção profunda x racionalidade ampla. A amizade é estranha, mas rica.",
    combina: [
      "Aquário amplia a visão de Câncer",
      "Câncer traz humanidade às ideias de Aquário",
      "Conversas sobre pessoas e mundo",
      "Possibilidade de amizade diferente do padrão"
    ],
    nao_combina: [
      "Câncer se sentindo invalidado",
      "Aquário achando tudo dramático demais",
      "Dificuldade em ajustar intensidade de contato",
      "Ruídos por falta de explicação clara de ambos"
    ],
    dicas: [
      "Aquário: valide os sentimentos do amigo.",
      "Câncer: entenda que o jeito frio não significa falta de carinho.",
      "Aceitem que essa amizade funciona num formato próprio, fora da regra."
    ],
    compatibilidade: 58
  },

  "cancer-pisces": {
    resumo:
      "Câncer e Peixes formam uma amizade muito sensível e empática. É quase terapia mútua, se não virar fuga da realidade.",
    combina: [
      "Escuta profunda e sem julgamento",
      "Entendimento intuitivo do que o outro sente",
      "Momentos de imaginação e criatividade",
      "Consolo real em fases difíceis"
    ],
    nao_combina: [
      "Ambos fugindo de problemas práticos",
      "Dramas que se retroalimentam",
      "Dificuldade em estabelecer limite com outras pessoas",
      "Oscilações emocionais pesadas"
    ],
    dicas: [
      "Lembrem de falar também de soluções, não só do problema.",
      "Tragam prática para os sonhos e dores.",
      "Usem a sensibilidade para se fortalecer, não só sofrer junto."
    ],
    compatibilidade: 92
  },

  // LEÃO COM...

  "leo-leo": {
    resumo:
      "Dois leoninos criam uma amizade intensa, divertida e cheia de histórias icônicas. Mas o orgulho é grande para os dois lados.",
    combina: [
      "Muitos rolês marcantes",
      "Apoio forte quando o outro está em baixa",
      "Elogios sinceros e motivação",
      "Defesa do amigo em qualquer ambiente"
    ],
    nao_combina: [
      "Competição por protagonismo",
      "Conflitos quando um não se sente valorizado",
      "Dificuldade em dar o braço a torcer",
      "Brigas que duram mais que o necessário"
    ],
    dicas: [
      "Aprendam a dizer ‘senti falta disso de você’.",
      "Elogiem mais do que cobram.",
      "Lembrem que o brilho de um não apaga o do outro."
    ],
    compatibilidade: 90
  },

  "leo-virgo": {
    resumo:
      "Leão e Virgem têm uma amizade que mistura brilho com discrição. Um quer palco, o outro quer eficiência.",
    combina: [
      "Virgem ajuda Leão a organizar a vida",
      "Leão incentiva Virgem a se expor um pouco mais",
      "Boa parceria em projetos ou trabalhos",
      "Troca de conselhos sinceros"
    ],
    nao_combina: [
      "Virgem criticando demais o drama de Leão",
      "Leão se ofendendo fácil com comentários",
      "Diferença de prioridade entre imagem e detalhes",
      "Pequenas irritações acumuladas"
    ],
    dicas: [
      "Virgem: selecione críticas realmente importantes.",
      "Leão: não leve tudo como ataque pessoal.",
      "Usem o melhor de cada um: visão + execução."
    ],
    compatibilidade: 71
  },

  "leo-libra": {
    resumo:
      "Leão e Libra constroem uma amizade charmosa e social. É a dupla que gosta de ambientes bonitos e boas companhias.",
    combina: [
      "Senso estético e social alinhado",
      "Troca de elogios e apoio",
      "Bom papo sobre relacionamentos",
      "Rolês que rendem boas fotos e memórias"
    ],
    nao_combina: [
      "Libra evitando conversas difíceis",
      "Leão sentindo que não é prioridade",
      "Disputa por agradar e ser agradado",
      "Ficar em cima do muro em temas importantes"
    ],
    dicas: [
      "Libra: seja mais direto sobre o que sente.",
      "Leão: pergunte antes de supor descaso.",
      "Definam juntos o que esperam um do outro na amizade."
    ],
    compatibilidade: 84
  },

  "leo-scorpio": {
    resumo:
      "Leão e Escorpião criam uma amizade intensa e séria, com muito respeito e também atrito. Não é uma amizade superficial.",
    combina: [
      "Lealdade muito forte",
      "Defesa absoluta um do outro",
      "Capacidade de se admirarem mutuamente",
      "Conversas profundas quando abrem espaço para isso"
    ],
    nao_combina: [
      "Disputa de poder dentro da amizade",
      "Ciúmes e controle velado",
      "Teimosia em conflitos",
      "Dificuldade de voltar atrás depois de uma briga grave"
    ],
    dicas: [
      "Escolham confiança em vez de teste.",
      "Falarem de incômodos antes de explodirem evita rompimentos.",
      "Lembrem que vocês são aliados, não rivais."
    ],
    compatibilidade: 78
  },

  "leo-sagittarius": {
    resumo:
      "Leão e Sagitário formam uma amizade animada, sincera e cheia de aventura. É a dupla ideal para viagem e festa.",
    combina: [
      "Muito humor e espontaneidade",
      "Sinceridade direta, às vezes até demais",
      "Apoio em planos ousados",
      "Competitividade saudável em alguns contextos"
    ],
    nao_combina: [
      "Falta de delicadeza em momentos sensíveis",
      "Esquecimento de datas e detalhes importantes",
      "Pouca paciência com drama prolongado",
      "Alguma dificuldade em pedir desculpa"
    ],
    dicas: [
      "Sejam honestos, mas não cruéis.",
      "Reservem momentos de conversa mais emocional.",
      "Lembrem que o amigo também tem dias ruins e inseguranças."
    ],
    compatibilidade: 95
  },

  "capricorn-leo": {
    resumo:
      "Leão e Capricórnio criam uma amizade que mistura ambição com orgulho. Podem conquistar muito juntos, se não entrarem em choque o tempo todo.",
    combina: [
      "Apoio em metas e planos de longo prazo",
      "Respeito pela força de vontade do outro",
      "Complemento entre otimismo e realismo",
      "Bom senso para negócios ou projetos"
    ],
    nao_combina: [
      "Capricórnio achando Leão dramático",
      "Leão achando Capricórnio frio",
      "Conflitos sobre dinheiro, risco e status",
      "Pouca conversa sobre vulnerabilidades"
    ],
    dicas: [
      "Capricórnio: valide o lado emocional do amigo.",
      "Leão: valorize o cuidado prático que ele oferece.",
      "Misturem conquista com amizade, não só cobrança."
    ],
    compatibilidade: 70
  },

  "aquarius-leo": {
    resumo:
      "Leão e Aquário formam uma amizade de opostos complementares: individualidade forte x visão coletiva. É intensa, diferente e cheia de debate.",
    combina: [
      "Respeito à autenticidade de cada um",
      "Troca de ideias fortes e opiniões marcantes",
      "Apoio em momentos de decisão",
      "Capacidade de se admirarem mesmo discordando"
    ],
    nao_combina: [
      "Apego x desapego emocional",
      "Discussões sobre quem está certo",
      "Falta de demonstração afetiva clara de Aquário",
      "Orgulho de Leão em admitir erro"
    ],
    dicas: [
      "Entendam que amam e demonstram de jeitos diferentes.",
      "Podem discordar sem romper a amizade.",
      "Criem espaço para falar de sentimento, não só de ideia."
    ],
    compatibilidade: 82
  },

  "leo-pisces": {
    resumo:
      "Leão e Peixes constroem uma amizade sensível e teatral. Um sente muito, o outro manifesta muito.",
    combina: [
      "Capacidade de se apoiar em momentos difíceis",
      "Criatividade, arte, música ou estética em comum",
      "Gestos bonitos de carinho entre amigos",
      "Proteção de Leão e empatia de Peixes"
    ],
    nao_combina: [
      "Peixes se magoando com brincadeiras de Leão",
      "Leão não entendendo o silêncio do amigo",
      "Dramas que ninguém sabe explicar bem",
      "Dificuldade em alinhar expectativas de contato"
    ],
    dicas: [
      "Leão: use seu brilho também para iluminar o amigo, não só o momento.",
      "Peixes: fale do que dói, não engula tudo.",
      "Os dois podem transformar essa amizade em grande apoio emocional."
    ],
    compatibilidade: 76
  },

  // VIRGEM COM...

  "virgo-virgo": {
    resumo:
      "Dois virginianos constroem uma amizade organizada, útil e sincera. Podem pegar pesado nas críticas, mas geralmente é por cuidado.",
    combina: [
      "Ajuda prática constante",
      "Conselhos realistas e pé no chão",
      "Responsabilidade com horários e promessas",
      "Cuidado com saúde, trabalho e rotina"
    ],
    nao_combina: [
      "Crítica em excesso de ambos os lados",
      "Autocobrança compartilhada que pesa o clima",
      "Pouca demonstração verbal de afeto",
      "Dificuldade em relaxar de verdade"
    ],
    dicas: [
      "Elogiem mais o esforço um do outro.",
      "Criem momentos sem pauta de produtividade.",
      "Aceitem que nem tudo precisa ser perfeito para ser bom."
    ],
    compatibilidade: 90
  },

  "libra-virgo": {
    resumo:
      "Virgem e Libra têm uma amizade que busca melhorar tudo: o clima, as pessoas, as situações. Um pelo detalhe, o outro pelo equilíbrio.",
    combina: [
      "Virgem organiza, Libra harmoniza",
      "Bons conselhos sobre relações e escolhas",
      "Cuidado em não ser cruel com palavras",
      "Ajuda real em questões práticas"
    ],
    nao_combina: [
      "Virgem achando Libra enrolado",
      "Libra achando Virgem rígido",
      "Discussões sobre o que é ‘correto’",
      "Evitar temas tensos para não estragar o clima"
    ],
    dicas: [
      "Virgem: foque no essencial, não em tudo.",
      "Libra: assuma posições mais claras quando necessário.",
      "Juntem racionalidade com diplomacia a favor da amizade."
    ],
    compatibilidade: 73
  },

  "scorpio-virgo": {
    resumo:
      "Virgem e Escorpião criam uma amizade séria, analítica e profunda. Não é uma amizade superficial nem barulhenta.",
    combina: [
      "Capacidade de observar o que ninguém vê",
      "Ajuda mútua em problemas complexos",
      "Lealdade discreta, mas real",
      "Conselhos honestos, mesmo que duros"
    ],
    nao_combina: [
      "Críticas que podem virar ataques",
      "Virgem sendo racional demais para Escorpião",
      "Escorpião puxando para intensidade demais",
      "Dificuldade em soltar mágoas antigas"
    ],
    dicas: [
      "Equilibrem verdade com cuidado.",
      "Não usem a inteligência para ferir, e sim para cuidar.",
      "Criem espaço para leveza às vezes, não só análises."
    ],
    compatibilidade: 80
  },

  "sagittarius-virgo": {
    resumo:
      "Virgem e Sagitário têm ritmos opostos: um quer planilha, o outro quer estrada. A amizade funciona se os dois toparem aprender.",
    combina: [
      "Virgem ajuda Sagitário a se organizar",
      "Sagitário ajuda Virgem a relaxar um pouco",
      "Troca interessante de visão de mundo",
      "Planos que podem ser bem executados"
    ],
    nao_combina: [
      "Virgem achando Sagitário irresponsável",
      "Sagitário achando Virgem chato",
      "Brigas por causa de detalhes x liberdade",
      "Falta de paciência de ambos"
    ],
    dicas: [
      "Virgem: dê espaço para o improviso.",
      "Sagitário: mostre que consegue cumprir o básico.",
      "Tratando a diferença como equilíbrio, a amizade cresce muito."
    ],
    compatibilidade: 62
  },

  "capricorn-virgo": {
    resumo:
      "Virgem e Capricórnio fazem uma amizade produtiva e estável. É aquela parceria que rende muito na vida real.",
    combina: [
      "Responsabilidade e foco em crescimento",
      "Ajuda prática em trabalhos e metas",
      "Respeito às obrigações de cada um",
      "Conselhos sérios e aplicáveis"
    ],
    nao_combina: [
      "Pouca flexibilidade para mudanças",
      "Falta de conversa emocional profunda",
      "Tendência a só falar de problema e tarefa",
      "Cansaço da vibe sempre séria"
    ],
    dicas: [
      "Incluam momentos de diversão despretensiosa.",
      "Falem também de sonhos e sentimentos.",
      "Lembrem que amizade não é só parceria de trabalho."
    ],
    compatibilidade: 92
  },

  "aquarius-virgo": {
    resumo:
      "Virgem e Aquário constroem uma amizade mental e prática ao mesmo tempo. Um cuida do detalhe, o outro da visão ampla.",
    combina: [
      "Aquário traz inovação, Virgem traz execução",
      "Conversas sobre sistemas, ideias e melhorias",
      "Interesse em resolver problemas reais",
      "Respeito pela inteligência de ambos"
    ],
    nao_combina: [
      "Virgem achando Aquário caótico ou distante",
      "Aquário achando Virgem crítico demais",
      "Conflitos sobre regras e mudanças repentinas",
      "Dificuldade em falar de temas emocionais"
    ],
    dicas: [
      "Virgem: aceite um pouco do caos criativo do amigo.",
      "Aquário: reconheça a utilidade do cuidado com detalhes.",
      "Juntem visão e precisão para fortalecer a amizade."
    ],
    compatibilidade: 66
  },

  "pisces-virgo": {
    resumo:
      "Virgem e Peixes formam uma amizade de cura mútua: razão e sensibilidade andando lado a lado. Desde que ninguém queira salvar o outro o tempo todo.",
    combina: [
      "Virgem ajuda Peixes a se organizar e se proteger",
      "Peixes ajuda Virgem a sentir e soltar um pouco",
      "Conselhos profundos e honestos",
      "Companhia boa em momentos de vulnerabilidade"
    ],
    nao_combina: [
      "Virgem pegando pesado na crítica",
      "Peixes escapando em vez de resolver",
      "Dinâmica de salvador x vítima",
      "Cansaço emocional para os dois"
    ],
    dicas: [
      "Virgem: ofereça estrutura, mas não controle.",
      "Peixes: receba ajuda, mas faça sua parte.",
      "Usem a amizade como espaço de equilíbrio, não de peso."
    ],
    compatibilidade: 83
  },

  // LIBRA COM...

  "libra-libra": {
    resumo:
      "Dois librianos criam uma amizade leve, educada e bem-intencionada. O problema é decidir qualquer coisa.",
    combina: [
      "Boa vontade para ouvir o outro",
      "Preocupação em não ferir ninguém",
      "Rolês em lugares bonitos e agradáveis",
      "Conselhos sobre relações com sensibilidade"
    ],
    nao_combina: [
      "Indecisão em dobro",
      "Fugir de conversas difíceis",
      "Guardar incômodo para não criar conflito",
      "Expectativas não ditas"
    ],
    dicas: [
      "Escolham alguns temas onde um decide e o outro segue.",
      "Conversem sobre o que realmente importa, mesmo com medo de brigar.",
      "Lembrem que honestidade também é harmonia."
    ],
    compatibilidade: 88
  },

  "libra-scorpio": {
    resumo:
      "Libra e Escorpião têm uma amizade que mistura leveza com intensidade. Às vezes é delicioso, às vezes é cansativo.",
    combina: [
      "Libra suaviza algumas durezas de Escorpião",
      "Escorpião traz profundidade à visão de Libra",
      "Conversas sobre relações e emoções",
      "Lealdade mútua quando a amizade é sincera"
    ],
    nao_combina: [
      "Escorpião achando Libra superficial",
      "Libra achando Escorpião pesado",
      "Fuga de temas tensos por parte de Libra",
      "Testes emocionais por parte de Escorpião"
    ],
    dicas: [
      "Libra: seja mais firme quando algo te incomodar.",
      "Escorpião: explique mais, ataque menos.",
      "Aproveitem o que cada um tem de melhor para amadurecer juntos."
    ],
    compatibilidade: 69
  },

  "libra-sagittarius": {
    resumo:
      "Libra e Sagitário constroem uma amizade divertida, social e cheia de histórias. É leve, mas pode faltar profundidade em alguns momentos.",
    combina: [
      "Rolês, viagens e boas conversas",
      "Pouca paciência para briga boba",
      "Vontade de manter o clima alto astral",
      "Interesse por pessoas e experiências"
    ],
    nao_combina: [
      "Empurrar assuntos importantes para depois",
      "Dificuldade em se comprometer com planos",
      "Medo de frustrar o outro ao ser sincero",
      "Fugir quando o clima fica tenso demais"
    ],
    dicas: [
      "Escolham momentos para falar sério, mesmo que poucos.",
      "Sejam honestos sobre limites e expectativas.",
      "Equilibrem os rolês com conversas de verdade de vez em quando."
    ],
    compatibilidade: 87
  },

  "capricorn-libra": {
    resumo:
      "Libra e Capricórnio criam uma amizade de troca entre leveza e responsabilidade. Um ajuda o outro a não ir para o extremo.",
    combina: [
      "Capricórnio oferece segurança e constância",
      "Libra traz socialização e suavidade",
      "Bons conselhos sobre relações e carreira",
      "Equilíbrio entre trabalho e prazer"
    ],
    nao_combina: [
      "Capricórnio achando Libra disperso",
      "Libra achando Capricórnio rígido",
      "Conflitos sobre prioridades de tempo",
      "Diferenças na forma de dizer ‘não’"
    ],
    dicas: [
      "Capricórnio: valorize o equilíbrio que Libra propõe.",
      "Libra: seja mais direto com o amigo, ele prefere clareza.",
      "Juntem responsabilidade com leveza para uma amizade duradoura."
    ],
    compatibilidade: 74
  },

  "aquarius-libra": {
    resumo:
      "Libra e Aquário constroem uma amizade mental, social e leve. É aquela dupla que conversa sobre tudo e some um pouco também.",
    combina: [
      "Interesse por temas sociais e relacionais",
      "Respeito à liberdade do outro",
      "Pouca tendência a controle e ciúme",
      "Conversas inteligentes e bem-humoradas"
    ],
    nao_combina: [
      "Evitar temas emocionais densos",
      "Racionalização excessiva de sentimentos",
      "Sumiços que podem ser mal interpretados",
      "Indefinição sobre o que incomoda"
    ],
    dicas: [
      "Separar um momento para falar de coisas mais íntimas ajuda.",
      "Pequenos gestos de cuidado fortalecem o vínculo.",
      "Se algo pesar, falem — não só pensem sobre."
    ],
    compatibilidade: 92
  },

  "libra-pisces": {
    resumo:
      "Libra e Peixes criam uma amizade sensível e idealista. São gentis um com o outro, mas podem se enrolar nos limites.",
    combina: [
      "Empatia e cuidado nas falas",
      "Imaginação e romantização da vida",
      "Vontade de evitar brigas pesadas",
      "Apoio em temas afetivos"
    ],
    nao_combina: [
      "Falta de decisão sobre o que fazer",
      "Fuga de conversas duras",
      "Expectativas silenciosas",
      "Dificuldade em estabelecer limites com o mundo"
    ],
    dicas: [
      "Pratiquem dizer ‘não’ juntos, se apoiando.",
      "Sejam um pouco mais objetivos quando o tema exigir.",
      "Conversem sobre o que cada um realmente precisa da amizade."
    ],
    compatibilidade: 80
  },

  // ESCORPIÃO COM...

  "scorpio-scorpio": {
    resumo:
      "Dois escorpianos criam uma amizade intensíssima, leal e às vezes dramática. Não é leve, mas é profunda.",
    combina: [
      "Segredos guardados a sete chaves",
      "Suporte real em fases muito difíceis",
      "Conexão emocional profunda",
      "Vontade de ver o outro crescer de verdade"
    ],
    nao_combina: [
      "Ciúmes e controle da vida do outro",
      "Brigas muito pesadas",
      "Dificuldade de perdoar traições de confiança",
      "Excesso de teste e desconfiança"
    ],
    dicas: [
      "Escolham confiar conscientemente um no outro.",
      "Não joguem com o medo e a culpa do amigo.",
      "Criem espaços de leveza, não só intensidade."
    ],
    compatibilidade: 89
  },

  "sagittarius-scorpio": {
    resumo:
      "Escorpião e Sagitário têm uma amizade de contraste: profundidade x leveza. Pode ser muito rica ou muito cansativa.",
    combina: [
      "Conversas filosóficas e emocionais",
      "Humor meio ácido em comum",
      "Coragem para falar de assuntos tabus",
      "Apoio quando a coisa fica séria"
    ],
    nao_combina: [
      "Escorpião achando Sagitário superficial",
      "Sagitário achando Escorpião pesado demais",
      "Conflitos sobre liberdade e controle",
      "Sumir em vez de resolver o problema"
    ],
    dicas: [
      "Sagitário: respeite a intensidade do amigo.",
      "Escorpião: não dramatize toda necessidade de espaço.",
      "Equilibrem profundidade com leveza, sem invalidar o estilo do outro."
    ],
    compatibilidade: 68
  },

  "capricorn-scorpio": {
    resumo:
      "Escorpião e Capricórnio criam uma amizade séria, leal e muito comprometida. É pouca fala e muito gesto.",
    combina: [
      "Ajuda concreta em crises reais",
      "Conselhos duros, porém honestos",
      "Proteção mútua contra injustiças",
      "Trabalho em equipe em objetivos importantes"
    ],
    nao_combina: [
      "Pouca verbalização de afeto",
      "Pesos emocionais acumulados",
      "Teimosia em admitir vulnerabilidades",
      "Risco de vínculo se tornar só problema, pouco prazer"
    ],
    dicas: [
      "Reservem momentos para simplesmente curtir sem pauta.",
      "Falem mais dos sentimentos, nem que seja aos poucos.",
      "Lembrem que amizade também é descanso, não só resistência."
    ],
    compatibilidade: 83
  },

  "aquarius-scorpio": {
    resumo:
      "Escorpião e Aquário constroem uma amizade complexa, desafiadora e interessante. Nem sempre é fácil, mas é inesquecível.",
    combina: [
      "Conversas profundas e fora do óbvio",
      "Interesse em entender a realidade por ângulos diferentes",
      "Lealdade quando decidem se importar",
      "Troca intensa de visões de mundo"
    ],
    nao_combina: [
      "Choque entre razão fria e emoção intensa",
      "Escorpião achando Aquário indiferente",
      "Aquário achando Escorpião controlador",
      "Dificuldade em alinhar expectativas de contato"
    ],
    dicas: [
      "Aquário: não minimize a dor do amigo.",
      "Escorpião: entenda que o outro pensa antes de sentir, é o jeito dele.",
      "Definam juntos qual é o ‘formato saudável’ dessa amizade."
    ],
    compatibilidade: 61
  },

  "pisces-scorpio": {
    resumo:
      "Escorpião e Peixes criam uma amizade intuitiva, espiritual e profunda. É uma conexão forte, mas que precisa de limites saudáveis.",
    combina: [
      "Entendimento emocional quase automático",
      "Apoio em fases sombrias e difíceis",
      "Interesse por temas psicológicos ou espirituais",
      "Lealdade e fidelidade no vínculo"
    ],
    nao_combina: [
      "Ambos absorvendo muita dor do outro",
      "Ciúmes de outras pessoas",
      "Dificuldade em dizer ‘não’ dentro da amizade",
      "Tendência à fusão emocional exagerada"
    ],
    dicas: [
      "Lembrem de cuidar de si mesmos também.",
      "Falarem sobre limites fortalece a amizade.",
      "Busquem leveza consciente, não só profundidade."
    ],
    compatibilidade: 94
  },

  // SAGITÁRIO COM...

  "sagittarius-sagittarius": {
    resumo:
      "Dois sagitarianos criam uma amizade livre, barulhenta e cheia de histórias absurdas. Difícil é levar tudo a sério.",
    combina: [
      "Viagens, rolês e aventuras",
      "Sinceridade direta e sem filtro",
      "Capacidade de rir de quase tudo",
      "Pouca cobrança de presença diária"
    ],
    nao_combina: [
      "Falta de tato em momentos sensíveis",
      "Promessas não cumpridas",
      "Sumiços longos sem explicação",
      "Pouca disposição para conversas profundas"
    ],
    dicas: [
      "Lembrem que às vezes o outro precisa de apoio mais emocional.",
      "Uma mensagem sincera de vez em quando sustenta o vínculo.",
      "Sejam honestos sobre o que conseguem e não conseguem oferecer."
    ],
    compatibilidade: 93
  },

  "capricorn-sagittarius": {
    resumo:
      "Sagitário e Capricórnio têm uma amizade didática: um ensina leveza, o outro ensina responsabilidade. Quando se respeitam, formam uma boa dupla.",
    combina: [
      "Capricórnio traz foco e estabilidade",
      "Sagitário traz humor e entusiasmo",
      "Boa troca sobre trabalho e sentido de vida",
      "Crescimento pessoal para os dois"
    ],
    nao_combina: [
      "Capricórnio achando o outro irresponsável",
      "Sagitário achando o outro pessimista",
      "Conflitos sobre compromisso x liberdade",
      "Falta de paciência com o estilo do outro"
    ],
    dicas: [
      "Capricórnio: aceite um pouco de improviso.",
      "Sagitário: mostre que pode ser confiável.",
      "Enxerguem a amizade como equilíbrio, não como disputa."
    ],
    compatibilidade: 71
  },

  "aquarius-sagittarius": {
    resumo:
      "Sagitário e Aquário formam uma amizade idealista, divertida e mentalmente estimulante. É muito ‘vamos mudar o mundo’ e também ‘vamos sumir por uns meses’.",
    combina: [
      "Conversas sobre ideias, futuro e liberdade",
      "Respeito ao espaço e individualidade",
      "Rolês diferentes do padrão",
      "Pouco julgamento de escolhas alheias"
    ],
    nao_combina: [
      "Dificuldade em lidar com emoções intensas",
      "Sumiços longos de ambos",
      "Tendência a racionalizar tudo",
      "Pouca disposição para lidar com demandas emocionais do outro"
    ],
    dicas: [
      "Lembrem que um pouco de presença concreta fortalece a amizade.",
      "Se algo for sério, avisem para o outro entrar no modo ‘escuta’.",
      "Criem formas simples de mostrar que se importam, mesmo à distância."
    ],
    compatibilidade: 95
  },

  "pisces-sagittarius": {
    resumo:
      "Peixes e Sagitário criam uma amizade inspiradora e confusa ao mesmo tempo. Um sente muito, o outro minimiza para seguir em frente.",
    combina: [
      "Sonhos compartilhados e planos viajados",
      "Histórias engraçadas e emocionantes",
      "Apoio em momentos de mudança",
      "Visão ampla de possibilidades"
    ],
    nao_combina: [
      "Sagitário sendo direto demais",
      "Peixes levando para o coração e sumindo",
      "Descompasso sobre o que é sério ou não",
      "Falta de clareza em algumas conversas"
    ],
    dicas: [
      "Sagitário: tenha mais tato nas horas certas.",
      "Peixes: pergunte antes de interpretar tudo como desinteresse.",
      "Alinhar expectativas evita frustração dos dois lados."
    ],
    compatibilidade: 76
  },

  // CAPRICÓRNIO COM...

  "capricorn-capricorn": {
    resumo:
      "Dois capricornianos constroem uma amizade de respeito, parceria e responsabilidade. Às vezes parece mais sociedade do que amizade, mas funciona.",
    combina: [
      "Ajuda em carreira, finanças e decisões sérias",
      "Lealdade forte, mesmo sem muito drama",
      "Compromisso com o que prometem",
      "Crescimento mútuo ao longo do tempo"
    ],
    nao_combina: [
      "Pouca fala sobre emoções",
      "Dificuldade em pedir ajuda emocional",
      "Ambiente às vezes sério demais",
      "Competição silenciosa por resultados"
    ],
    dicas: [
      "Se permitam momentos bobos e leves.",
      "Falarem de inseguranças também fortalece a amizade.",
      "Não transformem todo encontro em reunião de pauta."
    ],
    compatibilidade: 92
  },

  "aquarius-capricorn": {
    resumo:
      "Capricórnio e Aquário constroem uma amizade de construção e inovação. Um garante estrutura, o outro garante mudança.",
    combina: [
      "Troca forte sobre ideias e projetos",
      "Respeito pela competência do outro",
      "Possibilidade de criar coisas grandes juntos",
      "Conselhos realistas, mesmo diferentes"
    ],
    nao_combina: [
      "Capricórnio achando o amigo imprevisível",
      "Aquário achando o outro conservador demais",
      "Discussões sobre ritmo de mudança",
      "Pouca conversa sobre sentimentos profundos"
    ],
    dicas: [
      "Capricórnio: abra espaço para o novo.",
      "Aquário: reconheça o valor da experiência e estrutura.",
      "Use a diferença de estilos para equilibrar, não para competir."
    ],
    compatibilidade: 74
  },

  "capricorn-pisces": {
    resumo:
      "Capricórnio e Peixes criam uma amizade de apoio prático e emocional. Um segura, o outro acalma.",
    combina: [
      "Capricórnio ajuda a botar a vida de Peixes em ordem",
      "Peixes oferece escuta e empatia",
      "Conselhos que equilibram sonho e realidade",
      "Presença em fases difíceis"
    ],
    nao_combina: [
      "Capricórnio sendo duro demais às vezes",
      "Peixes evitando lidar com coisas concretas",
      "Mal-entendidos sobre o que é cuidado",
      "Cansaço emocional de ambos"
    ],
    dicas: [
      "Capricórnio: mostre carinho junto com o conselho.",
      "Peixes: faça sua parte no que combinarem.",
      "Transformem a amizade em espaço de maturidade e acolhimento."
    ],
    compatibilidade: 85
  },

  // AQUÁRIO COM...

  "aquarius-aquarius": {
    resumo:
      "Dois aquarianos criam uma amizade livre, cheia de ideias e um pouco desapegada. Ninguém sufoca ninguém, mas alguém pode sentir falta de mais calor.",
    combina: [
      "Respeito total ao espaço do outro",
      "Conversas inteligentes e fora da caixa",
      "Interesse por temas sociais ou futuristas",
      "Pouca cobrança de presença constante"
    ],
    nao_combina: [
      "Dificuldade em falar de emoções diretamente",
      "Sumiços longos normalizados demais",
      "Esfriar sem perceber ao longo do tempo",
      "Racionalizar dor em vez de acolher"
    ],
    dicas: [
      "Mandar um ‘pensei em você’ às vezes já muda tudo.",
      "Se algo machucar, falem com honestidade.",
      "Lembrem que vulnerabilidade também combina com liberdade."
    ],
    compatibilidade: 93
  },

  "aquarius-pisces": {
    resumo:
      "Aquário e Peixes têm uma amizade que mistura idealismo mental e emocional. É bonita, mas às vezes desencontrada.",
    combina: [
      "Interesse em ajudar pessoas ou causas",
      "Conversas profundas sobre vida e sentido",
      "Aceitação da diferença do outro",
      "Liberdade para ser autêntico"
    ],
    nao_combina: [
      "Aquário sendo lógico demais para Peixes",
      "Peixes sendo emotivo demais para Aquário",
      "Mal-entendidos por falta de comunicação clara",
      "Dúvidas sobre o lugar que a amizade ocupa"
    ],
    dicas: [
      "Traduzam o que sentem/pensam, não deixem implícito.",
      "Aceitem que o outro processa tudo de forma diferente.",
      "Criem um meio-termo entre razão e emoção na amizade."
    ],
    compatibilidade: 72
  },

  // PEIXES COM...

  "pisces-pisces": {
    resumo:
      "Dois piscianos criam uma amizade muito sensível, criativa e intuitiva. É quase um portal para outro mundo, se não esquecerem da vida real.",
    combina: [
      "Escuta amorosa e empática",
      "Imaginação fértil e criativa",
      "Apoio em momentos de crise",
      "Sensação de serem compreendidos sem muitas palavras"
    ],
    nao_combina: [
      "Fuga conjunta dos problemas concretos",
      "Dramas que se alimentam mutuamente",
      "Dificuldade em estabelecer limites",
      "Instabilidade na comunicação e presença"
    ],
    dicas: [
      "Criem pequenas rotinas e acordos para trazer pé no chão.",
      "Falem sobre limites com carinho, não com culpa.",
      "Usem a sensibilidade de vocês para se fortalecer, não só para sofrer juntos."
    ],
    compatibilidade: 90
  }
};

/**
 * Calculates compatibility between two signs based on mode (love or friendship).
 * Returns the static data if available, or calculates a deterministic fallback.
 */
export const getCompatibility = async (
  signA: SignData,
  signB: SignData,
  mode: 'love' | 'friendship'
): Promise<CompatibilityResult> => {
  // Sort by ID to ensure consistent key generation (e.g. 'aries-taurus' vs 'taurus-aries')
  // The keys in the data maps are generally 'sign1-sign2' where sign1 comes before sign2 alphabetically
  const [s1, s2] = [signA, signB].sort((a, b) => a.id.localeCompare(b.id));
  const key = `${s1.id}-${s2.id}`;
  
  const dataMap = mode === 'love' ? UNIQUE_LOVE : UNIQUE_FRIENDSHIP;
  let result = dataMap[key];

  if (result) {
    return result;
  }

  // Fallback calculation
  const score = calculateDeterministicScore(signA, signB);
  
  return {
    resumo: `A combinação entre ${signA.name} e ${signB.name} é interessante, unindo as energias de ${signA.element} e ${signB.element}.`,
    combina: ["Aprendizado mútuo", "Troca de experiências"],
    nao_combina: ["Diferenças de perspectiva", "Ajustes de ritmo"],
    dicas: ["Sejam pacientes um com o outro.", "Valorizem o que cada um traz de único."],
    compatibilidade: score
  };
};
