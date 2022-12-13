import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { Search_Movies,ISearchMovie } from "../api";
import styled from "styled-components";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import {useMatch, useNavigate, useParams } from "react-router-dom";
import { makeImagePath } from "../untills";
import ReactPlayer from "react-player";


const Wrapper = styled.div`
background: black;
`;

const SearchSlider = styled(motion.div)`
position:relative;
top: 100px;
`;

const Row = styled(motion.div)`
display: grid;
grid-template-columns: repeat(6,1fr);
gap: 10px;
position:absolute;
width:100%;
height: 100%;
`;

const Box = styled(motion.div)<{bgphoto:string}>`
background-color: white;
background-image: url(${(props) => props.bgphoto});
height: 200px;
color:red;
background-size: cover;
background-position: center center;
cursor: pointer;
&:first-child{
    transform-origin: center left;
};
&:last-child{
    transform-origin: center right;
};
`;

const Info = styled(motion.div)`
padding: 10px;
background-color: ${(props) => props.theme.black.lighter};
opacity: 0;
position: absolute;
bottom:0;
width: 100%;

h4{
    text-align: center;
    font-size: 8px;
    color: white;
    font-family: system-ui;
}
`;

const NotFound = styled.h1`
font-size: 100px;
margin-top: 200px;
margin-left: 200px;
`;

// ------------------------------------------------------------------

const rowVars = {
    hidden:{
    y:window.outerWidth-10,
    },
    visible:{
        y:0,
    },
    exit:{
        y:-window.outerWidth+10,
    },
}

const boxVars = {
    initial:{
        scale: 1,
    },
    hover: {
        scale: 1.5,
        borderRadius: "15px",
        transition:{
            duration: 1,
            delay: 0.2,
        }
    },
 
}

const infoVars = {
    hover:{
        borderRadius: "15px",
        opacity: 1,
        transition: {
            type: "tween",
            duration: 1,
            delay: 0.1
        }
    }
}

// ------------------------------------------------------------------


function Search(){
    const location = useLocation();
    console.log(location)
    const keyword = new URLSearchParams(location.search).get("keyword");
    console.log(keyword);

    const {data:search_Movie}  = useQuery<ISearchMovie>(["movie" ,"search"], ()=>Search_Movies(keyword+""))

    console.log(search_Movie);
console.log(Box);


const [index,setIndex] = useState(0);

    return (
        <Wrapper>
            <SearchSlider>
                <AnimatePresence>
                <Row
                variants={rowVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type:"tween", duration: 1}}
                key={index}
                >
                {search_Movie?.results.filter((movie) => movie.poster_path !== null).map((movie) => 
               <Box
                variants={boxVars}
                initial="initial"
                whileHover="hover"
                transition={{type: "tween"}}
                key={movie.id} 
                bgphoto={makeImagePath(movie.poster_path, "w500")}>
                    <Info variants={infoVars}><h4>{movie.title}</h4></Info>
                </Box>)
                 }
                {search_Movie?.results.length === 0 ? <NotFound>NOT FOUND</NotFound>:null}
                </Row>
                </AnimatePresence>
            </SearchSlider>
        </Wrapper>
    )
}

export default Search;