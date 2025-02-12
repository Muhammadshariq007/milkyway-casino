exports.getLandingPage = (req, res) => {
  res.render("index", { title: "MKC | Home" });
};


// exports.getSignupPage = (req, res) => {
//   res.render("signup", { title: "MKC | Sign Up" });

// };

exports.getPaymentInfoPage = (req, res) => {
  const balance = 100; // Example balance; replace with actual data
  const transactions = [
    { type: "Credit", amount: 50, date: "2024-10-06" },
    { type: "Debit", amount: 20, date: "2024-10-05" },
  ]; // Example transactions; replace with actual data

  res.render("payment-info", {
    title: "MKC | Payment Information",
    balance: balance,
    transactions: transactions,
    user: req.user, // Pass the user data if logged in
  });
};

exports.getDepositPage = (req, res) => {
  res.render("payment-deposit", { title: "MKC | Deposit" });
};
