import mongoose, { Schema, Document } from 'mongoose';

export interface IRate extends Document {
    resource: mongoose.Types.ObjectId;
    period: string; // YYYY-MM-01 format
    direct_rate: number;
    indirect_rate: number;
    currency: string;
}

const RateSchema: Schema = new Schema({
    resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
    period: { type: String, required: true },
    direct_rate: { type: Number, required: true },
    indirect_rate: { type: Number, required: true },
    currency: { type: String, default: 'CLP' } // Defaulting to CLP based on standard
}, {
    timestamps: true
});

// Compound index for resource and period to ensure unique rates per month
RateSchema.index({ resource: 1, period: 1 }, { unique: true });

RateSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

export const RateModel = mongoose.model<IRate>('Rate', RateSchema);
