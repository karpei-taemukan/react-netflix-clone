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

export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=kr`)
    .then(res => res.json());
}

export function getPopularMovies(){
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=en-US&page=2`).then(res=>res.json());
}