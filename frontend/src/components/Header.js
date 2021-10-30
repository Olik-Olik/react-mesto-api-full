import React from "react";
import logo from '../Logo.svg';
import '../index.css';
import {Link, Route, Switch} from "react-router-dom";
/* sing-up регистрация
* sing-in вход*/

/* Если залогинился и нажал на выход-Выйти*/

function Header(props) {

    return (
        <header className="header">
            <div className="auth__correct-logo-header">
                <img alt="logo" className="header__logo" src={logo}/>
                <Switch>
                    <Route exact path='/'>
                        <div className="auth__correct-logo-exit-email">
                            <span className="auth__header-email">{props.email}</span>
                            <Link to='/sign-in' onClick={props.handleSignOut} className="auth__header-exit">
                                <span>Выйти</span>
                            </Link>
                        </div>
                    </Route>
                    <Route exact path='/sign-in'>
                        <Link to='/sign-up' className="auth__header-exit">
                            <span>Регистрация</span>
                        </Link>
                    </Route>
                    <Route exact path='/sign-up'>
                        <Link to='/sign-in' className="auth__header-exit">
                            <span>Войти</span>
                        </Link>
                    </Route>
                </Switch>
            </div>
        </header>)
}

export default Header;

