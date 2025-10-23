<script>
import WeeklyCalendar from "../components/weekly-calendar.component.vue";
import ReservationToolbar from "../components/reservation-toolbar.component.vue";
import CreateReservationDialog from "../components/create-reservation-dialog.vue";
import { ReservationService } from "../services/reservation.service.js";
import { SharedAreaService } from "../../classroom-space-resource-management/services/shared-area.service.js";
import { SharedSpace } from "../../classroom-space-resource-management/model/SharedSpace.entity.js";
import { Reservation } from "../model/reservation.entity.js";
import { mapGetters } from "vuex";

export default {
  name: "reservation-management",
  components: {
    ReservationToolbar,
    WeeklyCalendar,
    CreateReservationDialog
  },
  data() {
    return {
      areas: [],
      events: [],
      areaId: null,
      reservationService: null,
      sharedAreaService: null,
      loading: true,
      showDialog: false,
      selectedDateInfo: null
    }
  },
  computed: {
    ...mapGetters('user', ['userId', 'userRole']),
    selectedSpace() {
      return this.areas.find(area => area.id === this.areaId) || null;
    }
  },
  methods: {
    //#region Event Handlers

    onSharedSpaceSelected(item) {
      this.areaId = item.id;
      this.getReservationsByAreaId(this.areaId);
    },

    onDateSelected(dateInfo) {
      if (!this.areaId) {
        this.$toast.add({
          severity: 'warn',
          summary: 'No Space Selected',
          detail: 'Please select a shared space first',
          life: 3000
        });
        return;
      }

      this.selectedDateInfo = dateInfo;
      this.showDialog = true;
    },

    onReservationCreated(reservationData) {
      this.createReservation(reservationData);
      this.showDialog = false;
    },

    onDialogClosed() {
      this.showDialog = false;
      this.selectedDateInfo = null;
    },

    //#endregion

    //#region Action Methods

    getSharedAreas() {
      this.sharedAreaService.getAll()
          .then(response => {
            this.areas = response.data.map(area => new SharedSpace(area));
            this.loading = false;
          })
          .catch(error => {
            console.error('Error loading areas:', error);
            this.loading = false;
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error loading shared spaces',
              life: 3000
            });
          });
    },

    getReservationsByAreaId(areaId) {
      this.loading = true;
      this.reservationService.findAllByAreaId(areaId)
          .then(response => {
            this.events = response.data.map(reservation => {
              const res = new Reservation(reservation);
              return {
                id: res.id,
                title: res.title,
                start: res.start,
                end: res.end,
                extendedProps: {
                  areaId: res.areaId,
                  teacherId: res.teacherId
                }
              };
            });
            this.loading = false;
          })
          .catch(error => {
            console.error('Error loading reservations:', error);
            this.loading = false;
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error loading area reservations',
              life: 3000
            });
          });
    },

    createReservation(reservationData) {
      const payload = {
        title: reservationData.title,
        start: reservationData.start,
        end: reservationData.end
      };

      this.reservationService.create(this.userId, this.areaId, payload)
          .then(response => {
            const newReservation = new Reservation(response.data);

            // Add to events array for immediate UI update
            this.events.push({
              id: newReservation.id,
              title: newReservation.title,
              start: newReservation.start,
              end: newReservation.end,
              extendedProps: {
                areaId: newReservation.areaId,
                teacherId: newReservation.teacherId
              }
            });

            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Reservation created successfully',
              life: 3000
            });
          })
          .catch(error => {
            console.error('Error creating reservation:', error);

            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response?.data?.message || 'Could not create reservation. Please try again.',
              life: 3000
            });
          });
    }

    //#endregion
  },
  created() {
    this.reservationService = new ReservationService();
    this.sharedAreaService = new SharedAreaService();
    this.getSharedAreas();
  }
}
</script>

<template>
  <div v-if="loading" class="loading-container">
    <pv-progress-spinner />
    <span class="loading-text">Loading shared spaces...</span>
  </div>

  <div v-else>
    <reservation-toolbar
        :sharedAreas="areas"
        :selectedAreaId="areaId"
        @shared-space-selected="onSharedSpaceSelected($event)"
    />

    <weekly-calendar
        :events="events"
        :areaId="areaId"
        :userId="userId"
        :selectedSpace="selectedSpace"
        @date-selected="onDateSelected"
    />

    <create-reservation-dialog
        :visible="showDialog"
        :dateInfo="selectedDateInfo"
        :selectedSpace="selectedSpace"
        @reservation-created="onReservationCreated"
        @dialog-closed="onDialogClosed"
    />
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.loading-text {
  font-size: 1rem;
  color: #6c757d;
  font-weight: 500;
}
</style>