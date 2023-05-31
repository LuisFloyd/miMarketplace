import { useContext, useState, useEffect } from "react";
import MyContext from "../my_context";
import axios from "axios";

export default function Good_login() {
  const { setLoginContext } = useContext(MyContext);
  const [usuario, setUsuarioLocal] = useState({});

  //llamo api por datos de usuario//  
  const getUsuarioData = async () => {
    const urlServer = "https://54.147.207.191";
    const endpoint = "/usuarios";
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.get(urlServer + endpoint, {
        headers: { Authorization: "Bearer " + token },
      });

      //aca se sobrescriben los estados  & context//    
      setLoginContext(data);
      setUsuarioLocal(data);
      window.location.href = "/"
    } catch ({ response: { data: message } }) {
      alert(message + " 🙁");
      console.log(message);
    }
  };

  useEffect(() => {
    getUsuarioData();
  }, []);

  return (
    <div className="py-5 bg-dark text-white d-flex justify-content-evenly">
      <h1>
        Bienvenido <span className="fw-bold">{usuario.email}</span>
      </h1>
    </div>
  );
}
