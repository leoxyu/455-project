import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes, useResolvedPath, useMatch } from 'react-router-dom';


export default function Menu() {
    return <nav className="nav">
        <CustomLink to="/home" className="site-title">Uni.Fi</CustomLink>
        <ul>
            <CustomLink to="/search">Search</CustomLink>
            <CustomLink to="/login">Login</CustomLink>
        </ul>
    </nav>
}

function CustomLink({ to, children, ...props }) {
    /* resolve the pathname (gets absolute path) and check the whole thing matches correctly before we redirect to that link */
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
}