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

// --- TEMPLATES (2 Detailed Variations per category) ---

const TEMPLATES_LOVE = {
  high: [
    {
      resumo: "Um encontro estelar raro! {A} e {B} possuem uma sinergia que transcende o físico. A energia vibrante de um alimenta a alma do outro, criando um ciclo virtuoso de admiração e desejo. É o tipo de relação onde o silêncio não incomoda e a conversa nunca acaba. Vocês constroem impérios juntos e se apoiam nas quedas com a mesma intensidade.",
      combina: ["Comunicação intuitiva e quase telepática", "Visão de futuro e ambições alinhadas", "Química física avassaladora e constante"],
      nao_combina: ["Risco de se isolarem do mundo exterior", "Dificuldade em lidar com críticas externas", "Idealização excessiva que pode gerar frustração"],
      dicas: ["Cultivem amizades fora do relacionamento para manter o frescor", "Celebrem pequenas vitórias do dia a dia, não apenas as grandes conquistas"]
    },
    {
      resumo: "Almas gêmeas em potencial. A conexão entre {A} e {B} é marcada por uma harmonia natural, como se vocês já se conhecessem de outras vidas. {A} traz exatamente a peça que faltava no quebra-cabeça de {B}, e vice-versa. Existe um equilíbrio perfeito entre dar e receber, tornando a convivência leve, divertida e profundamente segura emocionalmente.",
      combina: ["Segurança emocional inabalável", "Respeito profundo pelas individualidades", "Capacidade natural de resolver conflitos sem drama"],
      nao_combina: ["Podem cair na acomodação pela falta de conflitos", "Tendência a adiar decisões difíceis", "Possessividade disfarçada de cuidado"],
      dicas: ["Façam planos de longo prazo (5, 10 anos) juntos", "Mantenham a espontaneidade com surpresas ocasionais"]
    }
  ],
  medium: [
    {
      resumo: "Uma atração magnética baseada no mistério. {A} e {B} são fascinados pelas diferenças um do outro. É uma relação de aprendizado intenso: {A} ensina {B} a ver o mundo por uma nova ótica. O desafio aqui é transformar a paixão inicial em uma parceria prática, mas o potencial de crescimento pessoal para ambos é gigantesco se houver paciência.",
      combina: ["Atração física baseada na curiosidade", "Troca intelectual rica e desafiadora", "Momentos de paixão intensa e inesquecível"],
      nao_combina: ["Ritmos de vida e prioridades diferentes", "Teimosia em ceder nos pequenos detalhes", "Mal-entendidos causados por linguagens de amor distintas"],
      dicas: ["Pratiquem a escuta ativa sem tentar 'consertar' o outro", "Encontrem um hobby novo que nenhum dos dois domine"]
    },
    {
      resumo: "Fogo e gelo, razão e emoção. A relação entre {A} e {B} é uma montanha-russa emocionante. Vocês se desafiam constantemente, o que mantém a chama viva, mas pode cansar a longo prazo. Se conseguirem alinhar os egos e focar no amor que sentem, formam uma dupla poderosa capaz de conquistar qualquer objetivo, unindo a força de um com a estratégia do outro.",
      combina: ["Complementaridade de habilidades (um planeja, o outro executa)", "Lealdade feroz quando estão unidos", "Nunca existe tédio na rotina"],
      nao_combina: ["Disputas de poder e controle", "Dificuldade em pedir desculpas sinceramente", "Oscilação entre amor profundo e irritação"],
      dicas: ["Dividam claramente as responsabilidades da vida a dois", "Lembrem-se que vocês jogam no mesmo time, não um contra o outro"]
    }
  ],
  low: [
    {
      resumo: "Um desafio de evolução espiritual. {A} e {B} vibram em frequências muito diferentes. O que {A} valoriza, {B} pode considerar irrelevante. Para essa relação florescer, será necessário um esforço consciente de tradução: vocês precisam aprender a língua emocional do outro do zero. É difícil, mas se o amor for verdadeiro, será a relação que mais transformará quem vocês são.",
      combina: ["Oportunidade de quebrar preconceitos pessoais", "Momentos de surpresa genuína", "Paixão movida pelo desafio da conquista"],
      nao_combina: ["Choque constante de valores fundamentais", "Sensação frequente de não ser compreendido", "Rotinas e hábitos incompatíveis"],
      dicas: ["Não tentem mudar a essência do parceiro, aceitem ou deixem ir", "Busquem mediação ou terapia para melhorar a comunicação"]
    },
    {
      resumo: "Atração fatal com riscos. {A} e {B} podem sentir uma química explosiva, mas a convivência diária é um campo minado. {A} pode achar {B} intenso demais ou distante demais (e vice-versa). A relação tende a viver de altos extremos e baixos dolorosos. O segredo para sobreviver aqui é o respeito absoluto pelo espaço e pelas diferenças, criando 'regras de convivência' claras.",
      combina: ["Intensidade emocional e sexual", "Quebra total de monotonia", "Força para superar crises externas juntos"],
      nao_combina: ["Desgaste emocional por brigas repetitivas", "Falta de apoio prático no dia a dia", "Desconfiança ou insegurança permanente"],
      dicas: ["Estabeleçam limites claros sobre o que é inaceitável", "Foquem em atividades de lazer para aliviar a tensão"]
    }
  ]
};

const TEMPLATES_FRIENDSHIP = {
  high: [
    {
      resumo: "Irmãos de outra mãe! {A} e {B} possuem aquela conexão instantânea onde um completa a frase do outro. A lealdade aqui é inquestionável. Vocês funcionam como um time perfeito: quando {A} tem uma ideia maluca, {B} já está pronto para executá-la (ou vice-versa). É aquela amizade para a vida toda, que resiste ao tempo e à distância.",
      combina: ["Humor idêntico e piadas internas infinitas", "Defesa mútua contra qualquer ameaça externa", "Capacidade de ficarem em silêncio juntos sem constrangimento"],
      nao_combina: ["Podem acabar excluindo outras pessoas do grupo", "Risco de alimentarem os maus hábitos um do outro", "Dificuldade em serem duros quando a verdade dói"],
      dicas: ["Incentivem o crescimento profissional um do outro", "Planejem uma viagem anual sagrada só de vocês"]
    },
    {
      resumo: "A dupla dinâmica. A energia de {A} combinada com a de {B} ilumina qualquer ambiente. Vocês se estimulam criativamente e intelectualmente. É uma amizade produtiva, cheia de planos, projetos e sonhos compartilhados. Vocês são os maiores fãs um do outro e celebram cada vitória como se fosse própria.",
      combina: ["Inspiração mútua constante", "Apoio incondicional em momentos de crise", "Sinceridade brutal, mas amorosa"],
      nao_combina: ["Competição sutil por atenção em grupos sociais", "Promessas grandiosas que às vezes não se cumprem", "Momentos de carência excessiva"],
      dicas: ["Criem um projeto ou hobby colaborativo", "Estejam presentes fisicamente nos momentos difíceis, não só por mensagem"]
    }
  ],
  medium: [
    {
      resumo: "Amigos de momentos. {A} e {B} se dão super bem em contextos específicos (festas, trabalho, academia), mas podem faltar assuntos profundos na intimidade. É uma relação leve, sem cobranças, ideal para relaxar e esquecer os problemas. Vocês se divertem juntos, mas sabem que têm visões de mundo distintas.",
      combina: ["Ótimos parceiros para diversão e lazer", "Respeito pelas diferenças sem tentar mudar o outro", "Ajuda prática em questões do cotidiano"],
      nao_combina: ["Falta de profundidade emocional nas conversas", "Valores morais ou éticos que às vezes colidem", "Distanciamento natural quando a rotina muda"],
      dicas: ["Mantenham a leveza, não cobrem profundidade onde não há", "Foquem nas atividades que vocês amam fazer juntos"]
    },
    {
      resumo: "O professor e o aluno. Em momentos diferentes, {A} ensina {B}, e {B} ensina {A}. É uma amizade baseada em troca de experiências, mas que exige paciência. O jeito de ser de um pode, às vezes, irritar o outro, mas no fundo existe admiração. É aquele amigo que você procura quando precisa de uma opinião totalmente diferente da sua.",
      combina: ["Perspectivas novas para velhos problemas", "Honestidade intelectual", "Crescimento pessoal através do contraste"],
      nao_combina: ["Julgamentos silenciosos sobre as escolhas do outro", "Impaciência com o ritmo alheio", "Disputa por quem tem a razão"],
      dicas: ["Pratiquem a empatia ativa", "Valorizem a honestidade, mesmo que doa"]
    }
  ],
  low: [
    {
      resumo: "Diplomacia necessária. {A} e {B} são como óleo e água: não se misturam naturalmente. A amizade pode existir por circunstância (trabalho, família), mas exige esforço constante. Vocês tendem a interpretar mal as intenções um do outro. O segredo é manter a educação e focar em objetivos comuns, evitando entrar em temas polêmicos ou muito pessoais.",
      combina: ["Oportunidade de exercitar a tolerância", "Possibilidade de alianças estratégicas pontuais", "Aprendizado sobre como lidar com pessoas difíceis"],
      nao_combina: ["Fofocas ou mal-entendidos frequentes", "Sensação de pisar em ovos", "Energia drenada após muito tempo juntos"],
      dicas: ["Mantenham a relação estritamente cordial", "Não esperem validação emocional deste amigo"]
    },
    {
      resumo: "Mundos em colisão. O estilo de vida de {A} pode parecer absurdo para {B}, e vice-versa. Tentativas de aproximação forçada geralmente resultam em constrangimento. Se precisarem conviver, o melhor é o respeito distante. Aceitem que vocês operam em sintonias diferentes e que está tudo bem, nem todo mundo precisa ser melhor amigo.",
      combina: ["Definição clara de limites pessoais", "Independência total", "Nenhuma expectativa frustrada"],
      nao_combina: ["Críticas ao modo de viver do outro", "Competição desnecessária", "Falta total de empatia mútua"],
      dicas: ["Evitem dar conselhos não solicitados", "Respeitem o espaço vital um do outro"]
    }
  ]
};

export const getCompatibility = async (
  signA: SignData, 
  signB: SignData,
  mode: 'love' | 'friendship' = 'love'
): Promise<CompatibilityResult> => {
  
  // 1. Calculate Score (Deterministic)
  const score = calculateDeterministicScore(signA, signB);

  // 2. Determine Category
  let category: 'high' | 'medium' | 'low' = 'low';
  if (score >= 80) category = 'high';
  else if (score >= 50) category = 'medium';

  // 3. Select Template Array
  const templateSource = mode === 'love' ? TEMPLATES_LOVE : TEMPLATES_FRIENDSHIP;
  const templates = templateSource[category];

  // 4. Select Random Variation
  // We want randomness here so users get different texts for the same score on retries
  const randomIndex = Math.floor(Math.random() * templates.length);
  const selectedTemplate = templates[randomIndex];

  // 5. Replace Placeholders
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