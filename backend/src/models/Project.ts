import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    project_code: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
}

const ProjectSchema: Schema = new Schema({
    project_code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
}, {
    timestamps: true
});

// To ensure id is returned as string in JSON similar to SQL's id, though it will be alphanumeric
ProjectSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
