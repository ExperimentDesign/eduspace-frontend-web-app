import AuthenticationService from "../../iam/services/authentication.service.js";

const getStoredUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export default {
    namespaced: true,
    state: {
        user: getStoredUser(),
        id: getStoredUser()?.id || null,
        role: getStoredUser()?.role || null,
        token: localStorage.getItem("token") || null,
        isAuthenticated: !!localStorage.getItem("token"),
        isVerificationPending: false,
        verificationEmail: null,
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
            state.id = user?.id || null;
            state.role = user?.role || null;
            state.isAuthenticated = true;
            state.isVerificationPending = false;
            state.verificationEmail = null;
        },
        SET_TOKEN(state, token) {
            state.token = token;
        },
        CLEAR_USER(state) {
            state.id = null;
            state.role = null;
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.isVerificationPending = false;
            state.verificationEmail = null;
        },
        SET_VERIFICATION_PENDING(state, email) {
            state.isVerificationPending = true;
            state.verificationEmail = email;
        },
    },
    actions: {
        async signIn({ commit }, payload) {
            await AuthenticationService.signIn(payload);
            commit("SET_VERIFICATION_PENDING", payload.username);
        },

        async verifyCodeAndLogin({ commit }, verifyPayload) {
            const response = await AuthenticationService.verifyCode(verifyPayload);

            const { id, profileId, role, token, username } = response.data;

            if (!profileId || !role || !token) {
                throw new Error("Datos de usuario incompletos en la respuesta del servidor.");
            }

            const userData = { id: profileId,accountId: id, role, username };

            localStorage.setItem("token", token);
            localStorage.setItem('user', JSON.stringify(userData));

            commit("SET_TOKEN", token);
            commit("SET_USER", userData);
        },

        async signOut({ commit }) {
            commit("CLEAR_USER");
            localStorage.removeItem("token");
            localStorage.removeItem('user');
        },
    },
    getters: {
        isAuthenticated(state) {
            return state.isAuthenticated;
        },
        currentUser(state) {
            return state.user;
        },
        currentUsername(state) {
            return state.user?.username || "Guest";
        },
        userId(state) {
            return state.id;
        },
        userRole(state) {
            return state.role;
        },
        userToken(state) {
            return state.token;
        },
        isVerificationPending(state) {
            return state.isVerificationPending;
        },
        verificationEmail(state) {
            return state.verificationEmail;
        }
    },
};