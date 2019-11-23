const BrowserWindow = require('electron').remote.BrowserWindow;
var $ = require('jquery')
var dialog = require('electron').remote.dialog;
const pontoTemplate = require('../view/ajuste-ponto-template.js');

const divPontos = $('#pontos');
const telaPontos = $('#tela-pontos');
const guiaTdsPontos = $('#guia-tds-pontos');
const guiaInconsistencias = $('#guia-inconsistencias');
const guiaPreview = $('#guia-preview-planilha')
const inicio = $('#inicio');
const spinner = $('#spinner')
const content = $('#content');
var pontos = [];
var exibicaoAtiva = () => { };
var exibicaoCompleta = false;
var copiaPontos = [];
var colunas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
var wb;

const planilhaService = require('../service/planilha.service.js')


$('#btnCarregar').click(() => {
    carregarPlanilha();
})

function carregarPlanilha() {
    pontos = [];

    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Documents', extensions: ['*'] }]
    }, function (files) {
        if (files) {
            console.log('Files', files[0]);
            var dados = undefined
            spinner.attr('hidden', false)
            content.addClass('spinner-blur');
            planilhaService.converterPlanilha(files[0], (data) => dados = data)
            setTimeout(() => {
                spinner.attr('hidden', true)
                content.removeClass('spinner-blur')
                if (dados) {
                    wb = planilhaService.criarPlanilha(dados);
                    pontos = planilhaService.carregarPontosPlanilha(wb, false);
                    inicio.hide();
                    telaPontos.attr('hidden', false);
                    divPontos.show();
                    if (!copiaPontos.length) {
                        copiaPontos = pontos;
                    }
                    exibirInconsistencias();
                }else{
                    exibirMensagemErro("Não foi possível acessar o servico de conversão. Verifique sua conexão")
                }
            }, 50000)
        }
    });
}

gravarNovaPlanilha = () => {
    planilhaService.gravarNovaPlanilha(wb)
}

exibirMensagemErro = (mensagemErro) => {
    const mensagem = document.getElementById('message');
    if($('#message').hasClass('out')){
        $('#message').toggleClass('out');
    }

    if($('#message').hasClass('remove-pad')){
        $('#message').toggleClass('remove-pad');
    }

    if($('#message').hasClass('in')){
        $('#message').toggleClass('in');
    }

    mensagem.classList.add('message-error')
            mensagem.innerText = mensagemErro;
            mensagem.setAttribute('style', 'display: block')
            $('#message').toggleClass('in');
            setTimeout(() =>{
                $('#message').toggleClass('out');
                $('#message').toggleClass('remove-pad');
            }, 5000);
}

alternarExibicao = () => {
    exibicaoCompleta = !exibicaoCompleta;
    $('#btnAlternarExibicao').attr('title', exibicaoCompleta ? 'Alternar p/ Exibição Simplificada' : 'Alternar p/ Exibição Completa');
    exibicaoAtiva();
}

exibirTodosOsPontos = () => {
    exibicaoAtiva = exibirTodosOsPontos;
    pontos = planilhaService.carregarPontosPlanilha(wb, true);
    let exibicao = '';
    pontos.forEach(ponto => {
        if (exibicaoCompleta) {
            exibicao += pontoTemplate.criarExibicaoOitoPontos(ponto);
        } else {
            exibicao += pontoTemplate.criarExibicaoPonto(ponto);
        }
    });

    exibicao += `<input class="btn" onClick="gravarNovaPlanilha()" type="button" value="Gerar planilha de pontos"></input>`;
    divPontos.html(exibicao);
    switchTabs(guiaTdsPontos, guiaInconsistencias, guiaPreview);

}

setarNovoPonto = (event) => {
    planilhaService.corrigirPonto(wb, event.target.id, event.target.value);
};

marcarDebitoBancoHoras = (event) => {
    console.log('btnid', event.target.id);
    let linha = event.target.id.substring(1, 3);

    let cont = 2;
    while (cont < 10) {
        corrigirPonto(colunas[cont] + linha, '');
        cont++;
    }

    corrigirPonto('K' + linha, 'Débito Banco Horas');
    exibicaoAtiva();
}



voltarInicio = (event) => {
    divPontos.hide();
    divPontos.html('');
    telaPontos.attr('hidden', true);
    inicio.show();
}

switchTabs = (active, ...inactives) => {
    active.addClass('tab-active').removeClass('tab-inactive');
    inactives.forEach(inactive => {
        inactive.removeClass('tab-active').addClass('tab-inactive');
    })
}

exibirPreviewPlanilha = () => {
    exibicaoAtiva = exibirPreviewPlanilha;
    pontos = planilhaService.carregarPontosPlanilha(wb, true);
    let exibicao = '<table style="color: white">';
    pontos.forEach(ponto => {
        exibicao += pontoTemplate.criarLinhaPreviewPlanilha(ponto);
    });

    exibicao += '</table>'
    switchTabs(guiaPreview, guiaInconsistencias, guiaTdsPontos);
    divPontos.html(exibicao);
    console.log(exibicao);
}

exibirInconsistencias = () => {
    exibicaoAtiva = exibirInconsistencias;
    let exibicao = '';
    pontos = planilhaService.removerPontosInvalidos(pontos, false);
    for(i = 0; i < pontos.length; i++){
        for(pontoCol = 2; pontoCol < 10; pontoCol++){
            if(pontos[i][pontoCol].valor !== 'Sem Ponto'){
                pontos[i]['marcacoesPonto'] = pontos[i]['marcacoesPonto']? pontos[i]['marcacoesPonto']+ 1: 1
            }else{
                pontos[i]['marcacoesPonto'] = pontos[i]['marcacoesPonto']? pontos[i]['marcacoesPonto'] : 0 
            }
        }
    }

    let inconsistencias = pontos.filter(ponto => ponto.marcacoesPonto == 0 || ponto.marcacoesPonto%2 !== 0)
    inconsistencias.forEach(ponto => {
        if (exibicaoCompleta) {
            exibicao += pontoTemplate.criarExibicaoOitoPontos(ponto);
        } else {
            exibicao += pontoTemplate.criarExibicaoPonto(ponto);
        }
    });
    exibicao += `<input class="btn" onClick="gravarNovaPlanilha()" type="button" value="Gerar planilha de pontos"></input>`;
    divPontos.html(exibicao);
    console.log('Inconsistencias', inconsistencias);
    switchTabs(guiaInconsistencias, guiaTdsPontos, guiaPreview);
}
