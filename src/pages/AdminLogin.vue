<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="../assets/Omneas.png" alt="Logo" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Log in
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit="handleLogin">
              <q-input
                filled
                v-model="userLogin"
                label="Phone or Email"
                lazy-rules
              />
              <q-input
                type="password"
                filled
                v-model="password"
                label="Password"
                lazy-rules
              />
              <div>
                <q-btn label="Login" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <!-- Floating Footer -->
        <div class="absolute-bottom text-white text-center q-pa-xs" style="width: 100%;">
          <div style="font-size: 10px; opacity: 0.8;">
            © {{ new Date().getFullYear() }}
            <span
              class="cursor-pointer"
              style="font-weight: 500; text-decoration: underline;"
              @click="goToOmneasWebsite"
            >
              OMNEAS
            </span>
            . All rights reserved.
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>

</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const userLogin = ref("");
const password = ref("");
const router = useRouter();
const { VITE_API_URL } = import.meta.env;

const handleLogin = async () => {
  try {
    const response = await axios.post(`${VITE_API_URL}/api/login`, {
      userLogin: userLogin.value,
      password: password.value,
    });
    const { token, user } = response.data;

    localStorage.setItem("authToken", token); // Store token in localStorage
    localStorage.setItem("user", JSON.stringify(user)); // Optionally store user info

    router.push("/admin/appointment"); // Redirect to admin dashboard
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Navigate to Omneas website
const goToOmneasWebsite = () => {
  return;
  // TODO: Replace with actual Omneas website URL
  window.open('https://omneas.com', '_blank');
};
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
