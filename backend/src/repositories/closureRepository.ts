import { ClosureModel } from '../models/Closure';
import { ProjectModel } from '../models/Project';
import { ResourceModel } from '../models/Resource';
import { RateModel } from '../models/Rate';

export interface ClosureEntry {
    resourceName: string;
    hours: number;
}

export interface Closure {
    id?: string;
    project_id: string;
    period: string;
    status: 'DRAFT' | 'VALIDATED';
    revenue: number;
    third_party_costs: number;
    resources?: any[];
    kpis?: any;
    project_name?: string;
}

export const ClosureRepository = {
    getByProjectAndPeriod: async (projectCode: string, period: string) => {
        const project = await ProjectModel.findOne({ project_code: projectCode }).lean();
        if (!project) return null;

        const closure = await ClosureModel.findOne({ project: project._id, period })
            .populate('resources.resource')
            .lean();

        if (!closure) return null;

        const formattedClosure: Closure = {
            id: closure._id.toString(),
            project_id: closure.project.toString(),
            period: closure.period,
            status: closure.status,
            revenue: closure.revenue,
            third_party_costs: closure.third_party_costs,
            project_name: project.name,
            resources: []
        };

        let laborDirect = 0;
        let laborIndirect = 0;

        closure.resources.forEach((r: any) => {
            const h = r.hours;
            const dRate = r.rate_snapshot_direct || 0;
            const iRate = r.rate_snapshot_indirect || 0;
            laborDirect += h * dRate;
            laborIndirect += h * iRate;

            formattedClosure.resources!.push({
                resource_id: r.resource._id.toString(),
                resource_name: r.resource.resource_name,
                role: r.resource.role,
                hours: h,
                rate_snapshot_direct: dRate,
                rate_snapshot_indirect: iRate
            });
        });

        const totalCost = laborDirect + laborIndirect + formattedClosure.third_party_costs;
        const margin = formattedClosure.revenue - totalCost;
        const profitability = formattedClosure.revenue > 0 ? (margin / formattedClosure.revenue) * 100 : 0;

        formattedClosure.kpis = {
            laborDirectCost: laborDirect,
            laborIndirectCost: laborIndirect,
            totalCost,
            margin,
            profitabilityPct: parseFloat(profitability.toFixed(2))
        };

        return formattedClosure;
    },

    saveDraft: async (projectCode: string, period: string, data: any, user: string) => {
        const project = await ProjectModel.findOne({ project_code: projectCode });
        if (!project) throw new Error('Project not found');

        const existing = await ClosureModel.findOne({ project: project._id, period });
        if (existing && existing.status === 'VALIDATED') {
            throw new Error('Cannot modify a VALIDATED closure. Unvalidate first.');
        }

        const resourceLines = [];
        for (const line of data.resources) {
            const res = await ResourceModel.findOne({ resource_name: line.resourceName });
            if (!res) throw new Error(`Resource ${line.resourceName} not found`);

            const rate = await RateModel.findOne({ resource: res._id, period });

            resourceLines.push({
                resource: res._id,
                hours: line.hours,
                rate_snapshot_direct: rate ? rate.direct_rate : 0,
                rate_snapshot_indirect: rate ? rate.indirect_rate : 0
            });
        }

        let closureId;

        if (existing) {
            existing.revenue = data.revenue;
            existing.third_party_costs = data.thirdPartyCosts;
            existing.resources = resourceLines;
            await existing.save();
            closureId = existing._id.toString();
        } else {
            const newClosure = await ClosureModel.create({
                project: project._id,
                period,
                status: 'DRAFT',
                revenue: data.revenue,
                third_party_costs: data.thirdPartyCosts,
                resources: resourceLines,
                created_by: user
            });
            closureId = newClosure._id.toString();
        }

        return { id: closureId, status: 'DRAFT' };
    },

    setStatus: async (id: string, status: 'DRAFT' | 'VALIDATED', user: string) => {
        const updateData: any = { status };
        if (status === 'VALIDATED') {
            updateData.validated_by = user;
            updateData.validated_at = new Date();
        }

        const updated = await ClosureModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) throw new Error(`Closure ${id} not found`);

        return { id: updated._id.toString(), status: updated.status };
    }
};
