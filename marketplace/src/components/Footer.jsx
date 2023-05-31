import React from 'react';

const Footer = () => {
    return (
        <footer className="d-flex fixed-bottom pt-1 bg-black">
            <div className='row mx-auto'>
                <div className="text-center fw-bold mb-0 bg-white text-center m-auto rounded-1 ancho200"><a className="anaglyph"
                    href="#">MARKETPLACE 2023</a></div>
                <p className="text-center fw-light mb-0 text-white-50">
                    <i className="fa-regular fa-copyright pt-2"></i>
                    2023 LTC. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;