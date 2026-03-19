import express from "express"
import productRoutes from "./src/routes/products.js"
import faqsRoutes from "./src/routes/faqs.js"

const app = express();

//Que acepte JSON desde postman
app.use(express.json())

app.use("/api/products", productRoutes)
app.use("/api/faqs", faqsRoutes)


export default app;

