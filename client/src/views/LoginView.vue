<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg p-4">
          <div class="card-body p-5">
            <h1 class="mb-4 text-5xl font-bold text-center">
              <span class="text-warning">Milky Way Casino!</span>
            </h1>
            <h2 class="card-title text-center mb-4">Login to Your Account</h2>
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="whatsappNumber" class="form-label"
                  >Whatsapp Number</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="whatsappNumber"
                  v-model="whatsappNumber"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                />
              </div>
              <div id="globalError" class="text-danger" v-if="errorMessage">
                {{ errorMessage }}
              </div>

              <button type="submit" class="btn btn-warning w-100">Login</button>
            </form>
            <div class="text-center mt-3">
              <a href="/signup" class="text-light"
                >Don't have an account? Sign Up</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';


import ApiService from '../services/apiService'; // Adjust the path as necessary
import { useAuth } from '../composables/useAuth'; // Adjust the path accordingly

const { isLogin, role } = useAuth();



const errorMessage = ref('');
const whatsappNumber = ref('');
const password = ref('');
const router = useRouter()

const login = async () => {
  errorMessage.value = ''; // Reset error message

  try {
    const response = await ApiService.login(whatsappNumber.value, password.value);
    // Handle successful login, e.g., redirect or store tokens
    if(response.data.success){
      const userId = response.data?.data?.user?.id;
      const _role = response.data?.data?.user?.role
      const authToken = response.data?.data?.authToken

      localStorage.setItem("token", authToken)
      localStorage.setItem("_id", userId)
      localStorage.setItem("role", _role)
      isLogin.value = true;
      role.value = _role
      router.push(`/`)
    }
    else{
      errorMessage.value = response.data?.message
    }
  } catch (error) {
    console.log(error)
    if (error.response && error.response.data) {
      // Handle validation or server errors
      errorMessage.value = error.response.data.message || 'An error occurred. Please try again.';
    } else {
      // Handle network errors
      errorMessage.value = 'Network error. Please try again later.';
    }
  }
};
</script>
