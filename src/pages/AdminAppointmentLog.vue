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
          <q-btn flat round icon="o_filter_alt">
            <q-menu auto-close>
              <q-list>
                <q-item
                  v-ripple
                  clickable
                  @click="clearAllFilters"
                  :class="{ 'bg-grey-3': !selectedFilter.action && !selectedFilter.appointmentId }"
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
                  @click="setActionFilter(selectedField.value)"
                  :class="{
                    'bg-grey-3': selectedFilter.action === selectedField.value,
                  }"
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
          <q-icon name="event" size="sm">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="date" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:body-cell-appointment_id="props">
          <q-td :props="props">
            <q-btn flat dense color="primary" :label="props.value"
            @click="setAppointmentFilter(props.row.appointment_id)" />
          </q-td>
        </template>
        <template v-slot:body-cell-description="props">
          <q-td :props="props">
            <div
            class="text-grey-8"
            >
              {{ props.value }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.value === 'success' ? 'green' : 'red'"
              :label="props.value"
              outline
              size="12px"
              dense
            />
          </q-td>
        </template>
        <template v-slot:body-cell-comments="props">
          <q-td :props="props">
            {{ props.value || "" }}
          </q-td>
        </template>
        <template v-slot:body-cell-detail="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              icon="o_visibility"
              color="grey"
              size="10px"
              @click="
                router.push({
                  path: '/admin/appointment/detail',
                  query: { id: props.row.appointment_id },
                })
              "
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();
const $q = useQuasar();
const allLogs = ref([]);
const date = ref(new Date().toISOString().slice(0, 10));
const loading = ref(false);

// 筛选相关的响应式数据
const selectedFilter = ref({
  action: "",
  appointmentId: null,
});

const selectedFields = [
  { icon: "o_book_online", label: "Booked", value: "BOOKED" },
  { icon: "o_message", label: "Message", value: "MESSAGE" },
  { icon: "o_update", label: "Updated", value: "UPDATED" },
  { icon: "o_logout", label: "Checked Out", value: "CHECKED_OUT" },
  { icon: "o_cancel", label: "Cancelled", value: "CANCELLED" },
  { icon: "o_delete", label: "Deleted", value: "DELETED" },
];

// 计算属性：过滤后的日志
const logs = computed(() => {
  let filtered = allLogs.value;

  // 只按action筛选（appointment ID筛选通过API重新获取数据）
  if (selectedFilter.value.action) {
    filtered = filtered.filter(log => log.action === selectedFilter.value.action);
  }

  return filtered;
});

const columns = [
  {
    name: "appointment_id",
    label: "No.",
    align: "center",
    field: "appointment_id",
    sortable: true,
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
    name: "booking_time",
    label: "Booking Time",
    align: "left",
    field: "booking_time",
    format: (val) => {
      if (!val) return "";
      const date = new Date(val);
      return date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    },
    sortable: true,
  },

   {
    name: "staff_name",
    label: "Therapist",
    align: "center",
    field: "staff_name",
  },
  {
    name: "comments",
    label: "Description",
    align: "left",
    field: "comments",
  },
  {
    name: "description",
    label: "Action",
    align: "left",
    field: "description",
  },
   {
    name: "created_at",
    label: "Acted At",
    align: "center",
    field: "created_at",
    format: (val) => {
      if (!val) return "";
      const date = new Date(val);
      return date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    align: "center",
    field: "status",
  },

  {
    name: "detail",
    label: "View",
    align: "center",
    field: "detail",
    sortable: true,
  },
];

const goToAppointmentDetail = (appointmentId) => {
  router.push({
    path: "/admin/appointment/detail",
    query: { id: appointmentId },
  });
};

// 筛选功能函数
const setActionFilter = (action) => {
  selectedFilter.value.action = action;
  selectedFilter.value.appointmentId = null; // 清除其他筛选
};

const setAppointmentFilter = (appointmentId) => {
  if (selectedFilter.value.appointmentId === appointmentId) {
    // 如果点击的是同一个appointment ID，则清除筛选
    selectedFilter.value.appointmentId = null;
    selectedFilter.value.action = "";
    fetchLogs(); // 重新获取所有日志
  } else {
    // 设置新的appointment ID筛选并重新获取数据
    selectedFilter.value.appointmentId = appointmentId;
    selectedFilter.value.action = ""; // 清除action筛选
    fetchLogsByAppointmentId(appointmentId);
  }
};

const clearAllFilters = () => {
  selectedFilter.value.action = "";
  selectedFilter.value.appointmentId = null;
  fetchLogs(); // 重新获取所有日志
};

// 根据appointment ID获取日志
const fetchLogsByAppointmentId = async (appointmentId) => {
  try {
    loading.value = true;
    const params = {
      start_date: date.value,
      end_date: date.value,
      appointment_id: appointmentId,
    };

    const response = await api.get("/api/appointment-logs", {
      params: params,
    });
    if (
      response.data &&
      response.data.success &&
      Array.isArray(response.data.data)
    ) {
      allLogs.value = response.data.data;
    } else {
      allLogs.value = [];
    }
  } catch (error) {
    console.error("Error fetching appointment logs by ID:", error);
    allLogs.value = [];
    $q.notify({
      type: "negative",
      message: "Failed to fetch appointment logs",
    });
  } finally {
    loading.value = false;
  }
};

const getActionLabel = (action) => {
  const labels = {
    BOOKED: "Booked",
    MESSAGE: "Message",
    UPDATED: "Updated",
    CHECKED_OUT: "Checked Out",
    CANCELLED: "Cancelled",
    DELETED: "Deleted",
  };
  return labels[action] || action;
};

const fetchLogs = async () => {
  try {
    loading.value = true;
    const params = {
      start_date: date.value,
      end_date: date.value,
    };

    const response = await api.get("/api/appointment-logs", {
      params: params,
    });
    if (
      response.data &&
      response.data.success &&
      Array.isArray(response.data.data)
    ) {
      allLogs.value = response.data.data;
    } else {
      allLogs.value = [];
    }
  } catch (error) {
    console.error("Error fetching appointment logs:", error);
    allLogs.value = [];
    $q.notify({
      type: "negative",
      message: "Failed to fetch appointment logs",
    });
  } finally {
    loading.value = false;
  }
};

watch(date, () => {
  clearAllFilters(); // 清除筛选条件
  fetchLogs();
});

onMounted(() => {
  fetchLogs();
});
</script>
