<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-12">
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

            <h2 class="card-title text-center mb-4">Admin - User Management</h2>

            <!-- Filter Section -->
            <div class="mb-4">
              <input
                type="text"
                class="form-control mb-2"
                v-model="filters.search"
                @input="fetchUsers()"
                placeholder="Search by Name, Email, or WhatsApp Number"
              />
              <select
                class="form-control mb-2"
                v-model="filters.role"
                @change="fetchUsers()"
              >
                <option value="">All Roles</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <select
                class="form-control"
                v-model="filters.status"
                @change="fetchUsers()"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <!-- Users Table -->
            <div class="table-responsive">
              <table class="table table-striped text-light">
                <thead>
                  <tr>
                    <th scope="col">Full Name</th>
                    <th scope="col">WhatsApp Number</th>
                    <th scope="col">Email</th>
                    <th scope="col">CNIC</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.fullName }}</td>
                    <td>{{ user.whatsappNumber }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.cnic }}</td>
                    <td>{{ user.role }}</td>
                    <td>{{ user.status }}</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <!-- User Role Toggle Buttons -->
                        <button
                          class="btn btn-sm me-2"
                          :class="
                            user.role === 'ADMIN'
                              ? 'btn-primary'
                              : 'btn-outline-primary'
                          "
                          @click="updateRole(user)"
                        >
                          {{ user.role === "ADMIN" ? "USER" : "ADMIN" }}
                        </button>

                        <!-- Status Button -->
                        <button
                          class="btn btn-sm me-2"
                          :class="
                            user.status === 'ACTIVE'
                              ? 'btn-danger'
                              : 'btn-success'
                          "
                          @click="toggleStatus(user)"
                        >
                          {{
                            user.status === "ACTIVE" ? "Deactivate" : "Activate"
                          }}
                        </button>

                        <!-- Handle Payments Button -->
                        <button
                          class="btn btn-sm btn-primary"
                          @click="handlePayments(user)"
                        >
                          Handle Payments
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination Controls -->
            <nav aria-label="Page navigation" class="mt-4">
              <ul class="pagination justify-content-center">
                <li
                  class="page-item"
                  :class="{ disabled: pagination.page === 1 }"
                  @click="changePage(pagination.page - 1)"
                >
                  <a class="page-link" href="#">Previous</a>
                </li>
                <li
                  class="page-item"
                  v-for="page in pagination.totalPages"
                  :key="page"
                  :class="{ active: pagination.page === page }"
                  @click="changePage(page)"
                >
                  <a class="page-link" href="#">{{ page }}</a>
                </li>
                <li
                  class="page-item"
                  :class="{
                    disabled: pagination.page === pagination.totalPages,
                  }"
                  @click="changePage(pagination.page + 1)"
                >
                  <a class="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>

            <div id="globalError" class="text-danger" v-if="errorMessage">
              {{ errorMessage }}
            </div>

            <p class="lead text-center mt-4">
              <a href="/" class="btn btn-warning">Back to Home</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue';
import {useRouter} from 'vue-router'
import apiService from '../services/apiService'; // Adjust the path as needed
const showAlert = ref(false)
const alertMessage = ref('')

const router = useRouter()
const  hideAlert = ()  => {
  showAlert.value = false;
}
const users = ref([]);
const filters = ref({
  search: '',
  role: '',
  status: ''
});
const pagination = ref({
  page: 1,
  limit: 10,
  totalPages: 1
});
const errorMessage = ref('');

const fetchUsers = async () => {
errorMessage.value = ''
  try {
    const response = await apiService.getAllUsers({
      search: filters.value.search,
      role: filters.value.role,
      status: filters.value.status,
      page: pagination.value.page,
      limit: pagination.value.limit
    });
    if (response.data.success) {
      users.value = response.data.data?.users;
      pagination.value.totalPages = response.data.data?.totalPages;
    } else {
      errorMessage.value = response.data.message;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const updateRole = async (user) => {
    errorMessage.value = ''

  try {

    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const response = await apiService.updateUserRole(user.id, newRole);
    if (response.data.success) {
      fetchUsers();
      showAlert.value = true;
      alertMessage.value = response.data?.message
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);

    }
    else{
        errorMessage.value = response.data.message
    }
  } catch (error) {
    console.error('Error updating role:', error);
  }
};

const toggleStatus = async (user) => {
    errorMessage.value = ''
  try {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const response = await apiService.updateUserStatus(user.id, newStatus);
    if (response.data.success) {
      fetchUsers();
      showAlert.value = true;
      alertMessage.value = response.data?.message
      setTimeout(() => {
        showAlert.value = false;
      }, 3000);
    } else {
        errorMessage.value = response.data.message
    }
  } catch (error) {
    console.error('Error toggling status:', error);
  }
};

const handlePayments = (user) => {
    router.push(`/profile/${user.id}/${'admin'}`)
}
// Change page and fetch users
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page;
    fetchUsers();
  }
};

// Fetch users on component mount
onMounted(() => {

  fetchUsers();
});
</script>
<style scoped>
.container {
  max-width: 100%; /* Ensure the container takes the full width of the page */
}

.card {
  width: 100%; /* Ensure the card takes the full width */
}

.table {
  width: 100%; /* Ensure the table takes the full width */
  white-space: nowrap; /* Prevent text from breaking into multiple lines */
}

thead th {
  text-align: center; /* Optional: Center the table headers */
}

tbody td {
  text-align: center; /* Optional: Center the table data */
}

.pagination {
  flex-wrap: nowrap; /* Keep the pagination controls in one line */
}
.table-responsive {
  overflow-x: auto; /* Enables horizontal scrolling */
  white-space: nowrap; /* Prevents wrapping of table text */
}
</style>
