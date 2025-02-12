<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg text-light">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">Transaction History</h2>

            <!-- Transaction Table -->
            <div
              class="table-responsive"
              style="max-height: 400px; overflow-y: auto"
            >
              <table class="table table-striped text-light">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col">Credit</th>
                    <th scope="col">Debit</th>
                    <th scope="col">Coins</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="payment in paymentInfo" :key="payment?.id">
                    <td>{{ formatDate(payment?.createdAt) }}</td>
                    <td>{{ payment?.desc }}</td>
                    <td>
                      {{ payment?.credit }}
                    </td>
                    <td>
                      {{ payment?.debit }}
                    </td>
                    <td>
                      {{ payment?.coins }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Total Summary -->
            <div class="mt-4">
              <h5 class="text-center">Total Summary</h5>
              <div class="d-flex justify-content-between">
                <span><strong>Total Credit:</strong> {{ totalCredit }}</span>
                <span><strong>Total Debit:</strong> {{ totalDebit }}</span>
                <span><strong>Total Coins:</strong> {{ totalCoins }}</span>
              </div>
            </div>
            <div id="globalError" class="text-danger" v-if="errorMessage">
              {{ errorMessage }}
            </div>

            <p class="lead text-center mt-4">
              <a href="/" class="btn btn-warning">Back to Games</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue';
import apiService from '../services/apiService'; // Adjust the path as needed
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();

const paymentInfo = ref([]);
const totalDebit = ref(0);
const totalCredit = ref(0);
const totalCoins = ref(0);
const errorMessage = ref('')

const fetchPaymentInfo = async () => {
  try {
     const userId = route.params.id;
    const response = await apiService.paymentInfo(userId);
    if(response.data.success){
      const info = response.data.data;
      paymentInfo.value = info.paymentInfo;
      totalDebit.value = info.totalDebit;
      totalCredit.value =  info.totalCredit ;
      totalCoins.value = info.totalCoins;
    }
    else{
      errorMessage.value = response.data.message
    }

  } catch (error) {
    console.error('Error fetching payment info:', error);
    // Handle the error as needed
  }
};

function formatDate(isoDateString) {
    // Create a new Date object from the ISO date string
    const date = new Date(isoDateString);

    // Format the date to 'YYYY-MM-DD HH:MM:SS'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// Fetch payment info on component mount
onMounted(() => {
  fetchPaymentInfo();
});
</script>

<style scoped>
.table-responsive {
  overflow-x: auto; /* Enable horizontal scrolling */
}

.table {
  min-width: 600px; /* Set a minimum width for better responsiveness */
}
/* Add your custom styles here if needed */
</style>
