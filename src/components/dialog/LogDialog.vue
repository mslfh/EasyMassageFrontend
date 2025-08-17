<template>
  <q-dialog v-model="isVisible" @hide="$emit('close')">
    <q-card :style="$q.screen.gt.md ? 'min-width: 600px' : 'min-width: 100%'">
      <q-card-section horizontal class="q-pl-md q-pt-md">
        <div class="text-h6 text-grey">Appointment Logs</div>
        <q-space />
        <q-btn flat round icon="close" color="grey" @click="$emit('close')" />
      </q-card-section>
      <q-card-section>
        <q-timeline class="q-pl-md" v-if="appointmentLogs.length > 0">
          <q-timeline-entry
            v-for="log in appointmentLogs"
            :key="log.id"
            :color="getLogColor(log.action)"
            :icon="getLogIcon(log.action)"
          >
            <div class="text-grey-6">
              <div class="text-weight-bold">{{ log.description }}</div>
              <div v-if="log.comments" class="q-mt-xs">{{ log.comments }}</div>
              <div class="q-mt-sm">
                <q-chip
                  :color="log.status === 'success' ? 'green' : 'red'"
                  :label="log.status"
                  outline
                  size="sm"
                  dense
                />
              </div>
              <div class="text-grey-7 text-caption q-mt-sm" v-if="log.service_title || log.staff_name">
                <div v-if="log.service_title">Service: {{ log.service_title }}</div>
                <div v-if="log.staff_name">Therapist: {{ log.staff_name }}</div>
              </div>
            </div>
            <template v-slot:subtitle>
              <div class="row q-pa-none">
                <q-label class="col-12 text-subtitle2">{{ formatDateTime(log.created_at) }}</q-label>
              </div>
            </template>
          </q-timeline-entry>
        </q-timeline>
        <div v-else class="text-center text-grey-6 q-pa-lg">
          No logs found for this appointment
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  appointmentId: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "close"]);

const $q = useQuasar();
const isVisible = ref(props.modelValue);
const appointmentLogs = ref([]);

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    isVisible.value = newValue;
    if (newValue && props.appointmentId) {
      fetchAppointmentLogs();
    }
  }
);

// Watch for internal visibility changes
watch(isVisible, (newValue) => {
  emit("update:modelValue", newValue);
  if (!newValue) {
    emit("close");
  }
});

const fetchAppointmentLogs = async () => {
  if (!props.appointmentId) return;

  try {
    const response = await api.get("/api/appointment-logs", {
      params: {
        appointment_id: props.appointmentId,
      }
    });

    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      appointmentLogs.value = response.data.data.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );
      $q.notify({
        type: "info",
        message: "Appointment logs fetched successfully",
        position: "top",
        timeout: 2000,
      });
    } else {
      appointmentLogs.value = [];
      $q.notify({
        type: "warning",
        message: "No logs found for this appointment",
        position: "top",
        timeout: 2000,
      });
    }
  } catch (error) {
    console.error("Error fetching appointment logs:", error);
    appointmentLogs.value = [];
    $q.notify({
      type: "negative",
      message: "Failed to fetch appointment logs",
      position: "top",
      timeout: 2000,
    });
  }
};

const getLogColor = (action) => {
  const colors = {
    BOOKED: "blue-5",
    MESSAGE: "orange-5",
    UPDATED: "purple-5",
    CHECKED_OUT: "green-5",
    CANCELLED: "red-5",
    DELETED: "grey-7",
  };
  return colors[action] || "grey-5";
};

const getLogIcon = (action) => {
  const icons = {
    BOOKED: "o_book_online",
    MESSAGE: "o_message",
    UPDATED: "o_update",
    CHECKED_OUT: "o_done_all",
    CANCELLED: "o_cancel",
    DELETED: "o_delete",
  };
  return icons[action] || "o_circle";
};

const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

onMounted(() => {
  if (props.modelValue && props.appointmentId) {
    fetchAppointmentLogs();
  }
});
</script>
