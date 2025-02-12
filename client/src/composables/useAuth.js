// src/composables/useAuth.js
import { ref, watch } from 'vue';

const isLogin = ref(false);
const role = ref('USER');

const loadAuthState = () => {
    const storedRole = localStorage.getItem('role');
    const storedToken = localStorage.getItem('token');

    role.value = storedRole || 'USER';
    isLogin.value = !!storedToken; // true if token exists
};

// Call this function to initialize the state
loadAuthState();

// Watch for changes in local storage
watch(
    () => localStorage.getItem('token'),
    (newValue) => {
        isLogin.value = !!newValue; // true if token exists
    }
);

watch(
    () => localStorage.getItem('role'),
    (newValue) => {
        role.value = newValue || 'USER';
    }
);

export const useAuth = () => {
    return {
        isLogin,
        role,
        loadAuthState, // Optional, if you want to refresh state manually
    };
};
