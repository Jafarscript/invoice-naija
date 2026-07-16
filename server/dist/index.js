"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/clients", clientRoutes_1.default);
app.use("/api/invoices", invoiceRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.get("/", (req, res) => {
    res.json({ message: "InvoiceNaija API is running" });
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
