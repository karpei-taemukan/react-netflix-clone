const API_KEY = "ec2bd6ce45716cc9418f09264b0aafb5";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
    params: any;
    backdrop_path: string,
    id:number,
    original_language:string,
    original_title:string,
    overview:string,
    poster_path:string,
    title:string,
    release_date: string,
    vote_average: number,
    name: string
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

export interface ISearchMovie{
    results: IMovie[]
}





export interface IGetTvResults{
    backdrop_path: string | null,
    id:number,
    original_language:string,
    original_title:string,
    overview:string,
    poster_path:string,
    title:string,
    first_air_date: string,
    vote_average: number,
    name: string
}

export interface IGetTvs{
    results:IGetTvResults[],
    total_pages: number,
total_results: number
}

export interface ITvVideoResults{
key:string,
}

export interface ITvVideo{
 results: ITvVideoResults[],
}


interface ISearchTvResults{
    backdrop_path: string | null,
    id:number,
    overview:string,
    poster_path:string,
    first_air_date: string,
    vote_average: number,
    name: string
}

export interface ISearchTv{
    results:ISearchTvResults[]
}


export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=kr`)
    .then(res => res.json());
}

export function getPopularMovies(){
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=en-US&page=2`).then(res=>res.json());
}

export function getTop_RatedMovies(){
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`).then(res=>res.json());
}

export function getUpcomingMovies(){
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`).then(res=>res.json());
}

export function Now_Playing_MovieDetails(movieId:number){

return fetch(`${BASE_PATH}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`).then(res=>res.json());
}

export function Popular_MovieDetails(movieId:number){

    return fetch(`${BASE_PATH}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`).then(res=>res.json());
}



export function getTvShow(){
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=en-US&page=1`).then(res=>res.json());
}

export function getPopularTv(){
    return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=2`).then(res=>res.json());
}

export function getTv_On_the_air(){
    return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=3`).then(res=>res.json());
}

export function get_Tv_Video(tvId:number){
    return fetch(`${BASE_PATH}/tv/${tvId}/videos?api_key=${API_KEY}&language=en-US`).then(res=>res.json());
}

export function get_TvDetails(tvId:number){
    
    return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=en-US`).then(res=>res.json());
}







export function Search_Movies(keyword:string){
    return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`).then(res=>res.json());
}


export function Search_Tvs(keyword:string){
    return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`).then(res=>res.json());
}