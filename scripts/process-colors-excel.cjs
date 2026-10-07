const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Função para processar a planilha de cores
function processColorsExcel() {
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
      
      // Para esta planilha específica, sabemos que:
      // Linha 1 tem os cabeçalhos: ['Cores', '', 'cor informtiva', 'Codigo Pro Revest', 'Codigo', 'nome']
      // Coluna 6 (índice 6) tem o código hex
      // Coluna 7 (índice 7) tem o nome da cor
      
      console.log('Primeiras linhas da planilha:');
      jsonData.slice(0, 3).forEach((row, i) => {
        console.log(`Linha ${i}:`, row);
      });

      // Processar dados a partir da linha 2 (índice 2)
      for (let i = 2; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        const colorName = row[7]; // Nome da cor na coluna 7
        const hexCode = row[6];   // Código hex na coluna 6
        
        if (colorName && hexCode) {
          const colorData = {
            name: colorName.toString().trim(),
            hex_code: hexCode.toString().startsWith('#') ? hexCode.toString() : '#' + hexCode.toString(),
            category: sheetName,
            is_archived: false
          };
          
          allColors.push(colorData);
        }
      }
    });

    console.log(`\nTotal de cores processadas: ${allColors.length}`);

    // Salvar resultado em JSON
    const outputPath = path.join(__dirname, '..', 'processed-colors.json');
    fs.writeFileSync(outputPath, JSON.stringify(allColors, null, 2));
    console.log(`Cores salvas em: ${outputPath}`);

    // Mostrar algumas cores de exemplo
    console.log('\nExemplo de cores processadas:');
    allColors.slice(0, 5).forEach(color => {
      console.log(`- ${color.name}: ${color.hex_code || 'N/A'} (${color.category})`);
    });

    return allColors;

  } catch (error) {
    console.error('Erro ao processar planilha:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  processColorsExcel();
}

module.exports = { processColorsExcel };