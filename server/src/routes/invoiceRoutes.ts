import { Router } from "express";
import {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
} from "../controllers/invoiceController";
import { protect } from "../middleware/authMiddleware";
import { downloadInvoicePDF } from "../controllers/pdfController";

const router = Router();

router.use(protect);

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoice);
router.put("/:id", updateInvoice);
router.patch("/:id/status", updateInvoiceStatus);
router.delete("/:id", deleteInvoice);
router.get("/:id/pdf", downloadInvoicePDF);


export default router;