const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

let expenses = [];

document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const description = document.getElementById('description').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const value = parseFloat(document.getElementById('value').value);
    const currencyFrom = document.getElementById('currencyFrom').value;
    const currencyTo = document.getElementById('currencyTo').value;
  
    const convertedValue = await convertCurrency(value, currencyFrom, currencyTo);
    const totalConverted = (convertedValue * quantity).toFixed(2); // Corrigido
  
    const expense = { 
      description, 
      quantity,value, 
      currencyFrom,  
      convertedValue: 
      parseFloat(totalConverted), currencyTo 
    };
  
    expenses.push(expense);
    updateExpenseList();
    updateTotals();
    e.target.reset();
  });
  
  async function convertCurrency(value, from, to) {
    const res = await fetch(`${API_URL}${from}`);
    const data = await res.json();
    return (value * data.rates[to]).toFixed(2);
  }
  
  function updateExpenseList() {
    const list = document.getElementById('expenses-list');
    list.innerHTML = '';
  
    expenses.forEach((expense, index) => {
      const item = document.createElement('div');
      item.className = 'expense-item';
      item.innerHTML = `
        <span>${expense.description} (Qtd. ${expense.quantity}): ${expense.value} ${expense.currencyFrom} ➡ ${expense.convertedValue} ${expense.currencyTo}</span>

        <span 
            class="material-icons edit-icon" 
            onclick="editExpense(${index})"
            style="cursor: pointer; margin-left: 10px; color: #007bff;">
            edit
        </span>

        <span 
            class="material-icons delete-icon" 
            onclick="deleteExpense(${index})"
            style="cursor: pointer; margin-left: 10px; color: #dc3545;">
            delete
        </span>
      `;
      list.appendChild(item);
    });
  }
  
  function updateTotals() {
    const totalOriginal = expenses.reduce((acc, exp) => acc + (exp.value * exp.quantity), 0); // Corrigido
    const totalConverted = expenses.reduce((acc, exp) => acc + exp.convertedValue, 0); // Corrigido
  
    document.getElementById('total-original').textContent = `Total (Moeda de Origem): ${totalOriginal.toFixed(2)}`;
    document.getElementById('total-converted').textContent = `Total (Moeda de Destino): ${totalConverted.toFixed(2)}`;
  }
  
  function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('description').value = expense.description;
    document.getElementById('quantity').value = expense.quantity;
    document.getElementById('value').value = expense.value;
    document.getElementById('currencyFrom').value = expense.currencyFrom;
    document.getElementById('currencyTo').value = expense.currencyTo;
    expenses.splice(index, 1);
    updateExpenseList();
    updateTotals();
  }
  
  function deleteExpense(index) {
    expenses.splice(index, 1);
    updateExpenseList();
    updateTotals();
  }