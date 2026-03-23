import { parsePeriodToMmmYy } from '../utils/format.js';

const STORAGE_KEY = 'pmo_app_data_v1';
const PROJECT_STORAGE_KEY = 'pmo_projects_v1';
const PRO_STORAGE_KEY = 'pmo_professionals_v1';

const MOCK_DATA = [
    {
        id: '1',
        project: 'Transformación Digital Banco X',
        month: '2023-10',
        revenue: 45000,
        professionals: [
            { name: 'Juan P.', hours: 160, rate: 80 },
            { name: 'Ana M.', hours: 150, rate: 90 }
        ],
        thirdPartyCosts: 2000
    },
    {
        id: '2',
        project: 'Migración SAP Retail Y',
        month: '2023-10',
        revenue: 80000,
        professionals: [
            { name: 'Carlos S.', hours: 170, rate: 100 },
            { name: 'Elena R.', hours: 160, rate: 110 },
            { name: 'Junior 1', hours: 160, rate: 40 }
        ],
        thirdPartyCosts: 5000
    },
    {
        id: '3',
        project: 'Asesoría Agile Telco Z',
        month: '2023-10',
        revenue: 12000,
        professionals: [
            { name: 'Coach 1', hours: 100, rate: 110 }
        ],
        thirdPartyCosts: 0
    }
];

export const StorageService = {
    getAllEntries: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        let entries = [];
        if (!data) {
            // Initialize with mock data for first run
            entries = MOCK_DATA;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } else {
            entries = JSON.parse(data);
        }
        
        let needsSave = false;
        entries = entries.map(e => {
            const parsed = parsePeriodToMmmYy(e.month);
            if (parsed && parsed !== e.month) {
                e.month = parsed;
                needsSave = true;
            }
            return e;
        });
        
        if (needsSave) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        }
        
        return entries;
    },

    getEntriesByProject: (projectName) => {
        const entries = StorageService.getAllEntries();
        return entries.filter(e => e.project === projectName);
    },

    saveEntry: (entry) => {
        const entries = StorageService.getAllEntries();
        const newEntry = { ...entry, id: `e_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` };
        entries.push(newEntry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        return newEntry;
    },

    updateEntry: (entryId, updatedData) => {
        const entries = StorageService.getAllEntries();
        const index = entries.findIndex(e => e.id === entryId);
        if (index > -1) {
            entries[index] = { ...entries[index], ...updatedData };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } else {
            throw new Error('Registro no encontrado');
        }
    },

    getProjects: () => {
        const data = localStorage.getItem(PROJECT_STORAGE_KEY);
        if (!data) {
            // Initialize from existing entries if any
            const entries = StorageService.getAllEntries();
            const uniqueProjects = [...new Set(entries.map(e => e.project))];
            const initialProjects = uniqueProjects.map((name, index) => ({
                id: `p_${Date.now()}_${index}`,
                code: `PRJ-${String(index + 1).padStart(3, '0')}`,
                name: name,
                status: 'Activo'
            }));
            localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(initialProjects));
            return initialProjects;
        }
        return JSON.parse(data);
    },

    saveProject: (project) => {
        const projects = StorageService.getProjects();
        if (project.id) {
            const index = projects.findIndex(p => p.id === project.id);
            if (index > -1) {
                projects[index] = project;
            } else {
                projects.push(project);
            }
        } else {
            project.id = `p_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            projects.push(project);
        }
        localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
        return project;
    },

    getProfessionals: () => {
        const data = localStorage.getItem(PRO_STORAGE_KEY);
        if (!data) return [];
        
        let pros = JSON.parse(data);
        let needsSave = false;
        pros = pros.map(p => {
            const parsed = parsePeriodToMmmYy(p.period);
            if (parsed && parsed !== p.period) {
                p.period = parsed;
                needsSave = true;
            }
            return p;
        });
        
        if (needsSave) {
            localStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(pros));
        }
        
        return pros;
    },

    saveProfessional: (pro) => {
        const pros = StorageService.getProfessionals();
        if (pro.id) {
            const index = pros.findIndex(p => p.id === pro.id);
            if (index > -1) {
                pros[index] = pro;
            } else {
                pros.push(pro);
            }
        } else {
            pros.push({ ...pro, id: `pro_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` });
        }
        localStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(pros));
    },

    saveProfessionalsBulk: (prosList) => {
        const currentPros = StorageService.getProfessionals();
        const updatedPros = [...currentPros];
        
        prosList.forEach(newPro => {
            // Uniqueness is defined by Name + Period combination
            const existingIndex = updatedPros.findIndex(p => p.name === newPro.name && p.period === newPro.period);
            if (existingIndex > -1) {
                updatedPros[existingIndex] = { ...updatedPros[existingIndex], ...newPro };
            } else {
                updatedPros.push({ ...newPro, id: `pro_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` });
            }
        });
        
        localStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(updatedPros));
    },

    clearData: () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PROJECT_STORAGE_KEY);
        localStorage.removeItem(PRO_STORAGE_KEY);
    }
};
