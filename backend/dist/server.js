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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const resourceRoutes_1 = __importDefault(require("./routes/resourceRoutes"));
const rateRoutes_1 = __importDefault(require("./routes/rateRoutes"));
const closureRoutes_1 = __importDefault(require("./routes/closureRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Routes
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/resources', resourceRoutes_1.default);
app.use('/api/rates', rateRoutes_1.default);
app.use('/api/closures', closureRoutes_1.default);
// ...
app.get("/health", (req, res) => {
    res.status(200).json({ ok: true });
});
// Start Server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        console.log("Database connected successfully");
    }
    catch (error) {
        console.warn("⚠️ Database not available. Running in DEV mode without DB.");
    }
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
startServer();
