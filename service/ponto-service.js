const BrowserWindow = require('electron').remote.BrowserWindow;
const XLSX = require('xlsx-style');
var $ = require('jquery')
var dialog = require('electron').remote.dialog;
const criarExibicaoPonto = require('../view/ajuste-ponto-template.js').criarExibicaoPonto;
const criarLinhaPreviewPlanilha = require('../view/ajuste-ponto-template.js').criarLinhaPreviewPlanilha;
const criarExibicaoOitoPontos = require('../view/ajuste-ponto-template.js').criarExibicaoOitoPontos;

const divPontos = $('#pontos');
const telaPontos = $('#tela-pontos');
const guiaTdsPontos = $('#guia-tds-pontos');
const guiaInconsistencias = $('#guia-inconsistencias');
const guiaPreview = $('#guia-preview-planilha')
const inicio = $('#inicio');
var pontos = [];
var exibicaoAtiva = () =>{};
var exibicaoCompleta = false;
var copiaPontos = [];
var colunas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
var wb;


$('#btnCarregar').click(() => {
    carregarPlanilha();
})


$('#btnConverterPlanilha').click(() => {
    let win = new BrowserWindow({ width: 1500, height: 800 })
    win.loadURL('https://www.docspal.com/convert/xls-to-xlsx');

    let contents = win.webContents;
    console.log(contents)
    win.show();
})

removerPontosInvalidos = (weekends) => {
    if(!weekends){
        pontos = pontos.filter(ponto => !ponto[0]['valor'].includes('Banco Horas') && ponto[1]['valor'] === '(N)');
    }else{
        pontos = pontos.filter(ponto => !ponto[0]['valor'].includes('Banco Horas') && (ponto[1]['valor'] === '(N)' || ponto[1]['valor'] === '(C)' || ponto[1]['valor'] === '(F)'));
    }
    console.log('Lista de pontos válidos', pontos);
}

function carregarPlanilha() {
    pontos  = [];

    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{name: 'Documents', extensions: ['xlsx']}]
    }, function (files) {
        if (files !== undefined) {
            console.log('Files', files[0]);
            wb = XLSX.readFile(files[0]);
            wb.cellStyles = true;
            carregarPontosPlanilha();
            inicio.hide();
            telaPontos.attr('hidden', false);
            divPontos.show();
            if(!copiaPontos.length){
                copiaPontos = pontos;
            }
            exibirInconsistencias();
        }
    });
}

carregarPontosPlanilha = (weekends) => {
    pontos  = [];
    var planilha = wb.Sheets.Sheet1;
            console.log('Workbook', planilha);
            cellCont = 16;
            let ponto = {};
            let cont = 0;
            while (cellCont < 50) {
                while (cont < 11) {
                    let celula = colunas[cont] + cellCont;
                    ponto['isValido'] = true;
                    if (!planilha[celula] && cont === 1) {
                        ponto['isValido'] = false;
                    };

                    ponto[cont] = { valor: planilha[celula] ? planilha[celula]['v'] : 'Sem Ponto', 
                    celula , 
                    estilo: planilha[celula] && planilha[celula]['s'] !== undefined ?'color: B51F1F; background-color: FCC3B3;': 'border: 1px solid white'};
                    ponto['linha'] = celula.substring(1,3);
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
            removerPontosInvalidos(weekends);

}

gravarNovaPlanilha = () =>{

    var wscols = [
        {wpx:400},
        {wpx:50},
        {wpx:50},
        {wpx:50},
        {wpx:50},
        {wpx:50},
        {wpx:50},
        {wpx:50},
        {wpx:50},
        {wpx:50},
        {wpx:200},
    ];
    
    wb.Sheets.Sheet1['!cols'] = wscols;

    wb.cellStyles = true;


    dialog.showSaveDialog(filename => {
        XLSX.writeFile(wb, `${filename}.xlsx`, (err)=>{
            if(err){
                alert(err);
            }else{
                alert('Concluído!');
            }
        });
    });

}

alternarExibicao = () =>{
    exibicaoCompleta = !exibicaoCompleta;
    $('#btnAlternarExibicao').attr('title', exibicaoCompleta? 'Alternar p/ Exibição Simplificada': 'Alternar p/ Exibição Completa');
    exibicaoAtiva();
}

exibirTodosOsPontos = () => {
    exibicaoAtiva = exibirTodosOsPontos;
    carregarPontosPlanilha(true);
    let exibicao = '';
    pontos.forEach(ponto => {
        if(exibicaoCompleta){
            exibicao += criarExibicaoOitoPontos(ponto);
        }else{
            exibicao += criarExibicaoPonto(ponto);
        }
    });

    exibicao += `<input class="btn" onClick="gravarNovaPlanilha()" type="button" value="Gerar planilha de pontos"></input>`;
    divPontos.html(exibicao);
    switchTabs(guiaTdsPontos, guiaInconsistencias, guiaPreview);
    
}

setarNovoPonto = (event) => {
    corrigirPonto(event.target.id, event.target.value);
};

marcarDebitoBancoHoras = (event) => {
    console.log('btnid', event.target.id);
    let linha = event.target.id.substring(1, 3);

    let cont = 2;
    while (cont < 10) {
        corrigirPonto(colunas[cont] + linha, '');
        cont++;
    }

    corrigirPonto('K' + linha,'Débito Banco Horas');
    exibicaoAtiva();
}

corrigirPonto = (celula, novoValor) => {
    let linhaPonto = celula.substring(1,3);
    wb.Sheets.Sheet1['A' + linhaPonto] = { 
        'v': wb.Sheets.Sheet1['A' + linhaPonto]['v'], 
        's': { 
            font: { color: { rgb: 'FFB51F1F' } }, 
            fill: { fgColor: { rgb: "FFFCC3B3"}}},
        };

    
    wb.Sheets.Sheet1[celula] = { 
        'v': novoValor, 
        's': { 
            font: { color: { rgb: 'FFB51F1F' } }, 
            fill: { fgColor: { rgb: "FFFCC3B3" } } },
            alignment: { wrapText: true }
        };

        console.log(wb.Sheets.Sheet1[celula]);
    
}

voltarInicio = (event) => {
    divPontos.hide();
    divPontos.html('');
    telaPontos.attr('hidden', true);
    inicio.show();
}

switchTabs = (active, ...inactives) =>{
    active.addClass('tab-active').removeClass('tab-inactive');
    inactives.forEach(inactive =>{
        inactive.removeClass('tab-active').addClass('tab-inactive');
    })
}

exibirPreviewPlanilha = () => {
    exibicaoAtiva = exibirPreviewPlanilha;
    carregarPontosPlanilha(true);
    let exibicao = '<table style="color: white">';
    pontos.forEach(ponto =>{
        exibicao += criarLinhaPreviewPlanilha(ponto);
    });

    exibicao += '</table>'
    switchTabs(guiaPreview, guiaInconsistencias, guiaTdsPontos);
    divPontos.html(exibicao);
    console.log(exibicao);
}

exibirInconsistencias = () => {
    exibicaoAtiva = exibirInconsistencias;
    let exibicao = '';
    let inconsistencias = pontos.filter(ponto => ponto[2]['valor'] === 'Sem Ponto' || ponto[3]['valor'] === 'Sem Ponto' || ponto[4]['valor'] === 'Sem Ponto' || ponto[5]['valor'] === 'Sem Ponto');
    inconsistencias.forEach(ponto => {
        if(exibicaoCompleta){
            exibicao += criarExibicaoOitoPontos(ponto);
        }else{
            exibicao += criarExibicaoPonto(ponto);
        }
    });
    exibicao += `<input class="btn" onClick="gravarNovaPlanilha()" type="button" value="Gerar planilha de pontos"></input>`;
    divPontos.html(exibicao);
    console.log('Inconsistencias', inconsistencias);
    switchTabs(guiaInconsistencias, guiaTdsPontos, guiaPreview);
}
