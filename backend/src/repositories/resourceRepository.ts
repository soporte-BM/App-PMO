import { ResourceModel, IResource } from '../models/Resource';

export interface Resource {
    id?: string;
    resource_name: string;
    role: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export const ResourceRepository = {
    getAll: async (): Promise<Resource[]> => {
        const resources = await ResourceModel.find().lean();
        return resources.map((r: any) => {
            r.id = r._id.toString();
            delete r._id;
            delete r.__v;
            return r;
        });
    },

    create: async (resource: Resource): Promise<Resource> => {
        const newResource = await ResourceModel.create(resource);
        const r: any = newResource.toObject();
        r.id = r._id.toString();
        delete r._id;
        delete r.__v;
        return r;
    },
};
