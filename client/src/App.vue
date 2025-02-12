<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand ms-5" href="/">
        <span class="fw-bold navbar-text-color navbar-title">Milky Way Casino</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link navbar-text-color" href="/">Casino</a>
          </li>
          <li class="nav-item">
            <button class="btn nav-link navbar-text-color white" @click="handleProfileRoute()">
              Profile
            </button>
          </li>

          <li class="nav-item" v-if="isLogin">
            <button class="btn nav-link navbar-text-color white" @click="handlePaymentInfoRoute()">
              Payment Info
            </button>

            <a class="nav-link navbar-text-color" href="/payment-info"></a>
          </li>
          <li class="nav-item">
            <a class="nav-link navbar-text-color" href="/payment-deposit">Deposit</a>
          </li>
          <li class="nav-item" v-if="isLogin && role === 'ADMIN'">
            <a class="nav-link navbar-text-color" href="/admin">Admin</a>
          </li>
          <li class="nav-item" v-if="!isLogin">
            <a class="nav-link navbar-text-color" href="/login">Login</a>
          </li>
          <li class="nav-item" v-if="isLogin">
            <button class="btn nav-link navbar-text-color white" @click="logout()">
              Log out
            </button>
          </li>

          <li class="nav-item" v-if="!isLogin">
            <a class="nav-link navbar-text-color" href="/signup">Sign Up</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container mt-4">
    <router-view />
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "./composables/useAuth";

const { isLogin, role, loadAuthState } = useAuth();

const router = useRouter();

const handleProfileRoute = () => {
  const userId = localStorage.getItem("_id");
  if (
    userId === null ||
    userId === undefined ||
    userId === "" ||
    userId.length < 5
  ) {
    router.push(`login`);
    // check in future user id is exist or not from api call
  }
  router.push(`/profile/${userId}/${"user"}`);
};

const handlePaymentInfoRoute = () => {
  const userId = localStorage.getItem("_id");
  if (
    userId === null ||
    userId === undefined ||
    userId === "" ||
    userId.length < 5
  ) {
    router.push(`login`);
    // check in future user id is exist or not from api call
  }
  router.push(`/payment-info/${userId}/${"user"}`);
};
const logout = () => {
  localStorage.clear();
  loadAuthState();
  router.push("/");
};
</script>
<style scoped>
.white {
  color: white !important;
}

@media screen and (max-width: 768px) {
  .navbar-brand {
    font-size: 1rem;
    /* Reduce font size on smaller screens */
    margin-left: 1rem;
    /* Adjust left margin for better alignment */
  }

  .navbar-title {
    font-size: 0.9rem;
    /* Scale down the title size */
  }

  .ms-5 {
    margin-left: 1rem !important;
    /* Reduce excessive left margin in mobile view */
  }
}

.navbar-toggler {
  background-color: white !important;
}
</style>
