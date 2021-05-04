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

const Transaction = {
    all: [

        {
            description: 'Luz',
            amount: -50000,
            date: '23/01/2021',
        },
        {
            description: 'Website',
            amount: 500000,
            date: '23/01/2021',
        },
        {
            description: 'Internet',
            amount: -20000,
            date: '23/01/2021',
        },
        {
            description: 'Kit de Peles de Bateria',
            amount: -35000,
            date: '23/01/2021',
        }
    ],

    // add new transactions
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload();
    },



    incomes() {
        // Pegar todas as transações, verificar se é maior que zero. Para cada transação, se for maior que zero, somar a uma variável e retornar a variável.

        let income = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })

        return income
    },
    expenses() {
        // somar as saídas

        let expense = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
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
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
}

// Formatação da moeda
const Utils = {
    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },

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

// forms
const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },


    validateFields() {
        const { description, amount, date } = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Preencha todos os campos!")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
        
        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {

            // checking all information 
            Form.validateFields()

            // format data to save
            const transaction = Form.formatValues()

            // saving form
            Transaction.add(transaction)

            // delete data form
            Form.clearFields()

            // closing modal 
            // refreshing application 

        } catch (error) {
            alert(error.message);
        }


    }
}

// reload dos códigos
const App = {
    init() {

        // Imprimindo a tabela na tela
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        });

        DOM.updateBalance();
    },

    reload() {
        DOM.clearTransactions();
        App.init();
    },
}

App.init();


