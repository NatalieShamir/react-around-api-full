import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { PopupWithForm } from "./PopupWithForm";
import React from "react";
import { useEffect } from "react";
import { Route, useHistory, Switch, Redirect } from 'react-router-dom';
import { UserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/Api";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import * as auth from "../utils/auth";
import { Login } from "./Login";
import { ProtectedRoute } from "./ProtectedRoute";
import { Register } from "./Register";
import { InfoTooltip } from "./InfoTooltip";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({
    name: "",
    link: "",
  });
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isAddCardProcessing, setIsAddCardProcessing] = React.useState(false);
  const [isEditProfileProcessing, setIsEditProfileProcessing] =
    React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [isSuccessful, setIsSuccessful] = React.useState(true);
  const history = useHistory();

  function register(email, password) {
    auth.signup(email, password)
      .then(res => {
        if (res._id) {
          setIsSuccessful("successful");
          setTimeout(() => {
            history.push("/signin");
            setIsInfoTooltipOpen(false);
          }, 3000)
        } else {
          setIsSuccessful("fail");
        }
      })
      .catch((err) => {
        setIsSuccessful("fail");
      })
      .finally(() => {
        setIsInfoTooltipOpen(true);
      });
  }

  function login(email, password) {
    auth.signin(email, password)
      .then(res => {
        if (res.token) {
          setIsLoggedIn(true)
          setEmail(email)
          localStorage.setItem("jwt", res.token)
          history.push("/")
        } else {
          setIsSuccessful("fail");
        }
      })
      .catch((err) => {
        setIsSuccessful("fail");
      })
  }

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    api
      .getUserInfo()
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => console.log(err))

    api
      .getCardList()
      .then((res) => {
        setCards(res.data);
      })
      .catch((err) => console.log(err))
  }, [isLoggedIn]);

  function signOut() {
    localStorage.removeItem("jwt")
    setIsLoggedIn(false)
    setEmail("")
    history.push("/signin")
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt")

    if (token) {
      auth.checkToken(token)
        .then(res => {
          const { data: { email } } = res
          setEmail(email)
          setIsLoggedIn(true);
          history.push("/")
        })
        .catch((err) => console.log(err))
    }
  }, [])


  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({
      name: "",
      link: "",
    });
    setIsInfoTooltipOpen(false);
  }

  useEffect(() => {
    function closeByEscape(e) {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    }
    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser({ name, about }) {
    setIsEditProfileProcessing(true);
    api
      .editProfile(name, about)
      .then((res) => {
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsEditProfileProcessing(false);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .setUserAvatar(avatar)
      .then((res) => {
        setCurrentUser({ ...currentUser, avatar: res.data.avatar });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((userId) => userId === currentUser._id);

    if (isLiked) {
      api
        .removeLike(card._id)
        .then((likedCard) => {
          const newCards = cards.map((card) => {
            return card._id === likedCard.data._id ? likedCard.data : card;
          });
          setCards(newCards);
        })
        .catch((err) => console.log(err))
    } else {
      api
        .addLike(card._id)
        .then((likedCard) => {
          const newCards = cards.map((card) => {
            return card._id === likedCard.data._id ? likedCard.data : card;
          });
          setCards(newCards);
        })
        .catch((err) => console.log(err))
    }
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then((res) => {
        const newCards = cards.filter((item) => item._id !== card._id);
        setCards(newCards);
      })
      .catch((err) => console.log(err))
  }

  function handleAddPlaceSubmit(name, url) {
    setIsAddCardProcessing(true);
    api
      .createCard(name, url)
      .then((res) => {
        setCards([res.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsAddCardProcessing(false);
      });
  }

  return (
    <UserContext.Provider value={currentUser}>
      <div className="page">
        <Header isLoggedIn={isLoggedIn} text="Sign up" path="/signup" email={email} onSignOut={signOut}
        />
        <Switch>
          <Route path="/signup"><Register onRegister={register} /></Route>
          <Route path="/signin"><Login onLogin={login} /></Route>
          <ProtectedRoute exact path="/" isLoggedIn={isLoggedIn}><Main
            onEditProfileClick={handleEditProfileClick}
            onAddPlaceClick={handleAddPlaceClick}
            onEditAvatarClick={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
              isLoading={isEditProfileProcessing}
            />
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlaceSubmit={handleAddPlaceSubmit}
              isLoading={isAddCardProcessing}
            />
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />
            <PopupWithForm
              name="confirm-delete"
              title="Are you sure?"
              buttonText={"Yes"}
            />{" "}
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            <Footer /></ProtectedRoute>
        </Switch>
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSuccessful={isSuccessful} />
        <Route>
          {
            isLoggedIn
              ? <Redirect to="/" />
              : <Redirect to="/signin" />
          }
        </Route>
      </div>
    </UserContext.Provider >
  );

}

export default App;
