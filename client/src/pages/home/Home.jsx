import React from "react";
import Featured from "../../components/featured/featured";
import Slide from "../../components/slide/Slide";
import {categories} from "../../data";
const Home = () => {    
    return (
        <>
        <Featured/>
        <Slide categories={categories}/>
        
        </>
    );
    }

export default Home;