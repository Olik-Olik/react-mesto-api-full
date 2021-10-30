//для авторизации
import React, {useState} from "react";
import {Link} from 'react-router-dom';

function Register(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleChangeEmail(evt) {
        setEmail(evt.target.value);
    }

    function handleChangePassword(evt) {
        setPassword(evt.target.value);
    }

    function handleSubmitRegister(evt) {
        evt.preventDefault();
        if (!password || !email) {
            return;
        }
        props.handleRegister(password, email);
    }

    return (
        <div className="auth">
            <p className="auth__login-welcome">Регистрация</p>

            <form onSubmit={handleSubmitRegister}
                  className="auth__form-login">
                 <input
                    className="auth__form-login-input-email "
                    required
                    name="email"
                    type="email"
                    value={email || ""}
                    placeholder="Email"

                    onChange={handleChangeEmail}/>
                <input className="auth__form-login-input-password"

                       required
                       name="password"
                       type="password"
                       value={password || ""}
                       placeholder="Пароль"
                       onChange={handleChangePassword}/>


                <button className="auth__form-login-submit-button "
                        type="submit">Зарегистрироваться
                </button>

                <Link to="/sign-in"
                      className="auth__login-signup-Do_Register auth__signup-link">
                    Уже зарегистрированы? Войти</Link>
            </form>
        </div>
    )
}


export default Register;
