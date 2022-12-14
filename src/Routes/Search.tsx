import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
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
margin-left: 220%;
`;

const Overlay = styled(motion.div)`
position: fixed;
top:0;
width:100%;
height:100%;
background-color: red;
`;

const BigMovie = styled(motion.div)`
position: absolute;
width: 50vw;
height: 130vh;
left: 0;
right: 0;
margin: 0 auto;
border: 5px solid white;
background-color: rgba(0, 0, 0, 1);
z-index:99;
`;


//--------------------------------------------------------------------


const BigCover = styled.div`
width: 49.5vw;
height: 50vh;
background-size: cover;
background-position: center center;
border-bottom: 1px solid white;
`;

const BigTitle = styled.h2`
color: ${(props) => props.theme.white.lighter};
padding: 10px;
position: relative;
top: -80px;
font-size: 30px;
font-family: system-ui;
`;

const BigOverview = styled.p`
padding: 10px;
color: ${(props) => props.theme.white.lighter};
text-align: center;
text-indent: 5%;
font-family: Georgia, serif;
`;

const BigVideo = styled.div`
display: flex;
justify-content: center;
margin-top: -200px;
margin-left: 100px;
`;

const BigDate = styled.h3`
font-size: 20px;
padding: 10px;
font-family: cursive;
margin-left: 7%;
`;

const BigVote = styled.h3`
font-size: 20px;
padding: 10px;
font-family: cursive;
margin-left: 7%;
`;

const UnpreparedPreview = styled.h2`
font-size: 20px;
text-align: center;
position: absolute;
left: 40%;
bottom: 50%;
`;
const UnpreparedOverview = styled.h2`
font-size: 36px;
text-align: center;
margin-top: 50px;
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

const bigmovieVars = {
    hover: {
        scale: 1,
        borderRadius: "15px",
    }
}

// ------------------------------------------------------------------




function Search(){
const location = useLocation();
console.log(location)
console.log(location.search);
const navigate = useNavigate();


const keyword = new URLSearchParams(location.search).get("keyword");
//console.log(keyword);


const {data:search_Movie} = useQuery<ISearchMovie>(["movie" ,"search"], ()=>Search_Movies(keyword+""))

const Search_MovieMatch = useMatch("/search?keyword");
console.log(Search_MovieMatch) // null 안나오게 해야함
 
const Search_MovieClicked = () => {
    navigate(`/search${location.search}/details`);
}


const onOverlayClick = () => {
    navigate(-1);
}

// ------------------------------------------------------------------

const [index,setIndex] = useState(0);
// ------------------------------------------------------------------



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
                onClick={Search_MovieClicked}
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
            <AnimatePresence>
                {Search_MovieMatch ? (<>
                <Overlay
                onClick={onOverlayClick} 
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                /> 
                <BigMovie
                variants={bigmovieVars}
                whileHover="hover"
                >

                </BigMovie>
                </>):null}
            </AnimatePresence>
        </Wrapper>
    )
}

export default Search;