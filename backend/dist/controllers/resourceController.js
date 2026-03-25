"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResource = exports.getResources = void 0;
const resourceRepository_1 = require("../repositories/resourceRepository");
const getResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resources = yield resourceRepository_1.ResourceRepository.getAll();
        res.json(resources);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching resources', error });
    }
});
exports.getResources = getResources;
const createResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resource_name, role } = req.body;
        if (!resource_name || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const newResource = yield resourceRepository_1.ResourceRepository.create({ resource_name, role, status: 'ACTIVE' });
        res.status(201).json(newResource);
    }
    catch (error) {
        if (error && (error.number === 2627 || error.number === 2601 || (error.message && error.message.includes('UNIQUE KEY constraint')))) {
            return res.status(409).json({ message: 'Resource already exists' });
        }
        res.status(500).json({ message: 'Error creating resource', error });
    }
});
exports.createResource = createResource;
