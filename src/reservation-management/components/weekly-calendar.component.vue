<script>
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: "weekly-calendar",
  props: {
    events: { type: Array, required: true },
    areaId: { type: Number, required: true },
    userId: { type: Number, required: true },
    selectedSpace: { type: Object, default: null }
  },
  computed: {
    calendarOptions() {
      return {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek'
        },
        events: this.events,
        initialView: 'timeGridWeek',
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        height: 'auto',
        slotMinTime: '06:00:00',
        slotMaxTime: '22:00:00',
        selectConstraint: {
          start: new Date()
        },
        validRange: {
          start: new Date()
        },
        businessHours: {
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          startTime: '07:00',
          endTime: '20:00'
        },
        locale: 'en',
        buttonText: {
          today: 'Today',
          week: 'Week'
        },
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        },
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }
      }
    }
  },
  data() {
    return {
      currentEvents: []
    }
  },
  methods: {
    handleDateSelect(selectInfo) {
      this.$emit('date-selected', {
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
      selectInfo.view.calendar.unselect();
    },

    handleEventClick(clickInfo) {
      const event = clickInfo.event;
      alert(`Reservation: ${event.title}\nStart: ${event.start.toLocaleString('en-US')}\nEnd: ${event.end.toLocaleString('en-US')}`);
    },

    handleEvents(events) {
      this.currentEvents = events;
    }
  }
}
</script>

<template>
  <div class='calendar-wrapper'>
    <div v-if="selectedSpace" class="calendar-header">
      <div class="header-icon">
        <i class="pi pi-building"></i>
      </div>
      <div class="header-content">
        <h3>{{ selectedSpace.name }}</h3>
        <p>Viewing reservations for this space</p>
      </div>
    </div>

    <div class='calendar-container'>
      <fc-calendar
          class='modern-calendar'
          :options='calendarOptions'
      >
        <template v-slot:eventContent='arg'>
          <div class="event-content">
            <div class="event-time">
              <i class="pi pi-clock"></i>
              <span>{{ arg.timeText }}</span>
            </div>
            <div class="event-title">{{ arg.event.title }}</div>
          </div>
        </template>
      </fc-calendar>
    </div>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.calendar-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.02) 100%);
  border-radius: 12px;
  border: 2px solid #10b981;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.header-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.header-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
}

.calendar-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9ecef;
  padding: 1.25rem;
  overflow: hidden;
}

.modern-calendar {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Toolbar */
.modern-calendar :deep(.fc-toolbar) {
  padding: 0.75rem 0.5rem;
  margin-bottom: 1.25rem;
  background: transparent;
  border-radius: 0;
  border-bottom: 1px solid #e9ecef;
}

.modern-calendar :deep(.fc-toolbar-title) {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
}

.modern-calendar :deep(.fc-button) {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  border-radius: 6px;
  padding: 0.5rem 0.85rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.modern-calendar :deep(.fc-button:hover) {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.modern-calendar :deep(.fc-button-active) {
  background: #10b981 !important;
  border-color: #10b981 !important;
  color: white !important;
}

.modern-calendar :deep(.fc-button:focus) {
  box-shadow: none;
}

/* Column Headers */
.modern-calendar :deep(.fc-col-header-cell) {
  background: #f8f9fa;
  border-color: #dee2e6;
  padding: 0.75rem 0.5rem;
  font-weight: 600;
  color: #495057;
}

.modern-calendar :deep(.fc-col-header-cell-cushion) {
  color: #495057;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* Time Slots */
.modern-calendar :deep(.fc-timegrid-slot) {
  height: 2.5rem;
  border-color: #e9ecef;
}

.modern-calendar :deep(.fc-timegrid-slot-label) {
  color: #6c757d;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Events */
.modern-calendar :deep(.fc-event) {
  border: none;
  border-radius: 6px;
  background: #10b981;
  border-left: 3px solid #059669;
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.2);
  transition: all 0.2s ease;
  cursor: pointer;
}

.modern-calendar :deep(.fc-event:hover) {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(16, 185, 129, 0.3);
  background: #059669;
}

.event-content {
  padding: 0.4rem 0.5rem;
  color: white;
}

.event-time {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
  font-size: 0.7rem;
  margin-bottom: 0.2rem;
  opacity: 0.95;
}

.event-time i {
  font-size: 0.65rem;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.event-title {
  font-weight: 500;
  font-size: 0.8rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Selection Highlight */
.modern-calendar :deep(.fc-highlight) {
  background: rgba(16, 185, 129, 0.12);
  border-radius: 4px;
}

/* Today Column */
.modern-calendar :deep(.fc-day-today) {
  background: rgba(16, 185, 129, 0.03) !important;
}

/* Business Hours */
.modern-calendar :deep(.fc-non-business) {
  background: #f8f9fa;
}

/* Borders */
.modern-calendar :deep(.fc-scrollgrid) {
  border-color: #dee2e6;
}

.modern-calendar :deep(td),
.modern-calendar :deep(th) {
  border-color: #e9ecef;
}

/* Scrollbar */
.modern-calendar :deep(.fc-scroller)::-webkit-scrollbar {
  width: 6px;
}

.modern-calendar :deep(.fc-scroller)::-webkit-scrollbar-track {
  background: #f1f3f5;
  border-radius: 3px;
}

.modern-calendar :deep(.fc-scroller)::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.modern-calendar :deep(.fc-scroller)::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-container {
    padding: 1rem;
  }

  .modern-calendar :deep(.fc-toolbar) {
    flex-direction: column;
    gap: 0.75rem;
  }

  .modern-calendar :deep(.fc-toolbar-title) {
    font-size: 1.1rem;
  }

  .modern-calendar :deep(.fc-button) {
    font-size: 0.8rem;
    padding: 0.45rem 0.75rem;
  }

  .modern-calendar :deep(.fc-timegrid-slot) {
    height: 2rem;
  }
}
</style>
