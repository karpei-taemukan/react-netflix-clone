import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTvShow } from "../api";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useLocation, useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getMovies, getPopularMovies, IGetMoviesResult, IMovieDetailsVideo,Now_Playing_MovieDetails,Popular_MovieDetails } from "../api";
import { makeImagePath } from "../untills";
import ReactPlayer from "react-player";
const Wrapper = styled.div`
background: black;
`;

const Loader = styled.div`
height: 20vh;
font-size: 200px;
color: white;
display: flex;
justift-content:center;
align-items: center;
`;

const Banner = styled.div<{bgphoto:string}>`
height: 100vh;
display: flex;
flex-direction: column;
justify-content: center;
padding: 60px;
background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
url(${(props) => props.bgphoto});
background-size: cover;
`;

const Title = styled.h2`
font-size: 50px;
margin-bottom: 10px;
`;

const Overview = styled.p`
font-size: 15px;
width:50%;
`;


const Slider = styled(motion.div)`
position:relative;

top: -100px;
`;

const FirstSlider = styled.h3`
padding: 10px;
margin-bottom: 100px;
margin-top: 5%;
font-size: 40px;
cursor: pointer;
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
height: 60vh;
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
width: 100%;
bottom:0;
h4{
    text-align: center;
    font-size: 8px;
    color: white;
    font-family: system-ui;
}
`;

const rowVars = {
    hidden:{
        x:window.outerWidth-5,
    },
    visible:{
        x:0,
    },
    exit:{
        x:-window.outerWidth+5,
    },
}

const boxVars = {
    normal:{
        scale: 1,
    },
    hover:{
        borderRadius: "15px",
        scale: 1.3,
        y:-50,
        transition:{
            duration: 0.3,
            delay: 0.3,
            type:"tween"
        }
    }
}

const bigmovieVars = {
    hover: {
        scale: 1,
        borderRadius: "15px",
    }
}

function Tv(){
    const offset = 6;
 //--------------------------------------------------------------------
    const {data, isLoading} = useQuery<IGetMoviesResult>(["tvshow", "nowPlaying"], getTvShow);
    console.log(data);

//--------------------------------------------------------------------
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
//--------------------------------------------------------------------
const increaseIndex = () => {
    if(data){
        if(leaving) return;
        toggleLeaving();
        const totalTvshow = data?.results.length-1;
        const maxIndex = Math.floor(totalTvshow/offset)-1;
        setIndex(current => current === maxIndex ? 0 : current+1)
    }
}
const toggleLeaving = () => {
    setLeaving(current => !current);
};

    return (
        <Wrapper>
            {isLoading ?  <Loader>Loading...</Loader> : 
            <>
             <Banner
        bgphoto={makeImagePath(data?.results[0].poster_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
        </Banner>
            </>}
        <FirstSlider onClick={increaseIndex}>Now Playing</FirstSlider>
        <Slider>
        <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        >
          <Row variants={rowVars} 
          initial="hidden"
          animate="visiable"
          exit="exit"
          transition={{type:"tween", duration: 1}}
          key={index}>
          {data?.results
          .slice(1)
          .slice(offset*index, offset*index+offset)
          .map((movie) => 
          <Box 
          layoutId={movie.id+""}
          variants={boxVars}
          initial="normal"
          key={movie.id}
          whileHover="hover"
          transition={{type: "tween"}}
          bgphoto={
        makeImagePath(movie.poster_path, "w500")}>
              <Info><h4>{movie.title}</h4>
            </Info>
        </Box>)}
          </Row>
        </AnimatePresence>
        </Slider>
        </Wrapper>
    
    )
}

export default Tv;