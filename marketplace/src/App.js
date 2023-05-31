import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MyContext from "../src/my_context"
import axios from "axios";

//components
import Navbar from "./components/Navbar";
import RegistroUsuario from "./components/RegistroUsuario";
import LoginUsuario from "./components/LoginUsuario";
import Subirproducto from "./components/Subirproducto";
import Footer from "./components/Footer";
import PerfilUsuario from "./components/PerfilUsuario";
import PrivateNav from "./components/PrivateNav";


//views
import Home from "./views/Home"
import ProductDetail from "./views/ProductDetail";
import Good_login from "./views/GoodLogin";
import MisDatos from "./views/Misdatos";
import GaleriaBuscados from './views/GaleriaBuscados'
import MisPublicaciones from "./views/MisPublicaciones";
import MisFavoritos from "./views/MisFavoritos";
import Comprar from "./views/Comprar";
import MisCompras from "./views/MisCompras";
import MisVentas from "./views/MisVentas";

function App() {

  //manejo de estados
  const [images, setImages] = useState([])
  const [loginContext, setLoginContext] = useState([])
  const [productosData, setProductosData] = useState([])
  const [favorite, setFavorite] = useState([]);
  const [searchedItem, setSearchedItem] = useState("")
  const [productoSeleccionado, setProductoSeleccionado] = useState({});
  //funciones

  //declarando el context//
  const sharedContext = { images, setImages, loginContext, setLoginContext, productosData, setProductosData, favorite, setFavorite, searchedItem, setSearchedItem, productoSeleccionado, setProductoSeleccionado } 


  return (
    <div className="App vh-100 bg-light bg-gradient">

      <MyContext.Provider value={sharedContext}>
        <BrowserRouter>
          <Navbar />

          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/detalle_producto/:id" element={<ProductDetail />} />
            <Route path="/login" element={<LoginUsuario />} />
            <Route path="/Registro" element={<RegistroUsuario />} />
            <Route path="/subir" element={<Subirproducto />} />
            <Route path="/loguea3" element={<Good_login />} />
            <Route path="/MisDatos" element={<MisDatos />} />
            <Route path="/publicaciones" element = {<MisPublicaciones/>} />
            <Route path="/favoritos" element={<MisFavoritos />} />
            <Route path="/misCompras" element={<MisCompras />} />
            <Route path="/misVentas" element={<MisVentas />} />
            <Route path="/busqueda" element={<GaleriaBuscados />} />
            <Route path="/compra" element={<Comprar />} />
          </Routes>

          <Footer />
        </BrowserRouter>
      </MyContext.Provider>
    </div>
  );
}

export default App;
