<template>
  <q-dialog
    v-model="addAppointmentDialog.visible"
    transition-show="scale"
    transition-hide="scale"
    @hide="
      takeBreakDialog.visible ? (takeBreakDialog.visible = true) : emit('close')
    "
  >
    <q-card :style="$q.screen.gt.md ? 'min-width: 1000px' : 'min-width: 100%'">
      <div class="row">
        <!--Events -->
        <!-- <div :class="$q.screen.gt.md ? 'col-2-md ' : 'col-12'"> -->
        <div class="col-md-2 col-xs-12">
          <q-card-section>
            <q-label style="color: goldenrod" class="text-h5 text-weight-bold">
              <q-icon name="alarm" size="md" />
              {{ addAppointmentForm.booking_time }}
            </q-label>
            <q-btn
              v-if="$q.screen.gt.md"
              dense
              outline
              style="color: goldenrod"
              class="q-ma-md"
              label="Add Appointment"
            />
            <q-btn
              v-if="selectedTime"
              dense
              outline
              style="color: teal"
              class="q-ma-md"
              label="Take a break"
              @click="showTakeBreakDialog"
            />
          </q-card-section>
        </div>
        <!-- Select Therapist -->
        <div class="col-md-4 q-pa-md-md col-xs-5 q-ma-xs-xs">
          <div>
            <div class="text-h6 text-grey-8 q-pa-xs">Select Therapist</div>
            <q-chip
              v-for="staff in staffOptions"
              :key="staff.id"
              clickable
              :color="selectedStaff.id === staff.id ? 'orange-2' : 'blue-2'"
              @click="
                () => {
                  selectedStaff.id = staff.id;
                  selectedStaff.name = staff.name;
                  fetchAvailableBookingTime(addAppointmentForm.booking_date);
                }
              "
            >
              {{ staff.name }}
            </q-chip>

            <q-select
              v-model="addAppointmentForm.customer_service[0].service"
              :options="serviceOptions"
              label="* Service"
              option-value="id"
              option-label="name"
              clearable
              @update:model-value="
                fetchAvailableBookingTime(addAppointmentForm.booking_date)
              "
            />
            <q-input
              v-model="addAppointmentForm.booking_date"
              label="Select Date"
              mask="####-##-##"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="addAppointmentForm.booking_date"
                      mask="YYYY-MM-DD"
                      @update:model-value="
                        fetchAvailableBookingTime(
                          addAppointmentForm.booking_date
                        )
                      "
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-label class="text-subtitle2 text-grey-9"> Booking Time</q-label>
            <q-input
              dense
              v-model="addAppointmentForm.booking_time"
              outlined
              type="time"
            />
            <q-separator class="q-my-md" />
            <q-scroll-area style="height: 250px">
              <q-chip
                v-for="item in available_booking_time"
                :key="item"
                clickable
                :icon="
                  addAppointmentForm.booking_time == item
                    ? 'check_circle'
                    : 'o_fiber_manual_record'
                "
                :dense="$q.screen.lt.md"
                :color="
                  addAppointmentForm.booking_time == item
                    ? 'orange-3'
                    : 'teal-1'
                "
                @click="addAppointmentForm.booking_time = item"
                >{{ item }}</q-chip
              >
            </q-scroll-area>
          </div>
        </div>
        <!-- Select UserSearch -->
        <div class="col-md-5 q-pa-md-md col-xs-6">
          <q-card-section>
            <UserSearch @user-selected="onUserSelectedCustomer" />
            <q-input
              v-model="addAppointmentForm.customer_service[0].customer_name"
              label="Customer Name"
              @update:model-value="autoFillName()"
            />
            <q-input
              v-model="addAppointmentForm.customer_first_name"
              label="First Name"
            />
            <q-input
              v-model="addAppointmentForm.customer_last_name"
              label="Last Name"
            />
            <q-input
              v-model="addAppointmentForm.customer_email"
              label="Email"
            />
            <q-input
              v-model="addAppointmentForm.customer_phone"
              label="Phone"
            />
            <q-input
              autogrow
              v-model="addAppointmentForm.comments"
              label="Service Comments"
            />
            <div class="text-subtitle1 text-grey-7 text-weight-bold">
              Save Customer
              <q-toggle
                v-model="addAppointmentForm.is_first"
                checked-icon="check"
                color="deep-orange-6"
                unchecked-icon="clear"
              />
            </div>
            <div
              class="row justify-end"
              v-if="addAppointmentForm.customer_phone"
            >
              <q-chip
                v-if="profile"
                size="12px"
                outline
                icon="perm_media"
                color="blue-4"
                text-color="white"
                clickable
                @click.stop="isAttachmentDialogOpen = true"
              >
                Attachment
              </q-chip>
              <q-chip
                size="12px"
                outline
                icon="o_sticky_note_2"
                color="blue-4"
                text-color="white"
                clickable
                @click.stop="isProfileDialogOpen = true"
              >
                Profile
                <!-- <q-badge  floating-right rounded color="blue" transparent> -->
                <q-icon
                  v-if="hasProfile"
                  size="15px"
                  name="done_all"
                  color="blue"
                  class="q-ml-sm"
                />
                <q-icon
                  v-if="!hasProfile"
                  size="15px"
                  name="add"
                  color="blue"
                  class="q-ml-sm"
                />
                <!-- </q-badge> -->
              </q-chip>
              <q-chip
                size="12px"
                outline
                icon="history"
                color="blue-4"
                text-color="white"
                clickable
                @click.stop="isHistoryDialogOpen = true"
              >
                History
              </q-chip>
            </div>
          </q-card-section>
        </div>
      </div>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="negative"
          @click="addAppointmentDialog.visible = false"
        />
        <q-btn flat label="Add" color="positive" @click="addAppointment" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Add a Break Dialog -->
  <q-dialog v-model="takeBreakDialog.visible" seamless position="bottom">
    <q-card>
      <q-linear-progress :value="1.0" color="pink" />
      <q-card-section>
        <div class="text-h6">
          Take a Break - {{ addAppointmentForm.booking_time }}
        </div>
        <q-radio
          v-model="takeBreakDialog.selectedDuration"
          val="10"
          label="10 minutes"
          @update:model-value="assumeBreakEvent(10)"
        />
        <q-radio
          v-model="takeBreakDialog.selectedDuration"
          val="20"
          label="20 minutes"
          @update:model-value="assumeBreakEvent(20)"
        />
        <q-radio
          v-model="takeBreakDialog.selectedDuration"
          val="30"
          label="30 minutes"
          @update:model-value="assumeBreakEvent(30)"
        />
        <q-input
          v-model="takeBreakDialog.customDuration"
          label="Custom Duration (minutes)"
          type="number"
          debounce="300"
          outlined
          dense
          @update:model-value="
            takeBreakDialog.selectedDuration = null;
            assumeBreakEvent(takeBreakDialog.customDuration);
          "
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="negative"
          @click="
            assumeBreakEvent(0);
            emit('close');
          "
        />
        <q-btn
          flat
          label="Confirm"
          color="positive"
          @click="confirmTakeBreak"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Customer History -->
  <q-dialog v-model="isHistoryDialogOpen">
    <q-card style="min-width: 350px; min-height: 300px">
      <q-card-section class="text-h6"> Customer History </q-card-section>
      <q-card-section>
        <CustomerHistoryTimeline
          :user_Id="addAppointmentForm.customer_id"
          :customer_phone="addAppointmentForm.customer_phone"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Back"
          color="positive"
          @click="isHistoryDialogOpen = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Customer Profile -->
  <q-dialog v-model="isProfileDialogOpen">
    <ConfidentialClientCard
      v-if="hasProfile"
      style="width: 700px"
      :profileId="profile_id"
      :editable="true"
    />
    <CustomerProfileCard
      v-if="!hasProfile"
      style="width: 700px"
      :first_name="addAppointmentForm.customer_first_name"
      :last_name="addAppointmentForm.customer_last_name"
      :phone="addAppointmentForm.customer_phone"
      @save="
        (id) => {
          isProfileDialogOpen = false;
          profile_id = id;
          hasProfile = true;
        }
      "
    />
  </q-dialog>

  <!-- Customer Attachemnt -->
  <ProfileAttachmentDialog
    v-if="isAttachmentDialogOpen"
    :profile="profile"
    @close="
    fetchUserProfile();
    isAttachmentDialogOpen = false;
    "
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { fetchUserFromSearch } from "../../composables/useUserFromSearch";
import { fetchAvailableBookingTimeSlots } from "../../composables/useAvailableBookingTime";
import type { AppointmentEvent } from "../../types/appointment";
import UserSearch from "../UserSearch.vue";
import CustomerHistoryTimeline from "../CustomerHistoryTimeline.vue";
import ConfidentialClientCard from "components/ConfidentialClientCard.vue";
import CustomerProfileCard from "components/CustomerProfileCard.vue";
import ProfileAttachmentDialog from "components/dialog/ProfileAttachmentDialog.vue";

const props = defineProps({
  selectedStaff: {
    type: Object,
    required: true,
  },
  selectedDate: {
    type: String,
    required: true,
  },
  selectedTime: {
    type: String,
    required: true,
  },
  staffOptions: {
    type: Object,
    required: true,
  },
  serviceOptions: {
    type: Object,
    required: true,
  },
  selectedUser: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save"): void;
  (
    e: "addBreakEvent",
    payload: { id: number | null; event: AppointmentEvent | null }
  ): void;
}>();

const $q = useQuasar();

const selectedStaff = ref(props.selectedStaff);
const staffOptions = ref(
  props.staffOptions &&
    Array.isArray(props.staffOptions) &&
    props.staffOptions.length > 0
    ? props.staffOptions
    : []
);
const serviceOptions = ref(
  props.serviceOptions &&
    Array.isArray(props.serviceOptions) &&
    props.serviceOptions.length > 0
    ? props.serviceOptions
    : []
);

const addAppointmentDialog = ref({ visible: true, tab: "customer" });

const addAppointmentForm = ref({
  booking_time: props.selectedTime,
  booking_date: props.selectedDate,
  customer_id: 0,
  customer_first_name: "",
  customer_last_name: "",
  is_first: true,
  customer_email: "",
  customer_phone: "",
  comments: "",
  type: "assigned",
  tag: ["staff_created"],
  customer_service: [
    {
      customer_name: "",
      service: "",
      staff: "",
      comments: "",
    },
  ],
});

// UserProfile
const profile_id = ref(0);
const profile = ref(null);
const hasProfile = ref(false);

async function fetchUserProfile() {
  hasProfile.value = false;
  const user_id = addAppointmentForm.value.customer_id;
  if (!user_id) {
    return;
  }
  const { data } = await api.get(`/api/get-profile-by-userId`, {
    params: {
      user_id: user_id,
    },
  });
  if (!data.id) {
    return;
  }
  hasProfile.value = true;
  profile_id.value = data.id;
  profile.value = data;
}

onMounted(async () => {
  // 自动填充客户信息
  if (props.selectedUser) {
    addAppointmentForm.value.customer_service[0].customer_name =
      props.selectedUser.name || "";
    addAppointmentForm.value.customer_first_name =
      (props.selectedUser.name || "").split(" ")[0] || "";
    addAppointmentForm.value.customer_last_name =
      (props.selectedUser.name || "").split(" ").slice(1).join(" ") || "";
    addAppointmentForm.value.customer_email = props.selectedUser.email || "";
    addAppointmentForm.value.customer_phone = props.selectedUser.phone || "";
    addAppointmentForm.value.customer_id = props.selectedUser.id;
  }
  // 如果 staffOptions 没有传递，则自动获取
  if (!staffOptions.value || staffOptions.value.length === 0) {
    //
    const staffResponse = await api.get("/api/get-staff-schedule-from-date", {
      params: {
        date: addAppointmentForm.value.booking_date,
      },
    });
    staffOptions.value = staffResponse.data.map((staff) => ({
      id: staff.id,
      name: staff.name,
    }));
    staffOptions.value.unshift({ id: 0, name: "Any therapist" });
  }
  // 如果 serviceOptions 没有传递，则自动获取
  if (!serviceOptions.value || serviceOptions.value.length === 0) {
    const response = await api.get("/api/services");
    serviceOptions.value = response.data.map((service) => ({
      id: service.id,
      name: service.title + " (" + service.duration + " min)",
      duration: service.duration,
    }));
  }
  fetchAvailableBookingTime();
});

const available_booking_time = ref<string[]>([]);

async function fetchAvailableBookingTime(date: string) {
  // try {
  const duration = addAppointmentForm.value.customer_service[0].service
    ? serviceOptions.value.filter(
        (service) =>
          service.id === addAppointmentForm.value.customer_service[0].service.id
      )[0].duration
    : 0;

  // Filter out unavailable times
  const times = await fetchAvailableBookingTimeSlots({
    date: addAppointmentForm.value.booking_date,
    staffId: selectedStaff.value.id,
    duration,
  });

  available_booking_time.value = times;
  if (times.length === 0) {
    $q.notify({
      type: "warning",
      color: "orange-4",
      message: "No available booking time found.",
    });
  }
  // } catch (error) {
  //   available_booking_time.value = [];
  //   $q.notify({
  //     type: "negative",
  //     message: "Failed to load booking time.",
  //   });
  // }
}

async function addAppointment() {
  try {
    if (addAppointmentForm.value.customer_service[0]["service"] === "") {
      $q.notify({
        type: "negative",
        message: "Please select a service",
        position: "top",
        timeout: 2000,
      });
      return;
    }
    // Check if booking time is in the available booking time list
    if (!addAppointmentForm.value.booking_time) {
      $q.notify({
        type: "negative",
        message: "Booking time can not be empty!",
        position: "top",
        timeout: 2000,
      });
      return;
    }

    if (addAppointmentForm.value.customer_service[0]["customer_name"] === "") {
      $q.notify({
        type: "negative",
        message: "Customer Name Can not be empty!",
        position: "top",
        timeout: 2000,
      });
      return;
    }
    if (
      addAppointmentForm.value.is_first &&
      addAppointmentForm.value.customer_phone === ""
    ) {
      $q.notify({
        type: "negative",
        message: "The Phone Number can not be empty when saving!",
        position: "top",
        timeout: 2000,
      });
      return;
    }

    if (selectedStaff.value.id === 0) {
      addAppointmentForm.value.type = "unassigned";
    } else {
      addAppointmentForm.value.type = "assigned";
    }

    addAppointmentForm.value.customer_service[0]["staff"] = selectedStaff.value;

    const payload = {
      ...addAppointmentForm.value,
    };
    const response = await api.post("/api/appointments", payload);

    if (response.status === 201) {
      $q.notify({
        type: "positive",
        message: "Appointment added successfully",
        position: "top",
        timeout: 2000,
      });
    }
    emit("save");
  } catch (error) {
    console.error("Error adding appointment:", error);
    $q.notify({
      type: "negetive",
      message: "Error adding appointment",
      position: "top",
      timeout: 2000,
    });
  }
}

function autoFillName() {
  const fullName = addAppointmentForm.value.customer_service[0].customer_name;
  if (fullName) {
    const nameParts = fullName.split(" ");
    addAppointmentForm.value.customer_first_name = nameParts[0] || "";
    addAppointmentForm.value.customer_last_name =
      nameParts.slice(1).join(" ") || "";
  }
}

function showTakeBreakDialog() {
  addAppointmentDialog.value.visible = false;
  takeBreakDialog.value.visible = true;
}

// Take a Break
const takeBreakDialog = ref({
  visible: false,
  selectedDuration: null as number | null,
  customDuration: "",
});

const assumeBreakId = ref<number | null>(null);
const breakEvent = ref<AppointmentEvent>({
  id: 0,
  staff_id: selectedStaff.value.id,
  staff_name: selectedStaff.value.name,
  date: addAppointmentForm.value.booking_date,
  time: "",
  expected_end_time: "",
  service_id: null,
  service_title: "Break",
  service_duration: 0,
  service_price: 0,
  customer_name: selectedStaff.value.name,
  comments: "Scheduled break",
  bgcolor: "grey-5",
  status: "booked",
  type: "break",
  tag: "",
});

function assumeBreakEvent(duration: number) {
  if (duration === 0) {
    emit("addBreakEvent", { id: assumeBreakId.value, event: null });
    return;
  }
  const startTime = addAppointmentForm.value.booking_time;
  let [startHour, startMinute] = startTime.split(":").map(Number);
  let minutes = Number(startMinute) + Number(duration);
  if (minutes >= 60) {
    startHour += 1;
    minutes %= 60;
  }
  const endTime = `${String(startHour).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
  if (!assumeBreakId.value) {
    breakEvent.value.id = Date.now();
    assumeBreakId.value = breakEvent.value.id;
  }
  breakEvent.value.time = startTime;
  breakEvent.value.expected_end_time = endTime;
  breakEvent.value.service_duration = duration;
  emit("addBreakEvent", { id: breakEvent.value.id, event: breakEvent.value });
}

async function confirmTakeBreak() {
  const duration =
    takeBreakDialog.value.selectedDuration ||
    parseInt(takeBreakDialog.value.customDuration, 10);
  if (!duration || duration <= 0) {
    $q.notify({
      type: "negative",
      message: "Please select or enter a valid break duration",
      position: "top",
      timeout: 2000,
    });
    return;
  }

  const payload = {
    ...breakEvent.value,
  };
  const response = await api.post("/api/takeBreakAppointment", payload);
  if (response.status === 201) {
    $q.notify({
      type: "positive",
      message: `Break scheduled successfully`,
      position: "top",
      timeout: 2000,
    });
  }
  emit("save");
}

function onUserSelectedCustomer(user) {
  addAppointmentForm.value.customer_service[0].customer_name = user.name;
  addAppointmentForm.value.customer_first_name = user.name.split(" ")[0] || "";
  addAppointmentForm.value.customer_last_name =
    user.name.split(" ").slice(1).join(" ") || "";
  addAppointmentForm.value.customer_email = user.email || "";
  addAppointmentForm.value.customer_phone = user.phone || "";
  addAppointmentForm.value.customer_id = user.id;
  fetchUserProfile();
}

// Customer History
const isHistoryDialogOpen = ref(false);
//Profile
const isProfileDialogOpen = ref(false);

const isAttachmentDialogOpen = ref(false);
</script>
