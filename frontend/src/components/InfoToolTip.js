/*компонент модального окна,который информирует пользователя об успешной (или не очень) регистрации.*/
import React from "react";
//это были картинки и для сохранения общего стиля с большой буквы сделала, исправляю по ревью.
import oneMoreIcon from '../images/oneMoreIcon.svg';
import Success_Icon from '../images/successIcon.svg';

function InfoToolTip(props) {

    return (
        <div className={`popup ${props.isOpen ? "popup_opened" : ""} auth__tooltip-icon`}>
            <div className="popup__combine-image">

                <div>
                    <button type="button"
                            onClick={props.onClose}
                            aria-label='Закрыть'
                            className="popup__close-button popup__close-button-no-rel"/>

                </div>
                <div className="popup__combine-word">
                    <div className="popup__container-image">
                        <img className="auth__tooltip-icon"
                             alt="Картинка захода"
                             src={`${props.infoSuccess ? Success_Icon : oneMoreIcon}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );


}

export default InfoToolTip;