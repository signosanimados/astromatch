#!/bin/bash

# Script de instalação das Efemérides Swiss Ephemeris
# ====================================================

echo "🌟 Instalando Efemérides Swiss Ephemeris..."
echo ""

# Criar diretório ephe se não existir
mkdir -p ephe

cd ephe

echo "📥 Baixando arquivos de efemérides..."
echo ""

# Baixar arquivos principais
echo "→ Baixando sepl_18.se1 (planetas)..."
wget -q --show-progress https://www.astro.com/ftp/swisseph/ephe/sepl_18.se1

echo "→ Baixando semo_18.se1 (lua)..."
wget -q --show-progress https://www.astro.com/ftp/swisseph/ephe/semo_18.se1

echo "→ Baixando seas_18.se1 (asteroides)..."
wget -q --show-progress https://www.astro.com/ftp/swisseph/ephe/seas_18.se1

cd ..

echo ""
echo "✅ Efemérides instaladas com sucesso em backend/ephe/"
echo ""
echo "Arquivos instalados:"
ls -lh ephe/*.se1

echo ""
echo "🚀 Agora você pode iniciar o backend:"
echo "   npm run dev"
echo ""
