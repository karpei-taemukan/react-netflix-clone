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
gap: 5px;
position:absolute;
width:100%;
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

// ------------------------------------------------------------------

const rowVars = {
    hidden:{
    x:window.outerWidth-10,
    },
    visible:{
        x:0,
    },
    exit:{
        x:-window.outerWidth+10,
    },
}


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
               <Box key={movie.id} bgphoto={makeImagePath(movie.poster_path, "w500")}></Box>)
                 }
                </Row>
                </AnimatePresence>
            </SearchSlider>
        </Wrapper>
    )
}

export default Search;