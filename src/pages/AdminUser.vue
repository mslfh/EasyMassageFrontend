<template>
  <div class="q-pa-md">
    <!-- Add search input and dropdown for field selection -->
    <div class="col-8 items-center q-pa-md">
      <q-input
        rounded
        v-model="user_search"
        outlined
        placeholder="Search User"
        @update:model-value="findUserByField"
      >
        <template v-slot:append>
          <q-icon v-if="user_search === ''" name="search" />
          <q-icon
            v-else
            name="clear"
            class="cursor-pointer"
            @click="user_search = ''"
          />
        </template>
      </q-input>
    </div>

    <q-table
      title="Users"
      no-data-label="No users found"
      :dense="$q.screen.lt.md"
      :rows="users"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:body-cell-actions="props">
        <q-btn
          flat
          round
          icon="edit"
          color="primary"
          @click="editUser(props.row)"
        />
        <!-- <q-btn
          flat
          round
          icon="delete"
          color="red"
          @click="deleteUser(props.row)"
        /> -->
      </template>
    </q-table>

    <q-btn
      flat
      label="Import Users"
      color="primary"
      @click="triggerFileInput"
    />
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="importUsers"
      accept=".xlsx, .xls"
    />

    <q-inner-loading :showing="isLoading" />
    <q-dialog v-model="isSuccessDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Import Successful</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            @click="isSuccessDialogOpen = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isEditDialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit User</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="editForm.name" label="Username" />
          <q-input v-model="editForm.first_name" label="First Name" />
          <q-input v-model="editForm.last_name" label="Last Name" />
          <q-input
            filled
            v-model="editForm.email"
            label="Email"
            type="email"
            readonly
          />
          <q-input v-model="editForm.phone" label="Phone" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="isEditDialogOpen = false"
          />
          <q-btn flat label="Update" color="green" @click="updateUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isDeleteDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm Deletion</div>
        </q-card-section>
        <q-card-section>
          Are you sure you want to delete "{{ deleteTarget?.name }}"?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="isDeleteDialogOpen = false"
          />
          <q-btn flat label="Delete" color="red" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from "boot/axios";

const users = ref([]);
const columns = [
  {
    name: "name",
    required: true,
    label: "Username",
    align: "left",
    field: "name",
  },
  { name: "phone", label: "Phone", align: "left", field: "phone" },
  {
    name: "first_name",
    required: true,
    label: "First Name",
    align: "left",
    field: "first_name",
  },
  {
    name: "last_name",
    required: true,
    label: "Last Name",
    align: "left",
    field: "last_name",
  },
  {
    name: "email",
    required: true,
    label: "Email",
    align: "left",
    field: "email",
  },
  { name: "actions", label: "Actions", align: "center" },
];

onMounted(() => {
  fetchUsers();
});
const user_search = ref("");
const findUserByField = async () => {
  try {
    const response = await api.get("/api/findUserByField", {
      params: { search: user_search.value },
    });
    if (response.data.length > 0) {
      users.value = response.data.map((user) => ({
        ...user,
        first_name: user.first_name || "N/A",
        last_name: user.last_name || "N/A",
      }));
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const fetchUsers = async () => {
  try {
    const response = await api.get("/api/user");
    if (response.data.length > 0) {
      users.value = response.data.map((user) => ({
        ...user,
        first_name: user.first_name || "N/A",
        last_name: user.last_name || "N/A",
      }));
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
const isEditDialogOpen = ref(false);
const editForm = ref({
  id: null,
  name: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
});

const editUser = (row) => {
  editForm.value = { ...row };
  isEditDialogOpen.value = true;
};

const updateUser = async () => {
  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    Object.keys(editForm.value).forEach((key) => {
      if (key !== "id") {
        formData.append(key, editForm.value[key]);
      }
    });
    await api.post(`/api/user/${editForm.value.id}`, formData);

    const index = users.value.findIndex((u) => u.id === editForm.value.id);
    if (index !== -1) {
      users.value[index] = { ...editForm.value };
    }
    fetchUsers();
    editForm.value = {
      id: null,
      name: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    };
    isEditDialogOpen.value = false;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const isDeleteDialogOpen = ref(false);
const deleteTarget = ref(null);

const deleteUser = (row) => {
  deleteTarget.value = row;
  isDeleteDialogOpen.value = true;
};

const confirmDelete = async () => {
  try {
    await api.delete(`/api/user/${deleteTarget.value.id}`);
    users.value = users.value.filter((u) => u.id !== deleteTarget.value.id);
    isDeleteDialogOpen.value = false;
    deleteTarget.value = null;
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

const fileInput = ref(null);
const isLoading = ref(false);
const isSuccessDialogOpen = ref(false);

const triggerFileInput = () => {
  fileInput.value.click();
};

const importUsers = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  isLoading.value = true; // Show loading indicator
  try {
    await api.post("/api/importUser", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 10000 * 300, // Increase timeout to 10 seconds
    });
    fetchUsers();
    isSuccessDialogOpen.value = true; // Show success dialog
  } catch (error) {
    console.error("Error importing users:", error);
  } finally {
    isLoading.value = false; // Hide loading indicator
    event.target.value = null;
  }
};
</script>
