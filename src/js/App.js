class Despesa {
    constructor( ano, mes, dia, tipo, descricao, valor ) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for( let i in this ) {

            if( this[i] === '' || this[i] === undefined || this[i] === null ) {
                return false
            }
        }

        return true
    }
}

class Bd {
    constructor() {
        var id = localStorage.getItem('id')

        if( id === null ) {
            localStorage.setItem('id', 0)
        }

    }

    getNextId() {
        let nextId = localStorage.getItem('id')
        return parseInt(nextId) + 1
    }

    gravar( d ) {
        let id = this.getNextId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let despesas = []

        let id = localStorage.getItem('id')

        for( let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if( despesa === null ) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar( despesa ) {
        let despesasFiltradass = []

        let despesasFiltradas = this.recuperarTodosRegistros()

        // ano
        if( despesa.ano != '' ) {
            despesasFiltradass = despesasFiltradas.filter( (d) => d.ano == despesa.ano )
        }

        // mes

        if( despesa.mes != '' ) {
            despesasFiltradass = despesasFiltradas.filter( (d) => d.mes == despesa.mes )
        }

        // dia

        if( despesa.dia != '' ) {
            despesasFiltradass = despesasFiltradas.filter( (d) => d.dia == despesa.dia )
        }

        // tipo

        if( despesa.tipo != '' ) {
            despesasFiltradass = despesasFiltradas.filter( (d) => d.tipo == despesa.tipo )
        }

        // descrição

        if( despesa.descricao != '' ) {
            despesasFiltradass = despesasFiltradas.filter( (d) => d.descricao == despesa.descricao )
        }

        // valor

        if( despesa.valor != '' ) {
            despesasFiltradass = despesasFiltradas.filter( (d) => d.valor == despesa.valor )
        }

        return despesasFiltradass
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if( despesa.validarDados() ) {
        bd.gravar(despesa)

        document.getElementById('modalHeader').setAttribute('class', 'modal-header text-success')
        document.getElementById('textModalTitle').innerHTML = 'Sucesso!'
        document.getElementById('modalBody').innerHTML = 'Dados enviados com sucesso'
        document.getElementById('botaoModal').setAttribute('class', 'btn btn-success')
        document.getElementById('botaoModal').innerHTML = 'Continuar'


        $('#modalRegistroDespesa').modal('show')
        
        ano.value = '', mes.value = '', dia.value = '', descricao.value = '', valor.value = ''

    } else {
        document.getElementById('modalHeader').setAttribute('class', 'modal-header text-danger')
        document.getElementById('textModalTitle').innerHTML = 'Erro no envio de dados'
        document.getElementById('modalBody').innerHTML = 'Preencha os campos necessários'
        document.getElementById('botaoModal').setAttribute('class', 'btn btn-danger')
        document.getElementById('botaoModal').innerHTML = 'Voltar e corrigir'

        $('#modalRegistroDespesa').modal('show')
    }

}

function carregaListaDespesa(despesas = [], filtro = false) {

    if( despesas.length == 0 && filtro == true ) {
        document.getElementById('modalHeader').setAttribute('class', 'modal-header text-danger')
        document.getElementById('textModalTitle').innerHTML = 'Erro ao buscar dados'
        document.getElementById('modalBody').innerHTML = 'Não conseguimos encontrar dados com esses filtros, a lista inteira foi retornada'
        document.getElementById('botaoModal').setAttribute('class', 'btn btn-danger')
        document.getElementById('botaoModal').innerHTML = 'Voltar'
        $('#modalError').modal('show')
    }

    if(despesas.length == 0) {
        despesas = bd.recuperarTodosRegistros()
    }

    let tabela = document.getElementById('tabela')

    tabela.innerHTML = ''

    despesas.forEach((d) => {
        let data = `${ d.dia } / ${ d.mes } / ${ d.ano }`

        let linha = tabela.insertRow()
        
        switch(parseInt(d.tipo)) {
            case 1:
                d.tipo = 'Alimentação'
                break;
            case 2:
                d.tipo = 'Educação'
                break;
            case 3:
                d.tipo = 'Lazer'
                break;
            case 4:
                d.tipo = 'Saúde'
                break;
            case 5:
                d.tipo = 'Transportes'
                break;
        }

        linha.insertCell(0).innerHTML = data
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = `R$${ parseFloat(d.valor).toFixed(2) }`

        // botao de exclusão

        let btn = document.createElement('button')
        btn.setAttribute('class', 'btn btn-danger')
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = 'id-despesa-' + d.id
        btn.onclick = () => {
            let id = btn.id.replace('id-despesa-', '')
            bd.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d)
    })

}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesa(despesas, true)
    console.log(despesas)

}