const XLSX = require('xlsx-style');
var fs = require('fs');
var dialog = require('electron').remote.dialog;

//Cloudmersive API
var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
var Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = '895356b6-ba0f-4283-a534-ed077794e7ef';

var planilhaJson = undefined
var colunas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

function converterPlanilha(planilha, parentCallback){
   
        var apiInstance = new CloudmersiveConvertApiClient.ConvertDataApi();

        var inputFile = Buffer.from(fs.readFileSync(planilha).buffer);
        apiInstance.convertDataXlsToJson(inputFile, (error, data, response) => {
            if (error) {
                console.error('Cloudmersive Error',error);
            } else {
                console.log('API called successfully.');
                planilhaJson = data
                parentCallback(planilhaJson)
            }
        });
            
}

formatString = (toFormat) =>{
    return toFormat
        .replace(/Para�ba/gi, "Paraíba")
        .replace("Elp�dio","Elpídio")
        .replace("Cr�dito","Crédito")
        .replace("D�bito","Débito")
        .replace("Catol�","Catolé")
        .replace("Inform�tica","Informática")
    
        
}

function criarPlanilha(data){
    var planilha = {}
    console.log('Dados recebidos', data)
    for(cont = 0; cont < planilhaJson.length; cont++){
        for(col = 0; col <colunas.length; col ++){
            planilha[`${colunas[col]}${cont+1}`] = {"v": formatString(data[cont][`UnnamedField${col}`])}
        }
    }

    planilha["!ref"] = `A1:K${data.length+1}`

    var wb = {
        SheetNames: ["Sheet1"],
        Sheets: {
            Sheet1: planilha
          }
    }
    wb.cellStyles = true;
    return wb

}

function carregarPontosPlanilha (wb, weekends){
    pontos = [];
    var planilha = wb.Sheets.Sheet1;
    console.log('Workbook', wb);
    cellCont = 15;
    let ponto = {};
    let cont = 0;
    while (cellCont < 50) {
        while (cont < 11) {
            let celula = colunas[cont] + cellCont;
            ponto['isValido'] = true;
            if (!planilha[celula] && cont === 1) {
                ponto['isValido'] = false;
            };

            ponto[cont] = {
                valor: planilha[celula] ? planilha[celula]['v'] : 'Sem Ponto',
                celula,
                estilo: planilha[celula] && planilha[celula]['s'] !== undefined ? 'color: B51F1F; background-color: FCC3B3;' : 'border: 1px solid white'
            };
            ponto['linha'] = celula.substring(1, 3);
            cont++;
        }
        if (ponto['isValido']) {
            pontos.push(ponto);
            console.log('Ponto', ponto);
        }
        ponto = {};
        cellCont++;
        cont = 0;
    }
    return removerPontosInvalidos(pontos,weekends);

}

function gravarNovaPlanilha(wb){

    var wscols = [
        { wpx: 400 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 50 },
        { wpx: 200 },
    ];

    wb.Sheets.Sheet1['!cols'] = wscols;

    wb.cellStyles = true;


    dialog.showSaveDialog(filename => {
        XLSX.writeFile(wb, `${filename}.xlsx`, (err) => {
            if (err) {
                alert(err);
            } else {
                alert('Concluído!');
            }
        });
    });

}

removerPontosInvalidos = (pontos, weekends) => {
    if (!weekends) {
        pontos = pontos.filter(ponto => !ponto[0]['valor'].includes('Banco Horas') && ponto[1]['valor'] === '(N)');
    } else {
        pontos = pontos.filter(ponto => !ponto[0]['valor'].includes('Banco Horas') && (ponto[1]['valor'] === '(N)' || ponto[1]['valor'] === '(C)' || ponto[1]['valor'] === '(F)'));
    }
    return pontos
}

function corrigirPonto(wb, celula, novoValor) {
    let linhaPonto = celula.substring(1, 3);
    wb.Sheets.Sheet1['A' + linhaPonto] = {
        'v': wb.Sheets.Sheet1['A' + linhaPonto]['v'],
        's': {
            font: { color: { rgb: 'FFB51F1F' } },
            fill: { fgColor: { rgb: "FFFCC3B3" } }
        },
    };


    wb.Sheets.Sheet1[celula] = {
        'v': novoValor,
        's': {
            font: { color: { rgb: 'FFB51F1F' } },
            fill: { fgColor: { rgb: "FFFCC3B3" } }
        },
        alignment: { wrapText: true }
    };

    console.log(wb.Sheets.Sheet1[celula]);
}

module.exports = {
    converterPlanilha,
    criarPlanilha,
    carregarPontosPlanilha,
    gravarNovaPlanilha,
    corrigirPonto
}