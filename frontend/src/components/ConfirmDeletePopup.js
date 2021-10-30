import React from "react";
import PopupWithForm from "./PopupWithForm";


function ConfirmDeletePopup(props) {

    function handleClose(evt) {
        if (evt.target.classList.contains('popup'))
            props.onClose();
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        /* props.(props.selectedCard)*/
        props.onClose();
    }

    return (
        <PopupWithForm
            onClose={props.onClose}
            name="input-avatar popup_type_edit-avatar" ///испавить на confirm del
            formName="form_confirm_delete"
            title="Редактировать аватар"
            isOpen={props.isOpen}
            /*    onSubmit={handleSubmit} //Не описано еще и хз надо ли. По ревью.Как понимаю вопрос был в сабмите , тут про лайки ни слова*/
            buttonText="Сохранить">
            <label className="popup__label">
                <h2 className="popup__page"
                    onClick={props.onClose}>Вы уверены?</h2>
            </label>

        </PopupWithForm>
    )
}

export default ConfirmDeletePopup;

