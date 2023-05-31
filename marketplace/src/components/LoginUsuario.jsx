import { useState  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginUsuario() {

  const navigate = useNavigate();

  const [datosLogin, setDatosLogin] = useState({
    "email": "",
    "clave": "",
  });

  function handleEmail(e) {
    setDatosLogin({
      ...datosLogin,
      email: e.target.value
    });
  };

  function handlePassword(e) {
    setDatosLogin({
      ...datosLogin,
      clave: e.target.value
    });
  };

  const iniciarSesion = async () => {
    const urlServer = "http://localhost:3001";
    const endpoint = "/login";
    const { email, clave } = datosLogin;
    try {
      if (!email || !clave) return alert("Email y password obligatorias");
      const { data: token } = await axios.post(urlServer + endpoint, datosLogin);
      alert("Usuario identificado con éxito 😀");
      localStorage.setItem("token", token);
      setDatosLogin();
      navigate("/loguea3");
    } catch ({ response: { data: message } }) {
      alert(message + " 🙁");
      console.log(message);
    };
  };

  return (
    <div className="col-10 col-sm-6 m-auto mt-5 p-4 bg-white border border-secondary-subtle rounded">
      <h1 className="text-center">Iniciar Sesión</h1>
      <hr />
      <div className="form-group mt-1 ">
        <label>E-mail </label>
        <input
          value={datosLogin.email}
          onChange={handleEmail}
          type="email"
          name="email"
          className="form-control"
        />
      </div>
      <div className="form-group mt-1 ">
        <label>Password</label>
        <input
          value={datosLogin.password}
          onChange={handlePassword}
          type="password"
          name="password"
          className="form-control"
        />
      </div>
      <button onClick={iniciarSesion} className="container btn btn-outline-dark mt-3">
        Iniciar Sesión
      </button>
    </div>
  );
}
