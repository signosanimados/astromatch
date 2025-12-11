#!/bin/bash

# Script para baixar efemérides e iniciar servidor

EPHE_DIR="./ephe"

# Criar diretório se não existir
if [ ! -d "$EPHE_DIR" ]; then
  echo "📁 Criando diretório de efemérides..."
  mkdir -p "$EPHE_DIR"
fi

# URL alternativo - GitHub com arquivos Swiss Ephemeris
# Usando repositório público que hospeda os arquivos
GITHUB_BASE="https://raw.githubusercontent.com/astrorigin/pyswisseph/master/swisseph/sweph"

# Arquivos de efemérides necessários
declare -A FILES=(
  ["sepl_18.se1"]="planets"
  ["semo_18.se1"]="moon"
  ["seas_18.se1"]="asteroids"
)

echo "⬇️  Baixando arquivos de efemérides essenciais..."

# Tentar baixar de múltiplas fontes
for file in "${!FILES[@]}"; do
  if [ ! -f "$EPHE_DIR/$file" ]; then
    echo "  → $file..."

    # Tentar fonte 1: astro.com
    curl -f -s -L -o "$EPHE_DIR/$file" "https://www.astro.com/ftp/swisseph/ephe/$file" 2>/dev/null && echo "    ✅ Baixado de astro.com" && continue

    # Tentar fonte 2: GitHub
    curl -f -s -L -o "$EPHE_DIR/$file" "$GITHUB_BASE/$file" 2>/dev/null && echo "    ✅ Baixado do GitHub" && continue

    # Se falhou, remover arquivo parcial e continuar
    rm -f "$EPHE_DIR/$file"
    echo "    ⚠️  Não disponível (calculadora usará dados internos)"
  else
    echo "  ✅ $file já existe"
  fi
done

# Verificar status
count=$(ls -1 "$EPHE_DIR"/*.se1 2>/dev/null | wc -l)
if [ "$count" -gt 0 ]; then
  echo "✅ $count arquivo(s) de efemérides carregado(s)"
else
  echo "⚠️  Usando dados internos do Swiss Ephemeris"
fi

echo ""
echo "🚀 Iniciando servidor..."
node ./dist/server.js
