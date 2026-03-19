import faqsModel from "../models/faqs.js"

const faqsController = {}

//SELECT
faqsController.getFaqs = async (req, res) => {
  const products = await faqsModel.find();
  res.json(products);
};

//INSERTAR
faqsController.insertFaqs = async (req, res) => {
  //#1- Solicitamos los campos
  const { question, answer, isActive } = req.body;

  const newFaqs = new faqsModel({ question, answer, isActive});

  await newFaqs.save();

  res.json({ message: "FAQ save" });
};

//ELIMINAR
faqsController.deleteFaqs = async (req, res) => {
  await faqsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Faqs deleted" });
};

//ACTUALIZAR
faqsController.updateFaqs = async (req, res) => {
  //1- solicitamos los nuevos valores
  const { question, answer, isActive } = req.body;
  await faqsModel.findByIdAndUpdate(req.params.id, {
    question, answer, isActive}, {new: true})

    res.json({message: "faqs updated"})

};

export default faqsController;