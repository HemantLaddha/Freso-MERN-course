import React from "react";
import { Link } from "react-router-dom";
import logout from "../icon/logout.png";
import { withRouter } from "react-router";
import home from "../icon/home.png";

export function Header(props) {
    const { history, location, match } = props;

    function handleLogout() {
        // code goes here to handle logout
        localStorage.clear();
        history.push("/login");
    }

    function handleHome() {
        // code goes here to handle home icon
        history.push("/");
    }

    return (
        <>
            <nav>
                {/* code goes here for Add Member and Move Member Link */}
                {/* Link should navigate to respective pages */}
                <Link to="/addMember">Add Member</Link>
                <Link to="/moveMember">Move Member</Link>
            </nav>

            <header>
                <h1>
                    Team Tracker
                    <img src={logout} alt="" onClick={handleLogout} />
                    <img src={home} alt="" onClick={handleHome} />
                </h1>
            </header>
        </>
    );
}

export default withRouter(Header);