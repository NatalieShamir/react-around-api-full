class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error ${res.status}`);
  }

  getUserInfo() {
    return this._request(this._baseUrl + "/users/me", {
      headers: this._headers,
    });
  }

  getCardList() {
    return this._request(this._baseUrl + "/cards", {
      headers: this._headers,
    });
  }

  editProfile(name, about) {
    return this._request(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    });
  }

  createCard(name, link) {
    return this._request(this._baseUrl + "/cards", {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    });
  }

  addLike(id) {
    return this._request(this._baseUrl + "/cards/likes/" + id, {
      method: "PUT",
      headers: this._headers,
    });
  }

  removeLike(id) {
    return this._request(this._baseUrl + "/cards/likes/" + id, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  setUserAvatar(avatar) {
    return this._request(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    });
  }

  deleteCard(id) {
    return this._request(this._baseUrl + "/cards/" + id, {
      method: "DELETE",
      headers: this._headers,
    });
  }
}

export const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/cohort-3-en",
  headers: {
    authorization: "c38a1131-295f-471c-b53b-3cfda4699ea7",
    "Content-Type": "application/json",
  },
}); 