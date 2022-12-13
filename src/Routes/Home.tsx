import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useLocation, useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getMovies, getPopularMovies, IGetMoviesResult, IMovieDetailsVideo,Now_Playing_MovieDetails,Popular_MovieDetails } from "../api";
import { makeImagePath } from "../untills";
import ReactPlayer from "react-player";


const Wrapper = styled.div`
background: black;
height: 300%;
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
height: 30em;
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
    font-family: system-ui;
}
`;

const infoVars = {
    hover:{
        borderRadius: "15px",
        opacity: 1,
        transition: {
            delay: 0.5,
            duaration: 0.3,
            type: "tween",
          },
    },
}





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
width: 49vw;
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
line-height: 2.5;
font-family: Georgia, serif;
`;

const BigVideo = styled.div`
display: flex;
justify-content: center;
margin-top: -180px;
margin-left: 80px;
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
//--------------------------------------------------------------------


const FirstSlider = styled.h3`
padding: 10px;
margin-bottom: 100px;
margin-top: 5%;
font-size: 40px;
`;

const SecondSlider = styled.h3`
font-size: 40px;
margin-top: 30%;
padding: 10px;
margin-bottom: 10px;
`;


//--------------------------------------------------------------------

const PopularSlider = styled(motion.div)`
position:relative;
top: -5px;
`;

const PopularRow = styled(motion.div)`
display: grid;
grid-template-columns: repeat(6,1fr);
gap: 5px;
position:absolute;
width:100%;
`;

const PopularBox = styled(motion.div)<{bgphoto:string}>`
background-color: white;
background-image: url(${(props) => props.bgphoto});
height: 30em;
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



function Home(){
const offset = 6;
//--------------------------------------------------------------------    
const navigate  = useNavigate();
const Now_Playing_MovieMatch = useMatch("/movies/:movieId");
//console.log(Now_Playing_MovieMatch)
const Popular_MovieMatch = useMatch("/movies/popular/:movieId");


const {scrollY} = useScroll();


const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
//console.log(data, isLoading);


const {data:popularData, isLoading:popularLoading} = useQuery<IGetMoviesResult>(
    ["movies", "popular"], getPopularMovies);  
//console.log(popularData, popularLoading);

const id = useParams();
//console.log(id)

const clickedMovie = Now_Playing_MovieMatch?.params.movieId && data?.results.find(movie => movie.id+"" === Now_Playing_MovieMatch.params.movieId)
//console.log(clickedMovie);
//console.log(Now_Playing_MovieMatch?.params.movieId);

const clickedPopularMovie = Popular_MovieMatch?.params.movieId && popularData?.results.find(movie => movie.id+"" === Popular_MovieMatch.params.movieId)
//console.log(clickedPopularMovie);
//console.log(Popular_MovieMatch?.params.movieId);

const movieId = Number(id.movieId);

const {data:detailNow_Video, isLoading:detailNow_loading} = useQuery<IMovieDetailsVideo>(["smallVideo","nowDetail"], 
()=>Now_Playing_MovieDetails(movieId),
{enabled: !!movieId} // movieId가 존재할때까지 쿼리를 실행하지 않는다
);
//console.log(detailNow_Video);

const {data:detailPopular_Video, isLoading:detailPopular_loading} = useQuery<IMovieDetailsVideo>(["smallVideo", "popularDetail"],
()=>Popular_MovieDetails(movieId),
{enabled: !!movieId}
);

//console.log(detailPopular_Video)

//--------------------------------------------------------------------


const [index,setIndex] = useState(0);
const [leaving, setLeaving] = useState(false);
const [popindex,setpopIndex] = useState(0);

//--------------------------------------------------------------------


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

const popularIndex = () => {
    if(popularData){
        if(leaving) return;
        toggleLeaving();
        const totalMovies = popularData?.results.length - 1;
        const maxIndex = Math.floor(totalMovies/offset) - 1;
        setpopIndex(current => current === maxIndex ? 0 : current+1)
        }
}

const toggleLeaving = () => {
    setLeaving(current => !current);
};

//--------------------------------------------------------------------


const Now_playing_BoxClicked = (movieId:number) => {
navigate(`/movies/${movieId}`)
}

const Popular_BoxCliked = (movieId:number) => {
    navigate(`/movies/popular/${movieId}`)
    }

//--------------------------------------------------------------------


const onOverlayClick = () => {
navigate(-1);
}



    return (
    <Wrapper>
        {isLoading ? 
        <Loader>Loading...</Loader> 
        :
        <>
        <Banner
        bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
           {/* || ""(fallback) 쓴 이유는 
           data가 정의 되지않거나 api에서 data가 안옴 방지 */}
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
        </Banner>
        </>}
        {/* <></>는 공통된 부모없이 연이어서 리턴할수있는 방법 */}


        <FirstSlider onClick={increaseIndex}>Now Playing</FirstSlider>
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
            onClick={() => Now_playing_BoxClicked(movie.id)}
            variants={boxVars}
            initial="normal"
            key={movie.id}
            whileHover="hover"
            transition={{type: "tween"}}
            bgphoto={
                makeImagePath(movie.poster_path, "w500")}
            > 
   
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
            {Now_Playing_MovieMatch ? (<>
            <Overlay
            onClick={onOverlayClick}
            animate={{opacity: 1}}
            exit={{
                opacity: 0
            }}
            />
            <BigMovie
            variants={bigmovieVars}
            whileInView="hover"
            style={{top:scrollY.get()-80, bottom: scrollY.get()+10}}
            layoutId={Now_Playing_MovieMatch.params.movieId}>
            {clickedMovie && 
            <>
            <BigCover
             style={{
        backgroundImage: `linear-gradient(to top,black, transparent), url(${makeImagePath(
        clickedMovie.poster_path,
        "w500")})`,}} />
            <BigTitle>{clickedMovie.title}</BigTitle>
            <h2 style={{padding: "10px", marginLeft: "7%"}}>Release_Date:</h2>
            <BigDate>{clickedMovie.release_date}</BigDate>
            <h2 style={{padding: "10px", marginLeft: "7%"}}>Vote_Average:</h2>
        <BigVote>{clickedMovie.vote_average}</BigVote>
        { detailNow_Video?.results.length !== 0 ? 
        <BigVideo>
         <ReactPlayer
         url={`https://www.youtube.com/watch?v=${detailNow_Video?.results[0].key}`}
         className="react-player"
         width="27vw"
         height="45vh"
         playing={true}
         muted={false}
         controls={true}
         light={true}
         sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation allow-presentation"
         />
         </BigVideo>
         : <UnpreparedPreview>Preview is coming soon...</UnpreparedPreview> } 
            {clickedMovie.overview !== "" ? <BigOverview>{clickedMovie.overview}</BigOverview>
            : <UnpreparedOverview>OverView is coming soon...</UnpreparedOverview>
        }
            </>  }
    
            </BigMovie>
           </>) : null}

           {/* <></> (fragment)를 쓰는 이유는 서로 붙어있지만 분리된 컴포넌트를 반환하기 위해서이다 */}
        </AnimatePresence>



        <SecondSlider onClick={popularIndex}>Popular</SecondSlider>
        <PopularSlider>
            <AnimatePresence 
            initial={false}
            onExitComplete={toggleLeaving}
            >
     
            <PopularRow variants={rowVars}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{type:"tween", duration: 1}}
            key={popindex}>
            {popularData?.results
            .slice(offset*popindex, offset*popindex+offset)
            .map((movie)=>
            <PopularBox 
            layoutId={movie.id+""}
            onClick={() => Popular_BoxCliked(movie.id)}
            variants={boxVars}
            initial="normal"
            key={movie.id}
            whileHover="hover"
            transition={{type: "tween"}}
            bgphoto={makeImagePath(movie.poster_path, "w500")}
            >
   
            <Info variants={infoVars}><h4>{movie.title}</h4>
            </Info>
            
            </PopularBox>
            
            )}

            </PopularRow>
            </AnimatePresence>
        </PopularSlider>

    <AnimatePresence>
            {Popular_MovieMatch ? (<>
            <Overlay
            onClick={onOverlayClick}
            animate={{opacity: 1}}
            exit={{
                opacity: 0
            }}
            />
            <BigMovie
            style={{top:scrollY.get()-120, bottom: scrollY.get()+10}}
            layoutId={Popular_MovieMatch.params.movieId}>
            {clickedPopularMovie && 
            <>
            <BigCover
             style={{
        backgroundImage: `linear-gradient(to top,black, transparent), url(${makeImagePath(
        clickedPopularMovie.backdrop_path,
        "w500")})`,}} />
            <BigTitle>{clickedPopularMovie.title}</BigTitle>
            <h2 style={{padding: "10px",marginLeft: "7%"}}>Release_Date:</h2>
            <BigDate>{clickedPopularMovie.release_date}</BigDate>
            <h2 style={{padding: "10px",marginLeft: "7%"}}>Vote_Average:</h2>
        <BigVote>{clickedPopularMovie.vote_average}</BigVote>
        { detailNow_Video?.results.length !== 0 ? 
        <BigVideo>
         <ReactPlayer
         url={`https://www.youtube.com/watch?v=${detailNow_Video?.results[0].key}`}
         className="react-player"
         width="27vw"
         height="45vh"
         playing={true}
         muted={false}
         controls={true}
         light={true}
         sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation allow-presentation"
         />
         </BigVideo>
         : <UnpreparedPreview>Preview is coming soon...</UnpreparedPreview> }

        {clickedPopularMovie.overview !== "" ? <BigOverview>{clickedPopularMovie.overview}</BigOverview>
            : <UnpreparedOverview>OverView is coming soon...</UnpreparedOverview>
        }
        </>}
            </BigMovie>
           </>) : null}
        </AnimatePresence>

</Wrapper>
)}

export default Home;