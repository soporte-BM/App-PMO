import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ResourceRepository } from '../repositories/resourceRepository';

export const getResources = async (req: AuthRequest, res: Response) => {
    try {
        const resources = await ResourceRepository.getAll();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resources', error });
    }
};

export const createResource = async (req: AuthRequest, res: Response) => {
    try {
        const { resource_name, role } = req.body;
        if (!resource_name || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const newResource = await ResourceRepository.create({ resource_name, role, status: 'ACTIVE' });
        res.status(201).json(newResource);
    } catch (error) {
        res.status(500).json({ message: 'Error creating resource', error });
    }
};
