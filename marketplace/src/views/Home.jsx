import React from 'react';
import { useContext } from "react";
import MyContext from "../my_context";
import Carousel from '../components/Carousel';
import Galeria from '../components/Galeria';
import Loading from '../components/Loading';

const Home = () => {

    return (
        <div>
            <Carousel />
            <Galeria />
        </div>
    )
}

export default Home