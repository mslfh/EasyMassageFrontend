<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import Messages from "./Messages.vue";
import Profile from "./Profile.vue";
import EssentialLink from "components/EssentialLink.vue";
import { fetchUserFromSearch } from "../composables/useUserFromSearch";
import CustomerHistoryTimeline from "components/CustomerHistoryTimeline.vue";
import { api } from "boot/axios";
import AddAppointmentDialog from "components/dialog/AddAppointmentDialog.vue";
import {
  getCurrentUser,
  getUserRole,
  canAccessAllMenus,
  canOnlyAccessSchedule,
} from "../utils/auth";

const APP_TITLE = import.meta.env.VITE_APP_TITLE;
const showingNavigationDropdown = ref(false);
const leftDrawerOpen = ref(false);
const zoomDrawer = ref(false);
const $q = useQuasar();

// User role management
const currentUser = ref(null);
const userRole = ref("");

// Get current user info from localStorage
onMounted(() => {
  currentUser.value = getCurrentUser();
  console.log("Current User:", currentUser.value);
  userRole.value = getUserRole();
  console.log("User Role:", userRole.value);
  console.log("Is Admin or Desk:", canAccessAllMenus());
  console.log("Is Staff Only:", canOnlyAccessSchedule());
});

// Computed properties for role-based visibility
const isAdminOrDesk = computed(() => canAccessAllMenus());
const isStaffOnly = computed(() => canOnlyAccessSchedule());

const searchField = ref("");
const loading = ref(false);
const foundUsers = ref<
  { id: number; name: string; phone: string; email: string }[]
>([]);

async function onSearch() {
  if (!searchField.value) {
    foundUsers.value = [];
    return;
  }
  loading.value = true;
  foundUsers.value = await fetchUserFromSearch(searchField.value);
  loading.value = false;
}
const isHistoryDialogOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const zoomLeftDrawer = () => {
  zoomDrawer.value = !zoomDrawer.value;
};

const showAddAppointmentDialog = ref(false);
const selectedUser = ref(null);

function addAppointment(user) {
  selectedUser.value = user;
  showAddAppointmentDialog.value = true;
}

function viewHistory(user) {
  selectedUser.value = user;
  isHistoryDialogOpen.value = true;
}

// Get user initials for avatar display
function getUserInitials() {
  if (!currentUser.value) return "?";

  const name = currentUser.value.name;
  if (!name) return "?";

  // If name has spaces, get first letter of first and last name
  const nameParts = name.trim().split(" ");
  if (nameParts.length > 1) {
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  }

  // Otherwise just get first letter
  return name.charAt(0).toUpperCase();
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      elevated
      class="bg-white absolute-top q-mx-lg-md q-mt-md"
      style="right: 8px; border-radius: 4px"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
          color="grey"
        />
        <q-input
          borderless
          :dense="$q.screen.lt.sm"
          debounce="300"
          clearable
          v-model="searchField"
          :placeholder="
            $q.screen.gt.sm && isAdminOrDesk
              ? 'Search customer by  phone, name or email.'
              : 'Search'
          "
          style="width: 100%; padding-left: 20px"
          @update:model-value="onSearch"
        >
          <template v-slot:before>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-menu
          v-if="
            isAdminOrDesk &&
            searchField !== '' &&
            !loading &&
            foundUsers.length > 0
          "
        >
          <q-list>
            <q-item v-for="user in foundUsers" :key="user.id">
              <q-item-section>
                <q-item-label>{{ user.name }}</q-item-label>
                <q-item-label caption>{{ user.phone }}</q-item-label>
                <q-item-label caption>{{ user.email }}</q-item-label>
                <q-item-label caption>
                  <q-btn
                    flat
                    size="sm"
                    color="primary"
                    label="view history"
                    @click="viewHistory(user)"
                  />
                  <q-btn
                    flat
                    size="sm"
                    color="primary"
                    label="Add Appointment "
                    @click="addAppointment(user)"
                  />
                  <!-- <q-btn
                    flat
                    size="sm"
                    color="primary"
                    label="View Profile"
                    @click="viewProfile(user)"
                  /> -->
                </q-item-label>
              </q-item-section>
              <!-- <q-item-section side>
                <q-btn
                  flat
                  size="sm"
                  color="primary"
                  label="view history"
                  @click="viewHistory(user)"
                />
              </q-item-section> -->
            </q-item>
          </q-list>
        </q-menu>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="grey-8"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="
              () => {
                zoomDrawer = true;
                $q.fullscreen.toggle();
              }
            "
            v-if="$q.screen.gt.sm"
          >
          </q-btn>
          <q-btn
            v-if="false"
            round
            dense
            flat
            color="grey-8"
            icon="notifications"
          >
            <q-badge color="red" text-color="white" floating> 5 </q-badge>
            <q-menu>
              <q-list style="min-width: 100px">
                <messages></messages>
                <q-card class="text-center no-shadow no-border">
                  <q-btn
                    label="View All"
                    style="max-width: 120px !important"
                    flat
                    dense
                    class="text-indigo-8"
                  ></q-btn>
                </q-card>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn round dense flat>
            <q-avatar size="26px" color="primary" text-color="white">
              {{ getUserInitials() }}
              <q-tooltip>
                {{ currentUser?.name || "Unknown User" }} ({{
                  userRole || "No Role"
                }})
              </q-tooltip>
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 200px">
                <profile></profile>
                <q-card class="text-center no-shadow no-border"> </q-card>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="zoomDrawer ? 70 : 250"
      bordered
      class="bg-white text-grey-8 items-center"
    >
      <q-scroll-area
        q-scroll-area
        style="
          height: calc(100% - 80px);
          padding: 10px;
          margin-top: 80px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <!-- Dashboard - Only for Admin and Desk -->
          <q-item
            v-if="isAdminOrDesk"
            to="/admin/dashboard"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Appointment - Only for Admin and Desk -->
          <q-item
            v-if="isAdminOrDesk"
            to="/admin/appointment"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="bookmark" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Appointment</q-item-label>
            </q-item-section>
          </q-item>

          <!-- History - Only for Admin and Desk -->
          <q-item
            v-if="isAdminOrDesk"
            to="/admin/history"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="schedule" />
            </q-item-section>
            <q-item-section>
              <q-item-label>History</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Schedule - Visible for all roles -->
          <q-item
            to="/admin/schedule"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="calendar_month" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Schedule</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Staff - Only for Admin and Desk -->
          <q-item
            v-if="isAdminOrDesk"
            to="/admin/staff"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="storefront" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Staff</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Customer - Only for Admin and Desk -->
          <q-expansion-item
            v-if="isAdminOrDesk"
            icon="supervisor_account"
            label="Customer"
          >
            <q-list class="q-pl-lg">
              <q-item
                to="/admin/user"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>User</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                to="/admin/profile"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="description" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Profile</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Services - Only for Admin and Desk -->
          <q-expansion-item v-if="isAdminOrDesk" icon="pages" label="Services">
            <q-list class="q-pl-lg">
              <q-item
                to="/admin/package"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="view_list" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Package</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                to="/admin/service"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="category" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Service</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Invoice - Only for Admin and Desk -->
          <q-item
            v-if="isAdminOrDesk"
            to="/admin/order"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="payments" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Invoice</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Voucher - Only for Admin and Desk -->
          <q-item
            v-if="isAdminOrDesk"
            to="/admin/voucher"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="redeem" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Voucher</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Setting - Only for Admin and Desk -->
          <q-item
            v-if="isAdminOrDesk"
            to="/admin/setting"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Setting</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="absolute-top" style="height: 80px; padding-left: 10px">
        <div class="absolute-bottom bg-transparent">
          <q-toolbar class="bg-white text-grey-8">
            <q-avatar
              size="40px"
              class="q-mr-md"
              style="background-color: #f5f5f5"
              @click="zoomLeftDrawer"
            >
              <img
                src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
                alt="Quasar Logo"
              />
            </q-avatar>
            <q-toolbar-title
              class="text-weight-medium"
              style="font-size: 1.4rem; letter-spacing: -0.5px"
            >
              {{ APP_TITLE }}
            </q-toolbar-title>
          </q-toolbar>
        </div>
      </div>

      <div
        class="q-mini-drawer-hide absolute"
        style="top: 30px; right: -17px"
        v-if="!zoomDrawer"
      >
        <q-btn
          round
          flat
          dense
          icon="chevron_left"
          aria-label="Close"
          @click="zoomLeftDrawer"
          style="
            background-color: rgb(105, 108, 255);
            color: white;
            border: 6px solid rgb(242, 242, 247);
          "
        ></q-btn>
      </div>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <q-page class="q-pa-lg q-mt-sm">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>

  <AddAppointmentDialog
    v-if="showAddAppointmentDialog"
    :selectedStaff="{ id: 0, name: 'Any therapist' }"
    :selectedDate="new Date().toISOString().split('T')[0]"
    :selectedTime="''"
    :staffOptions="[]"
    :serviceOptions="[]"
    :selectedUser="selectedUser"
    @close="showAddAppointmentDialog = false"
    @save="showAddAppointmentDialog = false"
  />

  <q-dialog v-model="isHistoryDialogOpen">
    <q-card style="min-width: 350px; min-height: 300px">
      <q-card-section class="text-h6"> Customer History </q-card-section>
      <q-card-section>
        <CustomerHistoryTimeline
          :user_Id="selectedUser ? selectedUser.id : 0"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" @click="isHistoryDialogOpen = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
