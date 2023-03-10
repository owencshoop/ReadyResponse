import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addAddressImage } from "../../store/addresses";
import { useModal } from "../../context/Modal";
import altImage from '../../assets/alt-image.png'

const UploadImage = () => {
    const address = useSelector((state) => state.addresses.singleAddress);
    const [errors, setErrors] = useState([]);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [title, setTitle] = useState("");
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);

        const data = await dispatch(addAddressImage(address.id, formData));
        if (data.errors) {
            setErrors(data.errors);
        } else {
            await closeModal();
        }
    };

    const updateImage = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    useEffect(() => {
        if (image) {
            setImageUrl(URL.createObjectURL(image));
        }
    }, [image]);

    return (
        <div className="pad0t pad30lr fdcol w30vw ofhidden h100p">
            <h1 className="marlrauto mar10b">Upload Image</h1>
            {imageUrl && !errors[0] && (
                <div className="image-preview-container" >
                    <img src={imageUrl} alt='upload' className="image-preview" onError={e => { e.currentTarget.src = altImage}}></img>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {errors.length > 0 && (
                    <div className="errors-div">
                        {errors.map((error, ind) => (
                            <div key={ind}>{error}</div>
                        ))}
                    </div>
                )}
                <div className="fdcol mar20b">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        maxLength={255}
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="iflight bnone h40px"
                        required
                    ></input>
                </div>
                <div className="mar20b">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={updateImage}
                        required
                    />
                </div>
                <div className="jccen mar30t">
                    <button
                        type="submit"
                        className="w100p h50px btndark pad0 flar"
                    >
                        Upload
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadImage;
