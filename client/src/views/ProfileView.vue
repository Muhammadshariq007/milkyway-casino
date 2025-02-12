<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg text-light">
          <div class="card-body p-4">
            <div
              v-if="showAlert"
              class="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              {{ alertMessage }}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                @click="hideAlert"
              ></button>
            </div>

            <!-- User Information Section -->
            <div class="mb-3">
              <label for="fullName" class="form-label"
                >Full Name:{{ " " }}
              </label>
              <span class="form-label">{{ user.fullName || "N/A" }}</span>
            </div>
            <div class="mb-3">
              <label for="username" class="form-label"
                >Username:{{ " " }}
              </label>
              <span class="form-label">{{ user.whatsappNumber || "N/A" }}</span>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email: {{ " " }}</label>
              <span class="form-label">{{ user.email || "N/A" }}</span>
            </div>
            <div class="mb-3">
              <label for="contact" class="form-label"
                >Contact Number: {{ " " }}</label
              >
              <span class="form-label">{{ user.whatsappNumber || "N/A" }}</span>
            </div>
            <div class="mb-3">
              <label for="nin" class="form-label"
                >National Identity Number:{{ " " }}
              </label>
              <span class="form-label">{{ user.cnic || "N/A" }}</span>
            </div>
            <div class="mb-3">
              <label for="nin" class="form-label">Remaining Deposit:</label>
              <span class="badge bg-primary ms-2">{{ payment.debit }}</span>
            </div>

            <div class="mb-3">
              <label for="nin" class="form-label">Total Coins:</label>
              <span class="badge bg-success ms-2">{{ payment.coins }}</span>
            </div>

            <div class="mb-3">
              <label for="nin" class="form-label">Total Credit:</label>
              <span class="badge bg-danger ms-2">{{ payment.credit }}</span>
            </div>

            <!-- Change Password Section -->
            <h5 v-if="formType === 'user'" class="mt-4 mb-3">
              Change Password
            </h5>
            <form v-if="formType === 'user'" @submit.prevent="changePassword">
              <div class="mb-3">
                <label for="currentPassword" class="form-label"
                  >Current Password:</label
                >
                <input
                  type="password"
                  class="form-control"
                  v-model="currentPassword"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label"
                  >New Password:</label
                >
                <input
                  type="password"
                  class="form-control"
                  v-model="newPassword"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label"
                  >Confirm New Password:</label
                >
                <input
                  type="password"
                  class="form-control"
                  v-model="confirmPassword"
                  required
                />
              </div>
              <div id="globalError" class="text-danger" v-if="errorMessage">
                {{ errorMessage }}
              </div>
              <div class="card-actions d-flex justify-content-end">
                <button class="btn btn-warning btn-lg">Submit</button>
              </div>
            </form>
            <h5 v-if="formType === 'admin'" class="mt-4 mb-3">
              Handle Transactions
            </h5>
            <form v-if="formType === 'admin'" @submit.prevent="changePassword">
              <div class="mb-3">
                <label for="amount" class="form-label">Enter Amount:</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="amount"
                  required
                />
              </div>

              <div id="globalError" class="text-danger" v-if="errorMessage">
                {{ errorMessage }}
              </div>
            </form>
            <div
              v-if="formType === 'admin'"
              class="card-actions d-flex justify-content-end"
            >
              <button
                class="btn btn-primary btn-lg me-2"
                @click="handleRoute()"
              >
                View Transaction's
              </button>

              <button
                class="btn btn-warning btn-lg me-2"
                @click="addPayment('debit')"
              >
                Add Deposit
              </button>
              <button
                class="btn btn-danger btn-lg me-2"
                @click="addPayment('credit')"
              >
                Add Credit
              </button>
              <button
                class="btn btn-success btn-lg"
                @click="addPayment('coins')"
              >
                Add Coins
              </button>
            </div>
            <p v-if="formType === 'user'" class="lead text-center mt-4">
              <router-link style="color: white" to="/payment-deposit"
                >Buy Coins</router-link
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue';
import ApiService from '../services/apiService'; // Adjust the path as necessary
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter()
const user = ref({});
const payment = ref({})
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const showAlert = ref(false)
const formType = ref('')
const alertMessage = ref('')
const amount = ref(0)
const fetchUserProfile = async () => {
  const userId = route.params.id;
  try {
    const response = await ApiService.getUserProfile(userId);
    if(response.data.success){
      user.value = response.data.data.user;
      payment.value = response.data.data.payment
    }
    else{
      errorMessage.value = response.data.message
    }
     // Adjust based on your API response structure
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};
const  hideAlert = ()  => {
  showAlert.value = false;
}
const changePassword = async () => {
  errorMessage.value = ''; // Reset error message

  // Basic validation
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "New passwords do not match.";
    return;
  }

  try {
    const payload = {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    }
    const response = await ApiService.changePassword(payload);
    if(response.data.success){
      alertMessage.value = 'Password has been successfully changed.'
      showAlert.value = true;
      setTimeout(() => {
        showAlert.value = false;
        alertMessage.value=''
      }, 3000);
    }
    else{
      errorMessage.value=  response.data.message
    }
    // Handle success (e.g., notify the user, clear fields)
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'An error occurred. Please try again.';
  }
};
const addPayment = async(type) => {
  try {
    errorMessage.value = '';
    const userId = route.params.id;
    const payload = {
      type:type,
      amount:amount.value,
      userId:userId,
    }

    const response = await ApiService.addPayment(payload);
    if(response.data.success){
      alertMessage.value = response.data.message
      showAlert.value = true;
      fetchUserProfile();
      amount.value = 0
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);
    }
    else{
      errorMessage.value=  response.data.message
    }
    // Handle success (e.g., notify the user, clear fields)
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'An error occurred. Please try again.';
  }
}
const handleRoute = () => {
  const userId = route.params.id;
  router.push(`/payment-info/${userId}/admin`)
}
// Fetch user profile on component mount
onMounted(() => {
  formType.value = route.params.type;
  fetchUserProfile();

});
</script>
<style scoped></style>
