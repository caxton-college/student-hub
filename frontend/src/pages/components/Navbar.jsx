import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLightbulb, faNoteSticky} from '@fortawesome/free-regular-svg-icons'

function Navbar() {
    return (
        <div className="navbar">
            <div className="header-navbar-content">
                <Link to="/announcements" className="nav-link">
                    <FontAwesomeIcon icon={faNoteSticky} size="2xl" />
                </Link>
                <Link to="/suggestions" className="nav-link">
                    <FontAwesomeIcon icon={faLightbulb} size="2xl" />
                </Link>
                <Link to="/" className="nav-link">
                    <FontAwesomeIcon icon={faUser} size="2xl" />
                </Link>
            </div>
            
        </div>
    )
}

export default Navbar
