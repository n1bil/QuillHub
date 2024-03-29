import { Link, Outlet, useNavigate } from "react-router-dom";
import darkLogo from "../assets/logo-color-dark.png";
import lightLogo from "../assets/logo-color-light.png";
import { useContext, useEffect, useState } from "react";
import { ThemeContext, UserContext } from "../App";
import { UserNavigationPanel } from "./UserNavigationPanel";
import axios from "axios";
import { storeInSession } from "../common/session";

export const Navbar = () => {
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [ userNavPanel, setUserNavPanel ] = useState(false);
    const {userAuth, userAuth: { access_token, profile_img, new_notification_available }, setUserAuth} = useContext(UserContext);
    const { theme, setTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            if (access_token) {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/new-notifications`, {
                    headers: { 'Authorization': `Bearer: ${access_token}` }
                });
                const data = response.data;
                setUserAuth({ ...userAuth, ...data });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [access_token]);

    const handleUserNavPanel = () => {
        setUserNavPanel(currentValue => !currentValue);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 200);
    };

    const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value;
    
        if (event.key === 'Enter' && query.length) {
            navigate(`/search/${query}`);
        }
    };

    const changeTheme = () => {
        const newTheme = theme == 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        document.body.setAttribute("data-theme", newTheme);

        storeInSession("theme", newTheme);
    }
    
    return (
        <>
            <nav className="navbar z-50">
                <Link to="/" className="flex-none w-24 h-18">
                    <img src={ theme == 'dark' ? darkLogo : lightLogo } alt="logo" className="w-full" />
                </Link>

                {new_notification_available}

                <div className={"absolute bg-white w-full left-0 top-full border border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 lg:w-auto md:show " + (searchBoxVisibility ? "show" : "hide")}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12 border border-transparent hover:border-purple focus:outline-none"
                        onKeyDown={handleSearch}
                    />

                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button
                        className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() =>
                            setSearchBoxVisibility((currentValue) => !currentValue)}
                    >
                        <i className="fi fi-rr-search text-xl"></i>
                    </button>

                    <Link to="/editor" className="hidden md:flex gap-2 link">
                        <i className="fi fi-rr-file-edit"></i>
                        <p>Publish</p>
                    </Link>

                    <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                        <i 
                            className={"fi fi-rr-" + ( theme == 'light' ? "moon-stars" : "sun" ) + " text-2xl block mt-1" }
                            onClick={changeTheme}
                        >
                        </i>
                    </button>

                    {access_token ? (
                        <>
                            <Link to="/dashboard/notifications">
                                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                                    <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                                    {new_notification_available ? (
                                        <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                                    ) : (
                                        ""
                                    )}
                                    
                                </button>
                            </Link>

                            <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
                                <button className="w-12 h-12 mt-1">
                                    <img src={profile_img} alt="img" className="w-full object-cover rounded-full" />
                                </button>

                                {userNavPanel ? <UserNavigationPanel /> : ''}
                                
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/signin" className="btn-dark py-2">
                                Sign In
                            </Link>
                            <Link to="/signup" className="btn-light py-2 hidden md:block">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <Outlet />
        </>
    );
};
