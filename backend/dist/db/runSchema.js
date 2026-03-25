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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_1 = require("./index");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const runSchema = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield (0, index_1.connectDB)();
        const schemaPath = path_1.default.join(__dirname, 'schema.sql');
        const schemaSql = fs_1.default.readFileSync(schemaPath, 'utf8');
        // mssql package might fail trying to run GO batches, so we split by GO
        const queries = schemaSql.split(/GO\b/i).map(q => q.trim()).filter(q => q.length > 0);
        for (const query of queries) {
            console.log("Executing batch...");
            yield pool.request().query(query);
        }
        console.log("Database schema initialized successfully.");
        process.exit(0);
    }
    catch (err) {
        console.error("Error initializing schema:", err);
        process.exit(1);
    }
});
runSchema();
