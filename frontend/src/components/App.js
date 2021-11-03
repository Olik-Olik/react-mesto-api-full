import React, {useEffect, useState,} from "react";
import '../index.css';
import Header from "./Header";
import Main from './Main';
import Footer from './Footer';
import ImagePopup from "./ImagePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import api from "../utils/Api";
import {BrowserRouter, Redirect, Route, Switch, useHistory} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';
import InfoToolTip from "./InfoToolTip";


export default function App(props) {
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
    const [isConfirmDeletePopup, setIsConfirmDeletePopup] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});
    const [cards, setCards] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [infoSuccess, setInfoSuccess] = useState(false);
    const [credential, setCredential] = useState({});
    const [isRegResOpen, setIsRegResOpen] = useState(false);
    const history = useHistory(); /////
    //проверка токена  хуком
    function hukUseEffectToken() {
        // если у пользователя есть токен в localStorage,
        // эта функция проверит валидность токена
        const token = localStorage.getItem('token');
        if (token) {
            console.log("токен есть JWT");
            // проверим токен в локалсторадж
            auth.checkToken(token)
                // здесь можем получить данные пользователя!
                // поместим их в стейт внутри App.js
                .then((res) => {
                    console.log('Ответ есть!');
                    setLoggedIn(true);
                    setEmail(res.email);
                    setIsLoading(false);
                    //history.push('/');
                })
                .catch((err) => {
                    console.log('Ответа нет! ' + err.toString());
                    setLoggedIn(false);
                    setIsLoading(false);
                    setEmail('');
                })
        } else {
            console.log('Токена нету!!!');
            setLoggedIn(false);
            setIsLoading(false);
            setEmail('');
        }
    }

    useEffect(() => {
        hukUseEffectToken();
    }, [loggedIn]);

//card
    useEffect(() => {
        if (loggedIn) {
            api.getInitialCards()
                .then((res) => {
                    console.log(res);
                    setCards(res)
                })
                .catch((err) => console.log('MAMA, Карточки не  получены!!!: ' + err.toString()))
        }
    }, [loggedIn]);


//user
    useEffect(() => {
        if (loggedIn) {
            api.getUserInfo()
                .then(data => {
                    setCurrentUser(data);
                })
                .catch((err) => {
                        console.log('MAMA, Аватарчик не  получен!!!: ' + err.toString())
                    }
                )
        }
    }, [loggedIn]);

    function handleUpdateAvatar(userData) {
        // Запрещаем браузеру переходить по адресу формы
        api.submitUserAvatar({
            'avatar': userData.avatar
        })
            .then(data => {
                setCurrentUser(data);
                //setCurrentUser({ currentUser, avatar:data.avatar});
                closeAllPopups()
            })
            .catch((err) => {
                console.log('MAMA, Аватарчик не  получен!!!: ' + err.toString())
            })
    }

    function handleUpdateProfile(userData) {
        api.submitUserInfo({
            'name': userData.name,
            'about': userData.about
        })
            .then(data => {
                setCurrentUser(data);
                closeAllPopups()
            })
            .catch((err) => {
                console.log('MAMA, username не  получен!!!: ' + err.toString())
            })
    }

//like
    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i === currentUser._id);
        if (isLiked) {
            // Отправляем запрос в API и получаем обновлённые данные карточки
            api.dislike(card._id)
                .then((newCard) => {
                    setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
                })
                .catch((err) => {
                    console.log('MAMA!!! DisLike: ' + err.toString())
                })

        } else {
            api.like(card._id)
                .then((newCard) => {
                    setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
                })
                .catch((err) => {
                    console.log('MAMA!!! Like: ' + err.toString())
                })
        }
    }

///avatar
    function handleEditAvatarClick(evt) {
        console.log("I'm a walrus!!! Обработчик авы")
        setIsEditAvatarPopupOpen(true);
    }

//profile
    function handleEditProfileClick(evt) {
        console.log("I'm a walrus 2!!!")
        setIsEditProfilePopupOpen(true);
    }


///////place
    function handleAddPlaceClick(evt) {
        console.log("I'm a walrus 3!!!")
        setIsAddPlacePopupOpen(true);
    }

    function handleAddPlaceSubmit(newCard) {
        api.submitNewCard(newCard)
            .then(data => {
                setCards([data, ...cards]);
                closeAllPopups();
            })
            .catch((err) => {
                console.log('MAMA, место не добавлено!!!: ' + err.toString())
            })
    }

//avatar
    const handleEditAvatarOpen = (evt) => {
        console.log("I'm a superstar 1!!!")
        handleEditAvatarClick(evt)
    }
    //profile
    const handleEditProfileOpen = (evt) => {
        console.log("I'm a superstar 2!!!")
        handleEditProfileClick(evt)
    }
    //place
    const handleAddPlaceOpen = (evt) => {
        console.log("I'm a superstar 3!!!")
        handleAddPlaceClick(evt)
    }

    function handleCardClick(card) {
        console.log("I'm a walrus 4!!!")
        setSelectedCard(card);
        setIsImagePopupOpen(true);
    }

    function handleCardDeleteClick(card) {
        console.log("Anything interesting - delete");
       //  const isOwn = card.owner._id === currentUser._id;
        const isOwn = card.owner === currentUser._id;
        if (isOwn) {
            api.submitRemoveCard(card._id)
                .then(newArrCards => {
                    /* !!!!  бывают ситуации, что где-то уже изменили эту переменную,
                    но еще не обновились данные в ней, а Вы попытаетесь изменить старые данные, которые неактуальны больше*/
                    setCards((state) => state.filter((c) => c._id !== card._id))
                    closeAllPopups();
                })
                .catch((err) => {
                    console.log('MAMA, фотка не удалена!!!: ' + err.toString())
                })

        }
    }

    function closeAllPopups() {
        console.log("I was so close...")
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsImagePopupOpen(false);
        setIsConfirmDeletePopup(false);
        setIsRegResOpen(false);

    }

    function handleLogin(password, emmail) {
        return auth
            .login(password, emmail)
            .then((res) => {
               // console.log('vasa');
                localStorage.setItem('token', res.token);
                api.handleToken();
                setEmail(emmail);
                setLoggedIn(true);
                console.log('Залогинились 1!');
            })
            .catch((err) => {
                console.log('Не залогинились :( ' + err.toString());
                setLoggedIn(false);
            })
    }
/*

    function handleLogin(password, emmail) {
        return auth
            .login(password, emmail)
            .then((res) => {
                // console.log('vasa');
                if (res.token) {
                api.handleToken();
                setEmail(emmail);
                setLoggedIn(true);
                //history.push("/");
                console.log('Залогинились 1!');}
            })
            .catch((err) => {
                console.log('Не залогинились :( ' + err.toString());
                setLoggedIn(false);
            })
    }
*/

    function handleRegister(password, email) {
        return auth
            .register(password, email)
            .then((res) => {
                setInfoSuccess(true);
                setIsRegResOpen(true);
                history.push("/signin"); /////
                console.log("1");
            })
            .catch((err) => {
                    console.log('Не зарегались :( ' + err.toString());
                    setInfoSuccess(false);
                    console.log(`Вот такая ошибка вылезла ${err}`)
                    setIsRegResOpen(true);
                }
            )
    }

//out off
    function handleSignOut() {
        console.log("2 - logout");
        localStorage.removeItem('token');
        setCurrentUser({});
        setEmail("");
        setLoggedIn(false);
    }


    return (
        /*  который предоставит объект истории, который вы ищете, через ловушку.*/
        <BrowserRouter>
            <CurrentUserContext.Provider value={currentUser}>
                <>
                    <Header
                        email={email}
                        credential={credential}
                        loggedIn={loggedIn}
                        handleSignOut={handleSignOut}
                    />
                    {/*   <Route>
                        {loggedIn ? <Redirect to="/"/> : <Redirect to="/sign-in"/>}
                    </Route>*/}
                    { !isLoading &&
                    <Switch>
                        <ProtectedRoute exact={true} path="/"
                                        component={Main}
                                        loggedIn={loggedIn}
                                        cards={cards}
                                        onCardClick={handleCardClick}
                                        onEditAvatar={handleEditAvatarClick}
                                        onEditProfile={handleEditProfileClick}
                                        onAddPlace={handleAddPlaceClick}
                                        onCardDelete={handleCardDeleteClick}
                                        onCardLike={handleCardLike}
                                        handleEditAvatarOpen={handleEditAvatarOpen}
                                        handleEditProfileOpen={handleEditProfileOpen}
                                        handleAddPlaceOpen={handleAddPlaceOpen}
                                        setIsImagePopup={(evt) => handleCardClick(evt)}
                        />

                        {/*авторизация*/}
                        <Route exact={true} path="/sign-in">
                            <Login
                                handleLogin={handleLogin}
                            />
                        </Route>

                        {/*регистрация */}
                        <Route exact={true} path="/sign-up">
                            <Register
                                handleRegister={handleRegister}
                            />
                        </Route>
                        <Route>
                            {() => loggedIn === true ? <Redirect to="/"/> : <Redirect to="/sign-in"/>}
                        </Route>
                    </Switch>
                    }

                    <InfoToolTip
                        isOpen={isRegResOpen}
                        onClose={closeAllPopups}
                        infoSuccess={infoSuccess}
                    />

                    <EditAvatarPopup
                        isOpen={isEditAvatarPopupOpen}
                        onClose={closeAllPopups}
                        handleUpdateAvatar={handleUpdateAvatar}
                        buttonText="Cохранить"/>

                    <EditProfilePopup
                        isOpen={isEditProfilePopupOpen}
                        onClose={closeAllPopups}
                        buttonText="Сохранить"
                        handleUpdateProfile={handleUpdateProfile}
                    />

                    <AddPlacePopup
                        isOpen={isAddPlacePopupOpen}
                        onClose={closeAllPopups}
                        onAddPlacePopup={handleAddPlaceSubmit}
                        buttonText="Добавить"/>


                    <ConfirmDeletePopup
                        isOpen={isConfirmDeletePopup}
                        onClose={closeAllPopups}
                        buttonText="Да"/>

                    <ImagePopup
                        isOpen={isImagePopupOpen}
                        card={selectedCard}
                        onClose={closeAllPopups}/>
                </>
                <Footer/>
            </CurrentUserContext.Provider>
        </BrowserRouter>)
}