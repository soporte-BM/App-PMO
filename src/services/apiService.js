const API_BASE_URL = '/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || `Request failed: ${response.status}`);
    }
    return response.json();
};

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-user-role': 'ADMIN',
    'x-user-name': 'DevFrontend'
});

export const ApiService = {

    // ── PROJECTS ────────────────────────────────────────────────────────
    getProjects: async () => {
        const response = await fetch(`${API_BASE_URL}/projects`, { headers: getHeaders() });
        return handleResponse(response);
    },

    createProject: async (project) => {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(project)
        });
        return handleResponse(response);
    },

    // ── RESOURCES ───────────────────────────────────────────────────────
    getResources: async () => {
        const response = await fetch(`${API_BASE_URL}/resources`, { headers: getHeaders() });
        return handleResponse(response);
    },

    createResource: async (resource) => {
        const response = await fetch(`${API_BASE_URL}/resources`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(resource)
        });
        return handleResponse(response);
    },

    // ── RATES ────────────────────────────────────────────────────────────
    getRates: async (period) => {
        const response = await fetch(`${API_BASE_URL}/rates?period=${period}`, { headers: getHeaders() });
        return handleResponse(response);
    },

    saveRates: async (period, rates) => {
        const response = await fetch(`${API_BASE_URL}/rates`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ period, rates })
        });
        return handleResponse(response);
    },

    // ── CLOSURES ─────────────────────────────────────────────────────────
    getAllEntries: async () => {
        const response = await fetch(`${API_BASE_URL}/closures/all`, { headers: getHeaders() });
        return handleResponse(response);
    },

    getClosure: async (projectCode, period) => {
        const response = await fetch(`${API_BASE_URL}/closures?projectCode=${projectCode}&period=${period}`, { headers: getHeaders() });
        return handleResponse(response);
    },

    saveEntry: async (entry) => {
        const payload = {
            projectCode: entry.projectCode || entry.project_code || entry.project,
            period: entry.period || entry.month,
            revenue: entry.revenue,
            thirdPartyCosts: entry.thirdPartyCosts || entry.third_party_costs || 0,
            resources: (entry.professionals || entry.resources || []).map(p => ({
                resourceName: p.name || p.resource_name,
                hours: p.hours
            }))
        };
        const response = await fetch(`${API_BASE_URL}/closures`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    validateClosure: async (id) => {
        const response = await fetch(`${API_BASE_URL}/closures/${id}/validate`, {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    unvalidateClosure: async (id) => {
        const response = await fetch(`${API_BASE_URL}/closures/${id}/unvalidate`, {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    clearData: () => {
        console.warn('clearData no está soportado en modo API.');
    }
};
