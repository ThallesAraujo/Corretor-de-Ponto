module.exports = {

    criarExibicaoPonto: function (ponto) {
        return `
            <div id="div${ponto[1]['celula']}" style="display: flex, margin: 15px">
                            <h3 class="data-ponto" style="max-width: 20%"><i class="fa fa-calendar" style="margin-right: 10px"></i> ${ponto[0]['valor']}</h3>
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[2]['celula']}" type='text' value="${ponto[2]['valor']}">
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[3]['celula']}" type='text' value="${ponto[3]['valor']}">
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[4]['celula']}" type='text' value="${ponto[4]['valor']}">
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[5]['celula']}" type='text' value="${ponto[5]['valor']}">
                            <input id="${ponto[1]['celula']}" class="btn-debito-bh" onClick="marcarDebitoBancoHoras(event)"  type="button" value="Marcar Débito Banco Horas"></input>
                         </div>`
    },

    criarExibicaoOitoPontos: function (ponto) {
        return `
            <div id="div${ponto[1]['celula']}" style="display: flex, margin: 15px">
                            <h3 class="data-ponto" style="max-width: 20%"><i class="fa fa-calendar" style="margin-right: 10px"></i> ${ponto[0]['valor']}</h3>
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[2]['celula']}" type='text' value="${ponto[2]['valor']}">
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[3]['celula']}" type='text' value="${ponto[3]['valor']}">
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[4]['celula']}" type='text' value="${ponto[4]['valor']}">
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[5]['celula']}" type='text' value="${ponto[5]['valor']}">
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[6]['celula']}" type='text' value="${ponto[6]['valor']}">
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[7]['celula']}" type='text' value="${ponto[7]['valor']}">
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[8]['celula']}" type='text' value="${ponto[8]['valor']}">
                            <input onKeyUp="setarNovoPonto(event)" style="max-width: 10%" id="${ponto[9]['celula']}" type='text' value="${ponto[9]['valor']}">
                            <input id="${ponto[1]['celula']}" class="btn-debito-bh" onClick="marcarDebitoBancoHoras(event)"  type="button" value="Marcar Débito Banco Horas"></input>
                         </div>`
    }
}


