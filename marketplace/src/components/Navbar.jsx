import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import MyContext from "../my_context";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const { loginContext, setLoginContext, searchedItem, setSearchedItem } =
    useContext(MyContext);
  const [usuario, setUsuarioLocal] = useState({});

  //llamo api por datos de usuario//
  const getUsuarioData = async () => {
    const urlServer = "https://54.147.207.191";
    const endpoint = "/usuarios";
    const token = localStorage.getItem("token");

    if (token == undefined) {
      console.log("no hay token");
    } else {
      const { data } = await axios.get(urlServer + endpoint, {
        headers: { Authorization: "Bearer " + token },
      });
      setLoginContext(data);
    }
  };
  //  token == "" ? console.log("no hay token") :
  //    const { data } = await axios.get(urlServer + endpoint, {
  //      headers: { Authorization: "Bearer " + token },
  //    });

  //aca se sobreescriben los estados  & context//

  const logout = () => {
    setLoginContext(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    getUsuarioData();
  }, []);

  // desarrollo del buscar

  const [input, setInput] = useState("");

  function handleItemToSearch(e) {
    setInput(e.target.value);
    setSearchedItem(input);
  }

  const handleSearch = (e) => {
    if (loginContext == "" || !loginContext) {
      navigate("/login");
    } else {
      e.preventDefault();
      console.log("searchedItem :>> ", searchedItem);
      setInput("");
      navigate("/busqueda");
    }
  };

  return (
      <nav className="navbar navbar-expand-sm bg-body-tertiary">
        <div className="container-fluid">
          <div
            onClick={
              loginContext == "" || !loginContext
                ? () => {
                    alert("Debes logearte");
                    navigate("/login");
                  }
                : () => navigate("/")
            }
            className="text-black text-nowrap m-1 anaglyph"
            style={{ textDecoration: "none" }}
          >
            <h1 className="">HOME</h1>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="d-flex input-group m-1" role="search">
              <button
                className="btn btn-outline-secondary"
                onClick={handleSearch}
                type="submit"
              >
                🔎
              </button>
              <input
                className="form-control border-dark"
                onChange={handleItemToSearch}
                value={input}
                type="search"
                placeholder="Busca tu producto"
                aria-label="Search"
              ></input>
            </form>

            {loginContext == "" || !loginContext ? (
              <div className="btn-group m-1" role="group">
                <button type="button" className="btn btn-outline-secondary">
                  <Link
                    to="/login"
                    className="text-black text-nowrap"
                    style={{ textDecoration: "none" }}
                  >
                    Iniciar Sesión
                  </Link>
                </button>
                <button type="button" className="btn btn-outline-secondary">
                  <Link
                    to="/registro"
                    className="text-black text-nowrap"
                    style={{ textDecoration: "none" }}
                  >
                    Registrarse
                  </Link>
                </button>
              </div>
            ) : (
              <div className="btn-group m-1" role="group">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {loginContext.nombre + " " + loginContext.apellido}
                </button>

                <ul className="dropdown-menu">
                  <li>
                    <Link to="/MisDatos" className="dropdown-item">
                      Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <Link to="/publicaciones" className="dropdown-item">
                      Mis Publicaciones
                    </Link>
                  </li>
                  <li>
                    <Link to="/favoritos" className="dropdown-item">
                      Favoritos
                    </Link>
                  </li>
                  <li>
                    <Link to="/misCompras" className="dropdown-item">
                      Mis Compras
                    </Link>
                  </li>
                  <li>
                    <Link to="/misVentas" className="dropdown-item">
                      Mis Ventas
                    </Link>
                  </li>
                  <li>
                    <Link to="/subir" className="dropdown-item">
                      Subir Producto
                    </Link>
                  </li>
                </ul>
                <button
                  onClick={logout}
                  type="button"
                  className="btn btn-outline-secondary"
                >
                  <Link
                    to="/"
                    className="text-black text-nowrap"
                    style={{ textDecoration: "none" }}
                  >
                    Logout
                  </Link>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
