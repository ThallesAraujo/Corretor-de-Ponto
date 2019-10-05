var espaco = '<div style="min-width: 50px"></div>'

testarPontoNaoNulo = (ponto) => {
    return ponto !== 'Sem Ponto' && ponto !== ''? ponto: espaco
}

function criarExibicaoPonto (ponto) {
    return `
        <div id="div${ponto[1]['celula']}" class="card-ponto">
                        <h3 class="data-ponto" style="max-width: 20%"><i class="fa fa-calendar" style="margin-right: 10px"></i> ${ponto[0]['valor']}</h3>
                        <div style="display: flex">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[2]['celula']}" type='text' value="${ponto[2]['valor']}">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[3]['celula']}" type='text' value="${ponto[3]['valor']}">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[4]['celula']}" type='text' value="${ponto[4]['valor']}">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[5]['celula']}" type='text' value="${ponto[5]['valor']}">
                        <input id="${ponto[1]['celula']}" class="btn-debito-bh" onClick="marcarDebitoBancoHoras(event)"  type="button" value="Marcar Débito Banco Horas"></input>
                        </div>
                     </div>`
}

function criarExibicaoOitoPontos(ponto) {
    return `
        <div id="div${ponto[1]['celula']}" class="card-ponto">
                        <h3 class="data-ponto" style="max-width: 20%"><i class="fa fa-calendar" style="margin-right: 10px"></i> ${ponto[0]['valor']}</h3>
                        <div style="display: flex">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[2]['celula']}" type='text' value="${ponto[2]['valor']}">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[3]['celula']}" type='text' value="${ponto[3]['valor']}">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[4]['celula']}" type='text' value="${ponto[4]['valor']}">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[5]['celula']}" type='text' value="${ponto[5]['valor']}">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[6]['celula']}" type='text' value="${ponto[6]['valor']}">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[7]['celula']}" type='text' value="${ponto[7]['valor']}">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[8]['celula']}" type='text' value="${ponto[8]['valor']}">
                        <input onKeyUp="setarNovoPonto(event)" class="input-ponto" id="${ponto[9]['celula']}" type='text' value="${ponto[9]['valor']}">
                        </div>
                        <div>
                        <h3 class="data-ponto" style="max-width: 20%"><i class="fa fa-exclamation-triangle" style="margin-right: 10px"></i>Evento</h3>
                            <input onKeyUp="setarNovoPonto(event)" id="${ponto[10]['celula']}" type='text' value="${ponto[10]['valor']=== 'Sem Ponto'? 'Digite uma justificativa...': ponto[10]['valor']}">
                        </div>
                        <input id="${ponto[1]['celula']}" class="btn-debito-bh" onClick="marcarDebitoBancoHoras(event)"  type="button" value="Marcar Débito Banco Horas"></input>
                     </div>`
}

function criarLinhaPreviewPlanilha(ponto){
    return `
    <tr>
        <td style='${ponto[0]['estilo']}'>${testarPontoNaoNulo(ponto[0]['valor'])}</td>
        <td style='${ponto[1]['estilo']}'>${testarPontoNaoNulo(ponto[1]['valor'])}</td>
        <td style='${ponto[2]['estilo']}'>${testarPontoNaoNulo(ponto[2]['valor'])}</td>
        <td style='${ponto[3]['estilo']}'>${testarPontoNaoNulo(ponto[3]['valor'])}</td>
        <td style='${ponto[4]['estilo']}'>${testarPontoNaoNulo(ponto[4]['valor'])}</td>
        <td style='${ponto[5]['estilo']}'>${testarPontoNaoNulo(ponto[5]['valor'])}</td>
        <td style='${ponto[6]['estilo']}'>${testarPontoNaoNulo(ponto[6]['valor'])}</td>
        <td style='${ponto[7]['estilo']}'>${testarPontoNaoNulo(ponto[7]['valor'])}</td>
        <td style='${ponto[8]['estilo']}'>${testarPontoNaoNulo(ponto[8]['valor'])}</td>
        <td style='${ponto[9]['estilo']}'>${testarPontoNaoNulo(ponto[9]['valor'])}</td>
        <td style='${ponto[10]['estilo']}'>${testarPontoNaoNulo(ponto[10]['valor'])}</td>
    </tr>
    `
}

module.exports = {
    criarExibicaoOitoPontos,
    criarExibicaoPonto,
    criarLinhaPreviewPlanilha
}


