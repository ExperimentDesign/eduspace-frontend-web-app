<template>
  <div class="dashboard-layout">
    <div class="teacher-info">
      <div class="teacher-avatar">
        <pv-avatar
            :label="initials || 'NA'"
            size="xlarge"
            style="background-color: #2196F3; color: white; font-size: 30px;"
        ></pv-avatar>
      </div>
      <div class="teacher-details">
        <p><strong>Name:</strong> {{ teacher?.firstName || "Not available" }}</p>
        <p><strong>Last Name:</strong> {{ teacher?.lastName || "Not available" }}</p>
        <p><strong>Cell Phone:</strong> {{ teacher?.phone || "Not available" }}</p>
        <p><strong>Status:</strong> Teacher</p>
        <p><strong>Email:</strong> {{ teacher?.email || "Not available" }}</p>
      </div>
    </div>

    <pv-card class="classrooms-card scrollable-card">
      <template #header>
        <div class="card-header-content">
          <i class="pi pi-building header-icon"></i>
          <h3 class="card-title">My Classrooms</h3>
        </div>
      </template>
      <template #content>
        <div v-if="classroomReservations.length" class="cards-grid">
          <div
              v-for="(classroom, index) in classroomReservations"
              :key="`classroom-${index}`"
              class="classroom-item-card"
          >
            <div class="item-header">
              <i class="pi pi-building"></i>
              <h4>{{ classroom.name || "Unknown" }}</h4>
            </div>
            <p class="item-description">{{ classroom.description || "No description available" }}</p>
          </div>
        </div>
        <div v-else class="empty-state">
          <i class="pi pi-building empty-icon"></i>
          <p>No classrooms assigned yet.</p>
        </div>
      </template>
    </pv-card>

    <pv-card class="reservations-card scrollable-card">
      <template #header>
        <div class="card-header-content">
          <i class="pi pi-calendar-plus header-icon"></i>
          <h3 class="card-title">My Reservations</h3>
        </div>
      </template>
      <template #content>
        <div v-if="sharedAreaReservations.length" class="reservations-list">
          <div
              v-for="(reservation, index) in sharedAreaReservations"
              :key="`reservation-${reservation.id || index}`"
              class="reservation-item"
          >
            <div class="reservation-row">
              <span class="reservation-label">Title:</span>
              <span class="reservation-value">{{ reservation.title || 'Reservation' }}</span>
            </div>
            <div class="reservation-row">
              <span class="reservation-label">Area:</span>
              <span class="reservation-value">{{ reservation.areaName || 'Unknown area' }}</span>
            </div>
            <div class="reservation-row">
              <span class="reservation-label">Start:</span>
              <span class="reservation-value">{{ formatDateTime(reservation.start) }}</span>
            </div>
            <div class="reservation-row">
              <span class="reservation-label">End:</span>
              <span class="reservation-value">{{ formatDateTime(reservation.end) }}</span>
            </div>
            <hr v-if="index < sharedAreaReservations.length - 1" class="reservation-divider" />
          </div>
        </div>
        <div v-else class="empty-state">
          <i class="pi pi-calendar-plus empty-icon"></i>
          <p>No active reservations.</p>
        </div>
      </template>
    </pv-card>

    <pv-card class="meetings-card scrollable-card">
      <template #header>
        <div class="card-header-content">
          <i class="pi pi-users header-icon"></i>
          <h3 class="card-title">My Meetings</h3>
        </div>
      </template>
      <template #content>
        <div v-if="meetings.length">
          <div class="cards-grid">
            <div
                v-for="(meeting, index) in meetings"
                :key="`meeting-${index}`"
                class="meeting-item-card"
            >
              <div class="item-header">
                <i class="pi pi-calendar"></i>
                <h4>{{ meeting.title || "No title" }}</h4>
              </div>
              <div class="meeting-info">
                <div class="info-row">
                  <i class="pi pi-building"></i>
                  <span>{{ formatClassroom(meeting.classroom) }}</span>
                </div>
                <div class="info-row">
                  <i class="pi pi-calendar"></i>
                  <span>{{ formatDate(meeting.date || meeting.day) }}</span>
                </div>
                <div class="info-row">
                  <i class="pi pi-clock"></i>
                  <span>{{ meeting.start || "N/A" }} - {{ meeting.end || "N/A" }}</span>
                </div>
              </div>
              <p v-if="meeting.description" class="item-description">{{ meeting.description }}</p>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <i class="pi pi-users empty-icon"></i>
          <p>No meetings scheduled.</p>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import http from "../../shared/services/http-common.js";
import { ReservationService } from "../../reservation-management/services/reservation.service.js";
import { MeetService } from "../../meeting-management/services/meet.service.js";
import {ClassroomService} from "../../shared/services/classroom.service.js";

export default {
  name: "TeacherDashboard",
  data() {
    return {
      teacher: null,
      classroomReservations: [],
      sharedAreaReservations: [],
      meetings: [],
      reservationService: new ReservationService(),
      meetService: new MeetService(),
      classroomService: new ClassroomService(),
    };
  },
  computed: {
    ...mapGetters("user", ["userId"]),
    fullName() {
      return `${this.teacher?.firstName || ""} ${this.teacher?.lastName || ""}`.trim();
    },
    initials() {
      const [firstName, lastName] = [
        this.teacher?.firstName || "",
        this.teacher?.lastName || "",
      ];
      return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
    },
  },
  methods: {
    formatDateTime(dateString) {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
      }
    },
    formatDate(dateValue) {
      if (!dateValue) return 'N/A';

      try {
        let date;
        if (typeof dateValue === 'string') {
          date = new Date(dateValue + 'T00:00:00');
        } else if (dateValue instanceof Date) {
          date = dateValue;
        } else {
          return 'N/A';
        }

        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'N/A';
      }
    },
    formatClassroom(classroom) {
      if (!classroom) return 'N/A';
      if (typeof classroom === 'string') return classroom;
      return classroom.name || classroom.room || 'N/A';
    }
  },
  async mounted() {
    if (!this.userId) {
      console.error("Teacher ID not found.");
      return;
    }
    try {
      const teacherResponse = await http.get(`/teachers-profiles/${this.userId}`);
      this.teacher = teacherResponse.data;

      const classroomResponse = await http.get(`/classrooms/teachers/${this.userId}`);
      this.classroomReservations = classroomResponse.data;

      const [areasResponse, reservationsResponse] = await Promise.all([
        http.get("/shared-area"),
        this.reservationService.getAll()
      ]);
      const allAreas = areasResponse.data;
      const allReservations = reservationsResponse.data;

      const myReservations = allReservations.filter(
          (reservation) => reservation.teacherId === this.userId
      );

      this.sharedAreaReservations = myReservations.map(reservation => {
        const area = allAreas.find(a => a.id === reservation.areaId);
        return {
          ...reservation,
          areaName: area ? area.name : 'Unknown area',
          areaDescription: area ? area.description : ''
        };
      });

      const meetResponse = await http.get(`/teachers/${this.userId}/meetings`);
      this.meetings = meetResponse.data.map(meeting => ({
        ...meeting,
        // Ensure date/day is properly set
        date: meeting.date || meeting.day,
        day: meeting.day || meeting.date
      }));

      console.log("Teacher Dashboard loaded successfully");

    } catch (error) {
      console.error("Error loading teacher dashboard data:", error);
    }
  },
};
</script>

<style scoped>
.dashboard-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}

.teacher-info {
  grid-column: span 3;
  background: linear-gradient(135deg, rgba(255, 210, 0, 0.4) 0%, rgba(255, 223, 77, 0.3) 100%);
  padding: 25px;
  border-radius: 20px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.teacher-avatar {
  grid-column: 1 / 2;
}

.teacher-details {
  grid-column: 2 / 3;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.teacher-details p {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.scrollable-card {
  height: 450px;
  overflow-y: auto;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  will-change: transform;
  position: relative;
}

.scrollable-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.classrooms-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.reservations-card {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

.meetings-card {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
}

.card-header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  position: relative;
  z-index: 1;
  background: inherit;
}

.header-icon {
  font-size: 24px;
  color: #2196F3;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.classrooms-card .header-icon {
  color: #1976D2 !important;
}

.reservations-card .header-icon {
  color: #388E3C !important;
}

.meetings-card .header-icon {
  color: #7B1FA2 !important;
}

.card-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  position: relative;
  z-index: 2;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px;
}

/* Classroom Item Card */
.classroom-item-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.classroom-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.12);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.item-header i {
  color: #1976D2;
  font-size: 20px;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
  flex-shrink: 0;
}

.item-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #0d47a1;
}

.item-description {
  font-size: 13px;
  color: #555;
  margin: 0;
  line-height: 1.4;
}

/* Meeting Item Card */
.meeting-item-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.meeting-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.12);
}

.meeting-item-card .item-header i {
  color: #7B1FA2 !important;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
  flex-shrink: 0;
}

.meeting-item-card .item-header h4 {
  color: #4a148c;
}

.meeting-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 12px 0;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #333;
}

.info-row i {
  color: #7B1FA2 !important;
  font-size: 14px;
  min-width: 16px;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
  flex-shrink: 0;
}

/* Reservations List */
.reservations-list {
  list-style: none;
  padding: 16px;
  margin: 0;
}

.reservation-item {
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
}

.reservation-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.reservation-label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.reservation-value {
  color: #333;
  font-size: 14px;
  text-align: right;
}

.reservation-divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 12px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  color: #bbb;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

.scrollable-card::-webkit-scrollbar {
  width: 8px;
}

.scrollable-card::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.scrollable-card::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.scrollable-card::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

@media (max-width: 1200px) {
  .dashboard-layout {
    grid-template-columns: repeat(2, 1fr);
  }

  .teacher-info {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }

  .teacher-info {
    grid-column: span 1;
    grid-template-columns: 1fr;
    text-align: center;
  }

  .teacher-details {
    grid-template-columns: 1fr;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
