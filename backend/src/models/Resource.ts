import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
    resource_name: string;
    role: string;
    status: 'ACTIVE' | 'INACTIVE';
}

const ResourceSchema: Schema = new Schema({
    resource_name: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
}, {
    timestamps: true
});

ResourceSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

export const ResourceModel = mongoose.model<IResource>('Resource', ResourceSchema);
