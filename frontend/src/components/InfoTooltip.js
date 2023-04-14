import React from "react";
import registrationSuccess from "../images/successful_registration.svg"
import registrationFail from "../images/unsuccessful_registration.svg"

function InfoTooltip({ isOpen, onClose, isSuccessful }) {
    return (
        <div
            className={`popup  ${isOpen ? "popup_open" : ""}`}
        >
            <div className="popup__container">
                <button
                    onClick={onClose}
                    type="button"
                    aria-label="close"
                    className="popup__close-button"
                ></button>
                {isSuccessful === "successful" ? (
                    <div className="popup__tooltip-info">
                        <img className="popup__tooltip-image" src={registrationSuccess} alt="A tick symbol" />
                        <p className="popup__tooltip-status">Success! You have been registered.</p>
                    </div>
                ) : (
                    <div className="popup__tooltip-info">
                        <img className="popup__tooltip-image" src={registrationFail} alt="A red x symbol" />
                        <p className="popup__tooltip-status">Oops, something went wrong! Please try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export { InfoTooltip };