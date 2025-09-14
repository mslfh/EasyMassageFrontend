<template>
  <q-dialog
    v-model="editScheduleStaffDialog"
    transition-show="scale"
    transition-hide="scale"
    @hide="emit('close')"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">
          {{ props.staffSchedule.staff_name }}'s Schedule
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <q-input
            class="col-6"
            v-model="props.staffSchedule.staff_name"
            label="Staff"
            readonly
            outlined
          />
          <q-input
            class="col-6"
            v-model="schedule.work_date"
            readonly
            type="date"
            label="Date"
            outlined
          />
        </div>
        <q-input
          v-model="schedule.start_time"
          type="time"
          label="Start Time"
          :error="startTimeError.hasError"
          :error-message="startTimeError.message"
        />
        <q-input
          v-model="schedule.end_time"
          type="time"
          label="End Time"
          :error="endTimeError.hasError"
          :error-message="endTimeError.message"
        />
        <!-- <q-option-group
          v-model="schedule.status"
          label="Status"
          :options="[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ]"
          inline
        /> -->
        <q-input v-model="schedule.remark" label="Remark" />
      </q-card-section>
      <!-- Time Restrictions Configuration - Only for Admin/Desk -->
      <q-card-section
        v-if="isAdminOrDeskRole"
        class="q-pt-none"
      >
        <q-toggle
          v-model="timeRestrictionsEnabled"
          label="Enable time restrictions for staff"
          color="primary"
          @update:model-value="emit('update-time-restrictions', timeRestrictionsEnabled)"
        />
        <div class="text-caption text-grey-6 q-mt-xs">
          When enabled, staff can only advance start time and extend end time
        </div>
      </q-card-section>
      <q-card-section
        v-if="isAdminOrDeskRole"
        class="items-center q-pb-none text-grey text-subtitle1"
      >
        <div class="text-bold">
          <q-icon name="group" size="sm" class="q-mr-md" />Staff Filter
        </div>
        <q-option-group
          v-model="showAllStaff"
          :options="[
            { label: 'All Staff', value: true },
            { label: 'Scheduled Staff Only', value: false },
          ]"
          type="radio"
          color="primary"
          inline
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="negative"
          @click="editScheduleStaffDialog = false"
        />
        <q-btn
          flat
          label="Confirm"
          color="primary"
          :disable="hasValidationErrors"
          @click="
            () => {
              editScheduleStaffDialog = false;
              if (isAdminOrDeskRole && showAllStaff != props.isShowAllStaff) {
                updateSchedule();
                emit('switch-show-staff');
              } else {
                updateSchedule();
              }
            }
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { canAccessAllMenus } from "../../utils/auth";

const props = defineProps({
  staffSchedule: {
    type: Object,
    required: true,
  },
  isShowAllStaff: {
    type: Boolean,
    required: true,
  },
  enableTimeRestrictions: {
    type: Boolean,
    default: false,
  },
});

const $q = useQuasar();

const schedule = ref([]);
const isAdminOrDeskRole = ref(false);
const originalSchedule = ref({});
const timeRestrictionsEnabled = ref(props.enableTimeRestrictions);

const emit = defineEmits(["close", "switch-show-staff", "update-time-restrictions"]);

const editScheduleStaffDialog = ref(true);
const showAllStaff = ref(props.isShowAllStaff);

onMounted(() => {
  schedule.value = props.staffSchedule.schedule[0] || {};
  originalSchedule.value = { ...schedule.value };
  isAdminOrDeskRole.value = canAccessAllMenus();
});

// 开始时间验证计算属性
const startTimeError = computed(() => {
  // 如果禁用时间限制，或者是管理员/前台角色，则不进行验证
  if (!timeRestrictionsEnabled.value || isAdminOrDeskRole.value) {
    return { hasError: false, message: '' };
  }

  const originalStartTime = originalSchedule.value.start_time;
  const newStartTime = schedule.value.start_time;

  if (originalStartTime && newStartTime && newStartTime > originalStartTime) {
    return {
      hasError: true,
      message: 'Start time cannot be delayed by staff account. Please contact an administrator.'
    };
  }

  return { hasError: false, message: '' };
});

// 结束时间验证计算属性
const endTimeError = computed(() => {
  // 如果禁用时间限制，或者是管理员/前台角色，则不进行验证
  if (!timeRestrictionsEnabled.value || isAdminOrDeskRole.value) {
    return { hasError: false, message: '' };
  }

  const originalEndTime = originalSchedule.value.end_time;
  const newEndTime = schedule.value.end_time;

  if (originalEndTime && newEndTime && newEndTime < originalEndTime) {
    return {
      hasError: true,
      message: 'End time cannot be shortened by staff account. Please contact an administrator.'
    };
  }

  return { hasError: false, message: '' };
});

// 检查是否有任何验证错误
const hasValidationErrors = computed(() => {
  return startTimeError.value.hasError || endTimeError.value.hasError;
});

async function updateSchedule() {
  // 如果有验证错误，不执行更新
  if (hasValidationErrors.value) {
    return;
  }

  try {
    const { id, start_time, end_time,status, remark } = schedule.value;
    if (id) {
      await api.put(`/api/schedules/${id}`, {
        start_time,
        end_time,
        // status,
        remark,
      });
    } else {
      await api.post(`/api/schedules`, {
        staff_id: props.staffSchedule.staff_id,
        work_date: schedule.value.work_date,
        status:"active",
        start_time,
        end_time,
        remark,
      });
    }
  } catch (error) {
    console.error("Error updating event:", error);
  }
}
</script>
