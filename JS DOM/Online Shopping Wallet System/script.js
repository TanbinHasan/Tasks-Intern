const user_info = JSON.parse(localStorage.getItem("store")) || [];
let active_user = localStorage.getItem("active") || null;
let product_no = JSON.parse(localStorage.getItem("product_no")) || 0;
let product_list = JSON.parse(localStorage.getItem("products")) || [];

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#loginBtn")[0].addEventListener("click", login);
  document.querySelectorAll("#registerBtn")[0].addEventListener("click", showRegister);
  document.querySelectorAll("#create_account")[0].addEventListener("click", register);
  document.querySelectorAll("#backToLogin")[0].addEventListener("click", showLogin);
  document.querySelectorAll("#cashInBtn")[0].addEventListener("click", cashIn);
  document.querySelectorAll("#cashOutBtn")[0].addEventListener("click", cashOut);
  document.querySelectorAll("#buyProducts")[0].addEventListener("click", buyProduct);
  document.querySelectorAll("#logoutBtn")[0].addEventListener("click", logout);
  document.querySelectorAll("#backToDashboardBtn")[0].addEventListener("click", showDashboard);

  if (active_user) showDashboard();
});

function login() {
  const username = document.querySelectorAll("#username_input")[0].value.trim();
  const password = document.querySelectorAll("#password_input")[0].value;
  if (!user_info.find((user) => user.username === username && user.password === password)) {
    alert("Incorrect username or password.");
    return;
  }
  active_user = username;
  localStorage.setItem("active", active_user);
  showDashboard();
  sessionTimeOut();
}

function showDashboard() {
  document.querySelectorAll("#productPage")[0].classList.add("hidden");
  document.querySelectorAll("#loginPage")[0].classList.add("hidden");
  document.querySelectorAll("#registerPage")[0].classList.add("hidden");
  document.querySelectorAll("#walletPage")[0].classList.remove("hidden");
  const user = user_info.find((user) => user.username === active_user);
  document.querySelectorAll("#cur_balance")[0].value = user.wallet;
}

function showRegister() {
  document.querySelectorAll("#productPage")[0].classList.add("hidden");
  document.querySelectorAll("#loginPage")[0].classList.add("hidden");
  document.querySelectorAll("#registerPage")[0].classList.remove("hidden");
}

function showLogin() {
  document.querySelectorAll("#productPage")[0].classList.add("hidden");
  document.querySelectorAll("#registerPage")[0].classList.add("hidden");
  document.querySelectorAll("#loginPage")[0].classList.remove("hidden");
}

function register() {
  const username = document.querySelectorAll("#r_username_input")[0].value.trim();
  const password = document.querySelectorAll("#r_password_input")[0].value;
  const confirmPassword = document.querySelectorAll("#confirm_password_input")[0].value;
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }
  if (user_info.find((user) => user.username === username)) {
    alert("Username already exists.");
    return;
  }

  user_info.push({ username, password, wallet: 0, transactions: [] });
  localStorage.setItem("store", JSON.stringify(user_info));

  alert("Account created successfully.");
  showLogin();
}


function showDashboard() {
  document.querySelectorAll("#productPage")[0].classList.add("hidden");
  document.querySelectorAll("#loginPage")[0].classList.add("hidden");
  document.querySelectorAll("#registerPage")[0].classList.add("hidden");
  document.querySelectorAll("#walletPage")[0].classList.remove("hidden");

  const user = user_info.find((user) => user.username === active_user);
  // console.log(user.wallet);
  document.querySelectorAll("#cur_balance")[0].value = user.wallet;
}

function cashIn() {
  const amount = parseFloat(document.querySelectorAll("#cashin")[0].value);
  console.log(typeof amount);

  if (typeof amount !== "number" || typeof amount === "NaN") {
    alert("Insert a number");
    return;
  }
  if (amount < 500) {
    alert("Minimum cash-in amount is 500.");
    return;
  }
  alert(`${amount} added successfully.`);
  const user = user_info.find((user) => user.username === active_user);
  user.wallet += amount;
  user.transactions.push(`Cash In: + ${amount}`);
  while (user.transactions.length > 5) user.transactions.shift();
  localStorage.setItem("store", JSON.stringify(user_info));
  showDashboard();
}

function cashOut() {
  const amount = parseFloat(document.querySelectorAll("#cashout")[0].value);
  if (typeof amount !== "number" || typeof amount === "NaN") {
    alert("Insert a number");
    return;
  }
  const user = user_info.find((user) => user.username === active_user);
  if (amount > user.wallet) {
    alert("Insufficient balance.");
    return;
  }
  alert(`Cash out ${amount} successfully.`);
  user.wallet -= amount;
  user.transactions.push(`Cash Out: -${amount}`);
  while (user.transactions.length > 5) user.transactions.shift();
  localStorage.setItem("store", JSON.stringify(user_info));
  showDashboard();
}

function showProduct() {
  document.querySelectorAll("#productPage")[0].classList.remove("hidden");
  document.querySelectorAll("#loginPage")[0].classList.add("hidden");
  document.querySelectorAll("#registerPage")[0].classList.add("hidden");
  document.querySelectorAll("#walletPage")[0].classList.add("hidden");
}

function createProduct(name, amount) {
  let product_items = document.getElementById("product_items");
  let div = document.createElement("div");
  div.classList.add(`product-${++product_no}`);

  let ol = document.createElement("ol");
  ol.innerText = `${name}: ${amount} taka`;

  
  let btn = document.createElement("button");
  btn.innerText = "Buy Now";
  let cur_id = String(product_no);
  btn.id = cur_id;
  
  product_list.push({ name, price: amount, product_id: btn.id });

  div.appendChild(ol);
  div.appendChild(btn);
  product_items.appendChild(div);

  document.getElementById(cur_id).addEventListener("click", () => {
    alert(`Purchased item ${name} successfully`);
    const user = user_info.find((user) => user.username === active_user);
    if (amount > user.wallet) {
      alert("Insufficient balance.");
      return;
    }
    // console.log(user.wallet, amount);
    user.wallet -= amount;
    user.transactions.push(`Purchased item ${name}: -${amount}`);
    while (user.transactions.length > 5) user.transactions.shift();
    localStorage.setItem("store", JSON.stringify(user_info));
  });

  localStorage.setItem("products", JSON.stringify(product_list));
  localStorage.setItem("product_no", JSON.stringify(product_no));
}

function buyProduct() {
  showProduct();
  
}

function logout() {
  active_user = null;
  localStorage.removeItem("active");
  document.querySelectorAll("#walletPage")[0].classList.add("hidden");
  document.querySelectorAll("#loginPage")[0].classList.remove("hidden");
}

function sessionTimeOut() {
  setInterval(() => {
    logout();
  }, 180000);
}

// some random insertions
createProduct("Apex Shoe", 1000);
createProduct("Bata Shoe", 700);
createProduct("Chocoloate", 400);
createProduct("Flower", 100);
createProduct("Dark Chocolate", 100);