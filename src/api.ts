import { useMatch } from "react-router-dom";

const API_KEY = "ec2bd6ce45716cc9418f09264b0aafb5";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
    backdrop_path: string,
    id:number,
    original_language:string,
    original_title:string,
    overview:string,
    poster_path:string,
    title:string,
}

export interface IGetMoviesResult
{
dates: {
    maximum: string,
    minimum: string,
},
page: number,
results: IMovie[],
total_pages: number,
total_results: number
}

interface IMoiveDetail {
    key: string,
}

export interface IMovieDetailsVideo {
    id: number,
    key: string,
    results: IMoiveDetail[] // 따로 작성하는 이유는 results가 여러개이기 때문이다
}

export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=kr`)
    .then(res => res.json());
}

export function getPopularMovies(){
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=en-US&page=2`).then(res=>res.json());
}

export function Now_Playing_MovieDetails(movieId:number){

return fetch(`${BASE_PATH}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`).then(res=>res.json());
}

export function Popular_MovieDetails(){
    const Popular_MovieMatch = useMatch("/movies/popular/:movieId");
    
    const clickedPopularMovie = Popular_MovieMatch?.params.movieId;

    return fetch(`${BASE_PATH}/movie/${clickedPopularMovie}/videos?api_key=${API_KEY}&language=en-US`).then(res=>res.json());
}