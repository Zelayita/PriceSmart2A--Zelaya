import express from "express";
import productRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employeesRoutes from "./src/routes/employees.js";
import brandRoutes from "./src/routes/brand.js"
import customerRoutes from "./src/routes/customers.js"
import RegisterCustomer from "./src/routes/RegisterCustomer.js"
const app = express();
import loginCustomerController from "./src/routes/LoginCustomer.js";
import logoutRoutes from "./src/routes/logout.js"

import cookieParser from 'cookie-parser'
//Que acepte JSON desde postman
app.use(express.json());

//para las Cookies
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/registerCustomers", RegisterCustomer);
app.use("/api/LoginCustomer", loginCustomerController);
app.use("/api/logout", logoutRoutes);
export default app;
