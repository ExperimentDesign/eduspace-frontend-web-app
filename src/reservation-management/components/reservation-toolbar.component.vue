<script>
export default {
  name: "reservation-toolbar",
  props: {
    sharedAreas: { type: Array, required: true },
    selectedAreaId: { type: Number, default: null }
  },
  methods: {
    isSelected(area) {
      return this.selectedAreaId === area.id;
    },
    selectSpace(area) {
      this.$emit('shared-space-selected', area);
    },
    getAvailabilityStatus() {
      const now = new Date();
      const currentHour = now.getHours();

      // Business hours: 07:00-20:00
      if (currentHour >= 7 && currentHour < 20) {
        return { text: 'Open Now', class: 'available' };
      } else {
        return { text: 'Closed', class: 'closed' };
      }
    }
  }
}
</script>

<template>
  <div class="spaces-container">
    <div class="header">
      <div class="header-icon">
        <i class="pi pi-calendar-plus"></i>
      </div>
      <div>
        <h2>Select a Shared Space</h2>
        <p>Choose a space to view its reservations and book a time slot</p>
      </div>
    </div>

    <div class="spaces-grid">
      <div
        v-for="area in sharedAreas"
        :key="area.id"
        :class="['space-card', { 'selected': isSelected(area) }]"
        @click="selectSpace(area)"
      >
        <div class="card-header">
          <div class="space-icon">
            <i class="pi pi-building"></i>
          </div>
          <h3>{{ area.name }}</h3>
        </div>

        <div class="card-body">
          <p class="description">{{ area.description || 'No description available' }}</p>

          <div class="info-grid">
            <div class="info-item">
              <i class="pi pi-users"></i>
              <span class="label">Capacity</span>
              <span class="value">{{ area.capacity }} people</span>
            </div>

            <div class="info-item">
              <i class="pi pi-clock"></i>
              <span class="label">Hours</span>
              <span class="value">07:00 - 20:00</span>
            </div>

            <div class="info-item">
              <i class="pi pi-info-circle"></i>
              <span class="label">Status</span>
              <span :class="['status-badge', getAvailabilityStatus().class]">
                {{ getAvailabilityStatus().text }}
              </span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <i class="pi pi-check-circle"></i>
          <span>{{ isSelected(area) ? 'Selected' : 'Click to select' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spaces-container {
  margin-bottom: 1.5rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
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

.header h2 {
  margin: 0 0 0.25rem 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: #2c3e50;
}

.header p {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
}

.spaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

.space-card {
  background: #ffffff;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.space-card:hover {
  border-color: #10b981;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
  transform: translateY(-2px);
}

.space-card.selected {
  border-color: #10b981;
  background: linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 0%, #ffffff 100%);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.space-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-body {
  margin-bottom: 1rem;
}

.description {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #6c757d;
  line-height: 1.5;
  min-height: 2.5rem;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: grid;
  grid-template-columns: 20px 1fr auto;
  gap: 0.5rem;
  align-items: center;
}

.info-item i {
  color: #10b981;
  font-size: 0.9rem;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.info-item .label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
}

.info-item .value {
  font-size: 0.875rem;
  color: #2c3e50;
  font-weight: 600;
  text-align: right;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.available {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.closed {
  background: #fee2e2;
  color: #991b1b;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6c757d;
}

.space-card.selected .card-footer {
  color: #10b981;
}

.card-footer i {
  font-size: 1rem;
  position: relative;
  z-index: 2;
  backface-visibility: hidden;
  transform: translateZ(0);
}

@media (max-width: 768px) {
  .spaces-grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-icon {
    width: 42px;
    height: 42px;
    font-size: 1.3rem;
  }

  .header h2 {
    font-size: 1.2rem;
  }
}
</style>
