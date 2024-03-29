import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {

  return (
    <>
<BrowserRouter>
<Header /> 
<Routes>
<Route path="/*" element={<Home/>}/>
<Route path="/movies/:movieId" element={<Home/>}/>
<Route path="/movies/popular/:movieId" element={<Home/>}/>
<Route path="/movies/top_rated/:movieId" element={<Home/>}/>
<Route path="/movies/upcoming/:movieId" element={<Home/>}/>
<Route path="/movies/:movieId/videos" element={<Home/>}/>
<Route path="/tv" element={<Tv/>}/>   
<Route path="/tv/:tvId" element={<Tv />} />   
<Route path="/tv/popular/:tvId" element={<Tv/>}/>
<Route path="/tv/on_air/:tvId" element={<Tv/>}/>
<Route path="/search" element={<Search/>}/> 
<Route path="/search/movie/:movieId" element={<Search/>}/> 
<Route path="/search/tv/:tvId" element={<Search/>}/> 
</Routes>
</BrowserRouter>
    </>
  );
}

export default App;
