import React, {useContext} from "react";
import {CurrentUserContext} from '../contexts/CurrentUserContext';


function Card(props) {
    const currentUser = useContext(CurrentUserContext);
// Определяем, является ли текущий юзер- я,  владельцем  карточки
    const isOwn = props.card.owner._id === currentUser._id;

// Определяем, есть ли у карточки лайк, поставленный текущим пользователем - мной
    const isLiked = props.card.likes.some(i => i._id === currentUser._id);
// Создаём переменную, которую после зададим в `className` для кнопки удаления
    const cardDeleteButtonClassName =
        /*`card__delete-button ${props.isOwn ? 'card__delete-button_visible' : 'card__delete-button_hidden'}`*/
// Если собственник = текущему id юзера, то мусорка активна : иначе - не удалить.

        `${isOwn ? 'elements__trash' : 'elements__trash-hidden'}`;

    /*  ` ${props.isOwn === currentUser._id ? '': 'elements__trash-hidden'}`*/

// Создаём переменную, которую после зададим в `className` для кнопки лайка
// Если лайкнуто текущим мной-чернеет лайк
    const cardLikeButtonClassName = (
        `${isLiked ? 'elements__like_active' : 'elements__like'}`);

    function handleCardClick(evt) {
        props.onCardClick(props.card);
    }

    function handleCardDeleteClick() //handleCardClick
    {
        props.onCardDelete(props.card);
    }

//обработчик клика и вызываем  onCardLike
    function handleCardLike() {
        props.onCardLike(props.card);
    }


    return (
        //      <CurrentUserContext.Provider value={currentUser}>
        <div className="elements__card"
            /*      onClick={handleCardClick}*/
        >
            <div className="elements__trash-image">
                <button aria-label='Удаление элемента'
                        type="button"
                        onClick={handleCardDeleteClick}
                        className={cardDeleteButtonClassName}/>
                <img alt={props.alt}
                     className="elements__image" /* {props.title}*/
                     onClick={handleCardClick}
                     src={props.src}/>
                <div className="elements__combine">
                    {/* eslint-disable-next-line jsx-a11y/heading-has-content*/}
                    <h2 className="elements__word">{props.title}</h2>
                    <div className="elements__container-like">
                        <button
                            // className="elements__like"
                            className={cardLikeButtonClassName}
                            aria-label='Лайк'
                            type="button"
                            onClick={handleCardLike}/>
                        <p className="elements__like-count">{props.card.likes.length}</p>
                    </div>
                </div>
            </div>
        </div>
        //      </CurrentUserContext.Provider>
    )
}

export default Card;
