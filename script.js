'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const emptyAccount = {
  owner: '',
  movements: [],
  interestRate: 0, // %
}

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

/*const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};*/

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2/*, account3, account4*/];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// movements
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  const movements = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}
// displayMovements(account1);

// Username
const createUsername = function (accounts) {
 accounts.forEach((acc) => {
   acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('').toUpperCase();
 });
}
createUsername(accounts);

// balance
const calcAndDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  labelBalance.textContent = account.balance + '€';
};
// calcAndDisplayBalance(account1);

// balance summary
const calcAndDisplaySummary = function (account) {
  const incomes = account.movements.filter(mov => mov > 0).reduce((acc, income) => acc + income, 0);
  labelSumIn.textContent = incomes + '€';
  const spending = account.movements.filter(mov => mov < 0).reduce((acc, spend) => acc + spend, 0);
  labelSumOut.textContent = Math.abs(spending) + '€';
  const interest = account.movements
      .filter(mov => mov > 0)
      .map((deposit) => (deposit * account.interestRate) /100)
      .filter(int => int >=1 )
      .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = interest + '€';
}
// calcAndDisplaySummary(account1);

// update user interface
const updateInterface = function (account) {
  // display movements
  displayMovements(account);
  // display balance
  calcAndDisplayBalance(account);
  // display summary
  calcAndDisplaySummary(account);
}

// login
let signupAccount = null;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  const inputUsername = inputLoginUsername.value.toLowerCase();
  const inputPin = inputLoginPin.value.toLowerCase();
  signupAccount = accounts.find((acc) => acc['username'].toLowerCase() === inputUsername);

  if (signupAccount?.pin === Number(inputPin)) {
    // welcome message
    labelWelcome.textContent = `Welcome back, ${signupAccount.owner.split(' ')[0]}!`;

    // display container
    containerApp.style.opacity = '100';

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
    updateInterface(signupAccount);
  } else {
    containerApp.style.opacity = '0';
    alert('Wrong credentials. Please try again.');
  }

});

// transfer amount
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const transferTo = inputTransferTo.value.toLowerCase();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find((acc) => acc['username'].toLowerCase() === transferTo);

  if (amount > 0 && !!receiverAccount && amount <= signupAccount['balance']
      && receiverAccount.username !== signupAccount.username) {
    signupAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();
    updateInterface(signupAccount);
  } else {
    alert('Invalid transfer. Please try again.');
  }
});

// close account
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  const closeUsername = inputCloseUsername.value.toLowerCase();
  const closePin = Number(inputClosePin.value);
  if (closeUsername === signupAccount.username.toLowerCase() && closePin === signupAccount.pin) {
    const index = accounts.findIndex((account) => account['username'].toLowerCase() === closeUsername);
    if (index !== -1) {
      containerApp.style.opacity = '0';
      updateInterface(emptyAccount);
      inputCloseUsername.value = inputClosePin.value = '';
      accounts.splice(index, 1);
    } else {
      alert('Could not found the account. Please try again.');
    }
  } else {
    alert('Wrong credentials. Please try again.');
  }
});

// request loan
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = inputLoanAmount.value;
  if (amount && signupAccount.movements.some(mov => mov >= (amount * 0.1))) {
    signupAccount.movements.push(amount);
    updateInterface(signupAccount);
    inputLoanAmount.value = '';
  } else {
    alert('Could not approved the requested loan. Please try with different amount.');
  }
});

// sort movements
let toggleSort = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(signupAccount, toggleSort = !toggleSort);
});
