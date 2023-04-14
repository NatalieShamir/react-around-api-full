import React from "react";
import { useRef } from "react";
import { PopupWithForm } from "./PopupWithForm";

function EditAvatarPopup({ onUpdateAvatar, isOpen, onClose }) {
  const avatarRef = useRef();

  function handleSubmit(e) {
    const avatarValue = avatarRef.current.value;
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarValue,
    });
  }

  return (
    <PopupWithForm
      name="avatar-change"
      title="Change profile picture"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={"Save"}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__form-fieldset">
        <label htmlFor="image" className="popup__form-label"></label>
        <input
          ref={avatarRef}
          type="url"
          id="avatar-input"
          className="popup__form-input popup__form-input_type_image"
          name="image"
          placeholder="Image URL"
          required
        />
        <span id="avatar-input-error" className="popup__form-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}

export { EditAvatarPopup };
