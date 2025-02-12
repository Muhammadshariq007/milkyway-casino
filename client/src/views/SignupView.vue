<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg p-4">
          <div class="card-body p-5">
            <h1 class="mb-4 text-5xl font-bold text-center">
              <span class="text-warning">Milky Way Casino!</span>
            </h1>
            <h2 class="card-title text-center mb-4">Create an Account</h2>
            <form @submit.prevent="signup">
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
                  minlength="11"
                />
                <div
                  id="whatsappError"
                  class="text-danger"
                  v-if="whatsappError"
                >
                  {{ whatsappError }}
                </div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  title="Please enter a valid email address."
                />
                <div id="emailError" class="text-danger" v-if="emailError">
                  {{ emailError }}
                </div>
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
              <div class="mb-3">
                <label for="fullName" class="form-label">Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="fullName"
                  v-model="fullName"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="cnic" class="form-label"
                  >National Identity Number</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="cnic"
                  v-model="cnic"
                  required
                  pattern="^\d{5}-\d{7}-\d{1}$"
                  title="CNIC must be in the format 42201-9999999-9."
                />
                <div id="cnicError" class="text-danger" v-if="cnicError">
                  {{ cnicError }}
                </div>
              </div>
              <div id="globalError" class="text-danger" v-if="errorMessage">
                {{ errorMessage }}
              </div>
              <button type="submit" class="btn btn-warning w-100">
                Sign Up
              </button>
            </form>
            <div class="text-center mt-3">
              <a href="/login" class="text-light"
                >Already have an account? Login</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref,onMounted } from 'vue';
import ApiService from '../services/apiService'; // Adjust the path as necessary
import { useRouter } from 'vue-router';
const whatsappNumber = ref('');
const email = ref('');
const password = ref('');
const fullName = ref('');
const cnic = ref('');
const errorMessage = ref('');
const whatsappError = ref('');
const emailError = ref('');
const cnicError = ref('');
const router = useRouter()

onMounted(() => {
  localStorage.clear();
});


const validateInputs = () => {
  whatsappError.value = whatsappNumber.value.length < 11 ? 'Whatsapp number must be at least 11 digits.' : '';
  emailError.value = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? 'Invalid email format.' : '';
  cnicError.value = !/^\d{5}-\d{7}-\d{1}$/.test(cnic.value) ? 'CNIC must be in the format 42201-9999999-9.' : '';
};

const signup = async () => {
  errorMessage.value = ''; // Reset error message
  validateInputs(); // Validate inputs before proceeding

  if (whatsappError.value || emailError.value || cnicError.value) {
    return; // Prevent submission if there are validation errors
  }

  try {
    const payload = {
      whatsappNumber:whatsappNumber.value,
      email: email.value,
      password: password.value,
      fullName: fullName.value,
      cnic: cnic.value
    }
    const response = await ApiService.signUp(payload);
    if(response.data.success){
      router.push('/signup-success')
    }
    else{
      errorMessage.value = response.data.message
    }
  } catch (error) {
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

<style scoped>
/* Add any necessary styling here */
</style>
