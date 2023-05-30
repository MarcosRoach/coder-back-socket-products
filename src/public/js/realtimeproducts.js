//Iniciar Socket
const socket = io();

//DOM Elementos
const productosContainer = document.getElementById("productosContainer");
const buttonSubmit = document.getElementById("btnAdd");

//Escuchamos el evento "productos" y recibimos los productos
socket.on("productos", (data) => {
  let productos = "";

  //Recorremos los productos y los mostramos en el HTML
  productos += `<tr>

  <th>Producto</th>

  <th>Precio</th>

  <th>Categoria</th>

</tr>`;
  data.forEach((producto) => {
    productos += `
            <tr>
            <td>${producto.id}</td>
            <td>${producto.title}</td>
            <td>${producto.price}</td>
            <td>${producto.category}</td>
            <td><button type="submit" id=${producto.id} class="btnDelete">Borrar</button></td>
            </tr>
        `;
  });

  //Insertamos los productos en el HTML
  productosContainer.innerHTML = productos;

  //Cargar arr con botones para borrar
  const btnDelete = document.getElementsByClassName("btnDelete");

  for (let boton of btnDelete) {
    boton.addEventListener("click", () => {
      socket.emit("deleteProduct", boton.getAttribute("id"));
    });
  }
});

//Escuchamos el evento addProduct y recibimos el producto
buttonSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  //Obtenemos los valores de los inputs
  const id = document.getElementById("id").value;
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;

  //Validamos que los campos no esten vacios
  if (id === "" || title === "" || price === "" || category === "") {
    alert("Todos los campos son obligatorios");
  } else {
    //Creamos el objeto producto
    const producto = {
      id,
      title,
      price,
      category,
    };

    //Emitimos el evento addProduct y enviamos el producto
    socket.emit("addProduct", producto);

    //Reseteamos los valores de los inputs
    document.getElementById("id").value = "";
    document.getElementById("title").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
  }
});
