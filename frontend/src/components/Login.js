import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        onLogin(email, password)
    }

    return (
        <div className="login">
            <form onSubmit={handleLogin} className="login__form" >
                <h3 className="login__welcome">Log in</h3>
                <label htmlFor="email"></label>
                <input type="email" id="email-input" className="login__input" placeholder="Email"
                    value={email} onChange={e => setEmail(e.target.value)} />
                <label htmlFor="password"></label>
                <input type="password" id="password-input" className="login__input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <div className="login__button-container">
                    <button type="submit" className="login__link">
                        Log in
                    </button>
                </div>
            </form>

            <div className="login__signup">
                <p className="login__signup-text">Not a member yet?</p>
                <Link style={{ textDecoration: 'none' }} to="/signup" >
                    <p className="login__signup-link"> Sign up here!</p>
                </Link>
            </div>
        </div>

    )
}

export { Login }
