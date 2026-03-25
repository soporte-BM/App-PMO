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
exports.getClosureKPIs = exports.unvalidateClosure = exports.validateClosure = exports.saveClosure = exports.getClosure = void 0;
const closureRepository_1 = require("../repositories/closureRepository");
const getClosure = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectCode, period } = req.query;
        if (!projectCode || !period) {
            const closures = yield closureRepository_1.ClosureRepository.getAllClosures();
            return res.json(closures);
        }
        const closure = yield closureRepository_1.ClosureRepository.getByProjectAndPeriod(projectCode, period);
        if (!closure) {
            return res.status(404).json({ message: 'Closure not found' });
        }
        res.json(closure);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching closure', error });
    }
});
exports.getClosure = getClosure;
const saveClosure = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { projectCode, period, revenue, thirdPartyCosts, resources } = req.body;
        if (!projectCode || !period) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Validations could be stricter here
        const result = yield closureRepository_1.ClosureRepository.saveDraft(projectCode, period, { revenue, thirdPartyCosts, resources }, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown');
        res.json(result);
    }
    catch (error) {
        if (error.message.includes('VALIDATED')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error saving closure', error: error.message });
    }
});
exports.saveClosure = saveClosure;
const validateClosure = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        yield closureRepository_1.ClosureRepository.setStatus(Number(id), 'VALIDATED', ((_a = req.user) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown');
        res.json({ message: 'Closure validated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error validating closure', error });
    }
});
exports.validateClosure = validateClosure;
const unvalidateClosure = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        yield closureRepository_1.ClosureRepository.setStatus(Number(id), 'DRAFT', ((_a = req.user) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown');
        res.json({ message: 'Closure unvalidated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error unvalidating closure', error });
    }
});
exports.unvalidateClosure = unvalidateClosure;
const getClosureKPIs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Re-use logic: fetch by ID (simplification: we can add getById to repo or just query for KPIs)
        // For now, let's assume the frontend uses the main GET /closures endpoint which returns KPIs
        res.status(501).json({ message: 'Use GET /closures?projectCode=...&period=... to get KPIs' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error', error });
    }
});
exports.getClosureKPIs = getClosureKPIs;
