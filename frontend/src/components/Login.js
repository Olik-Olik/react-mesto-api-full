//для авторизации
import React, {useState} from "react";
import {Link, useHistory} from 'react-router-dom';

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    function handleChangeEmail(evt) {
        setEmail(evt.target.value);
    }

    function handleChangePassword(evt) {
        setPassword(evt.target.value);
    }

    function handleSubmitLogin(evt) {
        evt.preventDefault();
        props.handleLogin(password, email).then(() => {
                history.push('/')
            }
        );
    }

    return (
        <div className="auth">
            <p className=" auth__login-welcome">Вход</p>
            <form onSubmit={handleSubmitLogin}
                  className="auth__form-login">

                <input
                    className="auth__form-login-input-email"
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
                       onChange={handleChangePassword}
                />

                <button className="auth__form-login-submit-button"
                        type="submit">Войти
                </button>
            </form>

            <div className="auth__login-signup-Do-Register">
                <p>Уже зарегистрированы? Войти</p>

                <Link to="/sign-up"
                      className="auth__signin-link">
                    Зарегистрироваться</Link>
            </div>
        </div>
    )
}

export default Login;

