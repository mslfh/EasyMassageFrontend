<template>
  <div class="q-pa-md q-pt-lg">
    <!-- first row -->
    <div class="row q-col-gutter-lg">
      <!-- Income Earned -->
      <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <q-card class="fit bg-white q-pa-lg shadow-1">
          <div class="row q-mb-md">
            <div
              class="bg-orange-1 flex flex-center q-mr-md"
              style="width: 40px; height: 40px; border-radius: 50%"
            >
              <q-icon name="o_analytics" color="green-5" size="25px" />
            </div>

            <div class="col-7">
              <div class="text-h5 text-weight-bold text-grey-8">87.50</div>
              <div class="text-subtitle2 text-grey-5 q-mb-md">
                Income Earned
              </div>
            </div>

            <div class="col-auto text-subtitle2 text-grey-4">
              <q-icon name="circle" size="15px" class="text-green-2" />
              Today
            </div>
          </div>

          <div class="text-h5 text-weight-bold text-grey-7">16</div>
          <div class="text-subtitle2 text-grey-5 q-mb-md">
            Appointment Booked
          </div>
          <div style="height: 160px">
            <!-- Appointments line chart in this week -->
            <ApexCharts
              type="line"
              :options="AppointmentWeekChartOptions"
              :series="AppointmentWeekSeries"
            />
          </div>
        </q-card>
      </div>

      <!-- Sales Summary -->
      <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <q-card class="fit bg-white q-pa-lg shadow-1">
          <div class="row items-center q-mb-xs">
            <div class="text-h6 text-grey-6">Sales Summary</div>
            <div class="text-orange-6 text-weight-bold q-ml-auto">+18.2%</div>
          </div>
          <div class="text-h4 text-weight-bold text-grey-4">$87.5k</div>
          <div class="row q-mt-md q-gutter-md">
            <div class="col flex column items-center">
              <div
                class="bg-cyan-1 flex flex-center"
                style="width: 40px; height: 40px; border-radius: 12px"
              >
                <q-icon name="shopping_bag" color="cyan-5" size="24px" />
              </div>
              <div class="text-caption text-grey-5 q-mt-xs">Cash</div>
              <div class="text-h6 text-weight-bold text-grey-6">62.2%</div>
              <div class="text-caption text-grey-4">6,440</div>
            </div>
            <div class="col flex column items-center">
              <div
                class="bg-deep-purple-1 flex flex-center"
                style="width: 40px; height: 40px; border-radius: 12px"
              >
                <q-icon name="link" color="deep-purple-4" size="24px" />
              </div>
              <div class="text-caption text-grey-5 q-mt-xs">Pos</div>
              <div class="text-h6 text-weight-bold text-grey-6">25.5%</div>
              <div class="text-caption text-grey-4">12,749</div>
            </div>
          </div>
          <q-linear-progress
            value="0.62"
            color="deep-purple-4"
            class="q-mt-md"
            style="height: 6px; border-radius: 4px"
            track-color="grey-3"
          />
        </q-card>
      </div>

      <!-- Statistics Card -->
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card class="fit bg-white q-pa-lg shadow-1">
          <div class="row items-center q-mb-md">
            <div class="col text-h6 text-grey-6">Statistics</div>
            <div class="col-auto text-subtitle2 text-grey-5">
              Updated 1 month ago
            </div>
          </div>
          <div class="row q-col-gutter-xl q-mt-md q-mb-md flex justify-between">
            <div class="col-auto flex column items-center">
              <div
                class="bg-indigo-1 flex flex-center"
                style="width: 64px; height: 64px; border-radius: 50%"
              >
                <q-icon name="pie_chart" color="indigo-3" size="32px" />
              </div>
              <div class="text-h5 text-weight-bold text-grey-4 q-mt-sm">
                245k
              </div>
              <div class="text-subtitle2 text-grey-6">Total Appointments</div>
            </div>
            <div class="col-auto flex column items-center">
              <div
                class="bg-cyan-1 flex flex-center"
                style="width: 64px; height: 64px; border-radius: 50%"
              >
                <q-icon name="groups" color="cyan-5" size="32px" />
              </div>
              <div class="text-h5 text-weight-bold text-grey-4 q-mt-sm">
                9.127k
              </div>
              <div class="text-subtitle2 text-grey-6">Revenue</div>
            </div>
            <div class="col-auto flex column items-center">
              <div
                class="bg-pink-1 flex flex-center"
                style="width: 64px; height: 64px; border-radius: 50%"
              >
                <q-icon name="shopping_cart" color="pink-4" size="32px" />
              </div>
              <div class="text-h5 text-weight-bold text-grey-4 q-mt-sm">
                1.869k
              </div>
              <div class="text-subtitle2 text-grey-6">Vourcher</div>
            </div>
            <div class="col-auto flex column items-center">
              <div
                class="bg-green-1 flex flex-center"
                style="width: 64px; height: 64px; border-radius: 50%"
              >
                <q-icon name="attach_money" color="green-5" size="32px" />
              </div>
              <div class="text-h5 text-weight-bold text-grey-4 q-mt-sm">
                $10,126
              </div>
              <div class="text-subtitle2 text-grey-6">Total Revenue</div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Tracker -->
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card class="fit bg-white q-pa-lg shadow-1">
          <div class="row items-center">
            <!-- Left: Ticket Stats -->
            <div class="col-6">
              <div class="text-h6 text-grey-6">Appointment Tracker</div>
              <div class="text-subtitle2 text-grey-5 q-mb-lg">Last 17 Days</div>
              <div class="text-h2 text-weight-bold text-grey-7">164</div>
              <div class="text-subtitle2 text-grey-5 q-mb-lg">
                Aggregate Tickets
              </div>
              <div class="q-mb-md flex items-center">
                <div
                  class="bg-deep-purple-1 flex flex-center"
                  style="width: 40px; height: 40px; border-radius: 12px"
                >
                  <q-icon
                    name="confirmation_number"
                    color="deep-purple-4"
                    size="24px"
                  />
                </div>
                <div class="q-ml-md">
                  <div class="text-body1 text-grey-6">Finished</div>
                  <div class="text-caption text-grey-5">142 New Tickets</div>
                </div>
              </div>
              <div class="q-mb-md flex items-center">
                <div
                  class="bg-orange-1 flex flex-center"
                  style="width: 40px; height: 40px; border-radius: 12px"
                >
                  <q-icon name="check_circle" color="cyan-5" size="24px" />
                </div>
                <div class="q-ml-md">
                  <div class="text-body1 text-grey-6">Pending</div>
                  <div class="text-caption text-grey-5">28 Open Tickets</div>
                </div>
              </div>
              <div class="flex items-center">
                <div
                  class="bg-red-1 flex flex-center"
                  style="width: 40px; height: 40px; border-radius: 12px"
                >
                  <q-icon name="schedule" color="red-5" size="24px" />
                </div>
                <div class="q-ml-md">
                  <div class="text-body1 text-grey-6">No Show</div>
                  <div class="text-caption text-grey-5">
                    1 Day Response Time
                  </div>
                </div>
              </div>
            </div>


            <div class="col-6 flex flex-center">
              <div >
                <!-- Right: Appointment Tracker Chart -->
                <ApexCharts type="radialBar"
                :options="AppointmentTrackerchartOptions"
                :series="AppointmentTrackerSeries"
                 />
              </div>
            </div>
          </div>
        </q-card>
      </div>
      <!-- Summary of Weekly Earnings -->
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card class="q-pa-md shadow-1">
          <div class="row items-center q-mb-md">
            <div class="col">
              <div class="text-h6 text-grey-6">Summary of Staff Earnings</div>
              <div class="text-subtitle2 text-grey-5">Income Statements</div>
            </div>
            <q-btn flat round icon="more_vert" class="q-ml-auto" />
          </div>
          <div class="row items-center q-mb-md">
            <div class="col-auto">
              <div class="text-h2 text-weight-bold">$468</div>
            </div>
            <div class="col-auto flex items-center">
              <q-badge color="orange-2" text-color="orange-8" class="q-ml-sm"
                >+4.2%</q-badge
              >
            </div>
          </div>
          <div class="text-grey-5 q-mb-md">
            Provide a comparison of this week to the previous week
          </div>
          <div class="q-mb-lg">
            <!-- Staff Earnings Column Charts -->
            <ApexCharts
              type="bar"
              :options="StaffEarningsBarOptions"
              :series="StaffEarningsBarSeries"
              height="180"
            />
          </div>
          <q-separator />
          <div class="row q-mt-md q-gutter-md">
            <div
              class="col bg-grey-1 q-pa-md rounded-borders flex column items-center"
            >
              <q-icon
                name="attach_money"
                color="deep-purple-4"
                size="md"
                class="q-mb-xs"
              />
              <div class="text-caption text-grey-6">Income</div>
              <div class="text-h6 text-weight-bold">$3345.69</div>
              <q-linear-progress
                value="0.9"
                color="deep-purple-4"
                class="q-mt-sm"
                style="height: 4px; width: 100%"
              />
            </div>
            <div
              class="col bg-grey-1 q-pa-md rounded-borders flex column items-center"
            >
              <q-icon
                name="schedule"
                color="cyan-5"
                size="md"
                class="q-mb-xs"
              />
              <div class="text-caption text-grey-6">Financial gain</div>
              <div class="text-h6 text-weight-bold">$236.34</div>
              <q-linear-progress
                value="0.6"
                color="cyan-5"
                class="q-mt-sm"
                style="height: 4px; width: 100%"
              />
            </div>
            <div
              class="col bg-grey-1 q-pa-md rounded-borders flex column items-center"
            >
              <q-icon name="payment" color="red-4" size="md" class="q-mb-xs" />
              <div class="text-caption text-grey-6">Spending</div>
              <div class="text-h6 text-weight-bold">$74.19</div>
              <q-linear-progress
                value="0.4"
                color="red-4"
                class="q-mt-sm"
                style="height: 4px; width: 100%"
              />
            </div>
          </div>
        </q-card>
      </div>

      <!-- Sales by Staff Card -->
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card
          class="col bg-white q-pa-lg shadow-1 card-min"
          style="border-radius: 20px"
        >
          <div class="row items-center q-mb-md">
            <div class="text-h6 text-grey-6">Sales by Staff</div>
            <q-btn flat round icon="more_vert" class="q-ml-auto" />
          </div>
          <div class="text-subtitle2 text-grey-5 q-mb-md">
            Monthly Sales Overview
          </div>
          <div
            v-for="country in countries"
            :key="country.name"
            class="row items-center q-mb-sm"
          >
            <img
              :src="country.flag"
              alt="flag"
              style="
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
              "
            />
            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold text-grey-4">
                ${{ country.amount }}
              </div>
              <div class="text-caption text-grey-5">{{ country.name }}</div>
            </div>
            <div class="q-ml-auto flex items-center">
              <q-icon
                :name="country.trend > 0 ? 'north' : 'south'"
                :color="country.trend > 0 ? 'green-5' : 'red-5'"
                size="16px"
              />
              <span
                :class="country.trend > 0 ? 'text-green-5' : 'text-red-5'"
                class="q-ml-xs"
                >{{ Math.abs(country.trend) }}%</span
              >
            </div>
          </div>
        </q-card>
      </div>
      <!-- Monthly Appointment Performance Card -->
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card
          class="col bg-white q-pa-lg shadow-1 card-min"
          style="border-radius: 20px"
        >
          <div class="row items-center q-mb-md">
            <div class="text-h6 text-grey-6">
              Monthly Appointment Performance
            </div>
            <q-btn flat round icon="more_vert" class="q-ml-auto" />
          </div>
          <div class="text-subtitle2 text-grey-5 q-mb-md">
            4,210 Social Visitor
          </div>
          <div
            v-for="item in marketing"
            :key="item.label"
            class="row items-center q-mb-sm"
          >
            <div
              :class="item.bg"
              class="flex flex-center"
              style="width: 40px; height: 40px; border-radius: 12px"
            >
              <q-icon :name="item.icon" :color="item.color" size="24px" />
            </div>
            <div class="q-ml-md text-grey-4" style="min-width: 120px">
              {{ item.label }}
            </div>
            <div class="q-ml-auto text-h6 text-weight-bold text-grey-6">
              {{ item.value }}
            </div>
            <div class="q-ml-md" :class="item.trend > 0 ? 'text-green-5' : ''">
              {{
                item.trend
                  ? (item.trend > 0 ? "+" : "") + item.trend + "%"
                  : item.percent + "%"
              }}
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ApexCharts from "vue3-apexcharts";

const AppointmentWeekChartOptions = {
  chart: {
    type: "line",
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr"],
  },
};
const AppointmentWeekSeries = [
  {
    name: "Sales",
    data: [10, 41, 35, 51],
  },
];


const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const barData = [4, 7, 5, 4, 10, 6, 7]; // Example data, Friday is highest

function barStyle(idx, val) {
  const max = 10;
  const height = `${(val / max) * 100}%`;
  const color = idx === 4 ? "#5B4FE9" : "#E6E4FB";
  return {
    width: "32px",
    height,
    background: color,
    borderRadius: "8px",
    transition: "height 0.3s",
  };
}

const countries = [
  {
    name: "United States",
    amount: "2.45",
    trend: 5.8,
    flag: "https://flagcdn.com/us.svg",
  },
  {
    name: "Brazil",
    amount: "4.78",
    trend: -6.2,
    flag: "https://flagcdn.com/br.svg",
  },
  {
    name: "India",
    amount: "1.48",
    trend: 22.3,
    flag: "https://flagcdn.com/in.svg",
  },
  {
    name: "Australia",
    amount: "2.12",
    trend: -31.9,
    flag: "https://flagcdn.com/au.svg",
  },
  {
    name: "France",
    amount: "2.45",
    trend: 6.2,
    flag: "https://flagcdn.com/fr.svg",
  },
  {
    name: "China",
    amount: "1.90",
    trend: 4.8,
    flag: "https://flagcdn.com/cn.svg",
  },
];
const marketing = [
  {
    label: "Email Messages",
    value: "12,346",
    percent: 0.3,
    icon: "mail",
    color: "green-5",
    bg: "bg-green-1",
  },
  {
    label: "Emails Opened",
    value: "8,734",
    percent: 2.1,
    icon: "link",
    color: "cyan-5",
    bg: "bg-cyan-1",
  },
  {
    label: "Links Clicked",
    value: "967",
    percent: 1.4,
    icon: "campaign",
    color: "red-5",
    bg: "bg-red-1",
  },
  {
    label: "Subscribers",
    value: "345",
    trend: 8.5,
    icon: "person",
    color: "cyan-7",
    bg: "bg-cyan-1",
  },
  {
    label: "Complaints",
    value: "10",
    percent: 1.5,
    icon: "report_problem",
    color: "red-5",
    bg: "bg-red-1",
  },
  {
    label: "Unsubscribers",
    value: "86",
    percent: 0.8,
    icon: "block",
    color: "orange-5",
    bg: "bg-orange-1",
  },
];

const AppointmentTrackerchartOptions = {
  chart: {
    height: 220,
    type: 'radialBar',
    offsetY: 0,
    background: 'transparent',
    sparkline: { enabled: false },
    dropShadow: { enabled: false }
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        margin: 0,
        size: '70%',
        background: 'transparent',
        image: undefined,
      },
      track: {
        background: 'transparent',
        strokeWidth: '100%',
        margin: 0,
        dashArray: 0,
      },
      dataLabels: {
        name: {
          offsetY: -20,
          show: true,
          color: '#bdbacb',
          fontSize: '18px',
          fontWeight: 500,
        },
        value: {
          offsetY: 20,
          color: '#6C5DD3',
          fontSize: '48px',
          fontWeight: 700,
          show: true,
          formatter: function (val) {
            return val + "%";
          }
        }
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      gradientToColors: ['#7367f0'],
      stops: [0, 100],
      shadeIntensity: 1,
      opacityFrom: 1,
      opacityTo: 1,
    },
    colors: ['#cdc9fa'],
  },
  stroke: {
    lineCap: 'butt',
    dashArray: 6,
  },
  labels: ['Completed Issues'],
};
const AppointmentTrackerSeries = [65]; // or use a ref for dynamic value

const StaffEarningsBarOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false },
    height: 180,
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '40%',
      distributed: true,
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: days,
    labels: { style: { colors: '#bdbacb', fontSize: '14px' } },
  },
  yaxis: { show: false },
  grid: { show: false },
  tooltip: { enabled: false },
  colors: days.map((_, idx) => idx === 4 ? '#5B4FE9' : '#E6E4FB'),
};
const StaffEarningsBarSeries = [{ data: barData }];
</script>

<style scoped>
.q-card {
  border-radius: 16px;
}
</style>
