# 🔧 Build Command Atualizado para o Render

Use este comando no campo **"Build Command"** do Render:

```bash
npm install && mkdir -p ephe && (curl --retry 3 --retry-delay 2 -o ephe/sepl_18.se1 http://www.astro.com/ftp/swisseph/ephe/sepl_18.se1 || wget -q -O ephe/sepl_18.se1 http://www.astro.com/ftp/swisseph/ephe/sepl_18.se1) && (curl --retry 3 --retry-delay 2 -o ephe/semo_18.se1 http://www.astro.com/ftp/swisseph/ephe/semo_18.se1 || wget -q -O ephe/semo_18.se1 http://www.astro.com/ftp/swisseph/ephe/semo_18.se1) && (curl --retry 3 --retry-delay 2 -o ephe/seas_18.se1 http://www.astro.com/ftp/swisseph/ephe/seas_18.se1 || wget -q -O ephe/seas_18.se1 http://www.astro.com/ftp/swisseph/ephe/seas_18.se1) && npm run build
```

## Ou use este comando mais simples (com wget):

```bash
npm install && mkdir -p ephe && cd ephe && wget http://www.astro.com/ftp/swisseph/ephe/sepl_18.se1 && wget http://www.astro.com/ftp/swisseph/ephe/semo_18.se1 && wget http://www.astro.com/ftp/swisseph/ephe/seas_18.se1 && cd .. && npm run build
```

## Mudanças:
- Trocado `https` por `http` (pode estar bloqueado)
- Adicionado retry automático
- Fallback para wget se curl falhar

## ALTERNATIVA: Upload Manual (mais confiável)

Se continuar falhando, você pode fazer upload manual dos arquivos:

1. Baixe os arquivos no seu PC:
   - http://www.astro.com/ftp/swisseph/ephe/sepl_18.se1
   - http://www.astro.com/ftp/swisseph/ephe/semo_18.se1
   - http://www.astro.com/ftp/swisseph/ephe/seas_18.se1

2. No Render, vá em **"Advanced"** → **"Secret Files"**

3. Adicione cada arquivo:
   - **Filename:** `ephe/sepl_18.se1`
   - **Contents:** (faça upload do arquivo)

   Repita para os 3 arquivos.

4. Mude o Build Command para:
   ```bash
   npm install && npm run build
   ```

---

**Cole o novo Build Command no Render e tente novamente!**
