#!/bin/bash

# Script para baixar efemérides e iniciar servidor

EPHE_DIR="./ephe"

# Criar diretório se não existir
if [ ! -d "$EPHE_DIR" ]; then
  echo "📁 Criando diretório de efemérides..."
  mkdir -p "$EPHE_DIR"
fi

# Arquivos de efemérides necessários
FILES=("sepl_18.se1" "semo_18.se1" "seas_18.se1")
BASE_URL="http://www.astro.com/ftp/swisseph/ephe"

# Baixar arquivos se não existirem
for file in "${FILES[@]}"; do
  if [ ! -f "$EPHE_DIR/$file" ]; then
    echo "⬇️  Baixando $file..."
    curl -f -o "$EPHE_DIR/$file" "$BASE_URL/$file" || wget -O "$EPHE_DIR/$file" "$BASE_URL/$file" || echo "⚠️  Aviso: Falha ao baixar $file"
  else
    echo "✅ $file já existe"
  fi
done

echo "🚀 Iniciando servidor..."
node ./dist/server.js
