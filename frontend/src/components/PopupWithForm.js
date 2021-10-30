import React, {useEffect} from "react";

function PopupWithForm(props) {

    function closePopupKeyUp(evt) {
        if (evt.key === 'Escape') {
            props.onClose && props.onClose();
        }
    }

    useEffect(() => {
        document.addEventListener('keyup', closePopupKeyUp);
        return () => {
            document.removeEventListener('keyup', closePopupKeyUp);
        }
    }, [])

    return (
        <section className={`popup popup_type_edit ${props.isOpen ? "popup_opened" : ""} `}>
            <button aria-label='Закрыть всплывающее окошко' className="popup__close-button" type="button"
                    onClick={props.onClose}/>
            <div className="popup__container">

                <form action="#"
                      name={props.formName} //у каждой формы должен быть уникальным
                      className="popup__form"
                      aria-label='получения инфо и передачи данных в адресной строке'
                      onSubmit={props.onSubmit}>

                    <h2 className="popup__page">{props.title}</h2>
                    {props.children}
                    <button aria-label='Кнопка самбита'
                            className="popup__save"
                            type="submit">{props.buttonText}</button>

                </form>
            </div>
        </section>
    )
}

export default PopupWithForm;









