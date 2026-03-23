import mongoose, { Schema, Document } from 'mongoose';

export interface IClosureResourceHour {
    resource: mongoose.Types.ObjectId;
    hours: number;
    rate_snapshot_direct: number;
    rate_snapshot_indirect: number;
}

export interface IClosure extends Document {
    project: mongoose.Types.ObjectId;
    period: string; // YYYY-MM-01 format
    status: 'DRAFT' | 'VALIDATED';
    revenue: number;
    third_party_costs: number;
    resources: IClosureResourceHour[];
    created_by?: string;
    validated_by?: string;
    validated_at?: Date;
}

const ClosureResourceHourSchema = new Schema({
    resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
    hours: { type: Number, required: true },
    rate_snapshot_direct: { type: Number, required: true },
    rate_snapshot_indirect: { type: Number, required: true }
}, { _id: false });

const ClosureSchema: Schema = new Schema({
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    period: { type: String, required: true },
    status: { type: String, enum: ['DRAFT', 'VALIDATED'], default: 'DRAFT' },
    revenue: { type: Number, default: 0 },
    third_party_costs: { type: Number, default: 0 },
    resources: [ClosureResourceHourSchema],
    created_by: { type: String },
    validated_by: { type: String },
    validated_at: { type: Date }
}, {
    timestamps: true
});

ClosureSchema.index({ project: 1, period: 1 }, { unique: true });

ClosureSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

export const ClosureModel = mongoose.model<IClosure>('Closure', ClosureSchema);
