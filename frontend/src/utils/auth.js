export const BASE_URL = "https://register.nomoreparties.co"

export const signup = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then((response) => {
            if (response.status === 201) {
                return response.json();
            }
            return Promise.reject(`Error ${response.status}`);
        })
        .then((res) => {
            return res;
        })
}

export const signin = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(`Error ${response.status}`);
        })
        .then((data) => {
            if (data.token) {
                localStorage.setItem("jwt", data.token);
                return data;
            } else {
                return;
            }
        })
}

export const checkToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(`Error ${response.status}`);
        })
        .then(data => data)
}