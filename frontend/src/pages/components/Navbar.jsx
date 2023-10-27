import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLightbulb, faNoteSticky} from '@fortawesome/free-regular-svg-icons'

function Navbar() {
    return (
        <>
            <div className="navbar">
                <div id="navbar-items">
                    <Link to="/announcements" className="nav-link">
                        <FontAwesomeIcon icon={faNoteSticky} style={{color: "black"}} size="2xl"/>
                    </Link>
                    <Link to="/suggestions" className="nav-link">
                        <FontAwesomeIcon icon={faLightbulb} style={{color: "black"}} size="2xl"/>
                    </Link>
                    <Link to="/" className="nav-link">
                        <FontAwesomeIcon icon={faUser} style={{color: "black"}} size="2xl"/>
                    </Link>
                </div>
            </div>  
        </>
    )
}

export default Navbar