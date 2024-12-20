import express from "express";
import path from "path";
import { rateLimit } from "express-rate-limit";
import {
  getCompanies,
  getCompanyById,
  getCompanyProjectListing,
  getCompanyProfile,
  register,
  signIn,
  updateCompanyProfile,
  verifyEmail,
  getAllProjetsOfCompany,
  getApplicationsForCompany,
  getProfessorProfile,
} from "../controllers/companiesController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

const __dirname = path.resolve(path.dirname(""));

//ip rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//verify user email
router.get("/verify/:userId/:token", verifyEmail);

// REGISTER
router.post("/register", limiter, register);

// LOGIN
router.post("/login", limiter, signIn);

// GET DATA
router.post("/get-company-profile", userAuth, getCompanyProfile);
router.get('/get-professor-profile/:id', getProfessorProfile);
router.post("/get-company-projectlisting", userAuth, getCompanyProjectListing);
router.get("/", getCompanies);
router.get("/get-company/:id", getCompanyById);

// GET ALL PROJECTS OF A COMPANY
router.get("/get-company-projects/:companyId", userAuth, getAllProjetsOfCompany);

// UPDATE DATA
router.put("/update-company/", userAuth, updateCompanyProfile);

router.get('/:id/applications', getApplicationsForCompany);

export default router;

