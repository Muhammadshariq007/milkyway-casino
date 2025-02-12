<template>
  <main class="container">
    <div class="row align-content-start justify-content-around">
      <div class="text-center flex" style="height: 130px">
        <img src="../assets/winner.png" height="auto" width="20%" />
        <img v-if="winnerResult" :src="winnerResult.text" alt="Winner Icon" width="80" height="80" />
      </div>
      <div class="text-center flex">
        <h4 class="text-warning">{{ status }}</h4>
      </div>
      <div class="col-12 col-lg-7 px-lg-5 order-0 order-lg-1">
        <div class="sticky-top">
          <ShiningDots :color="shiningDotsColor" :border-color="shiningDotsBorderColor"
            :shine-color="shiningDotsShineColor" :border-width="shiningDotsBorderWidth" :size="shiningDotsSize"
            :count="shiningDotsCount">
            <VueWheelSpinner ref="spinner" :slices="slices" :winner-index="defaultWinner" :sounds="sounds"
              :cursor-angle="cursorAngle" :cursor-position="cursorPosition" :cursor-distance="cursorDistance"
              @spin-start="onSpinStart" @spin-end="onSpinEnd">
              <template #cursor>
                <img class="cursor-img" :src="cursorImage" alt="Cursor" />
              </template>

              <template #default>
                <ShiningDots :color="shiningDotsColor" :border-color="shiningDotsBorderColor"
                  :shine-color="shiningDotsShineColor" :border-width="60" :size="20" :count="20">
                  <button class="spin-button" disabled @click="handleSpinButtonClick" @mouseover="handleSpinButtonHover"
                    @mouseleave="handleSpinButtonLeave">
                    {{ timeLeft }}
                  </button>
                </ShiningDots>
              </template>
            </VueWheelSpinner>
          </ShiningDots>
        </div>
      </div>
    </div>
    <div v-if="showAlert" class="alert alert-success alert-dismissible fade show" role="alert">
      Bet has been placed
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="hideAlert"></button>
    </div>
    <div class="amount-section">
      <div class="mb-20 col-12 col-md-3">
        <div class="d-flex flex-column align-items-center mt-3">
          <h1 class="mb-10">Coins: {{ coinBalance }}</h1>
          <h5 for="amount" class="form-label">Enter Amount</h5>
          <input type="number" class="form-control" id="amount" v-model="amount" required />

        </div>
        <div class="bet-container mt-4">
          <button class="btn btn-warning btn-lg" :disabled="disabledButtons || activeBet" @click="placeBet(1)">
            <span style="margin-right: 10px; font-weight: bold;">2x</span>
            <img src="/laughing.png" width="20" height="20" />
          </button>
          <button class="btn btn-warning btn-lg" :disabled="disabledButtons || activeBet" @click="placeBet(3)">

            <span style="margin-right: 10px; font-weight: bold;">14x</span>
            <img src="/animal.png" width="20" height="20" />
          </button>
          <button class="btn btn-warning btn-lg" :disabled="disabledButtons || activeBet" @click="placeBet(2)">

            <span style="margin-right: 10px; font-weight: bold;">2x</span>
            <img src="/wolf.png" width="20" height="20" />
          </button>
        </div>

      </div>
    </div>
    <div id="globalError" class="text-danger" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div class="bet-container">
      <div class="card card-size shadow-lg text-center p-4">
        <div class="card-body">
          <h1 class="mb-4 text-5xl font-bold">
            <span class="text-warning">Score Board</span>

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
  </main>
</template>

<script>
import VueWheelSpinner from "vue-wheel-spinner";
// import "bootstrap/js/src/dropdown.js";

import cursorImage from "../assets/cursor.svg";
import wonSound from "../sounds/won.mp3";
import clickSound from "../sounds/click.mp3";
import hoverSound from "../sounds/hover.mp3";
import leaveSound from "../sounds/leave.mp3";
import spinningSound from "../sounds/spinning.mp3";
import ShiningDots from "../components/ShiningDots.vue";
import socket from "../services/websocket";
import gameServices from "../services/gameServices";
import apiService from "../services/apiService";
export default {
  components: {
    ShiningDots,
    VueWheelSpinner,
  },
  data() {
    return {
      spinnerOption: null,
      winnerResult: null,
      slices: this.createColorTextArray(3),
      isSpinning: false,
      showAlert: false,
      defaultWinner: 0,
      errorMessage: "",
      amount: 0,
      coinBalance: 0,
      sounds: {
        won: wonSound,
        spinButtonClick: clickSound,
        spinButtonHover: hoverSound,
        spinButtonLeave: leaveSound,
        spinning: spinningSound,
      },
      cursorImage,
      cursorAngle: 0,
      cursorPosition: "edge",
      cursorDistance: 0,
      shiningDotsColor: "#ffffff",
      shiningDotsShineColor: "#ffd800",
      shiningDotsBorderColor: "#1e254c",
      shiningDotsBorderWidth: 40,
      shiningDotsSize: 18,
      shiningDotsCount: 40,
      option1: [],
      totalCoins: 0,
      // option2: [],
      // option3: [],
      timeLeft: "",
      disabledButtons: false,
      status: "",
      selected: "",
      activeBet: false,
    };
  },
  computed: {
    spinnerComputedOption() {
      // Return spinnerOption as the computed value
      return this.spinnerOption;
    },

  },
  watch: {
    slices: {
      handler() {
        this.$refs.spinner.drawWheel();
      },
      deep: true,
    },
    option1: {
      handler(newValue) {
        this.totalCoins += newValue.reduce((total, opt) => total + opt.coins, 0);
      },
      immediate: true, // Run the handler immediately on component mount
    },
  },
  methods: {
    async placeBet(option) {
      if (this.amount === 0 || this.amount === null) {
        alert("Please select amount to continue");
        return;
      }

      this.errorMessage = "";
      try {
        const payload = {
          betOption: option,
          coins: this.amount,
          type: "SPIN",
        };
        const response = await gameServices.placeBet(payload);
        // Handle successful login, e.g., redirect or store tokens
        if (response.data.success) {
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
            this.alertMessage = "";
          }, 3000);
          this.selected = option;
          this.activeBet = true;
          await this.userCoins();
          this.disabledButtons = true;
        } else {
          this.errorMessage = response.data?.message;
        }
        this.amount = 0;
      } catch (error) {
        console.log(error);
        if (error.response && error.response.data) {
          // Handle validation or server errors
          this.errorMessage =
            error.response.data.message ||
            "An error occurred. Please try again.";
        } else {
          // Handle network errors
          this.errorMessage = "Network error. Please try again later.";
        }
      }
    },
    handleBetsResults(data) {
      this.option1 = data?.option1;
      // this.option2 = data?.option2;
      // this.option3 = data?.option3;
    },

    hideAlert() {
      this.showAlert = false;
    },
    getRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
    createColorTextArray(count) {
      const result = [];
      const colors = ["#eb4d4b", "#ffffff", "#E9FF97"]; // Predefined colors
      result.push({
        color: "#eb4d4b", // Alternate colors
        text: import.meta.env.VITE_PUBLIC_FOLDER + "animal.png",
      });

      result.push({
        color: "#E9FF97", // Alternate colors
        text: import.meta.env.VITE_PUBLIC_FOLDER + "laughing.png",
      });
      result.push({
        color: "#ffffff", // Alternate colors
        text: import.meta.env.VITE_PUBLIC_FOLDER + "wolf.png",
      });
      return result;
    },
    playAudio(audio) {
      if (audio) {
        audio.volume = 0.5;

        // Ensure audio plays after user interaction
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => { })
            .catch((error) => {
              // Catch any errors like the NotAllowedError
              console.error("Error playing audio:", error);
            });
        }
      }
    },
    handleSpinButtonClick() {
      if (this.buttonClickAudio) {
        this.playAudio(this.buttonClickAudio);
      }
      this.$refs.spinner.spinWheel(3);
    },
    handleSpinButtonHover() {
      if (this.buttonHoverAudio) {
        this.playAudio(this.buttonHoverAudio);
      }
    },
    handleSpinButtonLeave() {
      if (this.buttonLeaveAudio) {
        this.playAudio(this.buttonLeaveAudio);
      }
    },
    handleCursorPositionChange() {
      if (this.cursorPosition === "center") {
        if (!this.cursorDistance) {
          this.cursorDistance = 50;
        }
      } else {
        this.cursorDistance = 0;
      }
    },
    spinFor(index) {
      this.defaultWinner = index;
      this.$refs.spinner.spinWheel(index);
    },
    spinRandom() {
      const randomSlice = Math.floor(Math.random() * this.slices.length);
      console.log(randomSlice);
      this.$refs.spinner.spinWheel(randomSlice);
    },
    onSpinStart() {
      this.totalCoins = 0;
      this.winnerResult = null;
      this.isSpinning = true;
    },
    onSpinEnd(winnerIndex) {
      this.isSpinning = false;
      this.winnerResult = this.slices[winnerIndex];
    },
    fourCharacters(fullName) {
      // Check if fullName is a valid string
      if (!fullName || typeof fullName !== "string") {
        return ""; // Return empty string if fullName is not a valid string
      }

      // Get the first four characters of the string
      const truncatedName = fullName.slice(0, 4); // Slice the string to get the first four characters

      // If the length of the full name is greater than four, append ellipsis
      return fullName.length > 4 ? truncatedName + "..." : truncatedName;
    },
    async userCoins() {
      this.errorMessage = "";
      try {
        const response = await apiService.getUserCoins();
        // Handle successful login, e.g., redirect or store tokens
        if (response.data.success) {
          this.coinBalance = response.data?.data;
        } else {
          this.errorMessage = response.data?.message;
        }
      } catch (error) {
        if (error.response && error.response.data) {
          // Handle validation or server errors
          this.errorMessage =
            error.response.data.message ||
            "An error occurred. Please try again.";
        } else {
          // Handle network errors
          this.errorMessage = "Network error. Please try again later.";
        }
      }
    },
  },

  mounted() {
    this.buttonHoverAudio = new Audio(hoverSound);
    this.buttonLeaveAudio = new Audio(leaveSound);
    this.buttonClickAudio = new Audio(clickSound);
    this.userCoins();
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data?.type === "spin") {
        if (
          Number(data?.data?.spinNumber) === 1 ||
          Number(data?.data?.spinNumber) === 2 ||
          Number(data?.data?.spinNumber) === 3
        ) {
          this.activeBet = false;

          // if (Number(this.selected) === Number(data?.data?.spinNumber)) {
          //   this.status === "You Win";
          // } else if (Number(this.selected) === "") {
          //   this.status = "";
          // } else {
          //   this.status = "You Loose";
          // }
        }
        this.spinnerOption = data?.data?.spinNumber;
        this.userCoins();
        this.$refs.spinner.spinWheel(this.spinnerOption);
      } else if (data?.type == "spinBets") {
        this.handleBetsResults(data?.data);
      } else if (data?.type === "countdown") {
        this.timeLeft = data?.timeLeft + "s";
        if (data?.timeLeft <= 5) {
          this.disabledButtons = true;
        } else {
          this.disabledButtons = false;
        }
      }
    };
  },
};
</script>

<style>
.container {
  height: 120vh !important;
}

.display-none {
  display: none;
}

.cursor-img {
  width: 50px;
  aspect-ratio: 1 / 1;
  filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.19));
}

.spin-button {
  width: 130px;
  height: 130px;
  margin: 0 auto;
  aspect-ratio: 1 / 1;
  font-size: 20px;
  cursor: pointer;
  background: #eb4d4b;
  border-radius: 50%;
  transition: all 150ms;
  border: 5px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white !important;
  box-shadow: 0 0 0 5px white,
    /* White border */
    0 0 0 16px #e9ff97,
    /* Additional border with new color */
    inset -3px -3px 2px 2px rgba(0, 0, 0, 0.19),
    3px 3px 2px 2px rgba(0, 0, 0, 0.19);
  z-index: 11;
  position: relative;
  user-select: none;

  &:hover {
    box-shadow: 0 0 0 5px white,
      /* White border */
      0 0 0 16px #e9ff97,
      /* Additional border with new color */
      inset -5px -5px 2px 2px rgba(0, 0, 0, 0.19),
      3px 3px 2px 2px rgba(0, 0, 0, 0.19);
  }

  &:active {
    box-shadow: 0 0 0 5px white,
      /* White border */
      0 0 0 16px #e9ff97,
      /* Additional border with new color */
      inset 3px 3px 2px 2px rgba(0, 0, 0, 0.19),
      3px 3px 2px 2px rgba(0, 0, 0, 0.19);
  }

  &:disabled {
    background: #eb4d4b;
    cursor: not-allowed;
    pointer-events: none;
  }
}

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

.card-size {
  min-width: 550px;
}

.list-body {
  max-height: 300px;
  /* Define the max height for scrollable content */
  min-height: 150px;
  /* Define a min height for the list */
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

.amount-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
  margin-top: 20px;
  color: white;
}

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
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
