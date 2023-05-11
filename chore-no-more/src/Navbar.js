import React from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import './nav.css'
import { SignOut } from "./components/SignOut"
import { useSession } from '@supabase/auth-helpers-react';

export default function Navbar () {
    const session = useSession();
    
    return (
        <nav className="nav">
            <Link to="/" className="site-title">Chore No More</Link>
            {session ? (
                <ul>
                    <CustomLink to="/instructions">How To Use</CustomLink>
                    <CustomLink to="/groups">Groups</CustomLink>
                    <CustomLink to="/calendar">Calendar</CustomLink>
                    <SignOut />
                </ul>
            ) : (
                <ul>
                    <CustomLink to="/instructions">How To Use</CustomLink>
                    <CustomLink to="/groups">Groups</CustomLink>
                    <CustomLink to="/calendar">Calendar</CustomLink>
                </ul>
            )}
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