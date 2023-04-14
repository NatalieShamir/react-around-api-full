import React from "react";
import { useState } from "react";
import { PopupWithForm } from "./PopupWithForm";

function AddPlacePopup({ onAddPlaceSubmit, isOpen, onClose, isLoading }) {
  const [cardName, setCardName] = useState("");
  const [link, setLink] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlaceSubmit(cardName, link);
  }
  return (
    <PopupWithForm
      name="add-card"
      title="New Place"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={"Create"}
      isLoading={isLoading}
    >
      {" "}
      <fieldset className="popup__form-fieldset">
        <label htmlFor="title" className="popup__form-label"></label>
        <input
          type="text"
          id="title-input"
          className="popup__form-input"
          name="title"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Title"
          required
          minLength="1"
          maxLength="30"
        />
        <span id="title-input-error" className="popup__form-error"></span>
      </fieldset>
      <fieldset className="popup__form-fieldset">
        <label htmlFor="image" className="popup__form-label"></label>
        <input
          type="url"
          id="image-input"
          className="popup__form-input popup__form-input_type_image"
          name="image"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Image URL"
          required
        />
        <span id="image-input-error" className="popup__form-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}

export { AddPlacePopup };
