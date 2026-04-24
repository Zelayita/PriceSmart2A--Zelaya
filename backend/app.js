import express from "express";
import productRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employeesRoutes from "./src/routes/employees.js";
import brandRoutes from "./src/routes/brand.js"
import customerRoutes from "./src/routes/customers.js"
import cookieParser from "cookie-parser";
import registerCustomerRoutes from "./src/routes/registerCustomer.js"
import recoverypassword from "./src/routes/recoveryPassword.js";
import logoutRoutes from "./src/routes/logout.js"
const app = express();
import loginCustomerController from "./src/routes/LoginCustomer.js";

app.use(cookieParser());

//Que acepte JSON desde postman
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/registerCustomers", registerCustomerRoutes);
app.use("/api/recoveryPassword", recoverypassword);
app.use("/api/LoginCustomer", loginCustomerController);
app.use("/api/logout", logoutRoutes);

export default app;
