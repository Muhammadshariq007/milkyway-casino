<template>
  <main class="container">
    <div class="row align-content-start justify-content-around">
      <div class="text-center flex" style="height: 130px">
        <img src="../assets/winner.png" height="auto" width="20%" />
        <h1 style="color: white">{{ winnerResult }}</h1>
      </div>
      <div class="text-center flex">
        <!-- <h4 class="text-warning">{{ status }}</h4> -->
      </div>
      <div class="container-fluid">
        <div class="row justify-content-center align-items-center">
          <div class="coin-container glassmorphism-wrapper card-wrapper">
            <div class="coin" :class="{ flip: isFlipping }" ref="coin">
              <img :src="coinImage" alt="Coin" />
            </div>
            <div id="final-value" class="mt-2">
              <p>Bet on your option</p>
            </div>
            <div class="bet-options">
              <input type="number" id="bet-amount" placeholder="Enter amount" v-model="betAmount" />
            </div>
            <div class="bet-container mt-4">
              <button class="btn btn-warning btn-lg" :disabled="disabledButtons || activeBet" @click="placeBet(1)">
                Head
              </button>
              <button class="btn btn-warning btn-lg" :disabled="disabledButtons || activeBet" @click="placeBet(2)">
                Tail
              </button>
            </div>
            <div class="mt-2">

              <h1>
                Coins:
                <span id="total-coins">{{ userCoins }}</span>
              </h1>
            </div>
            <p id="countdown">{{ timeLeft }}</p>
            <div v-if="showAlert" class="alert alert-success alert-dismissible fade show" role="alert">
              Bet has been placed
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
                @click="hideAlert"></button>
            </div>
          </div>
          <div class="bet-container">
            <div class="card card-size shadow-lg text-center p-4">
              <div class="card-body">
                <h1 class="mb-4 text-5xl font-bold">
                  <span class="text-warning">Score Board </span>
                </h1>
                <div class="row mb-3">
                  <h5 class="mb-1 text-5xl font-bold">
                    <span class="text-warning">Total Coins</span>

                  </h5>
                  <h5 class="mb-1 text-5xl font-bold">
                    <span class="text-warning">{{ totalCoins }}</span>
                  </h5>
                </div>

                <div class="list-body custom-scroll">
                  <table class="table transparent-table">
                    <thead>
                      <tr>
                        <th class="text-warning">Players</th>
                        <th class="text-warning">Bet Coins </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(opt, index) in option1" :key="index">
                        <td>
                          <span class="user-name">{{ fourCharacters(opt.user.fullName) }}</span>
                        </td>
                        <td>
                          <span class="user-coins">{{ opt.coins }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div id="globalError" class="text-danger" v-if="errorMessage">
        {{ errorMessage }}
      </div>

      <p class="result"></p>
    </div>
  </main>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import apiService from "../services/apiService";
import socket from "../services/websocket";
import gameServices from "../services/gameServices";

const userCoins = ref("");
const betAmount = ref(0);
const isFlipping = ref(false);
const timeLeft = ref("");
const disabledButtons = ref(false);
const errorMessage = ref("");
const selected = ref([]);
const status = ref("");
let totalCoins = ref(0)
const coinImage = ref(
  "https://media.geeksforgeeks.org/wp-content/uploads/20231016151806/tails.png"
); // Default image

const option1 = ref([]);
const showAlert = ref(false);
const winnerResult = ref("");
const activeBet = ref(false);

watch(option1, (newValue) => {
  totalCoins.value = newValue.reduce((total, opt) => total + opt.coins, 0);
}, { immediate: true });

const fetchUsersCoins = async () => {
  errorMessage.value = "";
  try {
    const response = await apiService.getUserCoins();
    // Handle successful login, e.g., redirect or store tokens
    if (response.data.success) {
      userCoins.value = response.data?.data;
    } else {
      errorMessage.value = response.data?.message;
    }
  } catch (error) {
    if (error.response && error.response.data) {
      // Handle validation or server errors
      errorMessage.value =
        error.response.data.message || "An error occurred. Please try again.";
    } else {
      // Handle network errors
      errorMessage.value = "Network error. Please try again later.";
    }
  }
};
const fourCharacters = (fullName) => {
  // Check if fullName is a valid string
  if (!fullName || typeof fullName !== "string") {
    return ""; // Return empty string if fullName is not a valid string
  }

  // Get the first four characters of the string
  const truncatedName = fullName.slice(0, 4); // Slice the string to get the first four characters

  // If the length of the full name is greater than four, append ellipsis
  return fullName.length > 4 ? truncatedName + "..." : truncatedName;
};
// Function to trigger the coin flip based on the result
const flipCoin = (result) => {
  if (isFlipping.value) return; // Prevent multiple flips at once
  totalCoins.value = 0

  isFlipping.value = true; // Start flipping
  setTimeout(() => {
    // result is 1 for heads and 2 for tails
    coinImage.value =
      result === 1
        ? "https://media.geeksforgeeks.org/wp-content/uploads/20231016151817/heads.png" // Change to heads image
        : "https://media.geeksforgeeks.org/wp-content/uploads/20231016151806/tails.png"; // Change to tails image
    isFlipping.value = false; // End flipping
  }, 8000); // Set the duration for the flipping animation
};

const placeBet = async (betOption) => {
  if (betAmount.value === 0 || betAmount.value === null) {
    alert("Please select amount to continue");
    return;
  }
  errorMessage.value = "";
  try {
    const payload = {
      betOption: betOption,
      coins: betAmount.value,
      type: "FLIP",
    };
    const response = await gameServices.placeBet(payload);
    // Handle successful login, e.g., redirect or store tokens
    if (response.data.success) {
      showAlert.value = true;
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);
      // selected.value.push(betOption.toString());
      activeBet.value = true;
      await fetchUsersCoins();
    } else {
      errorMessage.value = response.data?.message;
    }
    betAmount.value = 0;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data) {
      // Handle validation or server errors
      this.errorMessage =
        error.response.data.message || "An error occurred. Please try again.";
    } else {
      // Handle network errors
      errorMessage.value = "Network error. Please try again later.";
    }
  }
};

const handleBetsResults = (data) => {
  option1.value = data?.option1;
};

const hideAlert = () => {
  showAlert.value = false;
};
onMounted(() => {
  fetchUsersCoins();

  // Listen to WebSocket messages
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // Handle the result of the coin flip
    if (data?.type === "flip") {
      const result = data?.data?.spinNumber; // 1 for heads, 2 for tails
      flipCoin(Number(result)); // Flip the coin based on the result from the WebSocket
      if (
        Number(result) === 1 ||
        Number(result) === 2 ||
        Number(result) === 3
      ) {
        activeBet.value = false;
      }
      if (result === "1" || result === 1) {
        winnerResult.value = "Heads";
      } else {
        winnerResult.value = "Tail";
      }
      if (selected.value.includes(result.toString())) {
        status.value = " You Win";
        setTimeout(() => {
          status.value = "";
          selected.value = [];
        }, 3000);
      } else {
        status.value = " You Win";

        setTimeout(() => {
          status.value = "";
          selected.value = [];
        }, 3000);
      }
      fetchUsersCoins();
    }

    // Handle flip bets (if needed, logic can be added here)
    if (data?.type == "flipBets") {
      handleBetsResults(data?.data);
    }

    // Handle countdown
    if (data?.type === "flipCountdown") {
      timeLeft.value = data?.timeLeft + "s";
      if (data?.timeLeft <= 5) {
        winnerResult.value = "";
        disabledButtons.value = true;
      } else {
        disabledButtons.value = false;
      }
    }
  };
});
</script>

<style scoped>
/* .bet-container {
  display: flex;
  justify-content: space-around;
} */
.bet-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  /* Space between cards */
  flex-wrap: wrap;
  /* Allow wrapping for smaller screens */
}


body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #1a1b1f;
}

.glassmorphism-wrapper {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
}

.card-wrapper {
  padding: 2.5rem;
  margin: 4rem;
}

@media screen and (max-width: 768px) {
  .card-wrapper {
    padding: 1.5rem 0;
    margin: 2rem 0;
  }
}

.coin-container {
  /* background-color: rgba(255, 255, 255, 0.9); */
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  text-align: center;
  animation: fadeIn 1s ease;
  width: 80%;
  max-width: 500px;
  perspective: 1000px;
  transition: transform 0.5s ease-in-out;
}

.card-size {
  min-width: 550px;
}

h1,
h2,
h3,
h4,
h5,
h6,
label,
p,
.form-label {
  color: #d9d9e3;
}

a {
  text-decoration: none;
  color: #d9d9e3;
}

a:hover {
  color: #d9d9e3;
}

.coin {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease-in-out;
  margin: 0 auto;
  backface-visibility: hidden;
}

.bet-options {
  margin-top: 20px;
  text-align: left;
  display: inline-block;
  width: 100%;
}

.bet-options label {
  display: block;
  margin-bottom: 10px;
}

#bet-amount {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-top: 10px;
}

.result {
  margin-top: 20px;
  font-size: 24px;
  color: #d9d9e3;
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
  text-transform: uppercase;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  letter-spacing: 2px;
}

.coin:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease-in-out;
}

@keyframes spin {
  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(360deg);
  }
}

.coin.flip {
  animation: spin 1s cubic-bezier(0.4, 2.5, 0.6, 0.5);
}

.coin img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: rotateY(0deg);
}

#countdown {
  font-size: 24px;
  color: #ff6b6b;
  margin-top: 10px;
  font-weight: bold;
}

.list-body {
  max-height: 300px;
  /* Define the max height for scrollable content */
  min-height: 150px;
  /* Define a min height for the list */
  min-width: 300px;
  overflow-y: auto;
  /* Enable vertical scrolling if content overflows */
  padding: 10px;
}

.user-list {
  list-style-type: none;
  /* Remove the bullet points from list */
  margin: 0;
  padding: 0;
}

.user-list li {
  display: flex;
  justify-content: space-between;
  /* Space between name and coins */
  align-items: center;
  /* Vertically center the content */
  padding: 5px 0;
}

.user-name {
  color: white;
  /* Name color will be white */
}

.user-coins {
  color: yellow;
  /* Coins color will be yellow */
  font-weight: bold;
}

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 
.coin-container:hover {
    transform: scale(1.02);
} */



@media screen and (max-width: 768px) {
  .bet-container {
    flex-direction: column;
    /* Stack the cards vertically */
    align-items: stretch;
    /* Stretch cards to fit full width */
    gap: 1.5rem;
    /* Increase spacing for better visibility */
  }

  .card {
    width: 100%;
    /* Make cards full width on small screens */
    max-width: 90%;
    /* Ensure they don’t exceed the container width */
    margin: 0 auto;
    /* Center the cards */
  }

  .list-body {
    min-width: auto;
    /* Allow the width to adjust naturally */
  }
}

.transparent-table {
  background-color: transparent !important;
  /* Make the table background transparent */
  border: none;
  /* Remove borders */
}

.transparent-table th,
.transparent-table td {
  background-color: transparent !important;
  /* Ensure header and cell backgrounds are also transparent */
  border: none;
  /* Remove borders from cells */
}

.transparent-table th {
  color: #ffc107;
  /* Optional: Set header text color */
}

.transparent-table td {
  color: white;
  /* Optional: Set cell text color */
}

.custom-scroll {
  max-height: 300px;
  /* Set a max height for the scrollable area */
  overflow-y: auto;
  /* Enable vertical scrolling */
  scrollbar-width: thin;
  /* For Firefox */
  scrollbar-color: #ffc107 transparent;
  /* For Firefox */
}

/* For WebKit browsers (Chrome, Safari) */
.custom-scroll::-webkit-scrollbar {
  width: 8px;
  /* Width of the scrollbar */
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
  /* Background of the scrollbar track */
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #ffc107;
  /* Color of the scrollbar thumb */
  border-radius: 10px;
  /* Rounded corners for the scrollbar thumb */
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #e0a800;
  /* Darker color on hover */
}
</style>
