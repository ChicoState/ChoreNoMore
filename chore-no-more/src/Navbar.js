import { Link, useMatch, useResolvedPath } from "react-router-dom"
import './nav.css'
import signOut from "./App.js"

export default function Navbar () {
    
    return (
        <nav className="nav">
            <Link to="/" className="site-title">Chore No More</Link>
            <ul>
                <CustomLink to="/instructions">How To Use</CustomLink>
                {/*<li className='active'> 
                    <a href="/pricing">Pricing</a>
                </li>*/}
                {/*<button onClick={() => signOut()}>Sign Out</button>*/}
                <CustomLink to="/groups">Groups</CustomLink>
                <CustomLink to="/calendar">Calendar</CustomLink>
            </ul>
        </nav>
    )
}

function CustomLink({to, children, ...props}) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <li className={isActive ? "active" : ""}> 
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}