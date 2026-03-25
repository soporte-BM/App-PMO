"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
function authMiddleware(req, res, next) {
    var _a;
    // Simulación por headers (para desarrollo)
    const simulatedRole = req.headers["x-user-role"];
    const simulatedUser = req.headers["x-user-name"];
    req.user = {
        name: simulatedUser !== null && simulatedUser !== void 0 ? simulatedUser : "dev-user",
        role: (_a = simulatedRole) !== null && _a !== void 0 ? _a : "Admin",
    };
    next();
}
/**
 * Middleware para exigir rol (o alguno de varios roles).
 * Uso: requireRole("Admin") o requireRole("PMO","Admin")
 */
function requireRole(...allowed) {
    return (req, res, next) => {
        var _a;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (!role) {
            return res.status(401).json({ error: "Unauthorized: missing role" });
        }
        if (!allowed.includes(role)) {
            return res.status(403).json({ error: "Forbidden: insufficient role", role, allowed });
        }
        next();
    };
}
