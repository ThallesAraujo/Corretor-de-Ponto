const BrowserWindow = require('electron').remote.BrowserWindow;
const XLSX = require('xlsx-style');
var $ = require('jquery')
var Inputmask = require('inputmask');
var dialog = require('electron').remote.dialog;
const criarExibicaoPonto = require('../view/ajuste-ponto-template.js').criarExibicaoPonto;
const criarLinhaPreviewPlanilha = require('../view/ajuste-ponto-template.js').criarLinhaPreviewPlanilha;

const telefone = $('#telefone');
const divPontos = $('#pontos');
const telaPontos = $('#tela-pontos');
const guiaTdsPontos = $('#guia-tds-pontos');
const guiaInconsistencias = $('#guia-inconsistencias');
const inicio = $('#inicio');
var pontos = [];
var copiaPontos = [];
var pontosCorrigidos = [];
var colunas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
var wb;
var estiloPontoCorrigido = { 
    font: { color: { rgb: 'FFB51F1F' }}, 
    fill: { fgColor: { rgb: "FFFCC3B3"}}
}

var mascara = new Inputmask("(99)9999-9999");
mascara.mask(telefone);

telefone.keyup(function (event) {
    if (event.keyCode === 13) {
        enviarMensagem();
    }
});


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

removerPontosInvalidos = () => {
    pontos = pontos.filter(ponto => !ponto[0]['valor'].includes('Banco Horas') && ponto[1]['valor'] === '(N)');
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

carregarPontosPlanilha = () => {
    pontos  = [];
    var planilha = wb.Sheets.Sheet1;
            console.log('Workbook', planilha);
            cellCont = 16;
            let ponto = {};
            let cont = 0;
            while (cellCont < 50) {
                while (cont < 10) {
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
            removerPontosInvalidos();

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

exibirTodosOsPontos = () => {
    carregarPontosPlanilha();
    let exibicao = '';
    pontos.forEach(ponto => {
        exibicao += criarExibicaoPonto(ponto);
    });

    exibicao += `<input class="btn" onClick="gravarNovaPlanilha()" type="button" value="Gerar planilha de pontos"></input>`;
    divPontos.html(exibicao);
    switchTabs(guiaTdsPontos, guiaInconsistencias);
    
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
    $(`#div${event.target.id}`).hide();
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

switchTabs = (active, inactive) =>{
    active.addClass('tab-active').removeClass('tab-inactive');
    inactive.removeClass('tab-active').addClass('tab-inactive');
}

exibirPreviewPlanilha = () => {
    carregarPontosPlanilha();
    let exibicao = '<table style="color: white">';
    pontos.forEach(ponto =>{
        exibicao += criarLinhaPreviewPlanilha(ponto);
    });

    exibicao += '</table>'
    divPontos.html(exibicao);
    console.log(exibicao);
}

exibirInconsistencias = () => {
    let exibicao = '';
    let inconsistencias = pontos.filter(ponto => ponto[2]['valor'] === 'Sem Ponto' || ponto[3]['valor'] === 'Sem Ponto' || ponto[4]['valor'] === 'Sem Ponto' || ponto[5]['valor'] === 'Sem Ponto');
    inconsistencias.forEach(ponto => {
        exibicao += criarExibicaoPonto(ponto);
    });
    exibicao += `<input class="btn" onClick="gravarNovaPlanilha()" type="button" value="Gerar planilha de pontos"></input>
    <input class="btn" onClick="exibirPreviewPlanilha()" type="button" value="Visualizar Planilha"></input>`;
    divPontos.html(exibicao);
    console.log('Inconsistencias', inconsistencias);
    switchTabs(guiaInconsistencias, guiaTdsPontos);
}
