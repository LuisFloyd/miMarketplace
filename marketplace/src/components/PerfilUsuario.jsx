import { useContext, useState, useEffect } from "react";
import MyContext from "../my_context";
import axios from "axios";

const PerfilUsuario = () => {
  const { loginContext, setLoginContext } = useContext(MyContext);
  const [payloadPass, setPayloadPass] = useState({})

  function handlePass(e) {
    setPayloadPass({
      ...payloadPass,
      nuevaClave: e.target.value,
    });
  }
  // put contraseña:
  const CambiarPass = async (e) => {
    e.preventDefault();
    const urlServer = "https://54.147.207.191";
    const endpoint = "/usuario/modificaClave/" + loginContext.id;
    const token = localStorage.getItem("token")
    try {
      await axios.put(urlServer + endpoint, payloadPass, {
        headers: { Authorization: "Bearer " + token }
      });
      alert("Cambio de clave exitoso");
    } catch (error) {
      alert("Algo salió mal ...");
      console.log(error);
    }
  };

  return (
    <div >
      <div className="row">
        <div className="col-6 ">
          <div className="my-2 text-center ">
            <label htmlFor="exampleInputEmail1" className="form-label m-0">
              Nombre:
            </label>
          </div>
        </div>
        <div className="col-3">
          <div className="mb-3 ">
            <input
              type="text"
              className="form-control "
              placeholder={loginContext.nombre}
              id="inputNombre"
              aria-describedby="emailHelp"
            />
          </div>
        </div>
        <div className="col-6">
          <div className="my-2 text-center ">
            <label htmlFor="exampleInputEmail1" className="form-label m-0">
              Apellido:
            </label>
          </div>
        </div>
        <div className="col-3">
          <div className="mb-3">
            <input
              type="text"
              className="form-control "
              placeholder={loginContext.apellido}
              id="inputAppellido"
              aria-describedby="emailHelp"
            />
          </div>
        </div>
        <div className="col-6">
          <div className="my-2 text-center">
            <label htmlFor="exampleInputEmail1" className="form-label m-0">
              Número Teléfono:
            </label>
          </div>
        </div>
        <div className="col-3">
          <div className="mb-3">
            <input
              type="text"
              className="form-control "
              placeholder={loginContext.telefono}
              id="inputTelefono"
              aria-describedby="emailHelp"
            />
          </div>
        </div>
        <div className="col-6">
          <div className="my-2 text-center">
            <label htmlFor="exampleInputEmail1" className="form-label m-0">
              Email:
            </label>
          </div>
        </div>
        <div className="col-3">
          <div className="mb-3 text-center">
            <input
              type="text"
              className="form-control "
              placeholder={loginContext.email}
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
        </div>
        <div className="col-6">
          <div className="my-2 text-center">
            <label htmlFor="exampleInputEmail1" className="form-label m-0">
              Password:
            </label>
          </div>
        </div>
        <div className="col-3">
          <div className="mb-3">
            <input
              onChange={handlePass}
              type="password"
              className="form-control "
              placeholder="contraseña"
              id="inputPassword"
              aria-describedby="emailHelp"
            />
          </div>

        </div>
        <div className="col-9">
          <button
            type="submit"
            onClick={CambiarPass}
            className="btn btn-success"
          >
            Cambiar Contraseña!
          </button>
        </div>


      </div>


    </div>
  );
};
export default PerfilUsuario;
