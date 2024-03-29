import React, { useEffect, useState } from "react";
import { motion, useAnimation, useScroll } from "framer-motion";
import { Link, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useForm } from "react-hook-form";


const Nav = styled(motion.nav)`
display: flex;
justify-content: space-between;
align-items: center;
position: fixed;
width: 100%;
top: 0;
background-color: ${(props) => props.theme.black.veryDark};
height: 80px;
font-size: 12px;
`;


// --------------------------------------------------------------------


const Col = styled.div`
display: flex;
align-items: center;
`;


// --------------------------------------------------------------------


const Logo = styled(motion.svg)`
margin-left: 30px;
margin-right: 30px;
width: 95px;
height: 25px;
fill: ${(props) => props.theme.red};
path {
    stroke-width: 6px;
    stroke: white;
}
`;

const logoVariants = {
    normal:{
fillOpacity:1,
pathLength: 0,
fill:"#E51013"
    },
    active:{
        fillOpacity: [0, 1, 0],
        transition: {
            repeat: Infinity,
        }
    },
end:{
    pathLength: 1,
    fill: "#E51013",
}
}


// --------------------------------------------------------------------


const Items = styled.ul`
display: flex;
align-items: center;
`;

const Item = styled.li`
margin-right: 50px;
color: ${(props) => props.theme.white.darker};
transition: color 0.3s ease-in-out;
position: relative;
&:hover {
  color: ${(props) => props.theme.white.lighter};
}
display: flex;
flex-direction: column;
`;

// --------------------------------------------------------------------


const Search = styled.form`
color: white;
display: flex;
align-items: center;
svg {
    height: 25px;
  }
position: relative;
margin-right: 10px;
`;


// --------------------------------------------------------------------


const Circle = styled(motion.span)`
position: absolute;
border-radius: 5px;
bottom: -5px;
left: 0;
right:0;
margin: 0 auto;
width:5px;
height:5px;
background-color: ${(props) => props.theme.red}
`;


// --------------------------------------------------------------------


const Input = styled(motion.input)`
transform-origin: right center;
position:absolute;
right: 0px;
color: white;
font-size: 16px;
border: 1px solid ${(props) => props.theme.white.lighter};
padding: 5px 10px;
padding-left: 30px;
padding-right: 10px;
width: 250px;
background-color: transparent;
z-index: -1;
`;
//transform-origin은 변화가 시작하는 위치
function Header (){
    const homeMatch = useMatch("/");
    const tvMatch = useMatch("/tv");
    //console.log(homeMatch, tvMatch)
    const {scrollY,scrollYProgress} = useScroll();
    // Progress는 얼마나 떨어져있는지 0%~100%의 사이 값으로 나타냄

    const navigate = useNavigate();
// --------------------------------------------------------------------


const inputAnimation = useAnimation();
// 코드를 통해 애니메이션을 실행시키고 싶을때 사용
// 즉, 애니메이션을 동시에 실행시키고 싶을때 유용
const navAnimation = useAnimation();

// --------------------------------------------------------------------

const navVariants = {
  top: {
    backgroundColor:"rgba(0,0,0,1)"
  },
  scroll: {
    backgroundColor:"rgba(0,0,0,0)"
  }
}

// --------------------------------------------------------------------


const [searchOpen, setSearchOpen] = useState(false);
const openSearch = () => {
  if(searchOpen){
    inputAnimation.start({
      scaleX:0,
    });
  }
  else {
    inputAnimation.start({
      scaleX:1,
    });
  }
  setSearchOpen((current) => !current);}

// --------------------------------------------------------------------

useEffect(()=>{
scrollY.onChange(()=>{
/*console.log(scrollY.get())*/
if(scrollY.get() > 80){
  navAnimation.start("scroll")
}
else{
  navAnimation.start("top")
}
})
},[scrollY, navAnimation])


// --------------------------------------------------------------------

interface IForm{
  keyword: string;
}

const {register, handleSubmit, setValue } = useForm<IForm>();

const onValid = (data:IForm) => {
console.log(data);
navigate(`/search?keyword=${data.keyword}`)
//window.location.reload();
}
setValue("keyword", "");
    return (
    <Nav 
    variants={navVariants}
    initial={"top"}
    animate={navAnimation}
    >
    <Col>
    <Logo
    xmlns="http://www.w3.org/2000/svg"
    width="1024"
    height="276.742"
    viewBox="0 0 1024 276.742"
    >
    <motion.path
  variants={logoVariants}
  initial="normal"
  whileHover="active"
  animate="end"
  transition={{
    repeat: Infinity,
      default: {duration: 5},
      fill: {duration: 1, delay: 0.5} 
      }}
     d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"></motion.path>
    </Logo>
        <Items>
            <Link to ="/"> {/* <a>는  페이지를 새로고침한다 같은 도매인 일대 사용하면 안된다*/}
            <Item>Home{homeMatch && <Circle layoutId="circle"/>}</Item>
            </Link>
            <Link to="/tv">
            <Item>Tv Shows{tvMatch ? <Circle layoutId="circle"/>:null}</Item>
            </Link>
            {/*
            layoutId는 서로 다른 컴포넌트를 연결하고 그 두 컴포넌트를 
            애니메이션으로 연결할 수 있게 해주는 도구이다 
            */}
        </Items>
    </Col>
    <Col>
    <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
          style={{marginRight: "20px"}}
          onClick={openSearch}
          animate={{x:searchOpen ? -200 : 0}}
          transition={{type:"linear"}}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/motion.svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
          {...register("keyword", {required: true, minLength:2,})}
          initial={{scaleX: 0}}
          transition={{type:"linear"}}
          animate={inputAnimation}
          placeholder="Search for movie or tv show.." />
        </Search>
    </Col>
    </Nav>
    )
}

export default Header;