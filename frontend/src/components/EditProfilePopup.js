import React from "react";
import { PopupWithForm } from "./PopupWithForm";
import { UserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const currentUser = React.useContext(UserContext);
  const [name, setName] = React.useState(currentUser.name);
  const [description, setDescription] = React.useState(currentUser.about);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="edit-profile"
      title="Edit profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={"Save"}
      isLoading={isLoading}
    >
      {" "}
      <fieldset className="popup__form-fieldset">
        <label htmlFor="name" className="popup__form-label"></label>
        <input
          type="text"
          id="name-input"
          className="popup__form-input popup__form-input_type_name"
          name="name"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          minLength="2"
          maxLength="40"
        />
        <span id="name-input-error" className="popup__form-error"></span>
      </fieldset>
      <fieldset className="popup__form-fieldset">
        <label htmlFor="job" className="popup__form-label"></label>
        <input
          type="text"
          id="job-input"
          className="popup__form-input popup__form-input_type_job"
          name="job"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="About me"
          required
          minLength="2"
          maxLength="200"
        />
        <span id="job-input-error" className="popup__form-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}

export { EditProfilePopup };
