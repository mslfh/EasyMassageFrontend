<template>
  <div class="subcontent">
    <q-btn
      class="float-left q-ma-md"
      label="Add Appointment"
      color="primary"
      @click="showAddAppointmentDialog"
    />
    <div class="text-h6 text-center">
      {{ currentMonth }}
    </div>
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row">
      <div class="q-mx-sm col-2">
        <div
          class="text-subtitle1 text-weight-bold q-my-md text-brown-9 text-center"
        >
          <q-btn dense flat color="grey-8" icon="calendar_month" size="md">
            <q-badge color="deep-orange" text-color="white" floating>
              {{ dragItems.length }}
            </q-badge>
          </q-btn>
          Unassigned
        </div>
        <ul class="column">
          <li
            v-for="item in dragItems"
            :key="item.id"
            draggable="true"
            @dragstart="onDragStart($event, item)"
          >
            <q-card class="text-subtitle q-mb-sm bg-amber-11" flat bordered>
              <q-icon name="drag_indicator"></q-icon>Time: {{ item.time }} ({{
                item.service_duration
              }}
              min)
              <q-separator></q-separator>
              <q-card-section class="q-pt-none q-pb-none">
                Name: {{ item.customer_name }}
              </q-card-section>
              <q-card-section class="q-pt-none text-caption">
                * {{ item.service_title }}
              </q-card-section>
            </q-card>
          </li>
        </ul>
      </div>

      <div class="col-9" style="display: flex; height: 600px">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          :drag-enter-func="onDragEnter"
          :drag-over-func="onDragOver"
          :drag-leave-func="onDragLeave"
          :drop-func="onDrop"
          view="day"
          hoverable
          animated
          bordered
          transition-next="slide-left"
          transition-prev="slide-right"
          no-active-date
          :column-count="staffList.length"
          :interval-minutes="10"
          :interval-start="52"
          :interval-count="64"
          :interval-height="28"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-day="onClickHeadDay"
        >
          <template #head-day="{ scope: { timestamp, columnIndex } }">
            <div
              style="
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                padding: 2px;
              "
              class="row"
            >
              <div
                class="col-12"
                v-if="staffList[columnIndex]"
                style="text-align: center"
              >
                <div>{{ staffList[columnIndex].staff_name }}</div>
              </div>

              <div class="col-12" style="text-align: center">
                <template
                  v-for="event in getEventsByStaff(
                    timestamp.date,
                    staffList[columnIndex]?.staff_id
                  )"
                  :key="event.id"
                >
                  <q-badge
                    v-if="!event.time"
                    :class="badgeClasses(event, 'header')"
                    :style="badgeStyles(event, 'header')"
                    style="
                      width: 100%;
                      cursor: pointer;
                      height: 12px;
                      font-size: 10px;
                      margin: 1px;
                    "
                  >
                  </q-badge>
                  <q-badge
                    v-else
                    :class="badgeClasses(event, 'header')"
                    :style="badgeStyles(event, 'header')"
                    style="
                      margin: 1px;
                      width: 10px;
                      max-width: 10px;
                      height: 10px;
                      max-height: 10px;
                      cursor: pointer;
                    "
                    @click="scrollToEvent(event)"
                  >
                    <q-tooltip>{{
                      event.time +
                      " - " +
                      event.service_title +
                      " | " +
                      event.service_duration +
                      " min"
                    }}</q-tooltip>
                  </q-badge>
                </template>
              </div>
            </div>
          </template>

          <template
            #day-body="{
              scope: {
                timestamp,
                columnIndex,
                timeStartPos,
                timeDurationHeight,
              },
            }"
          >
            <template
              v-for="event in getEventsByStaff(
                timestamp.date,
                staffList[columnIndex]?.staff_id
              )"
              :key="event.id"
            >
              <div
                v-if="event.time !== undefined"
                class="my-event"
                :class="badgeClasses(event, 'body')"
                :style="
                  badgeStyles(event, 'body', timeStartPos, timeDurationHeight)
                "
              >
                <div align="right" class="q-ma-xs">
                  <q-icon
                    name="edit_calendar"
                    size="20px"
                    class="float-right"
                    @click="openEditEventDialog(event)"
                    clickable
                  />
                </div>
                <div class="q-ma-md">
                  <q-list>
                    <q-item-label class="text-subtitle2">
                      Name: {{ event.customer_name }}
                    </q-item-label>
                    <q-item-label class="text-caption">
                      Time: {{ event.time }} -
                      {{ event.expected_end_time }}
                    </q-item-label>
                    <q-item-label class="text-subtitle">
                      {{ event.service_title }} |
                      {{ event.service_duration }} min
                    </q-item-label>

                    <q-chip
                    v-if="event.status === 'pending'"
                      outline
                      color="white"
                      text-color="white"
                      icon="event"
                      clickable
                      @click="startAppointment(event)"
                    >
                      Start
                    </q-chip>

                    <q-chip
                      v-if="event.status === 'in_progress'"
                      outline
                      color="white"
                      text-color="white"
                      icon="hourglass_top"
                    >
                    </q-chip>
                    <!-- <q-chip
                      outline
                      color="white"
                      text-color="white"
                      icon="check_circle_outline"
                      clickable
                      @click="finishAppointment(event)"
                    >
                      Done
                    </q-chip> -->
                  </q-list>
                  <q-tooltip>{{
                    event.time +
                    " - " +
                    event.service_title +
                    " | " +
                    event.service_duration +
                    " min"
                  }}</q-tooltip>
                </div>
              </div>
            </template>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </div>

  <q-dialog v-model="confirmDialog.visible">
    <q-card>
      <q-card-section>
        <div class="text-h6">Confirm Assignment</div>
        <div>
          Do you want to assign this item to {{ confirmDialog.staffName }}?
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="negative"
          @click="confirmDialog.reject"
        />
        <q-btn
          flat
          label="Confirm"
          color="positive"
          @click="confirmDialog.resolve"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Add Appointment Dialog -->
  <q-dialog v-model="addAppointmentDialog.visible">
    <q-card style="min-width: 450px">
      <q-card-section>
        <div class="text-h6">Add Appointment</div>
      </q-card-section>
      <q-card-section>
        <q-input
          rounded
          v-model="user_search"
          outlined
          placeholder="Find User by Name, Phone, or Email"
          @keyup.enter="selectUserFromSearch"
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

        <q-list v-if="user_search !== ''">
          <q-item-label v-if="foundUsers.length == 0" class="text-caption"
            >No data found</q-item-label
          >
          <q-item
            v-for="user in foundUsers"
            :key="user.id"
            clickable
            @click="
              addAppointmentForm.customer_service[0].customer_name = user.name;
              addAppointmentForm.customer_first_name = user.first_name;
              addAppointmentForm.customer_last_name = user.last_name;
              addAppointmentForm.customer_email = user.email;
              addAppointmentForm.customer_phone = user.phone;
            "
          >
            <q-item-section>
              <q-item-label>{{ user.name }}</q-item-label>
              <q-item-label caption>{{ user.phone }}</q-item-label>
              <q-item-label caption>{{ user.email }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-input
          v-model="addAppointmentForm.customer_service[0].customer_name"
          label="Customer Name"
        />
        <q-select
          v-model="addAppointmentForm.customer_service[0].staff"
          :options="practitionerOptions"
          label="Practitioner"
          option-value="id"
          option-label="name"
          clearable
        />
        <q-select
          v-model="addAppointmentForm.customer_service[0].service"
          :options="serviceOptions"
          label="Service"
          option-value="id"
          option-label="name"
          clearable
        />
        Date:
        <q-input
          v-model="addAppointmentForm.booking_date"
          filled
          type="date"
          label="Date"
          @change="fetchAvailableBookingTime(addAppointmentForm.booking_date)"
        />
        Available Time:
        <q-chip
          v-for="item in available_booking_time"
          :key="item"
          clickable
          :icon="
            addAppointmentForm.booking_time == item
              ? 'check_circle'
              : 'o_fiber_manual_record'
          "
          :color="
            addAppointmentForm.booking_time == item ? 'orange-3' : 'teal-1'
          "
          @click="addAppointmentForm.booking_time = item"
          >{{ item }}</q-chip
        >
        <q-input
          v-model="addAppointmentForm.customer_first_name"
          label="First Name"
        />
        <q-input
          v-model="addAppointmentForm.customer_last_name"
          label="Last Name"
        />
        <q-input v-model="addAppointmentForm.customer_email" label="Email" />
        <q-input v-model="addAppointmentForm.customer_phone" label="Phone" />
        <q-input v-model="addAppointmentForm.comments" label="Comments" />
        <q-input
          v-model="addAppointmentForm.customer_service[0].comments"
          label="Service Comments"
        />
      </q-card-section>
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

  <!-- Edit Event Dialog -->
  <q-dialog v-model="editEventDialog.visible">
    <q-card style="min-width: 450px">
      <q-card-section>
        <div class="text-h6">Edit Event</div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="editEventForm.date"
          filled
          type="date"
          label="Date"
          @change="fetchAvailableBookingTime(editEventForm.date)"
        />

        <div class="q-mb-sm text-weight-bold">
          Time:
          <q-chip class="bg-amber-4" icon="check_circle">
            {{ editEventForm.time }}
          </q-chip>
        </div>

        <q-chip
          v-for="item in available_booking_time"
          v-model:model-value="editEventForm.time"
          class="bg-teal-1"
          :key="item"
          clickable
          icon="o_fiber_manual_record"
          @click="editEventForm.time = item"
          >{{ item }}</q-chip
        >
        <q-input v-model="editEventForm.customer_name" label="Customer Name" />
        <q-select
          v-model="editEventForm.service"
          :options="serviceOptions"
          use-input
          label="Service"
          option-value="id"
          option-label="name"
          clearable
        />
        <q-select
          v-model="editEventForm.staff"
          :options="practitionerOptions"
          label="Practitioner"
          option-value="id"
          option-label="name"
          clearable
        />
        <q-lable class="text-caption">Comments:</q-lable>

        <q-input v-model="editEventForm.comments" filled type="textarea" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="negative"
          @click="editEventDialog.visible = false"
        />
        <q-btn flat label="Save" color="positive" @click="saveEditedEvent" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  QCalendarDay,
  addToDate,
  parseTimestamp,
  isBetweenDates,
  today,
  parsed,
  parseTime,
  Timestamp,
} from "@quasar/quasar-ui-qcalendar";
import "@quasar/quasar-ui-qcalendar/index.css";
import { ref, computed, onMounted } from "vue";
import { api } from "boot/axios";
import NavigationBar from "components/NavigationBar.vue";
import {
  useQuasar,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
} from "quasar";
import { comment } from "postcss";
import { id } from "element-plus/es/locales.mjs";
import NoWorkResult_ from "postcss/lib/no-work-result";

const $q = useQuasar();
interface Event {
  id: number;
  staff_id: number;
  staff_name: string;
  date: string;
  time: string;
  expected_end_time: string;
  service_id: number;
  service_title: string;
  service_duration: number;
  service_price: number;
  customer_name: string;
  comments: string;
  bgcolor: string;
  status: string;
  appointment_id: number;
}

const calendar = ref<QCalendarDay>();
const selectedDate = ref(today());
const staffList = ref<{ staff_id: number; staff_name: string }[]>([]);
const available_booking_time = ref<string[]>([]);

onMounted(() => {
  fetchAppointments();
  fetchServiceOptions();
  fetchPractitionerOptions();
  fetchAvailableBookingTime(selectedDate.value);
});

const events = ref<Event[]>([]);
const dragItems = ref<Event[]>([]);
const defaultEvent = ref<Event[]>([]);

interface CustomDragEvent extends Event {
  dataTransfer: DataTransfer;
  preventDefault: () => void;
}

interface Scope {
  scope: any;
}

const confirmDialog = ref({
  visible: false,
  staffName: "",
  resolve: () => {},
  reject: () => {},
});

function showConfirmDialog(staffName: string): Promise<boolean> {
  return new Promise((resolve) => {
    confirmDialog.value = {
      visible: true,
      staffName,
      resolve: () => {
        confirmDialog.value.visible = false;
        resolve(true);
      },
      reject: () => {
        confirmDialog.value.visible = false;
        resolve(false);
      },
    };
  });
}

const currentMonth = computed(() => {
  const date = new Date(selectedDate.value);
  return date.toLocaleString("default", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
});
// convert the events into a map of lists keyed by date
const eventsMap = computed(() => {
  const map: { [key: string]: Event[] } = {};
  events.value.forEach((event) => {
    if (!map[event.date]) {
      map[event.date] = [];
    }
    map[event.date]!.push(event);
    if (event.days) {
      let timestamp = parseTimestamp(event.date);
      let days = event.days;
      do {
        if (timestamp) {
          timestamp = addToDate(timestamp, { day: 1 });
          if (!map[timestamp.date]) {
            map[timestamp.date] = [];
          }
          map[timestamp.date]!.push(event);
        }
      } while (--days > 0);
    }
  });
  return map;
});

async function fetchAppointments() {
  try {
    const response = await api.get("/api/getBookedServiceByDate", {
      params: {
        date: selectedDate.value,
      },
    });

    const fetchedData = response.data.map((bookedService) => ({
      id: bookedService.id,
      service_id: bookedService.service_id,
      service_title: bookedService.service_title,
      service_duration: bookedService.service_duration,
      service_price: bookedService.service_price,
      comments: bookedService.comments,
      date: selectedDate.value,
      time: bookedService.booking_time.slice(11, 16),
      expected_end_time: bookedService.expected_end_time.slice(11, 16),
      customer_name: bookedService.customer_name,
      staff_id: bookedService.staff_id,
      staff_name: bookedService.staff_name,
      bgcolor: bookedService.status === "in_progress" ? "teal-14":"teal" ,
      status: bookedService.status,
      appointment_id: bookedService.appointment_id,
    }));

    events.value = fetchedData.filter((event) => event.staff_id !== 0);
    dragItems.value = fetchedData.filter((event) => event.staff_id === 0);

    const staffResponse = await api.get("/api/staff");
    staffResponse.data.forEach((staff) => {
      const staffId = staff.id;
      const staffName = staff.name;
      if (!staffList.value.some((s) => s.staff_id === staffId)) {
        staffList.value.push({ staff_id: staffId, staff_name: staffName });
      }
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
  }
}
function getEventsByStaff(date: string, staffId: number): Event[] {
  return (
    eventsMap.value[date]?.filter((event) => event.staff_id === staffId) || []
  );
}
function badgeClasses(event: Event, type: string) {
  const isHeader = type === "header";
  return {
    [`text-white bg-${event.bgcolor}`]: true,
    "full-width": !isHeader && (!event.side || event.side === "full"),
    "left-side": !isHeader && event.side === "left",
    "right-side": !isHeader && event.side === "right",
    "rounded-border": true,
  };
}

function badgeStyles(
  event: Event,
  _type: string,
  timeStartPos?: (_time: string) => number,
  timeDurationHeight?: (_minutes: number) => number
) {
  const s: { [key: string]: string } = {};
  if (timeStartPos && timeDurationHeight) {
    s.top = timeStartPos(event.time) + "px";
    s.height = timeDurationHeight(event.duration) + "px";
  }
  s["align-items"] = "flex-start";
  return s;
}

function getEvents(dt: string): Event[] {
  // get all events for the specified date
  const events = eventsMap.value[dt] || [];

  if (events.length === 1 && events[0]) {
    events[0].side = "full";
  } else if (events.length === 2 && events[0] && events[1]) {
    // this example does no more than 2 events per day
    // check if the two events overlap and if so, select
    // left or right side alignment to prevent overlap
    const startTimestamp = parsed(events[0].date);
    if (startTimestamp) {
      const startTime = addToDate(startTimestamp, {
        minute: parseTime(events[0].time),
      });
      const endTime = addToDate(startTime, { minute: events[0].duration });
      const startTime2 = addToDate(parsed(events[1].date)!, {
        minute: parseTime(events[1].time),
      });
      const endTime2 = addToDate(startTime2, { minute: events[1].duration });
      if (
        isBetweenDates(startTime2, startTime, endTime, true) ||
        isBetweenDates(endTime2, startTime, endTime, true)
      ) {
        events[0].side = "left";
        events[1].side = "right";
      } else {
        events[0].side = "full";
        events[1].side = "full";
      }
    }
  }

  return events;
}

function scrollToEvent(event: Event) {
  if (calendar.value) {
    calendar.value.scrollToTime(event.time, 350);
  }
}

function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday();
  }
}
function onPrev() {
  if (calendar.value) {
    calendar.value.prev();
  }
}
function onNext() {
  if (calendar.value) {
    calendar.value.next();
  }
}

function onMoved(data: Timestamp) {
  console.info("onMoved", data);
  selectedDate.value = data.date;
  fetchAppointments();
}

function onClickDate(data: Timestamp) {
  console.info("onClickDate", data);
}
function onClickTime(data: Timestamp) {
  const clickTime = data.scope.timestamp.time.slice(0, 4);
  addAppointmentForm.value.booking_time = clickTime+ "0";
  console.log("onClickTime", addAppointmentForm);
  showAddAppointmentDialog();
  //format the time to HH:mm
  return;

  console.info("onClickTime", data);
  //show a dialog to have a break
  $q.dialog({
    title: "Break Time",
    message: "Do you want to take a break?",
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      console.log("Break time confirmed");
    })
    .onCancel(() => {
      console.log("Break time canceled");
    });

}
function onClickInterval(data: Timestamp) {
  console.info("onClickInterval", data);
}
function onClickHeadDay(data: Timestamp) {
  console.info("onClickHeadDay", data);
}

function onDragStart(e: DragEvent, item: DragItem) {
  console.info("onDragStart called");
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "copy";
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("ID", String(item.id));
  }
}

function onDragEnter(e: DragEvent, type: string, { scope }: Scope) {
  console.info("onDragEnter", type, scope);
  e.preventDefault();
  return true;
}

function onDragOver(e: DragEvent, type: string, { scope }: Scope) {
  console.info("onDragOver", type, scope);
  e.preventDefault();
  return true;
}

function onDragLeave(_e: DragEvent, type: string, { scope }: Scope) {
  console.info("onDragLeave", type, scope);
  return false;
}

interface DropEvent extends CustomDragEvent {
  dataTransfer: DataTransfer;
}

interface DropScope extends Scope {
  timestamp: Timestamp;
  staff_id: number;
  staff_name: string;
}

async function onDrop(
  e: DropEvent,
  type: string,
  { scope }: DropScope
): Promise<boolean> {
  console.info("onDrop", type, scope);
  const itemID = parseInt(e.dataTransfer.getData("ID"), 10);
  const item = dragItems.value.filter((item) => item.id === itemID);
  const event = item[0] ? { ...item[0] } : { ...defaultEvent };

  const columnIndex = scope.columnIndex;
  if (staffList.value[columnIndex]) {
    const staffName = staffList.value[columnIndex].staff_name;

    // Use q-dialog for confirmation
    const confirmDrop = await showConfirmDialog(staffName);
    if (!confirmDrop) {
      return false; // Cancel the drop action if the user declines
    }

    event.staff_id = staffList.value[columnIndex].staff_id;
    event.staff_name = staffName;
  }
  try {
    const payload = {
      staff_id: event.staff_id,
      staff_name: event.staff_name,
    };
    await api.put("/api/service-appointments/" + event.id, payload);
  } catch (error) {
    console.error("Error updating appointments:", error);
    return false;
  }
  events.value.push(event);
  dragItems.value = dragItems.value.filter((item) => item.id !== itemID);
  console.log("events.value", events.value);
  return false;
}

function onIntervalClass({ scope }) {
  return {
    droppable: scope.droppable === true,
  };
}

/// @ts-expect-error ignore
function onWeekdayClass({ scope }) {
  return {
    droppable: scope.droppable === true,
  };
}

const addAppointmentDialog = ref({ visible: false });
const addAppointmentForm = ref({
  booking_time: "",
  booking_date: today(),
  customer_first_name: "",
  customer_last_name: "",
  is_first: false,
  customer_email: "",
  customer_phone: "",
  comments: "",
  customer_service: [
    {
      customer_name: "",
      service: "",
      staff: "",
      comments: "",
    },
  ],
});

const serviceOptions = ref<{ id: number; name: string }[]>([]);
const practitionerOptions = ref<{ id: number; name: string }[]>([]);

async function fetchServiceOptions() {
  try {
    const response = await api.get("/api/services");
    serviceOptions.value = response.data.map((service: any) => ({
      id: service.id,
      name: service.title + " (" + service.duration + " min)",
    }));
  } catch (error) {
    console.error("Error fetching services:", error);
  }
}

async function fetchAvailableBookingTime(date: string) {
  try {
    let formattedDate = new Date(date);
    const day = String(formattedDate.getDate()).padStart(2, "0");
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const year = formattedDate.getFullYear();
    const response = await api.get("/api/get-unavailable-time-from-date", {
      params: {
        date: `${year}/${month}/${day}`,
      },
    });
    const unavailable_booking_time = response.data;
    console.log("Unavailable booking times:", unavailable_booking_time);
    const allTimes = [];
    for (let i = 8; i < 18; i++) {
      allTimes.push(`${i.toString().padStart(2, "0")}:00`);
      allTimes.push(`${i.toString().padStart(2, "0")}:10`);
      allTimes.push(`${i.toString().padStart(2, "0")}:20`);
      allTimes.push(`${i.toString().padStart(2, "0")}:30`);
      allTimes.push(`${i.toString().padStart(2, "0")}:40`);
      allTimes.push(`${i.toString().padStart(2, "0")}:50`);
    }
    // Filter out unavailable times
    available_booking_time.value = allTimes.filter((time) => {
      return !unavailable_booking_time.some((slot) => {
        const start = slot.start_time.slice(0, 5);
        const end = slot.end_time.slice(0, 5);
        return time >= start && time < end;
      });
    });
    console.log("Available booking times:", available_booking_time.value);
  } catch (error) {
    console.error("Error fetching available booking times:", error);
  }
}

async function fetchPractitionerOptions() {
  try {
    const response = await api.get("/api/staff");
    practitionerOptions.value = response.data.map((staff: any) => ({
      id: staff.id,
      name: staff.name,
    }));
  } catch (error) {
    console.error("Error fetching practitioners:", error);
  }
}

function showAddAppointmentDialog() {
  addAppointmentDialog.value.visible = true;
}

async function addAppointment() {
  try {
    //check
    if (addAppointmentForm.value.customer_service[0]['service'] === "") {
      $q.notify({
        type: "negative",
        message: "Please select a service",
        position: "top",
        timeout: 2000,
      });
      return;
    }
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

    addAppointmentDialog.value.visible = false;
    addAppointmentForm.value = {
      booking_time: "",
      booking_date: today(),
      customer_first_name: "",
      customer_last_name: "",
      is_first: false,
      customer_email: "",
      customer_phone: "",
      comments: "",
      customer_service: [
        {
          customer_name: "",
          service: "",
          staff: "",
          comments: "",
        },
      ],
    };
    available_booking_time.value = [];
    dragItems.value = [];

    fetchAppointments(); // Refresh appointments after adding
  } catch (error) {
    console.error("Error adding appointment:", error);
  }
}

const editEventDialog = ref({ visible: false });

const editEventForm = ref({
  id: 0,
  date: "",
  time: "",
  customer_name: "",
  service: "",
  staff: 0,
  comments: "",
});

function openEditEventDialog(event: Event) {
  editEventForm.value = {
    id: event.id,
    date: event.date,
    time: event.time,
    customer_name: event.customer_name,
    service: event.service_title,
    staff: event.staff_name,
    comments: event.comments,
  };
  editEventDialog.value.visible = true;
}

async function saveEditedEvent() {
  try {
    const payload = { ...editEventForm.value };
    await api.put(`/api/service-appointments/${payload.id}`, payload);
    editEventDialog.value.visible = false;
    fetchAppointments(); // Refresh appointments after editing
  } catch (error) {
    console.error("Error saving edited event:", error);
  }
}

const user_search = ref("");
const foundUsers = ref<{ id: number; name: string; phone: string }[]>([]);

const selectUserFromSearch = async () => {
  foundUsers.value = [];
  try {
    const response = await api.get("/api/findUserByField", {
      params: { search: user_search.value },
    });
    if (response.data.length > 0) {
      foundUsers.value = response.data.map((user) => ({
        ...user,
      }));
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const startAppointment = async (event: Event) => {
  // Show confirmation dialog before starting the appointment
  //get the current time
  const start_time = new Date();
  const hours = String(start_time.getHours()).padStart(2, "0");
  const minutes = String(start_time.getMinutes()).padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;


  $q.dialog({
    title: "Start Appointment",
    message:
      "Do you want to start this appointment? it will be " + formattedTime,
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      try {
        const payload = {
          id: event.appointment_id,
          time: formattedTime,
          status: "in_progress",
        };
       api.put(`/api/appointments/${event.appointment_id}`, payload);
        fetchAppointments(); // Refresh appointments after finishing
      } catch (error) {
        console.error("Error finishing appointment:", error);
      }
    })
    .onCancel(() => {});
};

const finishAppointment = async (event: Event) => {
  // Show confirmation dialog before finishing the appointment
  $q.dialog({
    title: "Finish Appointment",
    message: "Do you want to finish this appointment?",
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      console.log("Break time confirmed");
    })
    .onCancel(() => {
      console.log("Break time canceled");
    });

  try {
    const payload = {
      id: event.id,
      status: "finished",
    };
    await api.put(`/api/service-appointments/${event.id}`, payload);
    fetchAppointments(); // Refresh appointments after finishing
  } catch (error) {
    console.error("Error finishing appointment:", error);
  }
};
</script>

<style lang="scss" scoped>
.my-event {
  position: absolute;
  font-size: 12px;
  justify-content: center;
  margin: 0 1px;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
</style>
