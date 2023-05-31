import { Link } from "react-router-dom"

const PrivateNav = () => {
  const pathname = window.location.pathname;

  return (
    <div className="list-group text-center">
      <h2>Menú</h2>
      <div className="rounded">
        <Link to="/MisDatos" className={pathname === "/MisDatos" ? "disabled text-danger list-group-item list-group-item-action text-center" : "list-group-item list-group-item-action text-center"}  >
          <p className="m-0">Mis Datos</p>
        </Link>
        <Link to="/publicaciones" className={pathname === "/publicaciones" ? "disabled text-danger list-group-item list-group-item-action text-center" : "list-group-item list-group-item-action text-center"}  >
          <p className="m-0">Mis Publicaciones</p>
        </Link>
        <Link to="/favoritos" className={pathname === "/favoritos" ? "disabled text-danger list-group-item list-group-item-action text-center" : "list-group-item list-group-item-action text-center"}  >
          <p className="m-0">Favoritos</p>
        </Link>
        <Link to="/misCompras" className={pathname === "/misCompras" ? "disabled text-danger list-group-item list-group-item-action text-center" : "list-group-item list-group-item-action text-center"}  >
          <p className="m-0">Mis Compras</p>
        </Link>
        <Link to="/misVentas" className={pathname === "/misVentas" ? "disabled text-danger list-group-item list-group-item-action text-center" : "list-group-item list-group-item-action text-center"}  >
          <p className="m-0">Mis Ventas</p>
        </Link>
      </div>
    </div>
  );
};

export default PrivateNav;
