import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegistroUsuario = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    "nombre": "",
    "apellido": "",
    "email": "",
    "clave": "",
    "telefono": ""

  });

  // funciones que agregan los datos del nuevo cliente al estado "usuario" desde el formulario 
  function handleNombre(e) {
    setUsuario({
      ...usuario,
      nombre: e.target.value,
    });
  }

  function handleApellido(e) {
    setUsuario({
      ...usuario,
      apellido: e.target.value,
    });
  }

  function handleEmail(e) {
    setUsuario({
      ...usuario,
      email: e.target.value,
    });
  }
  function handlePassword(e) {
    setUsuario({
      ...usuario,
      clave: e.target.value,
    });
  }
  function handleTelefono(e) {
    setUsuario({
      ...usuario,
      telefono: e.target.value,
    });
  }

  // post al endpoint del los datos del usuario
  const registrarUsuario = async (e) => {
    e.preventDefault();
    /* console.log(usuario); */
    const urlServer = "http://localhost:3001";
    const endpoint = "/usuarios";
    try {
      await axios.post(urlServer + endpoint, usuario);
      alert("Usuario registrado con éxito");
      navigate("/login");
    } catch (error) {
      alert("Algo salió mal ...");
      console.log(error);
    };
  };

  // RENDERIZADO DE APP
  return (
    <div className="col-10 col-sm-6 m-auto m-auto mt-5 bg-white p-5 border border-secondary-subtle rounded">
      <h1>Registrar usuario</h1>
      <form className="row g-3">
        <div className="col-md-6">
          <label for="inputEmail4" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="inpurname"
            value={usuario.nombre}
            onChange={handleNombre}
          />
        </div>
        <div className="col-md-6">
          <label for="inputPassword4" className="form-label">
            Apellido
          </label>
          <input
            type="text"
            className="form-control"
            id="inputapellido"
            value={usuario.apellido}
            onChange={handleApellido}
          />
        </div>
        <div className="col-12 ">
          <label for="inputAddress" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputAddress"
            value={usuario.email}
            onChange={handleEmail}
          />
        </div>
        <div className="col-12 ">
          <label for="inputpassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputpassword"
            value={usuario.clave}
            onChange={handlePassword}
          />
        </div>
        <div className="col-md-6">
          <label for="inputEmail4" className="form-label">
            Teléfono
          </label>
          <input
            type="text"
            className="form-control"
            id="inputfono"
            value={usuario.telefono}
            onChange={handleTelefono
            }
          />
        </div>
        <div className="col-12 d-flex justify-content-evenly">
          <button
            onClick={
              registrarUsuario}

            type="submit"
            className="btn btn-outline-dark container me-1"
          >
            Enviar!
          </button>
          <button type="submit" className="btn btn-outline-dark container ms-1">
            Cancelar!
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroUsuario;
