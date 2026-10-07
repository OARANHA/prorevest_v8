const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Função para processar a planilha de cores de forma melhorada
function processColorsExcelImproved() {
  try {
    // Caminho para o arquivo Excel
    const excelPath = path.join(__dirname, '..', 'RGB Cores.xlsx');
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(excelPath)) {
      console.error('Arquivo RGB Cores.xlsx não encontrado!');
      return;
    }

    // Ler o arquivo Excel
    const workbook = XLSX.readFile(excelPath);
    
    // Obter todas as planilhas
    const sheetNames = workbook.SheetNames;
    console.log('Planilhas encontradas:', sheetNames);

    const allColors = [];

    // Processar cada planilha
    sheetNames.forEach(sheetName => {
      console.log(`\nProcessando planilha: ${sheetName}`);
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log(`Total de linhas na planilha: ${jsonData.length}`);

      let processedInSheet = 0;
      let recoveredInSheet = 0;

      // Processar dados a partir da linha 2 (índice 2)
      for (let i = 2; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        const colorName = row[7]; // Nome da cor na coluna 7
        let hexCode = row[6];     // Código hex na coluna 6
        
        // Se não há nome da cor, pular
        if (!colorName) continue;

        // Se não há hex na coluna 6, procurar em outras colunas
        if (!hexCode) {
          // Procurar hex em outras colunas
          for (let j = 0; j < row.length; j++) {
            if (j !== 6 && row[j]) {
              const value = row[j].toString().trim();
              // Verificar se parece com um código hex (6 caracteres hexadecimais)
              if (value.match(/^[a-fA-F0-9]{6}$/)) {
                hexCode = value;
                recoveredInSheet++;
                console.log(`Recuperado: ${colorName} - Hex: ${hexCode} (coluna ${j})`);
                break;
              }
            }
          }
        }

        // Se ainda não temos hex, tentar gerar um baseado no nome ou usar um padrão
        if (!hexCode) {
          // Por enquanto, vamos pular cores sem hex
          // Mas podemos implementar geração de cores baseada no nome no futuro
          continue;
        }

        // Adicionar cor válida
        if (colorName && hexCode) {
          const colorData = {
            name: colorName.toString().trim(),
            hex_code: hexCode.toString().startsWith('#') ? hexCode.toString() : '#' + hexCode.toString(),
            category: sheetName,
            is_archived: false
          };
          
          allColors.push(colorData);
          processedInSheet++;
        }
      }

      console.log(`Cores processadas na planilha ${sheetName}: ${processedInSheet}`);
      console.log(`Cores recuperadas de outras colunas: ${recoveredInSheet}`);
    });

    console.log(`\nTotal de cores processadas: ${allColors.length}`);

    // Salvar resultado em JSON
    const outputPath = path.join(__dirname, '..', 'processed-colors-improved.json');
    fs.writeFileSync(outputPath, JSON.stringify(allColors, null, 2));
    console.log(`Cores salvas em: ${outputPath}`);

    // Mostrar algumas cores de exemplo
    console.log('\nExemplo de cores processadas:');
    allColors.slice(0, 10).forEach(color => {
      console.log(`- ${color.name}: ${color.hex_code || 'N/A'} (${color.category})`);
    });

    // Estatísticas finais
    console.log('\n=== ESTATÍSTICAS FINAIS ===');
    console.log(`Total de cores no arquivo original: ~1551 linhas`);
    console.log(`Cores processadas com sucesso: ${allColors.length}`);
    console.log(`Melhoria em relação ao script anterior: +${allColors.length - 944} cores`);

    return allColors;

  } catch (error) {
    console.error('Erro ao processar planilha:', error);
  }
}

// Executar o processamento
if (require.main === module) {
  processColorsExcelImproved();
}

module.exports = { processColorsExcelImproved };