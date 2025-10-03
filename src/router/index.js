import { createRouter, createWebHistory } from 'vue-router';

// Componentes de Autenticación y Públicos
import HomeComponent from '../public/pages/home.component.vue';
import LoginComponent from '../iam/login/pages/login.component.vue';
import RegisterComponent from '../iam/register/pages/register.component.vue';

// Componentes de Contextos de Dominio
import MeetManagementComponent from "../meeting-management/pages/meet-management.component.vue";
import ReservationManagementComponent from "../reservation-management/pages/reservation-management.component.vue";
import ClassroomManagementComponent from "../breakdown-report-management/pages/classroom-management.component.vue";
import ResourceManagementComponent from "../breakdown-report-management/pages/resource-management.component.vue";
import ReportResourceComponent from "../breakdown-report-management/pages/report-resource.component.vue";
import ReportsManagementComponent from "../breakdown-report-management/pages/reports-management.component.vue";

// Componentes del Dashboard de Administrador
import HomeAdminComponent from "../dashboard-admin/pages/home-admin.component.vue";
import PersonalDataComponent from "../dashboard-admin/pages/personal-data.component.vue";
import ClassroomChangesMeetingsComponent from "../dashboard-admin/pages/classroom-changes-meetings.component.vue";
import ClassroomsSharedSpacesComponent from "../dashboard-admin/pages/classrooms-shared-spaces.component.vue";
import AddClassroomsComponent from "../classroom-space-resource-management/pages/classrooms/add-classrooms.component.vue";
import ClassroomsComponent from "../classroom-space-resource-management/pages/classrooms/classrooms.component.vue";
import EditClassroomComponent from "../classroom-space-resource-management/pages/classrooms/edit-classroom.component.vue";
import AddSharedSpaceComponent from "../classroom-space-resource-management/pages/shared-spaces/add-shared-space.component.vue";
import SharedSpaceComponent from "../classroom-space-resource-management/pages/shared-spaces/shared-space.component.vue";
import EditSharedSpaceComponent from "../classroom-space-resource-management/pages/shared-spaces/edit-shared-space.component.vue";
import ResourceComponent from "../classroom-space-resource-management/pages/resources/resource.component.vue";
import AddResourceComponent from "../classroom-space-resource-management/pages/resources/add-resource.component.vue";
import EditResourceComponent from "../classroom-space-resource-management/pages/resources/edit-resource.component.vue";

// Componentes del Dashboard de Profesor
import HomeTeacherComponent from "../dashboard-teacher/pages/home-teacher.component.vue";
import ReservationsComponent from "../dashboard-teacher/pages/reservations.component.vue";
import BreakdownReportsComponent from "../dashboard-teacher/pages/breakdown-reports.component.vue";
import SpaceAvailabilityComponent from "../dashboard-teacher/pages/space-availability.component.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // Rutas Públicas y de Autenticación
        { path: '/', redirect: '/login' },
        { path: '/login', name: 'login', component: LoginComponent, meta: { title: 'Login' } },
        { path: '/register', name: 'register', component: RegisterComponent, meta: { title: 'Register' } },
        { path: '/home', name: 'home', component: HomeComponent, meta: { title: 'Home' } },

        // --- Rutas del Administrador ---
        { path: '/dashboard-admin', redirect: '/dashboard-admin/home-admin' },
        { path: '/dashboard-admin/home-admin', name: 'home-admin', component: HomeAdminComponent, meta: { title: 'Home Admin' } },
        { path: '/dashboard-admin/personal-data', name: 'personal-data', component: PersonalDataComponent, meta: { title: 'Personal Data' } },
        { path: '/dashboard-admin/classroom-changes-meetings', name: 'classroom-changes-meetings', component: ClassroomChangesMeetingsComponent, meta: { title: 'Classroom Changes & Meetings' } },
        { path: '/dashboard-admin/classroom-changes-meetings/meeting-management', name: 'meet-management', component: MeetManagementComponent, meta: { title: 'Meeting Management' } },
        { path: '/dashboard-admin/classrooms-shared-spaces', name: 'classrooms-shared-spaces', component: ClassroomsSharedSpacesComponent, meta: { title: 'Classrooms & Shared Spaces' } },
        { path: '/dashboard-admin/classrooms-shared-spaces/classrooms', name: 'admin-classrooms', component: ClassroomsComponent, meta: { title: 'Manage Classrooms' } },
        { path: '/dashboard-admin/classrooms-shared-spaces/classrooms/add', name: 'add-classrooms', component: AddClassroomsComponent, meta: { title: 'Add Classroom' } },
        { path: '/dashboard-admin/classrooms-shared-spaces/classrooms/edit/:id', name: 'edit-classroom', component: EditClassroomComponent, meta: { title: 'Edit Classroom' } },
        { path: '/dashboard-admin/classrooms-shared-spaces/shared-spaces', name: 'shared-spaces', component: SharedSpaceComponent, meta: { title: 'Manage Shared Spaces' } },
        { path: '/dashboard-admin/classrooms-shared-spaces/shared-spaces/add', name: 'add-shared-space', component: AddSharedSpaceComponent, meta: { title: 'Add Shared Space' } },
        { path: '/dashboard-admin/classrooms-shared-spaces/shared-spaces/edit/:id', name: 'edit-shared-space', component: EditSharedSpaceComponent, meta: { title: 'Edit Shared Space' } },
        { path: '/dashboard-admin/classrooms-shared-spaces/resources', name: 'resource-list', component: ResourceComponent, meta: { title: 'Resource List' } },
        { path: '/dashboard-admin/classrooms-shared-spaces/resources/add', name: 'add-resource', component: AddResourceComponent, meta: { title: 'Add Resource' } },
        { path: '/dashboard-admin/classrooms-shared-spaces/classrooms/:classroomId/resources/edit/:resourceId', name: 'edit-resource', component: EditResourceComponent, meta: { title: 'Edit Resource' } },

        // --- Rutas del Profesor ---
        { path: '/dashboard-teacher', redirect: '/dashboard-teacher/home-teacher' },
        { path: '/dashboard-teacher/home-teacher', name: 'home-teacher', component: HomeTeacherComponent, meta: { title: 'Home Teacher' } },
        { path: '/dashboard-teacher/reservations', name: 'reservations', component: ReservationsComponent, meta: { title: 'Reservations' } },
        { path: '/dashboard-teacher/reservations/reservation-management', name: 'reservation-management', component: ReservationManagementComponent, meta: { title: 'Reservation of spaces' } },
        { path: '/dashboard-teacher/reservations/space-availability', name: 'space-availability', component: SpaceAvailabilityComponent, meta: { title: 'My Reservations' } },
        { path: '/dashboard-teacher/breakdown-reports', name: 'breakdown-reports', component: BreakdownReportsComponent, meta: { title: 'Breakdown Reports' } },
        { path: '/dashboard-teacher/breakdown-reports/classrooms', name: 'teacher-classrooms', component: ClassroomManagementComponent, meta: { title: 'My Classrooms' } },
        { path: '/dashboard-teacher/breakdown-reports/classrooms/:classroomId/resources', name: 'teacher-resource-management', component: ResourceManagementComponent, meta: { title: 'Classroom Resources' }, props: true },
        { path: '/dashboard-teacher/breakdown-reports/classrooms/:classroomId/resources/:resourceId/report', name: 'report-resource', component: ReportResourceComponent, meta: { title: 'Report Resource' }, props: true },
        { path: '/dashboard-teacher/breakdown-reports/reports', name: 'teacher-reports', component: ReportsManagementComponent, meta: { title: 'My Reports' } },
    ]
});

router.beforeEach((to, from, next) => {
    let baseTitle = 'EduSpace';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
});

export default router;