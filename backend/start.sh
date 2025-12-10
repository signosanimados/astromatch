#!/bin/bash

# Script para baixar efemérides se não existirem
EPHE_DIR="./ephe"

echo "🌟 Verificando arquivos de efemérides..."

# Cria diretório se não existir
mkdir -p "$EPHE_DIR"

# Lista de arquivos necessários
FILES=("sepl_18.se1" "semo_18.se1" "seas_18.se1")

# Base URL
BASE_URL="http://www.astro.com/ftp/swisseph/ephe"

# Verifica e baixa cada arquivo
for file in "${FILES[@]}"; do
  if [ ! -f "$EPHE_DIR/$file" ]; then
    echo "📥 Baixando $file..."
    wget -q -O "$EPHE_DIR/$file" "$BASE_URL/$file" || curl -s -o "$EPHE_DIR/$file" "$BASE_URL/$file"
    if [ -f "$EPHE_DIR/$file" ]; then
      echo "✅ $file baixado com sucesso"
    else
      echo "❌ Erro ao baixar $file"
    fi
  else
    echo "✅ $file já existe"
  fi
done

echo "🚀 Iniciando servidor..."
node dist/src/server.js
