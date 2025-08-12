<template>
  <div class="q-pa-md">
    <q-table
      title="Appointment History"
      no-data-label="No appointments found"
      :dense="$q.screen.lt.md"
      :columns="columns"
      :rows="appointments"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          clearable
          debounce="500"
          rounded
          v-model="filter.value"
          :placeholder="`Search by ${
            filterFields.find((f) => f.value === filter.field)?.label || 'field'
          }`"
          class="q-mr-sm"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn flat dense round icon="o_filter_alt" color="grey-6">
          <q-menu>
            <q-list dense>
              <q-item
                v-ripple
                clickable
                v-for="(filterField, index) in filterFields"
                :key="index"
                @click="filter.field = filterField.value"
                :class="{ 'bg-grey-3': filter.field === filterField.value }"
              >
                <q-item-section>
                  <q-item-label class="text-grey-8 text-caption">{{
                    filterField.label
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn flat round icon="o_sort" color="grey-6">
          <q-menu auto-close>
            <q-list>
              <q-item
                v-ripple
                clickable
                @click="clearSelectedField"
                :class="{ 'bg-grey-3': !selected.field }"
              >
                <q-item-section
                  class="row items-center text-grey-6 text-caption"
                >
                  <q-icon name="clear_all" size="sm" />
                  <q-item-label>Clear Filter</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item
                v-ripple
                clickable
                v-for="(selectedField, index) in selectedFields"
                :key="index"
                @click="handleSelectedFieldClick(selectedField.value)"
                :class="{ 'bg-grey-3': selected.field === selectedField.value }"
              >
                <q-item-section
                  class="row items-center text-grey-6 text-caption"
                >
                  <q-icon :name="selectedField.icon" size="sm" />
                  <q-item-label>{{ selectedField.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width>
            <q-icon name="expand_more" size="sm" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-icon
              size="sm"
              color="accent"
              @click="props.expand = !props.expand"
              :name="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td key="id" :props="props">
            <q-btn
              dense
              class="text-blue-7"
              flat
              @click="
                router.push({
                  path: '/admin/appointment/detail',
                  query: { id: props.row.id },
                })
              "
            >
              {{ props.row.id }}
            </q-btn>
          </q-td>
          <q-td key="service_title" :props="props">
            <div v-for="service in props.row.services" :key="service.id">
              {{ service.service_title }}
            </div>
          </q-td>
          <q-td key="booking_time" :props="props">
            {{ props.row.booking_time.slice(0, 16) }}
          </q-td>
          <q-td key="customer_name" :props="props">
            <div v-for="service in props.row.services" :key="service.id">
              {{ service.customer_name }}
            </div>
          </q-td>
          <q-td key="customer_phone" :props="props">
            {{ props.row.customer_phone }}
          </q-td>
          <q-td key="therapist" :props="props">
            <div v-for="service in props.row.services" :key="service.id">
              {{ service.staff_name || "N/A" }}
            </div>
          </q-td>
          <q-td key="status" :props="props">
            <q-chip
              size="12px"
              dense
              :color="
                props.row.status === 'finished'
                  ? 'teal-4'
                  : props.row.status === 'pending'
                  ? 'red-10'
                  : props.row.status === 'in_progress'
                  ? 'green-4'
                  : props.row.status === 'cancelled'
                  ? 'red-5'
                  : 'deep-orange-5'
              "
              :label="props.row.status"
              text-color="white"
              class="q-mr-sm"
            />
          </q-td>
          <q-td key="type" :props="props">
            <q-chip
              size="12px"
              dense
              outline
              :color="
                props.row.type === 'no_show'
                  ? 'red-10'
                  : props.row.type === 'break'
                  ? 'grey'
                  : props.row.type === 'assigned'
                  ? 'green-5'
                  : 'deep-orange-5'
              "
              :label="props.row.type"
              text-color="white"
              class="q-mr-sm"
            />
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              @click="deleteAppointment(props.row.id)"
              flat
              round
              icon="delete"
              color="grey-6"
              size="10px"
            />
            <q-btn
              flat
              round
              icon="o_visibility"
              color="grey"
              size="10px"
              @click="
                router.push({
                  path: '/admin/appointment/detail',
                  query: { id: props.row.id },
                })
              "
            />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              Started at: {{ props.row.actual_start_time }}
              <br />
              Ended at: {{ props.row.actual_end_time }}
              <br />
              Comments: {{ props.row.comments }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { format, useQuasar } from "quasar";

const router = useRouter();
const appointments = ref([]); // Ensure appointments is always initialized as an empty array
const columns = [
  {
    name: "id",
    label: "No.",
    align: "center",
    field: "id",
  },
  { name: "service_title", label: "Service Title", align: "left" },
  {
    name: "booking_time",
    label: "Booking Time",
    align: "left",
    field: "booking_time",
    sortable: true,
  },
  { name: "customer_name", label: "Customer Name", align: "left" },
  { name: "customer_phone", label: "Customer Phone", align: "center" },
  { name: "therapist", label: "Therapist", align: "center" },
  { name: "status", label: "Status", align: "center" },
  { name: "type", label: "Type", align: "center" },
  { name: "actions", label: "Actions", align: "center" },
];

const filterFields = [
  { label: "Phone Number", value: "customer_phone" },
  { label: "Customer Name", value: "customer_name" },
  { label: "Date (MM-DD)", value: "booking_time" },
  { label: "Therapist", value: "therapist" },
];

const selectedFields = [
  { icon: "free_cancellation", label: "Cancelled", value: "cancelled" },
  { icon: "delete_forever", label: "Deleted", value: "deleted" },
  { icon: "o_visibility_off", label: "No Show", value: "no_show" },
];

const filter = ref({
  field: "customer_name",
  value: "",
});
const selected = ref({
  field: "",
  value: "",
});

const loading = ref(false);
const pagination = ref({
  sortBy: "id",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const fetchAppointments = async (
  startRow,
  count,
  filter,
  sortBy,
  descending,
  selected
) => {
  try {
    loading.value = true;
    const response = await api.get("/api/appointments", {
      params: {
        start: startRow,
        count,
        filter: filter && filter.value ? JSON.stringify(filter) : undefined,
        selected:
          selected && selected.field ? JSON.stringify(selected) : undefined,
        sortBy,
        descending,
      },
    });
    appointments.value = response.data?.rows || [];
    pagination.value.rowsNumber = response.data?.total || 0;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    appointments.value = []; // Ensure appointments is reset to an empty array on error
    pagination.value.rowsNumber = 0; // Reset rowsNumber to 0 on error
    loading.value = false;
  }
};

const onRequest = (props) => {
  loading.value = true;
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  // Only send filter if value is not empty, and pass a plain object
  const filterValue = filter.value ? { ...filter.value } : undefined;
  // Only send selected if field is not empty, and pass a plain object
  const selectedValue =
    selected.value && selected.value.field ? { ...selected.value } : undefined;

  const startRow = (page - 1) * rowsPerPage;
  const count = rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
  fetchAppointments(
    startRow,
    count,
    filterValue,
    sortBy,
    descending,
    selectedValue
  );
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  loading.value = false;
};

const handleSelectedFieldClick = (fieldValue) => {
  selected.value.field = fieldValue;
  // Trigger data refresh when selected field changes
  onRequest({
    pagination: pagination.value,
    filter: undefined,
  });
};

const clearSelectedField = () => {
  selected.value.field = "";
  selected.value.value = "";
  // Trigger data refresh when clearing selected field
  onRequest({
    pagination: pagination.value,
    filter: undefined,
  });
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
    filter: undefined,
  });
});
const $q = useQuasar();
const deleteAppointment = async (id) => {
  $q.dialog({
    title: "Confirm Deletion?",
    message: "Are you sure you want to completely delete this appointment?",
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      api
        .delete(`/api/appointments/${id}`)
        .then(() => {
          $q.notify({
            type: "positive",
            message: "Appointment deleted successfully.",
          });
          // Refresh the appointments list after deletion
          onRequest({
            pagination: pagination.value,
            filter: undefined,
          });
        })
        .catch((error) => {
          console.error("Error deleting appointment:", error);
          $q.notify({
            type: "negative",
            message: "Failed to delete appointment.",
          });
        });
    })
    .onCancel(() => {
      return;
    });
};
</script>
