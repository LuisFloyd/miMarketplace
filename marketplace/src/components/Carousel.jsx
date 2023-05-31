import React from 'react'
import { Link } from "react-router-dom";
import { useContext } from "react";
import MyContext from "../my_context";

const Carousel = () => {
    return (
        <div id="carouselExampleFade" className="bg-dark p-2 rounded carousel slide carousel-fade m-3" data-bs-ride="carousel">
            <div className="carousel-inner">
                <div className="carousel-item active justify-content-center d-flex"  data-bs-interval="5000">
                    <img src="https://www.america-retail.com/static/2022/09/marketplaces-europa-e1663938258924-696x463.jpg" style={{ maxHeight: '18rem'}} className="d-block" alt="..."></img>
                </div>
                <div className="carousel-item justify-content-center d-flex"  data-bs-interval="5000">
                    <img src="https://media.istockphoto.com/id/847918266/photo/technology-innovation-and-teamwork-concept.jpg?s=612x612&w=0&k=20&c=YBn1M6yoYQB-aFKDmDx01qMVKij_npBmZCW1u0EFjCk=" style={{ maxHeight: '18rem'}} className="d-block" alt="..."></img>
                </div>
                <div className="carousel-item justify-content-center d-flex"  data-bs-interval="5000">
                    <img src="https://d2hkn54fqqmadw.cloudfront.net/web/AL/wp-content/uploads/2016/04/Online-logistics-1024x831.jpg" style={{ maxHeight: '18rem'}} className="d-block" alt="..."></img>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
        </div>
    );
};

export default Carousel;