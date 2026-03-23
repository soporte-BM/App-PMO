import { RateModel } from '../models/Rate';
import { ResourceModel } from '../models/Resource';

export interface Rate {
    id?: string;
    resource_id: string;
    period: string; // YYYY-MM-01
    direct_rate: number;
    indirect_rate: number;
    currency: string;
}

export const RateRepository = {
    getByPeriod: async (period: string) => {
        const resources = await ResourceModel.find({ status: 'ACTIVE' }).lean();
        const rates = await RateModel.find({ period }).lean();

        const rateMap = new Map();
        for (const r of rates) {
            rateMap.set(r.resource.toString(), r);
        }

        return resources.map(res => {
            const resId = res._id.toString();
            const rate = rateMap.get(resId);
            return {
                resource_id: resId,
                resource_name: res.resource_name,
                direct_rate: rate ? rate.direct_rate : null,
                indirect_rate: rate ? rate.indirect_rate : null,
                currency: rate ? rate.currency : null
            };
        });
    },

    upsertRate: async (resourceName: string, period: string, directRate: number, indirectRate: number) => {
        const resource = await ResourceModel.findOne({ resource_name: resourceName }).lean();
        if (!resource) {
            throw new Error(`Resource ${resourceName} not found`);
        }

        await RateModel.findOneAndUpdate(
            { resource: resource._id, period },
            { direct_rate: directRate, indirect_rate: indirectRate },
            { upsert: true, new: true }
        );

        return { resourceName, status: 'updated' };
    }
};
