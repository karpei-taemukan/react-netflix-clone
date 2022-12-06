import { useQuery } from "@tanstack/react-query";
import { click } from "@testing-library/user-event/dist/click";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../untills";

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


//--------------------------------------------------------------------


const Slider = styled(motion.div)`
position:relative;
top: -100px;
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

//--------------------------------------------------------------------

const boxVars = {
    normal:{
        scale: 1,
    },
    hover:{
        scale: 1.3,
        y:-50,
        transition:{
            duration: 0.3,
            delay: 0.3,
            type:"tween"
        }
    }
}


//--------------------------------------------------------------------


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
}
`;

const infoVars = {
    hover:{
        opacity: 1,
        transition: {
            delay: 0.5,
            duaration: 0.3,
            type: "tween",
          },
    },
}

/*const Thumb = styled(motion.div)`
display: flex;
justify-content: space-around;
align-items: center;
`;

const Like = styled(motion.svg)`
width: 30px;
height: 30px;
`

const Dislike = styled(motion.svg)`
width: 30px;
height: 30px;
`*/
//--------------------------------------------------------------------


const Overlay = styled(motion.div)`
position: fixed;
top:0;
width:100%;
height:100%;
background-color: rgba(0,0,0,0.5);
`;

const BigMovie = styled(motion.div)`
position: absolute;
width: 50vw;
height: 80vh;
left: 0;
right: 0;
margin: 0 auto;
border-radius: 15px;
background-color: ${(props) => props.theme.black.lighter};
`;


//--------------------------------------------------------------------


const BigCover = styled.div`
width: 50vw;
height: 50vh;
background-size: cover;
background-position: center center;
`;

const BigTitle = styled.h2`
color: ${(props) => props.theme.white.lighter};
padding: 10px;
position: relative;
top: -80px;
font-size: 30px;
`;

const BigOverview = styled.p`
padding: 10px;
color: ${(props) => props.theme.white.lighter};
`;

function Home(){
    const offset = 6;

//--------------------------------------------------------------------    
const navigate  = useNavigate();
const bigMovieMatch = useMatch("/movies/:movieId");
//console.log(bigMovieMatch)

const {scrollY} = useScroll();
    const {data, isLoading} = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"], 
    getMovies);
// console.log(data, isLoading);

//--------------------------------------------------------------------

const [index,setIndex] = useState(0);
const [leaving, setLeaving] = useState(false);
//const [likeThumb, setLikethumb] = useState(false);
//const [dislikeThumb, setDislikethumb] = useState(false);

//--------------------------------------------------------------------
const increaseIndex = () => {
    if(data){
    if(leaving) return; //  return;함으로써 애니메이션이 움직이는 걸 막는다
    toggleLeaving();
    const totalMovies = data?.results.length - 1;
    const maxIndex = Math.floor(totalMovies/offset) - 1;
    setIndex(current => current === maxIndex ? 0 : current+1)
    }
};
const toggleLeaving = () => {
    setLeaving(current => !current);
};


const onBoxCliked = (movieId:number) => {
navigate(`/movies/${movieId}`)
}

{/*const toggleLikethumb = () => {
    setLikethumb(current => !current);
}

const likeVars = {
initial:{
    scale: 1,
    fill: "black"
},
end: {
    scale: 1,
    fill: "blue"
}
}
const toggleDislikethumb = () => {
    setDislikethumb(current => !current);
}*/}

//--------------------------------------------------------------------


const onOverlayClick = () => {
navigate(-1);
}
const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => movie.id+"" === bigMovieMatch.params.movieId)
console.log(clickedMovie);



    return (
    <Wrapper>
        {isLoading ? 
        <Loader>Loading...</Loader> 
        :
        <>
        <Banner onClick={increaseIndex}
        bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
           {/* || ""(fallback) 쓴 이유는 
           data가 정의 되지않거나 api에서 data가 안옴 방지 */}
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
        </Banner>
        </>}
        {/* <></>는 공통된 부모없이 연이어서 리턴할수있는 방법 */}
        <Slider>
            <AnimatePresence 
            initial={false}
            onExitComplete={toggleLeaving}
            >
            {/* initial={false} 처음 mount될때 오른쪽에서 들어오지 않는다 */}
            {/* onExitComplete exit될 때 실행*/}
            <Row variants={rowVars}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{type:"tween", duration: 1}}
            key={index}>
            {data?.results.slice(1)
            .slice(offset*index, offset*index+offset)
            .map((movie)=>
            <Box 
            layoutId={movie.id+""}
            onClick={() => onBoxCliked(movie.id)}
            variants={boxVars}
            initial="normal"
            key={movie.id}
            whileHover="hover"
            transition={{type: "tween"}}
            bgphoto={makeImagePath(movie.backdrop_path, "w500")}
            >
            {/*<Thumb>
            <Like
            variants={likeVars}
            initial="initial"
            whileFocus="end"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512">
            <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 25.3-19.5 46-44.3 47.9c7.7 8.5 12.3 19.8 12.3 32.1c0 23.4-16.8 42.9-38.9 47.1c4.4 7.2 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"/>
            </Like>
            <Dislike 
            onClick={toggleDislikethumb}
            style={{fill: dislikeThumb ? "blue" : "black" }}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512">
            <path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-25.3-19.5-46-44.3-47.9c7.7-8.5 12.3-19.8 12.3-32.1c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 320H96c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64V288c0 17.7 14.3 32 32 32z"/>
            </Dislike>
            </Thumb>*/}
            <Info variants={infoVars}><h4>{movie.title}</h4>
            </Info>
            
            </Box>
            
            )}
            
            {/*  $$$
            부모컴포넌트에 variants가 있다면 자식 컴포넌트에도 variants가 상속된다 
            즉, 
           <Box variants={boxVars}  whileHover="hover">
           <Info  whileHover="hover"/>
           </Box>
                $$$
            */}

            </Row>
            </AnimatePresence>
        </Slider>
        <AnimatePresence>
            {bigMovieMatch ? (<>
            <Overlay
            onClick={onOverlayClick}
            animate={{opacity: 1}}
            exit={{
                opacity: 0
            }}
            />
            <BigMovie
            style={{top:scrollY.get()+100, bottom: scrollY.get()+100}}
            layoutId={bigMovieMatch.params.movieId}>
            {clickedMovie && 
            <>
            <BigCover
             style={{
        backgroundImage: `linear-gradient(to top,black, transparent), url(${makeImagePath(
        clickedMovie.backdrop_path,
        "w500")})`,}} />
            <BigTitle>{clickedMovie.title}</BigTitle>
            <BigOverview>{clickedMovie.overview}</BigOverview>
            </> }
            </BigMovie>
           </>) : null}

           {/* <></> (fragment)를 쓰는 이유는 서로 붙어있지만 분리된 컴포넌트를 반환하기 위해서이다 */}
        </AnimatePresence>
</Wrapper>
)}

export default Home;