<script>
export default {
  name: "create-reservation-dialog",
  props: {
    visible: { type: Boolean, required: true },
    dateInfo: { type: Object, default: null },
    selectedSpace: { type: Object, default: null }
  },
  data() {
    return {
      title: '',
      selectedDate: null,
      startTime: null,
      endTime: null,
      isSubmitting: false
    }
  },
  computed: {
    minDate() {
      return new Date();
    },
    duration() {
      if (!this.startTime || !this.endTime) return null;

      const start = new Date(`2000-01-01T${this.startTime}`);
      const end = new Date(`2000-01-01T${this.endTime}`);
      const diffMs = end - start;
      const diffHrs = diffMs / 3600000;

      return diffHrs;
    },
    durationText() {
      if (!this.duration) return '';

      const hours = Math.floor(this.duration);
      const minutes = Math.round((this.duration - hours) * 60);

      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}min`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else {
        return `${minutes}min`;
      }
    },
    isValid() {
      return this.title.trim() && this.selectedDate && this.startTime && this.endTime &&
             this.duration > 0 && this.duration <= 2;
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initializeFromDateInfo();
      } else {
        this.resetForm();
      }
    },
    dateInfo: {
      immediate: true,
      handler() {
        if (this.visible) {
          this.initializeFromDateInfo();
        }
      }
    }
  },
  methods: {
    initializeFromDateInfo() {
      if (this.dateInfo) {
        const start = new Date(this.dateInfo.start);
        const end = new Date(this.dateInfo.end);

        this.selectedDate = start;
        this.startTime = this.formatTimeForInput(start);
        this.endTime = this.formatTimeForInput(end);
      }
    },

    formatTimeForInput(date) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },

    resetForm() {
      this.title = '';
      this.selectedDate = null;
      this.startTime = null;
      this.endTime = null;
      this.isSubmitting = false;
    },

    validateReservation() {
      if (!this.title.trim()) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Required Field',
          detail: 'Please enter a title for the reservation',
          life: 3000
        });
        return false;
      }

      if (!this.selectedDate) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Required Field',
          detail: 'Please select a date',
          life: 3000
        });
        return false;
      }

      if (!this.startTime || !this.endTime) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Required Field',
          detail: 'Please select start and end times',
          life: 3000
        });
        return false;
      }

      // Validate business hours (07:00 - 20:00)
      const startHour = parseInt(this.startTime.split(':')[0]);
      const endHour = parseInt(this.endTime.split(':')[0]);
      const endMinute = parseInt(this.endTime.split(':')[1]);

      if (startHour < 7 || (endHour > 20) || (endHour === 20 && endMinute > 0)) {
        this.$toast.add({
          severity: 'error',
          summary: 'Invalid Time',
          detail: 'Reservations must be within business hours (07:00 - 20:00)',
          life: 3000
        });
        return false;
      }

      // Validate duration
      if (this.duration <= 0) {
        this.$toast.add({
          severity: 'error',
          summary: 'Invalid Duration',
          detail: 'End time must be after start time',
          life: 3000
        });
        return false;
      }

      if (this.duration > 2) {
        this.$toast.add({
          severity: 'error',
          summary: 'Maximum Duration Exceeded',
          detail: 'Reservations cannot exceed 2 hours',
          life: 3000
        });
        return false;
      }

      return true;
    },

    onSubmit() {
      if (!this.validateReservation()) {
        return;
      }

      this.isSubmitting = true;

      // Combine date and time
      const year = this.selectedDate.getFullYear();
      const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(this.selectedDate.getDate()).padStart(2, '0');

      const startDateTime = `${year}-${month}-${day}T${this.startTime}:00`;
      const endDateTime = `${year}-${month}-${day}T${this.endTime}:00`;

      const reservation = {
        title: this.title.trim(),
        start: startDateTime,
        end: endDateTime
      };

      setTimeout(() => {
        this.$emit('reservation-created', reservation);
        this.resetForm();
      }, 500);
    },

    onCancel() {
      this.$emit('dialog-closed');
      this.resetForm();
    }
  }
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      :modal="true"
      :style="{ width: '40rem' }"
      @update:visible="onCancel"
      :draggable="false"
      class="reservation-dialog"
  >
    <template #header>
      <div class="dialog-header">
        <div class="header-icon">
          <i class="pi pi-calendar-plus"></i>
        </div>
        <div class="header-content">
          <h3 class="header-title">Create Reservation</h3>
          <p v-if="selectedSpace" class="header-subtitle">{{ selectedSpace.name }}</p>
        </div>
      </div>
    </template>

    <div class="dialog-body">
      <!-- Space Info Banner -->
      <div v-if="selectedSpace" class="space-info-banner">
        <div class="banner-row">
          <div class="banner-item">
            <i class="pi pi-users"></i>
            <span>Capacity: {{ selectedSpace.capacity }}</span>
          </div>
          <div class="banner-item">
            <i class="pi pi-clock"></i>
            <span>Hours: 07:00 - 20:00</span>
          </div>
          <div class="banner-item">
            <i class="pi pi-stopwatch"></i>
            <span>Max: 2 hours</span>
          </div>
        </div>
      </div>

      <!-- Title Input -->
      <div class="form-group">
        <label for="title" class="form-label">
          <i class="pi pi-pencil"></i>
          Reservation Title
        </label>
        <pv-input-text
            id="title"
            v-model="title"
            placeholder="e.g., Team Meeting, Math Class..."
            class="form-input"
            autofocus
        />
        <small class="form-hint">This title will be visible in the calendar</small>
      </div>

      <!-- Date Picker -->
      <div class="form-group">
        <label class="form-label">
          <i class="pi pi-calendar"></i>
          Date
        </label>
        <pv-date-picker
            v-model="selectedDate"
            :minDate="minDate"
            dateFormat="dd/mm/yy"
            placeholder="Select a date"
            :showIcon="true"
            class="form-input"
            iconDisplay="input"
        />
        <small class="form-hint">Select the date for your reservation</small>
      </div>

      <!-- Time Inputs -->
      <div class="time-grid">
        <div class="form-group">
          <label for="startTime" class="form-label">
            <i class="pi pi-clock"></i>
            Start Time
          </label>
          <input
              id="startTime"
              v-model="startTime"
              type="time"
              min="07:00"
              max="20:00"
              class="time-input"
          />
        </div>

        <div class="time-divider">
          <i class="pi pi-arrow-right"></i>
        </div>

        <div class="form-group">
          <label for="endTime" class="form-label">
            <i class="pi pi-clock"></i>
            End Time
          </label>
          <input
              id="endTime"
              v-model="endTime"
              type="time"
              min="07:00"
              max="20:00"
              class="time-input"
          />
        </div>
      </div>

      <!-- Duration Display -->
      <div v-if="duration !== null" class="duration-display">
        <div :class="['duration-badge', { 'valid': duration <= 2 && duration > 0, 'invalid': duration > 2 || duration <= 0 }]">
          <i class="pi pi-stopwatch"></i>
          <span>Duration: {{ durationText }}</span>
          <i v-if="duration > 2" class="pi pi-exclamation-triangle"></i>
          <i v-else-if="duration > 0 && duration <= 2" class="pi pi-check-circle"></i>
        </div>
        <small v-if="duration > 2" class="error-hint">Maximum duration is 2 hours</small>
        <small v-else-if="duration <= 0" class="error-hint">End time must be after start time</small>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <pv-button
            label="Cancel"
            icon="pi pi-times"
            @click="onCancel"
            severity="secondary"
            outlined
            :disabled="isSubmitting"
            class="footer-button"
        />
        <pv-button
            label="Create Reservation"
            icon="pi pi-check"
            @click="onSubmit"
            :disabled="!isValid || isSubmitting"
            :loading="isSubmitting"
            class="footer-button primary-button"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
/* Dialog Header */
.dialog-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.header-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.header-content {
  flex: 1;
}

.header-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.header-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 500;
}

/* Dialog Body */
.dialog-body {
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Space Info Banner */
.space-info-banner {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%);
  border-radius: 10px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 1rem;
}

.banner-row {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.banner-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #2c3e50;
  font-weight: 500;
}

.banner-item i {
  color: #10b981;
  font-size: 0.95rem;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* Form Group */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-label i {
  color: #10b981;
  font-size: 0.875rem;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.form-input {
  width: 100%;
}

.form-input :deep(.p-inputtext) {
  padding: 0.75rem;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-input :deep(.p-inputtext:focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-hint {
  color: #6c757d;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.error-hint {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Time Grid */
.time-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: end;
}

.time-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  font-size: 1.2rem;
  padding-bottom: 1.5rem;
}

.time-divider i {
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.time-input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  font-size: 0.95rem;
  color: #2c3e50;
  font-family: inherit;
  transition: all 0.3s ease;
}

.time-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Duration Display */
.duration-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.duration-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.duration-badge.valid {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.duration-badge.invalid {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
}

.duration-badge i {
  font-size: 0.9rem;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
}

.footer-button {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.primary-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
}

.primary-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  :deep(.reservation-dialog) {
    width: 95vw !important;
  }

  .time-grid {
    grid-template-columns: 1fr;
  }

  .time-divider {
    display: none;
  }

  .banner-row {
    flex-direction: column;
    gap: 0.75rem;
  }
}

/* Animation */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.p-dialog) {
  animation: slideInDown 0.3s ease-out;
}
</style>