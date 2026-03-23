import { renderDashboard } from './components/dashboard-view.js';
import { renderEntryForm } from './components/entry-form.js';
import { renderProjects } from './components/projects-view.js';
import { renderResources } from './components/resources-view.js';
import { AuthService } from './services/auth.js';

class App {
    constructor() {
        this.container = document.getElementById('content-area');
        this.navBtns = document.querySelectorAll('.nav-btn');
        this.init();
    }

    init() {
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = new Date().toLocaleDateString('es-ES', dateOptions);

        this.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.navigate(view);
                this.navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        const btnNewEntry = document.getElementById('btn-new-entry');
        if (btnNewEntry) {
            btnNewEntry.addEventListener('click', () => {
                this.navigate('entry');
                this.navBtns.forEach(b => b.classList.remove('active'));
                document.querySelector('[data-view="entry"]')?.classList.add('active');
            });
        }

        this.navigate('dashboard');
    }

    async navigate(view) {
        this.container.innerHTML = '';
        const title = document.getElementById('page-title');

        // Mostrar spinner mientras carga
        this.container.innerHTML = '<div style="padding:2rem;color:#6b7280;text-align:center;">Cargando...</div>';

        try {
            switch (view) {
                case 'dashboard':
                    title.textContent = 'Dashboard Ejecutivo';
                    await renderDashboard(this.container);
                    break;
                case 'entry':
                    title.textContent = 'Ingreso de Datos Operacionales';
                    await renderEntryForm(this.container);
                    break;
                case 'projects':
                    title.textContent = 'Gestión de Proyectos';
                    await renderProjects(this.container);
                    break;
                case 'resources':
                    title.textContent = 'Maestro de Profesionales';
                    await renderResources(this.container);
                    break;
                default:
                    await renderDashboard(this.container);
            }
        } catch (error) {
            console.error('Error al cargar la vista:', error);
            this.container.innerHTML = `
                <div style="padding:2rem;color:#dc2626;text-align:center;">
                    <strong>Error al conectar con el servidor.</strong><br>
                    <small>${error.message}</small>
                </div>`;
        }
    }
}

// Start App and Auth Flow
document.addEventListener('DOMContentLoaded', () => {
    AuthService.init();

    const loginContainer = document.getElementById('login-container');
    const mainAppContainer = document.getElementById('main-app-container');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('btn-logout');
    const forgotPasswordLink = document.getElementById('forgot-password');

    const updateProfileUI = (user) => {
        if (!user) return;
        document.getElementById('user-display-name').textContent = user.name;
        document.getElementById('user-display-role').textContent = user.role;
        document.getElementById('user-avatar-initials').textContent = user.name.substring(0, 2).toUpperCase();
    };

    const checkSession = () => {
        const user = AuthService.getCurrentUser();
        if (user) {
            loginContainer.classList.add('hidden');
            mainAppContainer.classList.remove('hidden');
            updateProfileUI(user);
            new App();
        } else {
            loginContainer.classList.remove('hidden');
            mainAppContainer.classList.add('hidden');
        }
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const user = AuthService.login(email, password);
            if (user) {
                checkSession();
                loginForm.reset();
            }
        } catch (error) {
            alert(error.message);
        }
    });

    logoutBtn.addEventListener('click', () => {
        AuthService.logout();
        window.location.reload();
    });

    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = prompt('Ingrese su correo electrónico para recuperar la contraseña:');
        if (email) {
            try {
                await AuthService.recoverPassword(email);
                alert('Se ha enviado un enlace de recuperación a su correo (Simulado).');
            } catch (error) {
                alert(error.message);
            }
        }
    });

    checkSession();
});
