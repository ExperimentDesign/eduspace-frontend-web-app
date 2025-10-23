<script>
import { Meet } from "../model/meet.entity.js";
import MeetCreateAndEditDialog from "../components/meet-create-and-edit.component.vue";
import { MeetService } from "../services/meet.service.js";
import {ClassroomService} from "../../shared/services/classroom.service.js";
import { AdministratorsService } from "../services/administrators.service.js";
import MeetingCard from '../components/meeting-card.vue';

export default {
  name: "meet-management",
  components: { MeetCreateAndEditDialog, MeetingCard },
  data() {
    return {
      title: { singular: 'Meet', plural: 'Meetings' },
      meetings: [],
      meet: new Meet({}),
      selectedMeetings: [],
      meetService: null,
      classroomsService: null,
      administratorsService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    },
    notifyErrorAction(message) {
      this.$toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    },

    async loadMeetings() {
      try {
        const [meetingsResponse, classroomsResponse, administratorsResponse] = await Promise.all([
          this.meetService.getAll(),
          this.classroomsService.getAll(),
          this.administratorsService.getAllAdministrators()
        ]);

        const meetingsData = meetingsResponse.data;
        const allClassrooms = classroomsResponse.data;
        const allAdministrators = administratorsResponse.data;

        this.meetings = meetingsData.map(meetData => {
          const classroom = allClassrooms.find(c => c.id === meetData.classroomId?.classroomIdentifier);
          const administrator = allAdministrators.find(a => a.id === meetData.administratorId?.administratorIdentifier);

          return new Meet({
            id: meetData.meetingId,
            title: meetData.title,
            description: meetData.description,
            day: meetData.date,
            start: meetData.start,
            end: meetData.end,
            classroom: classroom,
            administrator: administrator,
            teachers: meetData.teachers || []
          });
        });
      } catch (error) {
        console.error("Error loading and enriching meetings:", error);
        this.notifyErrorAction('Could not load meetings data.');
      }
    },

    onNewItem() {
      this.meet = new Meet({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onEditItem(item) {
      this.meet = JSON.parse(JSON.stringify(item));
      // Ensure classroomId and administratorId are properly set
      if (item.classroom && !this.meet.classroomId) {
        this.meet.classroomId = typeof item.classroom === 'object' ? item.classroom.id : item.classroom;
      }
      if (item.administrator && !this.meet.administratorId) {
        this.meet.administratorId = typeof item.administrator === 'object' ? item.administrator.id : item.administrator;
      }
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onDeleteItem(item) {
      this.meetService.delete(item.id).then(() => {
        this.meetings = this.meetings.filter(m => m.id !== item.id);
        this.notifySuccessfulAction('Meet Deleted');
      }).catch(error => {
        console.error("Error deleting meet:", error);
        this.notifyErrorAction('Could not delete meet.');
      });
    },
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
    },
    onSaveRequested(payload) {
      this.submitted = true;
      if (this.isEdit) {
        this.updateMeet(payload);
      } else {
        this.createMeet(payload);
      }
    },
    async createMeet(payload) {
      try {

        const createResponse = await this.meetService.create(
            payload.administratorId,
            payload.classroomId,
            payload.meetData
        );
        const newMeeting = createResponse.data;

        if (payload.teacherIds && payload.teacherIds.length > 0) {
          for (const teacherId of payload.teacherIds) {
            await this.meetService.addTeacherToMeeting(newMeeting.meetingId, teacherId);
          }
        }
        await this.loadMeetings();
        this.notifySuccessfulAction('Meet Created Successfully');
      } catch (error) {
        console.error("Error :", error);
        this.notifyErrorAction('An error occurred while creating the meet.');
      } finally {
        this.createAndEditDialogIsVisible = false;
      }
    },
    async updateMeet(payload) {
      try {
        payload.meetData.administratorId = this.meet.administrator?.id;
        payload.meetData.classroomId = this.meet.classroom?.id;

        await this.meetService.update(this.meet.id, payload.meetData);

        const currentTeacherIds = this.meet.teachers?.map(t => t.id) || [];
        const newTeacherIds = payload.teacherIds || [];
        const teachersToAdd = newTeacherIds.filter(id => !currentTeacherIds.includes(id));
        const teachersToRemove = currentTeacherIds.filter(id => !newTeacherIds.includes(id));

        if (teachersToRemove.length > 0) {
          for (const teacherId of teachersToRemove) {
            await this.meetService.removeTeacherFromMeeting(this.meet.id, teacherId);
          }
        }

        if (teachersToAdd.length > 0) {
          for (const teacherId of teachersToAdd) {
            await this.meetService.addTeacherToMeeting(this.meet.id, teacherId);
          }
        }

        await this.loadMeetings();
        this.notifySuccessfulAction('Meet Updated Successfully');
      } catch (error) {
        console.error("Error updating meet:", error);
        this.notifyErrorAction('An error occurred while updating the meet.');
      } finally {
        this.createAndEditDialogIsVisible = false;
      }
    },
    onViewItem(meeting) {
      this.notifySuccessfulAction(`Viewing meeting: ${meeting.title || meeting.id}`);
    },
  },
  created() {
    this.meetService = new MeetService();
    this.classroomsService = new ClassroomService();
    this.administratorsService = new AdministratorsService();
    this.loadMeetings();
  }
}
</script>

<template>
  <div class="meet-management-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="pi pi-calendar"></i>
        </div>
        <div class="header-text">
          <h1>Meeting Management</h1>
          <p>Schedule and organize meetings with teachers</p>
        </div>
      </div>
    </div>

    <div class="meetings-list">
      <button class="p-button p-button-success" @click="onNewItem">Nuevo Meeting</button>
      <div v-if="meetings.length" class="cards">
        <MeetingCard v-for="meeting in meetings" :key="meeting.id" :meeting="meeting" @view="onViewItem" @edit="onEditItem" @delete="onDeleteItem" />
      </div>
      <div v-else>
        <p>No hay reuniones programadas.</p>
      </div>
    </div>

    <meet-create-and-edit-dialog
        :item="meet"
        :visible="createAndEditDialogIsVisible"
        :edit="isEdit"
        @update:visible="value => createAndEditDialogIsVisible = value"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />

    <pv-toast />
  </div>
</template>

<style scoped>
.meet-management-page {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon i {
  font-size: 3rem;
  color: white;
}

.header-text h1 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 2rem;
  font-weight: 600;
}

.header-text p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

.meetings-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* small separation between MeetingCard components */
}
</style>