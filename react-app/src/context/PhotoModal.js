import React, { useRef, useState, useContext } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const PhotoModalContext = React.createContext();

export function PhotoModalProvider({ children }) {
    const modalRef = useRef();
    const [modalContent, setModalContent] = useState(null);
    // callback function that will be called when modal is closing
    const [onModalClose, setOnModalClose] = useState(null);

    const closePhotoModal = () => {
        setModalContent(null); // clear the modal contents
        // If callback function is truthy, call the callback function and reset it
        // to null:
        if (typeof onModalClose === "function") {
            setOnModalClose(null);
            onModalClose();
        }
    };

    const contextValue = {
        modalRef, // reference to modal div
        modalContent, // React component to render inside modal
        setModalContent, // function to set the React component to render inside modal
        setOnModalClose, // function to set the callback function called when modal is closing
        closePhotoModal, // function to close the modal
    };

    return (
        <>
            <PhotoModalContext.Provider value={contextValue}>
                {children}
            </PhotoModalContext.Provider>
            <div ref={modalRef} />
        </>
    );
}

export function PhotoModal() {
    const { modalRef, modalContent, closeModal } = useContext(PhotoModalContext);
    // If there is no div referenced by the modalRef or modalContent is not a
    // truthy value, render nothing:
    if (!modalRef || !modalRef.current || !modalContent) return null;

    // Render the following component to the div referenced by the modalRef
    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background" onClick={closeModal} />
            <div id="photo-modal-content-container">
                <div id="photo-modal-content">{modalContent}</div>
            </div>
        </div>,
        modalRef.current
    );
}

export const usePhotoModal = () => useContext(PhotoModalContext);
