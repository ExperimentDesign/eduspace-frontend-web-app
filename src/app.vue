<template>
  <pv-toast />
  <div class="app-container">
    <header v-if="userRole" class="sidenav-wrapper">
      <div :class="['sidenav', { 'admin-sidenav': userRole === 'RoleAdmin', 'teacher-sidenav': userRole === 'RoleTeacher' }]">
        <div class="user-info">
          <pv-avatar :image="avatarImage" class="mr-2" size="xlarge" shape="circle"></pv-avatar>
          <div class="info">
            <p class="info" :style="{ color: userRole === 'RoleAdmin' ? '#064C58' : '#584F06' }">
              {{ userRole === 'RoleAdmin' ? 'Administrator' : 'Teacher' }}
            </p>
            <p class="info">{{ currentUsername }}</p>
          </div>
        </div>

        <div class="drawer-content">
          <div v-for="item in items" :key="item.label" class="menu-item">
            <router-link
                v-if="item.to"
                :to="item.to"
                class="nav-link"
                active-class="router-link-active"
                exact-active-class="router-link-exact-active"
            >
              <pv-button
                  :class="[
                  'p-button-text',
                  { 'admin-hover-active': userRole === 'RoleAdmin', 'teacher-hover-active': userRole === 'RoleTeacher' },
                ]"
              >
                <img v-if="item.svg" :src="item.svg" alt="icon" style="width: 20px; height: 20px; margin-right: 8px;" />
                {{ item.label }}
              </pv-button>
            </router-link>
          </div>
        </div>

        <div class="footer-section">
          <div class="logout-container">
            <pv-button class="pv-button log-out logout-hover" @click="showLogoutConfirm($event)">
              <img src="./assets/Logo%20sidebar.png" alt="Logo" class="logout-icon" />
              <span>Log out</span>
            </pv-button>
          </div>
          <div class="copyright-text">Copyright EduSpace team</div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <pv-confirmpopup group="logout-group">
      <template #message="slotProps">
        <div class="flex flex-col items-center w-full gap-4 border-b border-surface-200 dark:border-surface-700 p-4 mb-4 pb-0">
          <i :class="slotProps.message.icon" class="text-6xl text-primary-500"></i>
          <p>{{ slotProps.message.message }}</p>
        </div>
      </template>
    </pv-confirmpopup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import HomeIcon from "/src/assets/admin/Home.svg";
import EnvironmentIcon from "/src/assets/admin/Environment.svg";
import PersonalDIcon from "/src/assets/admin/Personal_Data.svg";
import BreakdownIcon from "/src/assets/teacher/Breakdown_Reports.svg";
import NotificationIcon from "/src/assets/teacher/Notification.svg";
import SpaceIcon from "/src/assets/teacher/Space_Availability.svg";
import DefaultAvatar from "/src/assets/default-avatar.png";

export default {
  name: "app",
  data() {
    return {
      drawer: false,
      items: [],
      avatarImage: DefaultAvatar,
    };
  },
  computed: {
    ...mapGetters("user", ["isAuthenticated", "currentUsername", "userRole"]),
  },
  methods: {
    ...mapActions("user", ["signOut"]),
    async handleLogOut() {
      await this.signOut();
      this.$router.push({ name: "login" });
    },
    changeToolbar() {
      if (this.userRole === "RoleAdmin") {
        this.items = [
          { label: "Home", to: "/dashboard-admin/home-admin", svg: HomeIcon },
          { label: "Classrooms and Shared Spaces", to: "/dashboard-admin/classrooms-shared-spaces", svg: EnvironmentIcon },
          { label: "Personal Data", to: "/dashboard-admin/personal-data", svg: PersonalDIcon },
        ];
      } else if (this.userRole === "RoleTeacher") {
        this.items = [
          { label: "Home", to: "/dashboard-teacher/home-teacher", svg: HomeIcon },
          { label: "Reservations", to: "/dashboard-teacher/reservations", svg: NotificationIcon},
          { label: "Breakdown Reports", to: "/dashboard-teacher/breakdown-reports", svg: BreakdownIcon },
          { label: "Space Availability", to: "/dashboard-teacher/reservations/space-availability", svg: SpaceIcon },
        ];
      } else {
        this.items = [
          { label: "Home", to: "/home" },
          { label: "Login", to: "/login" },
        ];
      }
    },
    showLogoutConfirm(event) {
      this.$confirm.require({
        target: event.currentTarget,
        group: "logout-group",
        message: "Are you sure you want to log out?",
        icon: "pi pi-exclamation-circle",
        rejectProps: {
          icon: "pi pi-times",
          label: "Cancel",
          outlined: true,
        },
        acceptProps: {
          icon: "pi pi-check",
          label: "Confirm",
        },
        accept: () => {
          this.handleLogOut();
        },
        reject: () => {
          this.$toast.add({ severity: "info", summary: "Cancelled", detail: "Logout cancelled", life: 3000 });
        },
      });
    },
  },
  created() {
    if (!this.isAuthenticated) {
      this.$router.push({ name: "login" });
    } else {
      this.changeToolbar();
    }
  },
  watch: {
    userRole() {
      this.changeToolbar();
    },
  },
};
</script>

<style scoped>

.admin-sidenav {
  background: linear-gradient(160deg,
  rgba(255, 231, 120, 1) 0%,
  rgba(255, 255, 255, 1) 24%,
  rgba(246, 246, 246, 1) 34%,
  rgba(255, 255, 255, 1) 52%,
  rgba(255, 255, 255, 1) 71%,
  rgba(255, 255, 255, 1) 85%,
  rgba(147, 227, 241, 1) 100%);
}

.teacher-sidenav {
  background: linear-gradient(160deg,
  rgba(147, 227, 241, 1) 0%,
  rgba(255, 255, 255, 1) 24%,
  rgba(246, 246, 246, 1) 34%,
  rgba(255, 255, 255, 1) 52%,
  rgba(255, 255, 255, 1) 71%,
  rgba(255, 255, 255, 1) 85%,
  rgba(255, 231, 120, 1) 100%);
}

.user-info {
  padding: 15px 0;
  font-size: 1rem;
  color: #333;
  text-align: left;
  display: flex;
}

.user-info p {
  margin: 0;
  font-weight: 550;
}

.info{
  margin: auto 0;
}

.app-container {
  display: flex;
  height: 100vh;
}

.sidenav-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidenav {
  width: 350px;
  height: 100%;
  box-shadow: 2px 0 25px rgba(0, 0, 0, 0.13);
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.menu-item {
  margin-bottom: 10px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: auto;
  padding-top: 20px;
  width: 100%;
}

.logout-container {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-left: 0;
}

.log-out {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
  color: #000;
  font-weight: 300;
  text-align: left;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.logout-icon {
  width: 30px;
  height: 30px;
  margin-right: 8px;
}

.copyright-text {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #777;
  text-align: left;
  padding-left: 20px;
}

.p-button-text {
  color: #000 !important;
  text-align: left;
}

.pv-button {
  display: flex;
  color: #000;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  padding: 0.5rem 0.7rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.sidenav .pv-button:hover {
  border: none;
}

.main-content {
  flex: 1;
  height: 100vh;
  padding: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  .sidenav {
    width: 200px;
  }

  .main-content {
    margin-left: 0;
  }
}
</style>
