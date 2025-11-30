import { CompatibilityResult, SignData, ElementType } from '../types';

/**
 * Calculates a fixed, deterministic score for any pair of signs.
 * This ensures that Aries + Aries is always the same score.
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
    baseScore = 90; // Trine
  } else {
    // Check Compatible Elements (Fire+Air or Earth+Water)
    const fireAir = (el1 === FIRE && el2 === AIR) || (el1 === AIR && el2 === FIRE);
    const earthWater = (el1 === EARTH && el2 === WATER) || (el1 === WATER && el2 === EARTH);

    if (fireAir || earthWater) {
      baseScore = 85; // Sextile/Opposition
    } else {
      baseScore = 45; // Square/Quincunx
    }
  }

  // 3. Add Deterministic Variance (-12 to +12)
  const comboId = s1.id + s2.id;
  let hash = 0;
  for (let i = 0; i < comboId.length; i++) {
    hash = comboId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const variance = (Math.abs(hash) % 25) - 12;

  return Math.min(Math.max(baseScore + variance, 10), 99);
};

// --- TEMPLATES ---
// 3 categories (High, Medium, Low) x 2 modes (Love, Friendship) x 5 variations = 30 templates

const TEMPLATES_LOVE = {
  high: [
    {
      resumo: "{A} e {B} formam uma dupla explosiva e apaixonante. A energia flui naturalmente entre vocês, criando um laço difícil de quebrar. É o tipo de relação que inspira quem vê de fora.",
      combina: ["Comunicação quase telepática", "Valores de vida alinhados", "Química física intensa"],
      nao_combina: ["Tendência a se isolarem no mundo deles", "Falta de desafios pode gerar tédio", "Dificuldade em ver os defeitos um do outro"],
      dicas: ["Não deixem o romance cair na rotina", "Planejem viagens juntos para manter a chama"]
    },
    {
      resumo: "Um encontro de almas! {A} complementa perfeitamente a energia de {B}. Onde um falta, o outro transborda. A relação é marcada por apoio mútuo, carinho e um entendimento profundo.",
      combina: ["Respeito mútuo natural", "Objetivos de futuro semelhantes", "Apoio incondicional"],
      nao_combina: ["Podem se tornar dependentes demais", "Evitam brigas necessárias", "Excesso de idealização"],
      dicas: ["Mantenham suas individualidades vivas", "Conversem sobre finanças desde cedo"]
    },
    {
      resumo: "Pura magia. A conexão entre {A} e {B} é magnética. Vocês se entendem com um olhar. É uma relação cheia de entusiasmo, risadas e uma parceria invejável para a vida toda.",
      combina: ["Otimismo compartilhado", "Vida social ativa juntos", "Confiança sólida"],
      nao_combina: ["Impulsividade em decisões conjuntas", "Disputa sutil por atenção", "Dificuldade em lidar com rotinas chatas"],
      dicas: ["Criem rituais só de vocês", "Apoiem os sonhos individuais um do outro"]
    },
    {
      resumo: "Esta combinação tem tudo para ser duradoura e feliz. {A} traz o que {B} precisa e vice-versa. Existe um equilíbrio natural de forças que torna a convivência leve e prazerosa.",
      combina: ["Equilíbrio emocional", "Divisão justa de responsabilidades", "Admiração mútua"],
      nao_combina: ["Risco de acomodação", "Falta de espontaneidade às vezes", "Ciúmes bobos sem motivo"],
      dicas: ["Façam surpresas um para o outro", "Nunca durmam brigados"]
    },
    {
      resumo: "Amor de novela. {A} e {B} vivem uma sintonia fina. A atração é forte, mas a amizade que sustenta o romance é ainda maior. Vocês são parceiros no crime e na vida.",
      combina: ["Lealdade inquebrável", "Humor compatível", "Visão de mundo similar"],
      nao_combina: ["Dificuldade em dizer não um ao outro", "Podem gastar demais juntos", "Excesso de proteção"],
      dicas: ["Tenham hobbies separados também", "Sejam honestos sobre medos e inseguranças"]
    }
  ],
  medium: [
    {
      resumo: "{A} e {B} são diferentes, mas isso é o tempero. A atração vem justamente do mistério. É uma relação de aprendizado constante, onde um ensina o outro a ver o mundo de forma nova.",
      combina: ["Atração física forte", "Aprendizado constante", "Nunca falta assunto"],
      nao_combina: ["Ritmos de vida diferentes", "Teimosia de ambos os lados", "Mal-entendidos na comunicação"],
      dicas: ["Tenham paciência com as diferenças", "Ouçam mais do que falam"]
    },
    {
      resumo: "Uma montanha-russa de emoções. {A} e {B} oscilam entre momentos de pura paixão e estranhamento. Se souberem rir das diferenças, podem construir algo muito sólido e divertido.",
      combina: ["Momentos intensos e inesquecíveis", "Paixão avassaladora", "Quebra de monotonia"],
      nao_combina: ["Dramas desnecessários", "Choque de egos", "Instabilidade emocional"],
      dicas: ["Contem até dez antes de discutir", "Foquem no que une, não no que separa"]
    },
    {
      resumo: "Existe amor, mas requer trabalho. {A} tende a puxar para um lado, {B} para o outro. O segredo aqui é o compromisso. Se ambos quiserem, essa 'fricção' gera calor e luz.",
      combina: ["Crescimento pessoal forçado", "Lealdade quando decididos", "Proteção mútua"],
      nao_combina: ["Lutas por poder", "Diferentes formas de expressar afeto", "Cobranças excessivas"],
      dicas: ["Aceitem que não vão mudar o outro", "Dividam tarefas claramente"]
    },
    {
      resumo: "{A} e {B} funcionam bem quando têm um objetivo comum. O dia a dia pode ter atritos, mas a parceria em grandes projetos é forte. É um amor que precisa de maturidade.",
      combina: ["Força para conquistar objetivos", "Estabilidade material", "Resiliência"],
      nao_combina: ["Frieza em momentos de crise", "Competição interna", "Falta de romantismo às vezes"],
      dicas: ["Marquem encontros românticos semanais", "Elogiem mais um ao outro"]
    },
    {
      resumo: "Opostos se atraem? Aqui sim. {A} tem o que falta em {B}. O começo pode ser estranho, mas com o tempo vocês percebem que formam uma equipe imbatível se baixarem a guarda.",
      combina: ["Complementariedade", "Novas experiências", "Descoberta de novos mundos"],
      nao_combina: ["Julgamentos precipitados", "Insegurança com o jeito do outro", "Dificuldade de adaptação"],
      dicas: ["Sejam curiosos sobre o mundo do outro", "Respeitem o espaço individual"]
    }
  ],
  low: [
    {
      resumo: "Um desafio cármico. {A} e {B} falam línguas diferentes. A atração pode ser inicial, mas manter a harmonia exige esforço hercúleo. Vocês testam a paciência um do outro.",
      combina: ["Aprendizado sobre tolerância", "Momentos surpreendentes", "Paixão por desafios"],
      nao_combina: ["Valores opostos", "Comunicação travada", "Diferentes necessidades emocionais"],
      dicas: ["Evitem tentar mudar o parceiro", "Tenham muita, muita paciência"]
    },
    {
      resumo: "{A} quer ir para o norte, {B} para o sul. A relação é marcada por desencontros. Não é impossível, mas exige que ambos abram mão de muita coisa para funcionar.",
      combina: ["Intensidade nas reconciliações", "Quebra de paradigmas", "Força de vontade"],
      nao_combina: ["Rotina incompatível", "Brigas constantes por bobagens", "Sensação de não ser compreendido"],
      dicas: ["Escolham suas batalhas", "Procurem terapia de casal ou mediação"]
    },
    {
      resumo: "Fogo e Água? Terra e Ar? A mistura aqui é instável. {A} pode achar {B} complicado demais, e {B} pode achar {A} superficial. É preciso muito amor para superar a barreira da incompreensão.",
      combina: ["Atração pelo proibido/difícil", "Momentos de epifania", "Mudança de perspectiva"],
      nao_combina: ["Exaustão emocional", "Falta de apoio prático", "Desconfiança"],
      dicas: ["Sejam claros como água sobre sentimentos", "Não esperem que o outro adivinhe nada"]
    },
    {
      resumo: "É como misturar óleo e água. {A} e {B} vivem em frequências diferentes. Para dar certo, vocês precisam criar um 'terceiro mundo' onde as regras de ambos sejam respeitadas.",
      combina: ["Inovação na convivência", "Respeito à distância", "Independência total"],
      nao_combina: ["Solidão a dois", "Falta de intimidade profunda", "Interesses divergentes"],
      dicas: ["Foquem em hobbies em comum, se houver", "Respeitem o silêncio do outro"]
    },
    {
      resumo: "Uma relação de provação. {A} testa os limites de {B}. Pode haver uma química sexual estranha, mas a convivência diária é um campo minado. Exige evolução espiritual de ambos.",
      combina: ["Transformação radical", "Intensidade", "Quebra de ego"],
      nao_combina: ["Feridas emocionais frequentes", "Jogos de manipulação", "Instabilidade"],
      dicas: ["Pratiquem o perdão diariamente", "Estabeleçam limites claros"]
    }
  ]
};

const TEMPLATES_FRIENDSHIP = {
  high: [
    {
      resumo: "{A} e {B} são aquela dupla inseparável. A amizade flui sem esforço. Vocês riem das mesmas coisas e se entendem sem precisar falar. Parceiros para qualquer aventura.",
      combina: ["Humor idêntico", "Confiança total", "Aventuras épicas"],
      nao_combina: ["Podem se meter em confusão juntos", "Excluem outros amigos", "Fofoca excessiva"],
      dicas: ["Mantenham o grupo aberto a outros", "Planejem uma viagem de amigos"]
    },
    {
      resumo: "Amigos para a vida toda. {A} é o porto seguro de {B}. Uma amizade baseada em lealdade, conselhos honestos e muito apoio nos momentos difíceis. Irmãos de alma.",
      combina: ["Lealdade absoluta", "Conselhos sábios", "Apoio nas crises"],
      nao_combina: ["Ciúmes de outros amigos", "Protetorismo exagerado", "Cobrança de atenção"],
      dicas: ["Celebrem as vitórias um do outro", "Estejam lá nos dias ruins"]
    },
    {
      resumo: "A energia de {A} e {B} juntas é contagiante. Vocês são a alma da festa. Uma amizade dinâmica, cheia de planos, projetos e muita diversão. Tédio não existe aqui.",
      combina: ["Criatividade explosiva", "Vida social agitada", "Incentivo mútuo"],
      nao_combina: ["Competição por destaque", "Impulsividade", "Falta de profundidade às vezes"],
      dicas: ["Criem um projeto juntos", "Sejam honestos quando algo incomodar"]
    },
    {
      resumo: "Uma conexão intelectual poderosa. {A} e {B} adoram conversar por horas. Vocês trocam ideias, livros e visões de mundo. É uma amizade que faz ambos crescerem mentalmente.",
      combina: ["Conversas profundas", "Estímulo intelectual", "Respeito às ideias"],
      nao_combina: ["Debates que viram brigas", "Frieza emocional", "Excesso de racionalidade"],
      dicas: ["Façam atividades culturais juntos", "Não levem debates para o lado pessoal"]
    },
    {
      resumo: "Parceria sólida como rocha. {A} e {B} podem contar um com o outro para o que der e vier. Não precisam se falar todo dia para saber que a amizade continua forte.",
      combina: ["Estabilidade", "Ajuda prática", "Sem frescuras"],
      nao_combina: ["Teimosia em admitir erros", "Rotina pode afastar", "Falta de novidades"],
      dicas: ["Marquem encontros regulares", "Lembrem dos aniversários"]
    }
  ],
  medium: [
    {
      resumo: "{A} e {B} são bons colegas, mas com ressalvas. Vocês se divertem em grupo, mas sozinhos o assunto pode acabar. É uma amizade de momentos específicos.",
      combina: ["Bons para festas", "Interesses superficiais comuns", "Sem cobranças"],
      nao_combina: ["Falta de intimidade", "Valores diferentes", "Distância natural"],
      dicas: ["Foquem na diversão leve", "Não esperem profundidade demais"]
    },
    {
      resumo: "Amizade de contrastes. {A} agita, {B} acalma (ou vice-versa). Vocês aprendem muito um com o outro, mas precisam respeitar o ritmo diferente de cada um para não estressar.",
      combina: ["Equilíbrio de energias", "Novas perspectivas", "Ajuda mútua"],
      nao_combina: ["Impaciência", "Julgamento de escolhas", "Ritmos opostos"],
      dicas: ["Respeitem o 'não' do outro", "Valorizem o que o outro ensina"]
    },
    {
      resumo: "Uma amizade situacional. {A} e {B} funcionam bem no trabalho ou na academia, mas fora dali o mundo é outro. Tudo bem, nem todo amigo precisa ser irmão.",
      combina: ["Objetivos práticos", "Cooperação", "Respeito profissional"],
      nao_combina: ["Mundos muito distintos", "Falta de assunto pessoal", "Desconexão emocional"],
      dicas: ["Mantenham a relação leve", "Não forcem intimidade"]
    },
    {
      resumo: "{A} e {B} têm altos e baixos. Ora estão super próximos, ora somem. É uma amizade cíclica, movida por interesses momentâneos ou fases da vida.",
      combina: ["Reencontros animados", "Flexibilidade", "Sem amarras"],
      nao_combina: ["Inconstância", "Falta de confiabilidade", "Sumicos repentinos"],
      dicas: ["Aceitem a natureza livre da amizade", "Aproveitem quando estiverem juntos"]
    },
    {
      resumo: "Respeito mútuo, mas caminhos diferentes. {A} admira {B}, mas não entende suas escolhas. É uma amizade distante, cordial e educada.",
      combina: ["Polidez", "Networking", "Admiração distante"],
      nao_combina: ["Falta de calor humano", "Críticas veladas", "Formalidade excessiva"],
      dicas: ["Sejam cordiais sempre", "Usem a rede de contatos um do outro"]
    }
  ],
  low: [
    {
      resumo: "{A} e {B} dificilmente seriam amigos espontaneamente. As personalidades chocam. Se são amigos, é porque a vida forçou a convivência. Requer diplomacia.",
      combina: ["Desafio social", "Quebra de bolha", "Tolerância"],
      nao_combina: ["Atritos constantes", "Mal-entendidos", "Irritação gratuita"],
      dicas: ["Mantenham conversas breves", "Evitem polêmicas"]
    },
    {
      resumo: "Água e óleo. {A} não entende o humor de {B}. O que um acha engraçado, o outro acha ofensivo. Melhor manter uma distância segura para evitar conflitos.",
      combina: ["Nenhuma óbvia", "Talvez um inimigo comum", "Distância saudável"],
      nao_combina: ["Humor incompatível", "Valores éticos distintos", "Desconforto"],
      dicas: ["Sejam apenas educados", "Não tentem forçar a barra"]
    },
    {
      resumo: "Competição velada. {A} e {B} tendem a competir em vez de colaborar. Há uma tensão no ar quando estão juntos, como se um quisesse provar ser melhor que o outro.",
      combina: ["Estímulo competitivo", "Ambição", "Alerta constante"],
      nao_combina: ["Inveja branca", "Comparações", "Falsidade potencial"],
      dicas: ["Evitem comparar conquistas", "Celebrem o sucesso alheio com sinceridade"]
    },
    {
      resumo: "Desconexão total. {A} fala grego, {B} fala japonês. Vocês não têm nada em comum. Tentativas de aproximação costumam ser constrangedoras e silênciosas.",
      combina: ["Silêncio", "Indiferença pacífica", "Espaço"],
      nao_combina: ["Tédio mortal", "Constrangimento", "Falta de empatia"],
      dicas: ["Aceitem que não bateu", "Cumprimentem e sigam em frente"]
    },
    {
      resumo: "Choque de valores. {A} desaprova o estilo de vida de {B}. É difícil ser amigo de quem você fundamentalmente discorda. Melhor cada um no seu canto.",
      combina: ["Definição de identidade própria", "Conviction", "Limites"],
      nao_combina: ["Julgamento moral", "Tentativa de doutrinação", "Desrespeito"],
      dicas: ["Evitem tópicos sensíveis", "Respeitem a existência do outro de longe"]
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