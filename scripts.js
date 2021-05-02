const Modal = {
    open() {
        // Abrir modal
        // Adicionar a class active ao modal 
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },
    close() {
        // Fechar modal
        // Remover a class active ao modal 
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021',
    },
    {
        id: 2,
        description: 'Website',
        amount: 500000,
        date: '23/01/2021',
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021',
    },
    {
        id: 4,
        description: 'Kit de Peles de Bateria',
        amount: -35000,
        date: '23/01/2021',
    }
]

const Transaction = {
    incomes() {
        // Pegar todas as transações, verificar se é maior que zero. Para cada transação, se for maior que zero, somar a uma variável e retornar a variável.
        
        let income = 0;

        transactions.forEach( transaction => {
            if (transaction.amount > 0 ) {
                income += transaction.amount;
            }
        })

        return income
    },
    expenses() {
        // somar as saídas

        let expense = 0;

        transactions.forEach( transaction => {
            if (transaction.amount < 0 ) {
                expense += transaction.amount
            }
        });

        return expense
    },
    total() {
        // somar entradas - saídas
        
        return Transaction.incomes() + Transaction.expenses();
    }
}

// Substituindo a tabela de entradas e saídas do HTML com o JS
const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        
        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = ` 
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                <img src="./assets/minus.svg" alt="Remover Transação">
                </td>
        `
        return html 
    },

    updateBalance() {

        // Soma das Entradas
        document.getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes())

        // Soma das Saídas
        document.getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses())

        // Total
        document.getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total())
    }
}


// Formatação da moeda
const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        
        // REGEX para colocar o R$
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        })

        return signal + value
    }
}


// Imprimindo a tabela na tela
transactions.forEach(function(transaction) {
    DOM.addTransaction(transaction)
});

DOM.updateBalance();