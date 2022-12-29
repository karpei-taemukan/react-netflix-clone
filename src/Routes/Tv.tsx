import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useLocation, useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getTvShow, getPopularTv, IGetMoviesResult, IMovieDetailsVideo,get_TvDetails,Popular_MovieDetails,ITvVideo,get_Tv_Video } from "../api";
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
//--------------------------------------------------------------------


const FirstSlider = styled.h3`
padding: 10px;
margin-bottom: 100px;
margin-top: 5%;
font-size: 40px;
cursor: pointer;
`;

const SecondSlider = styled.h3`
font-size: 40px;
margin-top: 40%;
padding: 10px;
margin-bottom: 10px;
cursor: pointer;
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



function Tv(){
const offset = 6;
//--------------------------------------------------------------------    
const navigate  = useNavigate();
const Now_Playing_MovieMatch = useMatch("/tv/:tvId");
//console.log(Now_Playing_MovieMatch)
const Popular_MovieMatch = useMatch("/tv/popular/:tvId");


const {scrollY} = useScroll();


const {data, isLoading} = useQuery<IGetMoviesResult>(["tvs", "nowPlaying"], getTvShow);
console.log(data, isLoading);


const {data:popularData, isLoading:popularLoading} = useQuery<IGetMoviesResult>(
    ["tvs", "popular"], getPopularTv);  
//console.log(popularData, popularLoading);

const id = useParams();

//console.log(id)

const clickedTv = Now_Playing_MovieMatch?.params.tvId && data?.results.find(movie => movie.id+"" === Now_Playing_MovieMatch.params.tvId);

const clickedPopularTv = Popular_MovieMatch?.params.tvId && popularData?.results.find(movie => movie.id+"" === Popular_MovieMatch.params.tvId)

const tvId = Number(id.tvId);

const {data:detailNow_Tv, isLoading:detailNow_loading} = useQuery<IMovieDetailsVideo>(["smallVideo","nowDetail"], 
()=>get_TvDetails(tvId),
{enabled: !!tvId} 
);

//console.log(detailNow_Tv)

const {data:detailPopular_Video, isLoading:detailPopular_loading} = useQuery<IMovieDetailsVideo>(["smallVideo", "popularDetail"],
()=>get_TvDetails(tvId),
{enabled: !!tvId}
);

const {data:tv_video} = useQuery<ITvVideo>(["smallVideo","tvdetail"], ()=>get_Tv_Video(tvId),{enabled: !!tvId} )
console.log(tv_video);

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


const Now_playing_BoxClicked = (tvId:number) => {
navigate(`/tv/${tvId}`)
}

const Popular_BoxCliked = (tvId:number) => {
    navigate(`/tv/popular/${tvId}`)
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
   
            <Info variants={infoVars}><h4>{movie.name}</h4>
            </Info>
            
            </Box>
            
            )}
        

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
            layoutId={Now_Playing_MovieMatch.params.tvId}>
            {clickedTv && 
            <>
            <BigCover
             style={{
        backgroundImage: `linear-gradient(to top,black, transparent), url(${makeImagePath(
        clickedTv.poster_path,
        "w500")})`,}} />
            <BigTitle>{clickedTv.title}</BigTitle>
            <h2 style={{padding: "10px", marginLeft: "7%"}}>Release_Date:</h2>
            <BigDate>{clickedTv.release_date}</BigDate>
            <h2 style={{padding: "10px", marginLeft: "7%"}}>Vote_Average:</h2>
        <BigVote>{clickedTv.vote_average}</BigVote>
    
            </>  }
    
            </BigMovie>
           </>) : null}

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
   
            <Info variants={infoVars}><h4>{movie.name}</h4>
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
               variants={bigmovieVars}
               whileInView="hover"
            style={{top:scrollY.get()-120, bottom: scrollY.get()+10}}
            layoutId={Popular_MovieMatch.params.tvId}>
            {clickedPopularTv && 
            <>
            <BigCover
             style={{
        backgroundImage: `linear-gradient(to top,black, transparent), url(${makeImagePath(
        clickedPopularTv.backdrop_path,
        "w500")})`,}} />
            <BigTitle>{clickedPopularTv.title}</BigTitle>
            <h2 style={{padding: "10px",marginLeft: "7%"}}>Release_Date:</h2>
            <BigDate>{clickedPopularTv.release_date}</BigDate>
            <h2 style={{padding: "10px",marginLeft: "7%"}}>Vote_Average:</h2>
        <BigVote>{clickedPopularTv.vote_average}</BigVote>
       

        {clickedPopularTv.overview !== "" ? <BigOverview>{clickedPopularTv.overview}</BigOverview>
            : <UnpreparedOverview>OverView is coming soon...</UnpreparedOverview>
        }
        </>}
            </BigMovie>
           </>) : null}
        </AnimatePresence>

</Wrapper>
)}

export default Tv;