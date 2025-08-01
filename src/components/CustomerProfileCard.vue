<template>
  <q-card class="q-pa-lg q-mx-auto" style="max-width: 700px">
    <q-toolbar-title class="text-weight-bold text-blue-4">
      <q-icon name="privacy_tip" size="md" />
      Confidential Client Information
    </q-toolbar-title>
    <q-separator class="q-my-md" />
    <q-form @submit.prevent="onSubmit">
      <div class="q-pa-xs q-gutter-md">
        <div class="row">
          <div class="col-6 q-pr-md">
            <q-input
              v-model="form.first_name"
              label="* First Name"
              outlined
              dense
            />
          </div>
          <div class="col-6">
            <q-input
              v-model="form.last_name"
              label="* Last Name"
              outlined
              dense
            />
          </div>
        </div>
        <div class="row text-grey-8">
          <div class="col-6 q-pr-md">
            <q-input
              v-model="form.date_of_birth"
              label="Date of Birth"
              outlined
              dense
            >
              <template #append>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                  @click="showDatePicker = true"
                />
              </template>
            </q-input>
            <q-popup-proxy
              v-model="showDatePicker"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="form.date_of_birth"
                mask="DD/MM/YYYY"
                @update:model-value="showDatePicker = false"
              />
            </q-popup-proxy>
          </div>
          <div class="col-6">
            <q-radio v-model="form.gender" val="male" label="Male" />
            <q-radio v-model="form.gender" val="female" label="Female" />
          </div>
        </div>
        <q-input v-model="form.phone" label="* Phone" outlined dense />
        <q-input v-model="form.address" label="Address" outlined dense />
        <div class="row">
          <div class="col-6 q-pr-md">
            <q-input
              v-model="form.emergency_contact_name"
              label="Emergency Contact Name"
              outlined
              dense
            />
          </div>
          <div class="col-6">
            <q-input
              v-model="form.emergency_contact_phone"
              label="Emergency Contact Phone"
              outlined
              dense
            />
          </div>
        </div>
        <q-input
          v-model="form.private_health_fund_provider"
          label="Private health fund provider (if you have one)"
          outlined
          dense
        />
        <q-input
          v-model="form.visit_reason"
          label="Reason for visit"
          outlined
          dense
          type="textarea"
        />
        <div class="row">
          <div class="col-sm-7 col-xs-12 q-pl-sm-md">
            <PainPointMarker
              :painPoints="painPoints"
              @update:painPoints="
                (val) => (console.log('update', val), (painPoints.value = val))
              "
            />
          </div>
          <div class="col-sm-5 col-xs-12">
            <q-input
              v-model="form.areas_of_soreness"
              label="Areas of Soreness"
              dense
              type="textarea"
              :autogrow="false"
              :input-style="
                $q.screen.gt.xs ? 'min-height: 310px;' : 'min-height: 120px;'
              "
            />
          </div>
        </div>
        <!-- medical_history -->
        <div class="row q-pt-md">
          <div class="col-12">
            <q-input
              v-model="form.medical_history"
              label="Medical History"
              outlined
              dense
              type="textarea"
            >
            </q-input>
          </div>
          <div class="col-12 q-pl-sm q-pb-md q-gutter-md row items-start">
            <q-file
              v-model="files"
              dense
              use-chips
              multiple
              counter
              max-files="5"
              :counter-label="counterLabelFn"
              style="min-width: 50%; max-width: 100%"
              accept=".jpg,.jpeg,.png,image/*"
              label-slot
            >
              <template v-slot:prepend>
                <q-icon size="xs" name="attach_file" />
              </template>
              <template v-slot:label>
                <span class="text-caption">Upload Files</span>
              </template>
            </q-file>
          </div>
        </div>
        <q-input
          v-model="form.others"
          label="Others (e.g. pregnant/period etc.)"
          outlined
          dense
          type="textarea"
        />
        <q-input
          v-model="form.notes"
          label="Notes"
          outlined
          dense
          type="textarea"
        />
        <div class="row justify-end">
          <q-btn label="Save" color="primary" type="submit" />
        </div>
      </div>
    </q-form>
    <!-- <UserSelectDialog ref="userSelectDialogRef" /> -->
  </q-card>
</template>

<script setup>
import { ref, defineProps } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import PainPointMarker from "components/PainPointMarker.vue";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const $q = useQuasar();

const props = defineProps({
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
});

const emit = defineEmits([
  "save",
]);

const form = ref({
  first_name: props.first_name || "",
  last_name: props.last_name || "",
  phone: props.phone || "",
  gender: "",
  date_of_birth: "",
  address: "",
  visit_reason: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  private_health_fund_provider: "",
  areas_of_soreness: "",
  medical_history: "",
  others: "",
  notes: "",
});

const painPoints = ref([]);
const showDatePicker = ref(false);
const files = ref(null);

const counterLabelFn = ({ totalSize, filesNumber, maxFiles }) => {
  return `${filesNumber} files of ${maxFiles} (max) | ${totalSize}`;
};


const onSubmit = async () => {
  try {
    const formData = new FormData();
    if(!form.value.first_name || !form.value.last_name || !form.value.phone) {
      $q.notify({ type: "negative", message: "Please fill in first name, last name and phone number." });
      return;
    }

    Object.entries(form.value).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    formData.append("pain_points", JSON.stringify(painPoints.value));
    if (files.value && Array.isArray(files.value)) {
      files.value.forEach((file) => {
        formData.append("files[]", file);
      });
    } else if (files.value) {
      formData.append("files[]", files.value);
    }

    const response = await axios.post(
      `${VITE_API_URL}/api/user-profile`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    $q.notify({ type: "positive", message: "Saved successfully" });
    emit('save',response.data.id);

  } catch (e) {
    $q.notify({ type: "negative", message: "Save failed" });
  }
};
</script>

<style scoped>
.q-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>
