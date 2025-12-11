/**
 * Significados dos planetas para tooltips
 */

export const PLANET_MEANINGS: Record<string, { short: string; description: string }> = {
  'Sol': {
    short: 'Identidade e Ego',
    description: 'Representa sua essência, vitalidade e como você brilha no mundo. É o núcleo da sua personalidade.'
  },
  'Lua': {
    short: 'Emoções e Instintos',
    description: 'Governa suas emoções, necessidades internas e como você reage instintivamente. Representa o lado íntimo e emocional.'
  },
  'Mercúrio': {
    short: 'Comunicação e Mente',
    description: 'Rege sua forma de pensar, comunicar e processar informações. Influencia seu estilo de aprendizado.'
  },
  'Vênus': {
    short: 'Amor e Prazer',
    description: 'Governa relacionamentos, afeto, valores e o que você considera bonito. Mostra como você ama e se conecta.'
  },
  'Marte': {
    short: 'Ação e Energia',
    description: 'Representa sua força de vontade, coragem e como você age. É sua energia física e determinação.'
  },
  'Júpiter': {
    short: 'Expansão e Sorte',
    description: 'Planeta da sorte, crescimento e oportunidades. Mostra onde você tende a ter mais facilidade e abundância.'
  },
  'Saturno': {
    short: 'Disciplina e Limites',
    description: 'Ensina através de desafios e responsabilidades. Representa maturidade, disciplina e conquistas duradouras.'
  },
  'Urano': {
    short: 'Inovação e Mudança',
    description: 'Traz mudanças súbitas, originalidade e quebra de padrões. Representa sua individualidade única.'
  },
  'Netuno': {
    short: 'Intuição e Espiritualidade',
    description: 'Governa sonhos, intuição e conexão espiritual. Representa o misticismo e a imaginação.'
  },
  'Plutão': {
    short: 'Transformação Profunda',
    description: 'Planeta das transformações intensas e renascimentos. Mostra onde você passa por mudanças profundas.'
  }
};

export const ASCENDANT_MEANING = {
  short: 'Sua Máscara Social',
  description: 'Como você se apresenta ao mundo e a primeira impressão que causa nas pessoas. É sua personalidade externa.'
};

export const MIDHEAVEN_MEANING = {
  short: 'Carreira e Propósito',
  description: 'Representa seus objetivos de vida, carreira e como você é visto publicamente. Seu caminho profissional.'
};
