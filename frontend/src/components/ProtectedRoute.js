import React from 'react';
import { Redirect } from 'react-router-dom';

const ProtectedRoute = ({ children, isLoggedIn }) => {

    if (isLoggedIn) {
        return children
    }

    return <Redirect to="/signin" />
}

export { ProtectedRoute };