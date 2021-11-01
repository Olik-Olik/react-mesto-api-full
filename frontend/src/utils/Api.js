//import React from "react";

class Api {
    constructor(arr) {
        this._address = arr.address;
        this._headers = arr.headers;
        this._authTocken = null;
    }

    handleToken(){
        this._authTocken = localStorage.getItem('jwt');
        this._headers.Authorization = `Bearer ${this._authTocken}`;
     }

// если сервер ответит ок- то выдать значение  если нет-отклоняется промис
    _handleResponse(response) {
        if (response.ok) {
            return response.json()
        } else {
            console.log("Вылезла ошибка, УПС, Повезло-то как! " + response.statusText);
            return Promise.reject("Вылезла ошибка, УПС, Повезло-то как! " + response.status + ":" + response.statusText);
        }
    }

//получение карточек с сервера внешний метод
    getInitialCards() {
        this.handleToken();
        return fetch(this._address + '/cards',
            {
                headers: this._headers,
                method: 'GET',
            })
            .then((response) => this._handleResponse(response));
    }

//добавляем карточки
    submitNewCard(cardInfo) {
        this.handleToken();
        return fetch(this._address + '/cards',
            {
                headers: {
                    'authorization': this._headers.authorization,
                    'Content-Type': 'application/json'
                },
                method: 'POST',      //Роst запрос через body
                body: JSON.stringify(cardInfo)
            })
            .then((response) => this._handleResponse(response));
    }

    setUserInfo(inputNameUserInfo, inputAboutUserInfo) {
        console.log(inputNameUserInfo);
        console.log(inputAboutUserInfo);
        this.handleToken();
        return fetch(this._address + '/users' + '/me', {
            headers: this._headers,
            method: 'POST', //Роst запрос через body
            body: JSON.stringify({
                name: inputNameUserInfo,
                about: inputAboutUserInfo
            })
        })
            .then((response) => this._handleResponse(response));
    }


    submitRemoveCard(cardId) { //идентифицируем карточку
        this.handleToken();
        return fetch(this._address + '/cards/' + cardId, {
            headers: this._headers,
            method: 'DELETE'
        })
            .then((response) => this._handleResponse(response));
    }


    like(cardId) {
        this.handleToken();
        return fetch(this._address + '/cards/likes/' + cardId, {
            headers: this._headers,
            method: 'PUT'
        })
            .then((response) => this._handleResponse(response));
    }

    dislike(cardId) {
        this.handleToken();
        return fetch(this._address + '/cards/likes/' + cardId, {
            headers: this._headers,
            method: 'DELETE'
        })
            .then((response) => this._handleResponse(response))
    }


// _id — это идентификатор пользователя, в данном случае вашего.
    getUserInfo() {
        this.handleToken();
        return fetch(this._address + '/users/me',
            {
                headers: this._headers,
                method: 'GET'
            })
            .then((response) => this._handleResponse(response));
    }

    submitUserInfo(userInfo) {
        this.handleToken();
        const userUpdate = {
            'name': userInfo.name,
            'about': userInfo.about
        }
        return fetch(this._address + '/users/me',
            {
                headers: {
                    'authorization': this._headers.authorization,
                    'Content-Type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify(userUpdate), // в аватар кладем строку от аватара
            })
            .then((response) => this._handleResponse(response));
    }

    submitUserAvatar(userInfo) {
        this.handleToken();
        const avaUpdate = {
            'avatar': userInfo.avatar
        }
        return fetch(this._address + '/users/me/avatar',
            {
                headers: {
                    'authorization': this._headers.authorization,
                    'Content-Type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify(avaUpdate), // в аватар кладем строку от аватара
            })
            .then((response) => this._handleResponse(response));
    }

}

const api = new Api({
  /*  address: 'https://mesto.nomoreparties.co/v1/cohort-26',*/
    address: 'http://localhost:3624',
    headers: {
        // authorization: 'b12ac09d-a522-46ec-9026-b6918737b3ea'
    }
});

export default api;

