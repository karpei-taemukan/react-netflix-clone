import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Search_Movies,ISearchMovie, Now_Playing_MovieDetails, IMovieDetailsVideo,ISearchTv,Search_Tvs } from "../api";
import styled from "styled-components";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import {useMatch, useNavigate, useParams } from "react-router-dom";
import { makeImagePath } from "../untills";
import ReactPlayer from "react-player";
import {Helmet} from "react-helmet";

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

// --------------------------------------------------------------------------



const MovieSearchSlider = styled(motion.div)`
position:relative;
top: 100px;
`;

const TvSearchSlider = styled(motion.div)`
position: relative;
top: 1700px;
`;

const MovieSearchHead = styled(motion.h1)`
position: absolute;
font-size: 5em;
top: 20%;

cursor: pointer
`;

const TvSearchHead = styled(motion.h1)`
position: absolute;
font-size: 5em;
top: 1000px;
cursor: pointer
`;

const Row = styled(motion.div)`
display: grid;
grid-template-columns: repeat(6,1fr);
gap: 10px;
position:absolute;
margin-top: 10%;
top: 100px;
width:100%;
height: 100%;
`;

const Box = styled(motion.div)<{bgphoto:string}>`
background-color: white;
background-image: url(${(props) => props.bgphoto});
height: 300px;
color:red;
margin-top: 20%;
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
const TvBox = styled(motion.div)<{bgphoto:string}>`
background-color: white;
background-image: url(${(props) => props.bgphoto});
height: 300px;
margin-top: -200%;
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
height:120%;
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
z-index:98;
`;


//--------------------------------------------------------------------


const BigCover = styled.div`
width: 49.5vw;
height: 50vh;
background-size: cover;
background-position: left 10% bottom 70%;
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
font-family: Georgia, serif;
line-height: 32px;
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
bottom: 52%;
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
    
const offset = 6;

const location = useLocation();
//console.log(location)

const navigate = useNavigate();
const {scrollY} = useScroll();

const keyword = new URLSearchParams(location.search).get("keyword");
//console.log(keyword);

const Search_MovieMatch = useMatch("/search/movie/:movieId");
//console.log(Search_MovieMatch) 
 
const Search_TvMatch = useMatch("/search/tv/:tvId");
//console.log(Search_TvMatch);
const id = useParams();
//console.log(id)

const movieId = Number(id.movieId);
const tvId = Number(id.tvId);


const {data:search_Movie, isLoading} = useQuery<ISearchMovie>(["movies" ,"search"], ()=>Search_Movies(keyword+""), {enabled: !!keyword})
console.log(search_Movie);

const {data:search_Tv} = useQuery<ISearchTv>(["tvs", "search"], ()=>Search_Tvs(keyword+""), {enabled: !!keyword})

console.log(search_Tv);

const {data:detailNow_Video, isLoading:detailNow_loading} = useQuery<IMovieDetailsVideo>(["smallVideo","nowDetail"], 
()=>Now_Playing_MovieDetails(movieId),
{enabled: !!movieId} 
);





const clickedMovie = Search_MovieMatch?.params.movieId && search_Movie?.results.find(movie => movie.id+"" === Search_MovieMatch.params.movieId)
//console.log(clickedMovie);


const clickedTv = Search_TvMatch?.params.tvId && search_Tv?.results.find(tv => tv.id+"" === Search_TvMatch?.params.tvId);
//console.log(clickedTv)

// clickedTv 부분 만들기


// ------------------------------------------------------------------

const [searchMovieindex,setSearchMovieIndex] = useState(0);
const [leaving, setLeaving] = useState(false);
const [searchTvindex,setSearchTvIndex] = useState(0);

// ------------------------------------------------------------------


const SearchMovieIndex = () => {
    if(search_Movie){
    if(leaving) return; //  return;함으로써 애니메이션이 움직이는 걸 막는다
    toggleLeaving();
    const totalMovies = search_Movie?.results.length - 1;
    const maxIndex = Math.floor(totalMovies/offset) - 1;
    setSearchMovieIndex(current => current === maxIndex ? 0 : current+1)
    }
};

const SearchTvIndex = () => {
    if(search_Tv){
    if(leaving) return; //  return;함으로써 애니메이션이 움직이는 걸 막는다
    toggleLeaving();
    const totalMovies = search_Tv?.results.length - 1;
    const maxIndex = Math.floor(totalMovies/offset) - 1;
    setSearchTvIndex(current => current === maxIndex ? 0 : current+1)
    }
};

const toggleLeaving = () => {
    setLeaving(current => !current);
};


const Search_MovieClicked = (keyword:string, movieId:number) => {
    navigate(`/search/movie/${movieId}/?keyword=${keyword}`);
}
const Search_TvClicked = (keyword:string, tvId:number) => {
    navigate(`/search/tv/${tvId}/?keyword=${keyword}`);
}

const onOverlayClick = () => {
    navigate(-1);
}

    return (
        <Wrapper>
    <Helmet>  
    <title>NETFLIX</title>
    <link rel="icon" href="https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI" />
    </Helmet>
                 {isLoading ? 
        <Loader>Loading...</Loader> 
        :
        <>
        <MovieSearchHead onClick={SearchMovieIndex}>Movies</MovieSearchHead>
      <MovieSearchSlider>
                <AnimatePresence
                   initial={false}
                   onExitComplete={toggleLeaving}
                >
                <Row
                variants={rowVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type:"tween", duration: 1}}
                key={searchMovieindex}
                >
                {search_Movie?.results.filter((movie) => movie.poster_path !== null).slice(offset*searchMovieindex, offset*searchMovieindex+offset).map((movie) => 
               <Box
                onClick={()=>Search_MovieClicked(keyword+"", movie.id)}
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
            </MovieSearchSlider>

            <AnimatePresence>
                {Search_MovieMatch ? (<>
                <Overlay
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                onClick={onOverlayClick}
                />
                
                <BigMovie
                variants={bigmovieVars}
                whileHover="hover"
                style={{top:scrollY.get()-120, bottom: scrollY.get()+10}}
                >
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
         width="30vw"
         height="60vh"
         playing={true}
         muted={false}
         controls={true}
         light={true}
         sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation allow-presentation"
         />
         </BigVideo> : <UnpreparedPreview>Preview is coming soon...</UnpreparedPreview> 
        }
        {detailNow_Video?.results.length !== 0 ? 
       <BigOverview>{clickedMovie.overview}</BigOverview> : clickedMovie.overview !== "" ? <BigOverview style={{marginTop: "20%"}}>{clickedMovie.overview}</BigOverview>
       : <UnpreparedOverview style={{marginTop: "20%"}}>OverView is coming soon...</UnpreparedOverview>
        }
    
                </>
                }
                </BigMovie>
                </>):null}
                </AnimatePresence>
        </>}
  

               <TvSearchHead onClick={SearchTvIndex}>Tv Show</TvSearchHead>
            <TvSearchSlider>
            <AnimatePresence
               initial={false}
               onExitComplete={toggleLeaving}
            >
                <Row
                variants={rowVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type:"tween", duration: 1}}
                key={searchTvindex}
                >
                {search_Tv?.results.filter((movie) => movie.backdrop_path !== null).slice(offset*searchTvindex, offset*searchTvindex+offset).map((movie) => 
               <TvBox
                onClick={()=>Search_TvClicked(keyword+"", movie.id)}
                variants={boxVars}
                initial="initial"
                whileHover="hover"
                transition={{type: "tween"}}
                key={movie.id} 
                bgphoto={makeImagePath(movie.poster_path, "w500")}>
                    <Info variants={infoVars}><h4>{movie.name}</h4></Info>
                </TvBox>)
                }

                {search_Tv?.results.length === 0 ? <NotFound>NOT FOUND</NotFound>:null}
                </Row>

                </AnimatePresence>
            </TvSearchSlider>



            

        <AnimatePresence>
                {Search_TvMatch ? (<>
                <Overlay
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                onClick={onOverlayClick}
                />
                
                <BigMovie
                variants={bigmovieVars}
                whileHover="hover"
                style={{top:scrollY.get()-120, bottom: scrollY.get()+10}}
                >
                {clickedTv && 
                <>
            <BigCover
             style={{
        backgroundImage: `linear-gradient(to top,black, transparent), url(${makeImagePath(
        clickedTv.poster_path,
        "w500")})`,}} />
     <BigTitle>{clickedTv.name}</BigTitle>
            <h2 style={{padding: "10px", marginLeft: "45%", marginBottom: "5%"}}>Release_Date:</h2>
            <BigDate style={{marginLeft: "45%", marginBottom: "5%"}}>{clickedTv.first_air_date}</BigDate>
            <h2 style={{padding: "10px", marginLeft: "45%", marginBottom: "5%"}}>Vote_Average:</h2>
        <BigVote style={{padding: "10px",marginLeft: "50%", marginBottom: "5%"}}>{clickedTv.vote_average}</BigVote>

        {detailNow_Video?.results.length !== 0 ? 
       <BigOverview>{clickedTv.overview}</BigOverview> : clickedTv.overview !== "" ? <BigOverview style={{marginTop: "20%"}}>{clickedTv.overview}</BigOverview>
       : <UnpreparedOverview style={{marginTop: "20%"}}>OverView is coming soon...</UnpreparedOverview>
        }
    
                </>
                }
                </BigMovie>
                </>):null}
                </AnimatePresence>

  
          
        </Wrapper>
    )
}

export default Search;