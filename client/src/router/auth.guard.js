export const authGuard = async (to, from, next) => {
    const isAuthenticated = checkIfAuthenticated(); // Implement this function to check if user is authenticated

    if (isAuthenticated) {
        next(); // User is authenticated, allow them to proceed
    } else {
        next({ name: 'Login' }); // Redirect to login if not authenticated
    }
}

// Function to check authentication
function checkIfAuthenticated() {
    // Check for a valid token or session
    const token = localStorage.getItem('token'); // or use any method to check auth
    return !!token; // Return true if token exists
}