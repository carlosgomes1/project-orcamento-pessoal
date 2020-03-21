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

            despesas.push(despesa)
        }

        return despesas
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

function carregaListaDespesa() {
    let despesas = []

    despesas = bd.recuperarTodosRegistros()
    
    let tabela = document.getElementById('tabela')

    despesas.forEach((d) => {
        let data = `${ d.dia } / ${ d.mes } / ${ d.ano }`

        console.log(d, d.tipo)

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
    })

}