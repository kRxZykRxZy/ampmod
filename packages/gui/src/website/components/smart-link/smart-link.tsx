import React from 'react';
import { Link } from 'wouter';

export default ({ to, children, ...rest }) => {
    if (!!process.env.SPA) {
        return (
            <Link to={to} {...rest}>
                {children}
            </Link>
        );
    }

    return (
        <a href={process.env.ROOT + to + (to === "/" ? "" : ".html")} {...rest}>
            {children}
        </a>
    );
}