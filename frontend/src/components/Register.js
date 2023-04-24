import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        onRegister(email, password)
    }

    return (
        <div className="register">
            <form onSubmit={handleRegister} className="register__form">
                <h3 className="register__welcome">
                    Sign up
                </h3>
                <label htmlFor="email"></label>
                <input name="email" type="email" id="email-input" className="register__input" placeholder="Email" value={email}
                    onChange={e => setEmail(e.target.value)} />
                <label htmlFor="password"></label>
                <input name="password" type="password" id="password-input" className="register__input" placeholder="Password" value={password}
                    onChange={e => setPassword(e.target.value)} />
                <div className="register__button-container">
                    <button className="register__link">Sign up</button>
                </div>
            </form>

            <div className="register__signin">
                <p className="register__signin-text">Already a member?</p>
                <Link style={{ textDecoration: 'none' }} to="/signin" className="register__login-link">Log in here!</Link>
            </div>
        </div>
    )
}

export { Register };