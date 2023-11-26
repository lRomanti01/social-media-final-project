import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import { auth } from "../firebase";
import { FaRegMoon, FaSun, FaSearch } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import "../styles/Header.css";

function Header() {
	const [{ user }, dispatch] = useStateValue();
	const [theme, setTheme] = useState()
	const btnToggle = useRef(null)

	const handleAuthenticaton = () => {
		if (user) {
			auth.signOut();
		}
	};

	useEffect(() => {
		if (theme === "light") {
			document.querySelector("body").classList.add(theme);
			setTheme(localStorage.getItem("theme"))
		} else {
			document.querySelector("body").classList.toggle("light");
			setTheme(localStorage.getItem("theme"))
		}
	}, [theme]);

	const handleTheme = () => {
		if (localStorage.getItem("theme") === "light") {
			localStorage.setItem("theme", "dark");
			setTheme('dark')
		} else {
			localStorage.setItem("theme", "light");
			setTheme('light')
		}
	} 

	return (
		<div className="header">
			<Link className="link headerTitle" to="/">
				<h1 className="headerLogo">SocialMedia</h1>
			</Link>

			<div className="headerSearchContainer">
				<input className="headerSearchInput" type="text" />
				<FaSearch />
			</div>
			<div className="break" ></div>

			<div className="headerNavContainer">
				<Link to="/" className="link headerOptionBasket">
					<div className="headerOptionBasket">
						<FaHouse />
					</div>
				</Link>

				<Link to={`/profile/${user?.email}`} className="link headerOptionBasket">
					<div className="headerOptionBasket">
						{user && <img className=" headerAvatar" src={user?.photoURL || `https://avatars.dicebear.com/api/gridy/${user?.email}.svg`} alt={user?.email} title={user?.email}/>}
					</div>
				</Link>

				<Link to={!user ? "/login" : ""} className="link headerOptionBasket">
					<div onClick={handleAuthenticaton} >
						<span className="headerOption">
							<span className="headerOptionLineOne">
								{user ? user.email.split('@')[0] : "Hello Guest"}
							</span>
							<span className="headerOptionLineTwo">
								{user ? "Sign Out" : "Sign In"}
							</span>
						</span>
					</div>
				</Link>
				


			</div>

			<div onClick={() => handleTheme()} ref={btnToggle} className="headerTheme">
				{theme === 'light' ? 
					<FaRegMoon style={{padding: '10px'}}/> : 
					<FaSun style={{padding: '10px'}}/>
				}
				
			</div>
		</div>
	);
}

export default Header;
