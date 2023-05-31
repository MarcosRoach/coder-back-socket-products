import { Router } from "express";
import Productos from "../class/productos.js";

const router = Router();

router.get("/", (req, res) => {
  //intancia de la clase productos
  const productos = new Productos().productos;

  //renderizamos la vista index con los productos
  const data = { productos: productos };
  res.render("index", data);
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

//Exportamos el router
export default router;
