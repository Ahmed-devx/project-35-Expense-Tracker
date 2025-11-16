var state = {
  transactions: [],
};

var isUpdate = false;
var editId = null;

var formEl = document.getElementById("transactionForm");
var netEl = document.getElementById("netAmount");
var earningEl = document.getElementById("earning");
var expenseEl = document.getElementById("expense");
var txContainer = document.querySelector(".transactions");

function render() {
  var earning = 0;
  var expense = 0;
  txContainer.innerHTML = "";

  for (var i = 0; i < state.transactions.length; i++) {
    var tx = state.transactions[i];
    var isCredit = tx.type == "credit";
    var sign = isCredit ? "+" : "-";

    var txHtml =
      '<div class="transaction" id="' +
      tx.id +
      '">' +
      '<div class="content" onclick="toggleEdit(' +
      tx.id +
      ')">' +
      '<div class="left">' +
      "<p>" +
      tx.text +
      "</p>" +
      "<p>" +
      sign +
      " Rs " +
      tx.amount +
      "</p>" +
      "</div>" +
      '<div class="status ' +
      (isCredit ? "credit" : "debit") +
      '">' +
      (isCredit ? "C" : "D") +
      "</div>" +
      "</div>" +
      '<div class="lower">' +
      '<div class="icon" onclick="editTx(' +
      tx.id +
      ')">' +
      '<img src="./icons/pen.svg">' +
      "</div>" +
      '<div class="icon" onclick="deleteTx(' +
      tx.id +
      ')">' +
      '<img src="./icons/trash.svg">' +
      "</div>" +
      "</div>" +
      "</div>";

    txContainer.innerHTML += txHtml;

    if (isCredit) {
      earning += tx.amount;
    } else {
      expense += tx.amount;
    }
  }

  var net = earning - expense;
  netEl.innerHTML = "Rs " + net;
  earningEl.innerHTML = "Rs " + earning;
  expenseEl.innerHTML = "Rs " + expense;
}

function addTx(e) {
  e.preventDefault();

  var text = document.getElementById("text").value;
  var amount = Number(document.getElementById("amount").value);
  var type = e.submitter.id == "earnBtn" ? "credit" : "debit";

  if (isUpdate) {
    for (var i = 0; i < state.transactions.length; i++) {
      if (state.transactions[i].id == editId) {
        state.transactions[i].text = text;
        state.transactions[i].amount = amount;
        state.transactions[i].type = type;
      }
    }
    isUpdate = false;
    editId = null;
  } else {
    var transaction = {
      id: Math.floor(Math.random() * 10000),
      text: text,
      amount: amount,
      type: type,
    };
    state.transactions.push(transaction);
  }

  formEl.reset();
  render();
}

function toggleEdit(id) {
  var txEl = document.getElementById(id);
  var lower = txEl.querySelector(".lower");
  if (lower.style.display == "flex") {
    lower.style.display = "none";
  } else {
    lower.style.display = "flex";
  }
}

function editTx(id) {
  for (var i = 0; i < state.transactions.length; i++) {
    if (state.transactions[i].id == id) {
      document.getElementById("text").value = state.transactions[i].text;
      document.getElementById("amount").value = state.transactions[i].amount;
      isUpdate = true;
      editId = id;
    }
  }
}

function deleteTx(id) {
  var newTx = [];
  for (var i = 0; i < state.transactions.length; i++) {
    if (state.transactions[i].id != id) {
      newTx.push(state.transactions[i]);
    }
  }
  state.transactions = newTx;
  render();
}

formEl.addEventListener("submit", addTx);
render();
