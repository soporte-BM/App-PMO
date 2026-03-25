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
exports.ProjectRepository = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../db");
exports.ProjectRepository = {
    getAll: () => __awaiter(void 0, void 0, void 0, function* () {
        const pool = (0, db_1.getPool)();
        const result = yield pool.request().query('SELECT * FROM Projects');
        return result.recordset;
    }),
    create: (project) => __awaiter(void 0, void 0, void 0, function* () {
        const pool = (0, db_1.getPool)();
        const result = yield pool.request()
            .input('project_code', mssql_1.default.VarChar, project.project_code)
            .input('name', mssql_1.default.VarChar, project.name)
            .query(`
        INSERT INTO Projects (project_code, name)
        OUTPUT INSERTED.*
        VALUES (@project_code, @name)
      `);
        return result.recordset[0];
    }),
};
