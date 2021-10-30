import React from "react";

//не имеет пропсов и вложенного содержимого.
function ImagePopup(props) {
    return (
        <div className={`popup ${props.isOpen ? "popup_opened" : ""} popup_type_image`}>
            <div className="popup__combine-image">

                <div>
                    <button type="button"
                            onClick={props.onClose}
                            aria-label='Закрыть'
                            className="popup__close-button popup__close-button-no-rel"/>
                </div>
                <div className="popup__combine-word">
                    <div className="popup__container-image">
                        <img className="popup__image"
                             alt="Большая картинка"
                             src={props.card.link}
                        />
                        <h2 className="popup__image-word">{props.card.name}</h2>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ImagePopup;