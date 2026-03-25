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
exports.getPool = exports.connectDB = void 0;
const mssql_1 = __importDefault(require("mssql"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER || 'localhost',
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: true, // Use this if you're on Azure.
        trustServerCertificate: true, // Change to false for production
    },
};
let pool = null;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Connecting to SQL Server with config:", Object.assign(Object.assign({}, config), { password: config.password ? '***' : undefined }));
        pool = yield mssql_1.default.connect(config);
        console.log('Connected to Azure SQL Database');
        return pool;
    }
    catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
});
exports.connectDB = connectDB;
const getPool = () => {
    if (!pool) {
        throw new Error('Database not connected');
    }
    return pool;
};
exports.getPool = getPool;
