class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
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
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    });
  }

  getCardList() {
    return this._request(this._baseUrl + "/cards", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    });
  }

  editProfile(name, about) {
    return this._request(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        about,
      }),
    });
  }

  createCard(name, link) {
    return this._request(this._baseUrl + "/cards", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        link,
      }),
    });
  }

  addLike(id) {
    return this._request(this._baseUrl + "/cards/likes/" + id, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    });
  }

  removeLike(id) {
    return this._request(this._baseUrl + "/cards/likes/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    });
  }

  setUserAvatar(avatar) {
    return this._request(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar,
      }),
    });
  }

  deleteCard(id) {
    return this._request(this._baseUrl + "/cards/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    });
  }
}

export const api = new Api({
  baseUrl: "https://api.around.full.my.to",
}); 