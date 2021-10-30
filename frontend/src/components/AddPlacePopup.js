import React, {useState} from "react";
//import isAddPlacePopupOpen from './App';
import PopupWithForm from "./PopupWithForm";


function AddPlacePopup(props) {

    const [placeTitle, setplaceTitle] = useState(''); //name of img
    const [placeUrl, setplaceUrl] = useState(''); //img

    /*    function handleClose(evt) {
            if (evt.target.classList.contains('popup'))
                props.onClose();
        }*/

    function handleSubmitAddPlace(evt) {
        // Запрещаем браузеру переходить по адресу формы
        evt.preventDefault();
        const newCard = {
            'name': placeTitle,
            'link': placeUrl
        }
        props.onAddPlacePopup(newCard)
    }

//теперь обработчик  места и ссылки
    function handleChangeTitle(evt) {
        setplaceTitle(evt.target.value)
    }// c evt.target.value
    function handleChangePlace(evt) {
        setplaceUrl(evt.target.value)
    }

    return (
        <PopupWithForm
            onClose={props.onClose}
            name="popup-input-place popup-input-img "
            formName="form_add_place"
            title="Редактировать место"
            isOpen={props.isOpen}
            onSubmit={handleSubmitAddPlace}
            buttonText="Сохранить"
        >
            <label className="popup__label">

                <input className="popup__field"
                       type="text"
                       name="popup-input-place"
                       placeholder="Название"
                       value={placeTitle ? placeTitle : ''}
                       required
                       maxLength="30" minLength="2"
                       id="popup-field-card-name"
                       onChange={handleChangeTitle}
                />
            </label>

            <span className="popup__input-error"
                  id="popup-field-card-name-error"/>
            <label className="popup__label">

                <input className="popup__field"
                       type="url"
                       id="popup-field-card-img"
                       name="popup-input-img"
                       placeholder="Ссылка на картинку"
                       required
                       value={placeUrl ? placeUrl : ''}
                       onChange={handleChangePlace}/>
                <span className="popup__input-error"
                      id="popup-field-card-img-error"/>
            </label>
        </PopupWithForm>
    );
}

export default AddPlacePopup;
