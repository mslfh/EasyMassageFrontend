<template>
  <q-page>
    <q-card class="q-pa-sm">
      <q-table
        :rows="logs"
        :columns="columns"
        row-key="id"
        title="Appointment Logs"
        :loading="loading"
        :pagination="{
          rowsPerPage: 10,
          page: 1,
        }"
        binary-state-sort
      >
        <template v-slot:top-right>
          <q-icon name="event" size="sm">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="date"
                mask="YYYY-MM-DD"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:body-cell-appointment_id="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              color="primary"
              :label="props.value"
              @click="goToAppointmentDetail(props.row.appointment_id)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-comments="props">
          <q-td :props="props">
            {{ props.value || '' }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();
const $q = useQuasar();
const logs = ref([]);
const date = ref(new Date().toISOString().slice(0, 10));

const loading = ref(false);

const columns = [
  {
    name: "appointment_id",
    label: "No.",
    align: "center",
    field: "appointment_id",
    sortable: true,
  },
  {
    name: "description",
    label: "Description",
    align: "left",
    field: "description",
  },
   {
    name: "staff_name",
    label: "Therapist",
    align: "center",
    field: "staff_name",
  },
  {
    name: "customer_name",
    label: "Customer Name",
    align: "center",
    field: "customer_name",
  },
  {
    name: "service_title",
    label: "Service",
    align: "left",
    field: "service_title",
  },
  {
    name: "status",
    label: "Status",
    align: "center",
    field: "status",
  },

  {
    name: "comments",
    label: "Comments",
    align: "left",
    field: "comments",
  },
  {
    name: "booking_time",
    label: "Booking Time",
    align: "left",
    field: "booking_time",
    format: (val) => {
      if (!val) return '';
      const date = new Date(val);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },
    sortable: true,
  },
  {
    name: "created_at",
    label: "Log At",
    align: "left",
    field: "created_at",
    format: (val) => {
      if (!val) return '';
      const date = new Date(val);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },
    sortable: true,
  },
];

const goToAppointmentDetail = (appointmentId) => {
  router.push({
    path: '/admin/appointment/detail',
    query: { id: appointmentId },
  });
};

const fetchLogs = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/appointment-logs", {
      params: {
        start_date: date.value,
        end_date: date.value,
      },
    });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      logs.value = response.data.data;
    } else {
      logs.value = [];
    }
  } catch (error) {
    console.error('Error fetching appointment logs:', error);
    logs.value = [];
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch appointment logs'
    });
  } finally {
    loading.value = false;
  }
};

watch(date, () => {
  fetchLogs();
});

onMounted(() => {
  fetchLogs();
});
</script>
