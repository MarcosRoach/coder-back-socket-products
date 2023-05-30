import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";

import Productos from "./class/Productos.js";

//Incializamos el servidor
const app = express();

//Rutas Extendidas
app.use(express.urlencoded({ extended: true }));

//Carpetas estaticas
app.use(express.static(__dirname + "/public"));

//Configuramos el motor de plantillas handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const httpServer = app.listen(8080, () => {
  console.log("Servidor HTTP escuchando en el puerto 8080");
});

//Rutas
app.use("/", viewsRouter);

//Productos
// const productos = [
//   {
//     id: "1",
//     title: "Iphone 13 Pro Max",
//     description: "El nuevo Iphone 13 Pro con 1TB de memoria y 16GB de RAM",
//     code: "CD-001",
//     price: 1000,
//     status: true,
//     stock: 4,
//     category: "Celulares",
//   },
//   {
//     id: "2",
//     title: "Sansumg S22",
//     description: "El nuevo Sansumg S22 con 1TB de memoria y 16GB de RAM",
//     code: "CD-002",
//     price: 900,
//     category: "Celulares",
//     status: true,
//     stock: 4,
//   },
//   {
//     id: "3",
//     title: "Mavic Pro 2",
//     price: 1000,
//     category: "Drones",
//   },
// ];

//Instanciamos la clase Productos
const productos = new Productos().productos;

//Socket.io
const socketServer = new Server(httpServer);

//Escuchamos la conexion de un cliente
socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado!", socket.id);

  //Enviamos los productos al cliente que se conectó
  socket.emit("productos", productos);

  //Escuchamos el evento addProduct y recibimos el producto
  socket.on("addProduct", (data) => {
    //Agregamos el producto a la lista de productos
    productos.push(data);

    //Enviamos los productos a todos los clientes conectados
    socketServer.emit("productos", productos);
  });

  //Escuchamos el evento deleteProduct y recibimos el id del producto
  socket.on("deleteProduct", (id) => {
    //Eliminamos el producto de la lista de productos
    productos.splice(
      productos.findIndex((producto) => producto.id === id),
      1
    );

    //Enviamos los productos a todos los clientes conectados
    socketServer.emit("productos", productos);
  });
});
