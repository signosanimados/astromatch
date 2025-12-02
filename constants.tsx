import React from 'react';
import { SignData, ElementType } from './types';

// Link direto do Imgur (Logo do App)
export const APP_LOGO = "https://i.imgur.com/azbf6qp.png";

// Imagem de Fallback (Reserva) caso a imagem da combinação específica não exista
export const DEFAULT_BACKGROUND = "https://i.imgur.com/SpAFefg.jpeg";

// Mapeamento para nomes de arquivo (Usado para gerar a chave de busca)
export const PORTUGUESE_NAMES: Record<string, string> = {
  aries: 'ARIES',
  taurus: 'TOURO',
  gemini: 'GEMEOS',
  cancer: 'CANCER',
  leo: 'LEAO',
  virgo: 'VIRGEM',
  libra: 'LIBRA',
  scorpio: 'ESCORPIAO',
  sagittarius: 'SAGITARIO',
  capricorn: 'CAPRICORNIO',
  aquarius: 'AQUARIO',
  pisces: 'PEIXES'
};

// URLs dos Backgrounds hospedados no Cloudinary
// As chaves são sempre a combinação dos nomes em ORDEM ALFABÉTICA (ex: AQUARIO vem antes de ARIES)
export const BACKGROUND_URLS: Record<string, string> = {
  // ARIES (A) vs ...
  "AQUARIOxARIES": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666025/ARIESxAQUARIO_vy5opz.png",
  "ARIESxARIES": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666025/ARIESxARIES_l8yxwi.png",
  "ARIESxCANCER": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666025/ARIESxCANCER_pfuvi4.png",
  "ARIESxCAPRICORNIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666026/ARIESxCAPRICORNIO_jp0dkt.png",
  "ARIESxESCORPIAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666026/ARIESxESCORPIAO_su4bvt.png",
  "ARIESxGEMEOS": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666026/ARIESxGEMEOS_yp1itq.png",
  "ARIESxLEAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666026/ARIESxLEAO_nvqodf.png",
  "ARIESxLIBRA": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666026/ARIESxLIBRA_tadfbi.png",
  "ARIESxPEIXES": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666026/ARIESxPEIXES_scu5ay.png",
  "ARIESxSAGITARIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666028/ARIESxSAGITARIO_k8ti1m.png",
  "ARIESxTOURO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666032/ARIESxTOURO_ggrqyw.png",
  "ARIESxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666032/ARIESxVIRGEM_fzvr1y.png",

  // TOURO (T) vs ... (Lembrando da ordem alfabetica: AQUARIO, CANCER, CAPRICORNIO, ESCORPIAO, GEMEOS, LEAO, LIBRA, PEIXES, SAGITARIO antes de TOURO)
  "AQUARIOxTOURO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666101/TOUROxAQUARIO_rbb4id.png",
  "CANCERxTOURO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666102/TOUROxCANCER_zpu58k.png",
  "CAPRICORNIOxTOURO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666102/TOUROxCAPRICORNIO_vqi7fd.png",
  "ESCORPIAOxTOURO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666108/TOUROxESCORPIAO_neh4ox.png",
  "GEMEOSxTOURO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666108/TOUROxGEMEOS_polsu9.png",
  "LEAOxTOURO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666108/TOUROxLEAO_dangdf.png",
  "LIBRAxTOURO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666108/TOUROxLIBRA_zmuhjn.png",
  "PEIXESxTOURO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666115/TOUXOxPEIXES_rrmtww.png", // Link corrigido (typo no nome do arquivo original)
  "SAGITARIOxTOURO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666108/TOUROxSAGITARIO_xx2jrh.png",
  "TOUROxTOURO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666109/TOUROxTOURO_x9nvwf.png",
  "TOUROxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666109/TOUROxVIRGEM_t31wat.png",

  // GEMEOS (G) vs ...
  "AQUARIOxGEMEOS": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666042/GEMEOSxAQUARIO_qpympd.png",
  "CANCERxGEMEOS": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666043/GEMEOSxCANCER_rukpos.png",
  "CAPRICORNIOxGEMEOS": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666045/GEMEOSxCAPRICORNIO_rqs2fk.png",
  "ESCORPIAOxGEMEOS": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666045/GEMEOSxESCORPIAO_gzfpwj.png",
  "GEMEOSxGEMEOS": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666085/GEMEOSxGEMEOS_hl9qdv.png",
  "GEMEOSxLEAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666046/GEMEOSxLEAO_eydkwj.png",
  "GEMEOSxLIBRA": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666046/GEMEOSxLIBRA_w1ukym.png",
  "GEMEOSxPEIXES": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666047/GEMEOSxPEIXES_azxuhm.png",
  "GEMEOSxSAGITARIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666049/GEMEOSxSAGITARIO_yfhiou.png",
  "GEMEOSxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666050/GEMEOSxVIRGEM_hmwpjf.png",

  // CANCER (C) vs ...
  "AQUARIOxCANCER": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666032/CANCERxAQUARIO_wxu4zv.png",
  "CANCERxCANCER": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666033/CANCERxCANCER_slzrpc.png",
  "CANCERxCAPRICORNIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666033/CANCERxCAPRICORNIO_f1ul3d.png",
  "CANCERxESCORPIAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666033/CANCERxESCORPIAO_ao85pm.png",
  "CANCERxLEAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666034/CANCERxLEAO_ntx9cz.png",
  "CANCERxLIBRA": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666034/CANCERxLIBRA_v4ktuy.png",
  "CANCERxPEIXES": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666035/CANCERxPEIXES_l2ey0g.png",
  "CANCERxSAGITARIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666036/CANCERxSAGITARIO_mhtxj1.png",
  "CANCERxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666036/CANCERxVIRGEM_s9d4ui.png",

  // LEAO (L) vs ...
  "AQUARIOxLEAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666085/LEAOxAQUARIO_r5cbvj.png",
  "CAPRICORNIOxLEAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666085/LEAOxCAPRICORNIO_zdujgw.png",
  "ESCORPIAOxLEAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666086/LEAOxESCORPIAO_ae0jef.png",
  "LEAOxLEAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666085/LEAOxLEAO_itdpky.png",
  "LEAOxLIBRA": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666085/LEAOxLIBRA_hzhzwe.png", // Leao (Le) vs Libra (Li) -> Leao comes first
  "LEAOxPEIXES": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666086/LEAOxPEIXES_d6lno2.png",
  "LEAOxSAGITARIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666086/LEAOxSAGITARIO_vwr54o.png",
  "LEAOxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666086/LEAOxVIRGEM_gbrhxt.png",

  // VIRGEM (V) vs ...
  "AQUARIOxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666116/VIRGEMxAQUARIO_ljj1jb.png",
  "CAPRICORNIOxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666116/VIRGEMxCAPRICORNIO_aphox3.png",
  "ESCORPIAOxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666116/VIRGEMxESCORPIAO_jn57ob.png",
  "LIBRAxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666121/VIRGEMxLIBRA_rbv8dc.png", // Libra (L) before Virgem (V)
  "PEIXESxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666122/VIRGEMxPEIXES_s8qcby.png", // Peixes (P) before Virgem (V)
  "SAGITARIOxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666121/VIRGEMxSAGITARIO_ylvux5.png", // Sagitario (S) before Virgem (V)
  "VIRGEMxVIRGEM": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666121/VIRGEMxVIRGEM_xv2ruz.png",

  // LIBRA (L) vs ...
  "AQUARIOxLIBRA": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666092/LIBRAxAQUARIO_j4wrnd.png",
  "CAPRICORNIOxLIBRA": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666093/LIBRAxCAPRICORNIO_klnolz.png",
  "ESCORPIAOxLIBRA": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666094/LIBRAxESCORPIAO_dqtxuk.png",
  "LIBRAxLIBRA": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666094/LIBRAxLIBRA_wbyt4n.png",
  "LIBRAxPEIXES": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666094/LIBRAxPEIXES_dfxsje.png",
  "LIBRAxSAGITARIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666094/LIBRAxSAGITARIO_r9qguz.png",

  // ESCORPIAO (E) vs ...
  "AQUARIOxESCORPIAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666037/ESCORPIAOxAQUARIO_go5fd2.png",
  "CAPRICORNIOxESCORPIAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666041/ESCORPIAOxCAPRICORNIO_aype8r.png",
  "ESCORPIAOxESCORPIAO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666040/ESCORPIAOxESCORPIAO_jqsgpd.png",
  "ESCORPIAOxPEIXES": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666041/ESCORPIAOxPEIXES_bs3j2q.png",
  "ESCORPIAOxSAGITARIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666041/ESCORPIAOxSAGITARIO_cglf6f.png",

  // SAGITARIO (S) vs ...
  "AQUARIOxSAGITARIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666097/SAGITARIOxAQUARIO_vah50w.png",
  "CAPRICORNIOxSAGITARIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666101/SAGITARIOxCAPRICORNIO_svu34l.png",
  "PEIXESxSAGITARIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666101/SAGITARIOxPEIXES_lxcudo.png", // Peixes (P) before Sagitario (S)
  "SAGITARIOxSAGITARIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666101/SAGITARIOxSAGITARIO_kgngpf.png",

  // CAPRICORNIO (C) vs ...
  "AQUARIOxCAPRICORNIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666036/CAPRICORNIOxAQUARIO_k5k1vq.png",
  "CAPRICORNIOxCAPRICORNIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666037/CAPRICORNIOxCAPRICORNIO_bslocd.png",
  "CAPRICORNIOxPEIXES": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666037/CAPRICORNIOxPEIXES_glejzo.png",

  // AQUARIO (A) vs ...
  "AQUARIOxAQUARIO": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666025/AQUARIOxAQUARIO_novbwn.png",
  "AQUARIOxPEIXES": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666024/AQUARIOxPEIXES_ods8t4.png",

  // PEIXES (P) vs ...
  "PEIXESxPEIXES": "https://res.cloudinary.com/dwhau3ipe/image/upload/v1764666094/PEIXESxPEIXES_inzkx7.png"
};

// Paleta de Cores por Elemento
const COLORS = {
  FIRE: '#FC4629',   // Vermelho
  EARTH: '#A3CB00',  // Verde
  WATER: '#1D5EFF',  // Azul
  AIR: '#FFFFFF'     // Branco
};

export const SIGNS: SignData[] = [
  {
    id: 'aries',
    name: 'Áries',
    date: '21 Mar - 19 Abr',
    element: ElementType.FIRE,
    color: `text-[${COLORS.FIRE}]`,
    gradient: `from-[${COLORS.FIRE}]/20 to-[${COLORS.FIRE}]/80`,
    icon: 'https://i.imgur.com/1jfkg85.png'
  },
  {
    id: 'taurus',
    name: 'Touro',
    date: '20 Abr - 20 Mai',
    element: ElementType.EARTH,
    color: `text-[${COLORS.EARTH}]`,
    gradient: `from-[${COLORS.EARTH}]/20 to-[${COLORS.EARTH}]/80`,
    icon: 'https://i.imgur.com/Je2j4uC.png'
  },
  {
    id: 'gemini',
    name: 'Gêmeos',
    date: '21 Mai - 20 Jun',
    element: ElementType.AIR,
    color: `text-[${COLORS.AIR}]`,
    gradient: `from-[${COLORS.AIR}]/10 to-[${COLORS.AIR}]/60`,
    icon: 'https://i.imgur.com/6F9Gu1T.png' 
  },
  {
    id: 'cancer',
    name: 'Câncer',
    date: '21 Jun - 22 Jul',
    element: ElementType.WATER,
    color: `text-[${COLORS.WATER}]`,
    gradient: `from-[${COLORS.WATER}]/20 to-[${COLORS.WATER}]/80`,
    icon: 'https://i.imgur.com/Jev0I5P.png'
  },
  {
    id: 'leo',
    name: 'Leão',
    date: '23 Jul - 22 Ago',
    element: ElementType.FIRE,
    color: `text-[${COLORS.FIRE}]`,
    gradient: `from-[${COLORS.FIRE}]/20 to-[${COLORS.FIRE}]/80`,
    icon: 'https://i.imgur.com/iXWGgB5.png'
  },
  {
    id: 'virgo',
    name: 'Virgem',
    date: '23 Ago - 22 Set',
    element: ElementType.EARTH,
    color: `text-[${COLORS.EARTH}]`,
    gradient: `from-[${COLORS.EARTH}]/20 to-[${COLORS.EARTH}]/80`,
    icon: 'https://i.imgur.com/p2w1syF.png'
  },
  {
    id: 'libra',
    name: 'Libra',
    date: '23 Set - 22 Out',
    element: ElementType.AIR,
    color: `text-[${COLORS.AIR}]`,
    gradient: `from-[${COLORS.AIR}]/10 to-[${COLORS.AIR}]/60`,
    icon: 'https://i.imgur.com/8yyWG6m.png'
  },
  {
    id: 'scorpio',
    name: 'Escorpião',
    date: '23 Out - 21 Nov',
    element: ElementType.WATER,
    color: `text-[${COLORS.WATER}]`,
    gradient: `from-[${COLORS.WATER}]/20 to-[${COLORS.WATER}]/80`,
    icon: 'https://i.imgur.com/XMz6rP6.png'
  },
  {
    id: 'sagittarius',
    name: 'Sagitário',
    date: '22 Nov - 21 Dez',
    element: ElementType.FIRE,
    color: `text-[${COLORS.FIRE}]`,
    gradient: `from-[${COLORS.FIRE}]/20 to-[${COLORS.FIRE}]/80`,
    icon: 'https://i.imgur.com/ar07j7y.png'
  },
  {
    id: 'capricorn',
    name: 'Capricórnio',
    date: '22 Dez - 19 Jan',
    element: ElementType.EARTH,
    color: `text-[${COLORS.EARTH}]`,
    gradient: `from-[${COLORS.EARTH}]/20 to-[${COLORS.EARTH}]/80`,
    icon: 'https://i.imgur.com/iD9niIf.png'
  },
  {
    id: 'aquarius',
    name: 'Aquário',
    date: '20 Jan - 18 Fev',
    element: ElementType.AIR,
    color: `text-[${COLORS.AIR}]`,
    gradient: `from-[${COLORS.AIR}]/10 to-[${COLORS.AIR}]/60`,
    icon: 'https://i.imgur.com/b7dHYgk.png'
  },
  {
    id: 'pisces',
    name: 'Peixes',
    date: '19 Fev - 20 Mar',
    element: ElementType.WATER,
    color: `text-[${COLORS.WATER}]`,
    gradient: `from-[${COLORS.WATER}]/20 to-[${COLORS.WATER}]/80`,
    icon: 'https://i.imgur.com/IDVKxlq.png'
  }
];

export const ElementIcons = {
  [ElementType.FIRE]: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2l-6 10h12z" />
    </svg>
  ),
  [ElementType.EARTH]: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 22l-8-8h16z M2 14h20" />
    </svg>
  ),
  [ElementType.AIR]: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
       <path d="M2 12h20" />
    </svg>
  ),
  [ElementType.WATER]: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 22l-6-10h12z" />
    </svg>
  )
};