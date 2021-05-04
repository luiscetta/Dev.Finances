const Modal = {
    open() {
        // Open modal
        // Add class active to modal 
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },
    close() {
        // Close modal
        // Remover class active of modal 
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
}

const Storage = {
    get() {

        // transform string to array or object
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transaction", 

        // transform array to string
        JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

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
        // Take all transactions, check if it is greater than zero. For each transaction, if it is greater than zero, add to a variable and return the variable.

        let income = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })

        return income
    },
    expenses() {
        // sum expenses

        let expense = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        });

        return expense
    },
    total() {
        // sum incomes - expenses

        return Transaction.incomes() + Transaction.expenses();
    }
}

// Replacing the HTML input and output table with JS
const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"


        const amount = Utils.formatCurrency(transaction.amount)

        const html = ` 
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
                </td>
        `
        return html
    },

    updateBalance() {

        // Incomes Sum
        document.getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        // Expenses Sum
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

// Currency formatting
const Utils = {
    formatAmount(value) {
        value = Number(value.replace(/\,\./g, "")) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        // REGEX to put R$
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
            Modal.close()

        } catch (error) {
            alert(error.message);
        }

    }
}


// init/reload of codes
const App = {
    init() {

        // Printing the table on the screen
        Transaction.all.forEach(DOM.addTransaction);

        // Updating cards
        DOM.updateBalance();

        // Updating Local Storage
        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions();
        App.init();
    },
}

App.init();


