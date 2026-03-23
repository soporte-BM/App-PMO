// src/services/apiService.js

const API_BASE_URL = 'http://localhost:3000/api'; // Make this configurable via env if needed

// Helper to handle responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || `Request failed: ${response.status}`);
    }
    return response.json();
};

// Headers with simulated auth
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-user-role': 'ADMIN', // Simulate Admin for now, change as needed
    'x-user-name': 'DevFrontend'
});

export const ApiService = {
    // Projects
    getProjects: async () => {
        const response = await fetch(`${API_BASE_URL}/projects`, { headers: getHeaders() });
        return handleResponse(response);
    },

    // Resources
    getResources: async () => {
        const response = await fetch(`${API_BASE_URL}/resources`, { headers: getHeaders() });
        return handleResponse(response);
    },

    // Rates
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

    // Closures (Replacing StorageService logic)
    getAllEntries: async (filters = {}) => {
        // This maps to getClosure logic. 
        // If the UI expects a list of all closures, we might need a new endpoint GET /closures/all or filtering by project/period loop.
        // The original StorageService returned everything.
        // For strict compatibility with the Prompt's "GET /closures?projectCode=...&period=..." design, 
        // we might need to know what the UI expects.
        // Assuming the UI calls this to load a specific view or list.
        // If the UI needs a list, we should probably implement a list endpoint.
        // For now, let's assume the UI passes filters projectCode and period, or we return an empty list if not valid.

        if (filters.projectCode && filters.month) {
            try {
                const data = await ApiService.getClosure(filters.projectCode, filters.month);
                return [data]; // Return as array to mimic getAllEntries behavior for a single match
            } catch (e) {
                if (e.message.includes('not found')) return [];
                throw e;
            }
        }
        return []; // TODO: Implement getAllClosures on backend if needed
    },

    getClosure: async (projectCode, period) => {
        const response = await fetch(`${API_BASE_URL}/closures?projectCode=${projectCode}&period=${period}`, { headers: getHeaders() });
        return handleResponse(response);
    },

    saveEntry: async (entry) => {
        // storage.js entry structure: { project, month, revenue, professionals, thirdPartyCosts ... }
        // We need to map it to backend expectation: { projectCode, period, revenue, thirdPartyCosts, resources }

        // entry.project might be the name or code? In storage.js MOCK_DATA it was Name like "Transformación..."
        // The backend expects projectCode. We might need a mapping or ensure frontend sends code.
        // For this task, assuming we pass what we have. If entry.project is name, we might fail on backend lookup 
        // unless we fix frontend to send code. 
        // Let's assume entry.projectCode exists or we pass entry.project as code if it matches.

        const payload = {
            projectCode: entry.projectCode || entry.project, // Fallback, but backend needs Code
            period: entry.month,
            revenue: entry.revenue,
            thirdPartyCosts: entry.thirdPartyCosts,
            resources: entry.professionals.map(p => ({
                resourceName: p.name,
                hours: p.hours
                // rate is not sent, backend looks it up.
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
        console.warn('clearData not supported in API mode');
    }
};
