import { ProjectModel, IProject } from '../models/Project';

export interface Project {
    id?: string;
    project_code: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export const ProjectRepository = {
    getAll: async (): Promise<Project[]> => {
        const projects = await ProjectModel.find().lean();
        return projects.map((p: any) => {
            p.id = p._id.toString();
            delete p._id;
            delete p.__v;
            return p;
        });
    },

    create: async (project: Project): Promise<Project> => {
        const newProject = await ProjectModel.create(project);
        const p: any = newProject.toObject();
        p.id = p._id.toString();
        delete p._id;
        delete p.__v;
        return p;
    },
};
