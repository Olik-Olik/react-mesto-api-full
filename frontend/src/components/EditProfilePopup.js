import React, {useContext, useEffect, useState} from "react";
import PopupWithForm from "./PopupWithForm";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
    const [profileTitle, setProfileTitle] = useState('');
    const [profileJob, setProfileJob] = useState('');
    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        setProfileTitle(currentUser.name)
        setProfileJob(currentUser.about)
    }, [currentUser, props.isOpen])

    function handleChangeProfileTitle(evt) {
        setProfileTitle(evt.target.value)
    }

    function handleChangeProfileJob(evt) {
        setProfileJob(evt.target.value)
    }

    function handleSubmitProfile(evt) {
        evt.preventDefault();
        props.handleUpdateProfile({
            'name': profileTitle,
            'about': profileJob
        })
    }

    return (
        <PopupWithForm
            name="profile"
            formName="form_edit_profile"
            title="Редактировать профиль"
            onClose={props.onClose}
            isOpen={props.isOpen}
            onSubmit={handleSubmitProfile}
            buttonText="Сохранить">
            <label className="popup__label">
                <input className="popup__field"
                       onChange={handleChangeProfileTitle}
                       id="popup-field-name"
                       maxLength="40" minLength="2"
                       name="inputForm_name"
                       placeholder="Ваше имя"
                       required
                       type="text"
                       value={profileTitle ? profileTitle : ''}
                />
                <span className="popup__input-error"
                      id="popup-field-name-error"/>
            </label>

            <label className="popup__label">
                <input className="popup__field"
                       onChange={handleChangeProfileJob}
                       value={profileJob ? profileJob : ''}
                       id="popup-field-job"
                       maxLength="200"
                       minLength="2"
                       name="inputForm_job"
                       placeholder="Род занятия"
                       required type="text"
                />
                <span className="popup__input-error"
                      id="popup-field-job-error"/>
            </label>
        </PopupWithForm>
    )
}

export default EditProfilePopup;