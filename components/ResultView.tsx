
import React, { useEffect, useState, useRef } from 'react';
import { CompatibilityResult, SignData } from '../types';
import { APP_LOGO, PORTUGUESE_NAMES, DEFAULT_BACKGROUND, BACKGROUND_URLS } from '../constants';

interface ResultViewProps {
  result: CompatibilityResult;
  signA: SignData;
  signB: SignData;
  mode: 'love' | 'friendship';
  onReset: () => void;
  userEmail?: string;
}

const ResultView: React.FC<ResultViewProps> = ({ result, signA, signB, mode, onReset, userEmail }) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bgImage, setBgImage] = useState<string>(DEFAULT_BACKGROUND);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Detectar iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    // Determine dynamic background image
    const determineBackgroundImage = () => {
      const sortedSigns = [signA, signB].sort((a, b) => {
        const nameA = PORTUGUESE_NAMES[a.id];
        const nameB = PORTUGUESE_NAMES[b.id];
        return nameA.localeCompare(nameB);
      });

      const name1 = PORTUGUESE_NAMES[sortedSigns[0].id];
      const name2 = PORTUGUESE_NAMES[sortedSigns[1].id];
      const key = `${name1}x${name2}`;

      return BACKGROUND_URLS[key] || DEFAULT_BACKGROUND;
    };

    setBgImage(determineBackgroundImage());

    // Animate percentage
    let start = 0;
    const end = result.compatibilidade;
    const duration = 1500;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedPercent(end);
        clearInterval(timer);
      } else {
        setAnimatedPercent(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [result.compatibilidade, signA, signB]);

  // Determine color based on percentage
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Flip logic
  const nameA = PORTUGUESE_NAMES[signA.id];
  const nameB = PORTUGUESE_NAMES[signB.id];

  const extractFileNames = (url: string): [string, string] | null => {
    const match = url.match(/\/([A-Z]+)x([A-Z]+)_/);
    if (match) {
      return [match[1], match[2]];
    }
    return null;
  };

  const fileNames = extractFileNames(bgImage);
  let userSelectedInFileOrder = false;
  if (fileNames) {
    const [fileFirst, fileSecond] = fileNames;
    userSelectedInFileOrder = (nameA === fileFirst && nameB === fileSecond);
  }

  const isAquariusPisces = (signA.id === 'aquarius' && signB.id === 'pisces') || (signA.id === 'pisces' && signB.id === 'aquarius');
  const isAriesLeo = (signA.id === 'aries' && signB.id === 'leo') || (signA.id === 'leo' && signB.id === 'aries');
  const isExceptionPair = isAquariusPisces || isAriesLeo;

  let shouldFlipBackground;
  if (isExceptionPair) {
    shouldFlipBackground = userSelectedInFileOrder;
  } else {
    shouldFlipBackground = !userSelectedInFileOrder;
  }

  // Gerar imagem como canvas
  const generateImage = async (): Promise<{ canvas: HTMLCanvasElement; blob: Blob } | null> => {
    const element = document.getElementById('share-card');
    const html2canvas = (window as any).html2canvas;

    if (!element || !html2canvas) {
      return null;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 1,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 1080,
        height: 1920,
        windowWidth: 1080,
        windowHeight: 1920,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            resolve({ canvas, blob });
          } else {
            resolve(null);
          }
        }, 'image/png');
      });
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      return null;
    }
  };

  // Download function - com suporte iOS
  const handleDownloadCard = async () => {
    setIsGenerating(true);

    try {
      const result = await generateImage();

      if (!result) {
        alert("Não foi possível gerar a imagem.");
        setIsGenerating(false);
        return;
      }

      const { canvas, blob } = result;

      if (isIOS) {
        // No iOS, abre modal com a imagem para o usuário salvar manualmente
        const imageUrl = canvas.toDataURL('image/png');
        setGeneratedImageUrl(imageUrl);
        setShowImageModal(true);
      } else {
        // No desktop/Android, faz download direto
        const link = document.createElement('a');
        link.download = `SignosCombinados-${signA.name}-${signB.name}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error("Erro ao gerar card:", error);
      alert("Não foi possível gerar a imagem.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Share functions - com imagem
  const shareText = `${signA.name} + ${signB.name} = ${result.compatibilidade}% de compatibilidade! 💫 Descubra a sua em signosanimados.com.br`;
  const shareUrl = 'https://signosanimados.com.br';

  const handleNativeShare = async () => {
    setIsGenerating(true);

    try {
      const result = await generateImage();

      if (result && navigator.canShare) {
        const { blob } = result;
        const file = new File([blob], `SignosCombinados-${signA.name}-${signB.name}.png`, { type: 'image/png' });

        // Verificar se pode compartilhar arquivos
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Signos Combinados',
            text: shareText,
          });
          setIsGenerating(false);
          return;
        }
      }

      // Fallback: compartilhar só texto
      if (navigator.share) {
        await navigator.share({
          title: 'Signos Combinados',
          text: shareText,
          url: shareUrl,
        });
      } else {
        setShowShareMenu(true);
      }
    } catch (err: any) {
      // Se o usuário cancelou, não mostra erro
      if (err.name !== 'AbortError') {
        console.log('Share error:', err);
        setShowShareMenu(true);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = async () => {
    // Para WhatsApp, gerar imagem e mostrar modal para salvar, depois compartilhar texto
    setIsGenerating(true);

    try {
      const result = await generateImage();
      if (result) {
        const imageUrl = result.canvas.toDataURL('image/png');
        setGeneratedImageUrl(imageUrl);
        setShowImageModal(true);
        setShowShareMenu(false);

        // Após um delay, abrir WhatsApp com o texto
        setTimeout(() => {
          const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
          window.open(url, '_blank');
        }, 500);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText + ' ' + shareUrl);
    alert('Texto copiado! Cole onde quiser compartilhar.');
  };

  const tipsTitle = mode === 'love' ? 'Dicas para o Casal' : 'Dicas para a Amizade';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-8">

      {/* HERO SECTION - Imagem de Fundo com Resultado */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl">
        {/* Background Image - Alinhado ao topo */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt="Background"
            className="w-full h-full object-cover object-top"
            style={{ transform: shouldFlipBackground ? 'scaleX(-1)' : 'none' }}
            crossOrigin="anonymous"
            onError={(e) => { e.currentTarget.src = DEFAULT_BACKGROUND; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        </div>

        {/* Content Over Image */}
        <div className="relative z-10 p-6 md:p-10 min-h-[500px] md:min-h-[600px] flex flex-col justify-between">

          {/* Top - TikTok Badge */}
          <div className="flex justify-center">
            <a
              href="https://www.tiktok.com/@signosanimadosoficial"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full text-white/80 text-xs font-medium hover:bg-black/60 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              @signosanimadosoficial
            </a>
          </div>

          {/* Center - Signs and Score */}
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            {/* Mode Badge */}
            <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6 ${
              mode === 'love'
                ? 'bg-pink-500/30 text-pink-200 border border-pink-400/30'
                : 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/30'
            }`}>
              {mode === 'love' ? '❤️ Amor' : '🤝 Amizade'}
            </div>

            {/* Signs Row */}
            <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
              {/* Sign A */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 p-2 shadow-lg">
                  <img src={signA.icon} alt={signA.name} className="w-full h-full object-contain drop-shadow-lg" crossOrigin="anonymous" />
                </div>
                <span className="text-white font-bold text-sm md:text-lg uppercase tracking-wide drop-shadow-lg">{signA.name}</span>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center">
                <span className={`text-6xl md:text-8xl font-black font-mono ${getScoreColor(result.compatibilidade)} drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]`}>
                  {animatedPercent}
                </span>
                <span className={`text-2xl md:text-3xl font-bold ${getScoreColor(result.compatibilidade)}`}>%</span>
              </div>

              {/* Sign B */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 p-2 shadow-lg">
                  <img src={signB.icon} alt={signB.name} className="w-full h-full object-contain drop-shadow-lg" crossOrigin="anonymous" />
                </div>
                <span className="text-white font-bold text-sm md:text-lg uppercase tracking-wide drop-shadow-lg">{signB.name}</span>
              </div>
            </div>

            {/* Summary */}
            <p className="text-white/90 text-center text-lg md:text-xl font-light italic max-w-2xl px-4 drop-shadow-lg">
              "{result.resumo}"
            </p>
          </div>

          {/* Bottom - Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownloadCard}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="animate-spin h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full"></span>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              )}
              {isGenerating ? 'Gerando...' : 'Baixar Imagem'}
            </button>

            <button
              onClick={handleNativeShare}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              )}
              Compartilhar
            </button>
          </div>
        </div>
      </div>

      {/* Modal para salvar imagem (iOS) */}
      {showImageModal && generatedImageUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
          <div className="bg-slate-900 rounded-2xl p-4 w-full max-w-sm border border-slate-700" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-3 text-center">Salvar Imagem</h3>

            <p className="text-slate-400 text-xs text-center mb-4">
              {isIOS ? 'Segure na imagem e selecione "Salvar Imagem"' : 'Clique com botão direito e "Salvar imagem como..."'}
            </p>

            <div className="rounded-lg overflow-hidden mb-4 bg-black">
              <img
                src={generatedImageUrl}
                alt="Imagem para compartilhar"
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>

            <button
              onClick={() => setShowImageModal(false)}
              className="w-full py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Share Menu Modal */}
      {showShareMenu && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowShareMenu(false)}>
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4 text-center">Compartilhar</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* WhatsApp */}
              <button onClick={handleWhatsAppShare} disabled={isGenerating} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <span className="text-white text-xs font-medium">WhatsApp</span>
              </button>

              {/* Twitter/X */}
              <button onClick={handleTwitterShare} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center border border-slate-600">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </div>
                <span className="text-white text-xs font-medium">Twitter</span>
              </button>

              {/* Copy Link */}
              <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                </div>
                <span className="text-white text-xs font-medium">Copiar</span>
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
              <p className="text-slate-300 text-xs text-center">
                📱 <strong>Dica:</strong> Clique em "Baixar Imagem" primeiro, depois compartilhe a imagem salva no Instagram, TikTok ou Stories!
              </p>
            </div>

            <button
              onClick={() => setShowShareMenu(false)}
              className="w-full py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Pros */}
        <div className="glass rounded-2xl p-6 border-l-4 border-l-emerald-500">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </span>
            O que Combina
          </h3>
          <ul className="space-y-3">
            {result.combina.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="glass rounded-2xl p-6 border-l-4 border-l-red-500">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-red-500/20 text-red-400 p-1.5 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </span>
            Desafios
          </h3>
          <ul className="space-y-3">
            {result.nao_combina.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className="glass rounded-2xl p-6 border-l-4 border-l-indigo-500 md:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-400 p-1.5 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </span>
            {tipsTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.dicas.map((item, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4 text-slate-300 text-sm border border-slate-700/50">
                "{item}"
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Combination Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-slate-800 text-white font-bold rounded-full hover:bg-slate-700 transition-colors shadow-lg border border-slate-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Nova Combinação
        </button>
      </div>

      {/* HIDDEN SHARE CARD (1080x1920) */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <div
          id="share-card"
          className="flex flex-col items-center p-0 relative"
          style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: -50,
              width: '1080px',
              height: '1920px',
              minWidth: '1080px',
              minHeight: '1920px',
              boxSizing: 'border-box',
              fontFamily: 'sans-serif',
              backgroundColor: '#000'
          }}
        >
            {/* LAYER 1: Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
               <img
                 src={bgImage}
                 crossOrigin="anonymous"
                 style={{
                   width: '100%',
                   height: '100%',
                   objectFit: 'cover',
                   objectPosition: 'top',
                   transform: shouldFlipBackground ? 'scaleX(-1)' : 'none'
                 }}
                 onError={(e) => {
                   e.currentTarget.src = DEFAULT_BACKGROUND;
                 }}
               />
               <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* LAYER 2: Content */}
            <div className="relative z-10 w-full h-full flex flex-col items-center">

                {/* Header / Logo Section */}
                <div className="flex flex-col items-center gap-4 mt-20 z-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_50px_rgba(99,102,241,0.5)] border-4 border-white/20">
                        <img src={APP_LOGO} crossOrigin="anonymous" className="w-full h-full object-cover rounded-full" onError={(e) => {e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerText='AM'}}/>
                    </div>
                    <h1 className="text-3xl font-bold tracking-[0.1em] text-white font-mono uppercase mt-6 drop-shadow-md">
                        TikTok: @signosanimadosoficial
                    </h1>
                </div>

                {/* Main Content Container */}
                <div
                  className="flex-1 flex flex-col justify-center items-center w-full z-10 mt-10"
                  style={{ filter: 'drop-shadow(0px 0px 10px rgba(0,0,0,0.5))' }}
                >
                    {/* Horizontal Layout: Sign A - Score - Sign B */}
                    <div className="flex flex-row items-center justify-center gap-2 w-full px-8">

                        {/* Sign A */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-64 h-64 flex items-center justify-center">
                              <img src={signA.icon} alt={signA.name} className="w-64 h-64 object-cover rounded-full drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] border-4 border-white/10" crossOrigin="anonymous" />
                            </div>
                            <span className="text-3xl font-bold text-white uppercase tracking-wide text-center text-shadow-lg whitespace-nowrap">{signA.name}</span>
                        </div>

                        {/* Center Score Block */}
                        <div className="flex flex-col items-center justify-center mx-2 gap-4">
                            <div className="flex items-baseline">
                                 <span className={`text-[9rem] leading-none font-bold font-mono ${getScoreColor(result.compatibilidade)} drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]`}>
                                    {result.compatibilidade}
                                 </span>
                                 <span className={`text-6xl font-bold ${getScoreColor(result.compatibilidade)}`}>%</span>
                            </div>
                        </div>

                        {/* Sign B */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-64 h-64 flex items-center justify-center">
                              <img src={signB.icon} alt={signB.name} className="w-64 h-64 object-cover rounded-full drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] border-4 border-white/10" crossOrigin="anonymous" />
                            </div>
                            <span className="text-3xl font-bold text-white uppercase tracking-wide text-center text-shadow-lg whitespace-nowrap">{signB.name}</span>
                        </div>
                    </div>

                    {/* Summary Snippet */}
                    <div className="mt-16 px-20 w-full flex flex-col items-center gap-6">
                       <span className={`text-4xl font-bold uppercase tracking-[0.2em] drop-shadow-md ${
                              mode === 'love' ? 'text-pink-300' : 'text-cyan-300'
                            }`}>
                               {mode === 'love' ? 'AMOR' : 'AMIZADE'}
                       </span>

                       <p className="text-5xl text-white leading-tight font-light italic text-center drop-shadow-[0_4px_8px_rgba(0,0,0,1)]" style={{ textShadow: '0px 2px 10px rgba(0,0,0,0.8)' }}>
                          "{result.resumo}"
                       </p>
                    </div>

                </div>

                <div className="h-20"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
