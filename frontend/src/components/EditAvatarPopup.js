import React, {useState} from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
    const [avaUrl, setAvaUrl] = useState('');

    function handleChangeAva(evt) {
        setAvaUrl(evt.target.value);
    }

    function handleEditAvatarSubmit(evt) {
        // Запрещаем браузеру переходить по адресу формы
        evt.preventDefault();
        props.handleUpdateAvatar({
            'avatar': avaUrl
        })
    }

    return (
        <PopupWithForm
            onClose={props.onClose}
            onSubmit={handleEditAvatarSubmit}
            name="input-avatar popup_type_edit-avatar"
            formName="form_edit_avatar"
            title="Обновить аватар"
            isOpen={props.isOpen}
            type="submit"
            buttonText="Сохранить"
        >
            <label className="popup__label">
                <input className="popup__field popup__avatar-link"
                       id="popup-avatar-link"
                       name="input-avatar"
                       placeholder="Ссылка на новую аватарку"
                       required
                       type="url"
                       value={avaUrl ? avaUrl : ''}
                       onChange={handleChangeAva}
                />
                <span className="popup__input-error" id="popup-avatar-link-error"/>
            </label>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;
