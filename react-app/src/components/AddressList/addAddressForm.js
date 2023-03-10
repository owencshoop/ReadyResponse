import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { addAddress } from "../../store/addresses";

const AddAddressForm = () => {
    const { closeModal } = useModal();
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const [ownerErrors, setOwnerErrors] = useState([]);
    const [firstAddressLine, setFirstAddressLine] = useState("");
    const [secondAddressLine, setSecondAddressLine] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerEmail, setOwnerEmail] = useState("");
    const [ownerFirstAddressLine, setOwnerFirstAddressLine] = useState("");
    const [ownerSecondAddressLine, setOwnerSecondAddressLine] = useState("");
    const [ownerCity, setOwnerCity] = useState("");
    const [ownerState, setOwnerState] = useState("");
    const [ownerZipCode, setOwnerZipCode] = useState("");
    const [notes, setNotes] = useState("");
    const [nextInspectionDate, setNextInspectionDate] = useState("");
    const [googleResponse, setGoogleResponse] = useState(false);
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const dispatch = useDispatch();

    const date = new Date().toJSON().split("T")[0];

    const states = [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "DC",
        "Florida",
        "Georgia",
        "Guam",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virgin Island",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
    ];
    const stateOptions = states.map((state) => {
        return (
            <option key={state} value={state} className="opt h40px">
                {state}
            </option>
        );
    });

    const api_key = process.env.REACT_APP_GOOGLE_API_KEY;

    const handleGoogleResponse = (addressResponse) => {
        if (addressResponse.result.verdict.hasReplacedComponents) {
            addressResponse.result.address.addressComponents.forEach(
                (component) => {
                    if (component.replaced === true) {
                        if (component.componentType === "locality") {
                            setCity(component.componentName.text);
                        } else if (component.componentType === "postal_code") {
                            setZipCode(component.componentName.text);
                        } else if (component.componentType === "subpremise") {
                            setSecondAddressLine(component.componentName.text);
                        }
                    }
                }
            );
        }

        if (addressResponse.result.verdict.hasInferredComponents) {
            addressResponse.result.address.addressComponents.forEach(
                (component) => {
                    if (component.inferred === true) {
                        if (component.componentType === "locality") {
                            setCity(component.componentName.text);
                        } else if (component.componentType === "postal_code") {
                            setZipCode(component.componentName.text);
                        } else if (component.componentType === "subpremise") {
                            setSecondAddressLine(component.componentName.text);
                        }
                    }
                }
            );
        }

        if (
            addressResponse.result.verdict.hasUnconfirmedComponents ||
            addressResponse.result.address.missingComponentTypes ||
            addressResponse.result.verdict.validationGranularity === "OTHER" ||
            addressResponse.result.address.unresolvedTokens
        ) {
            const unconfirmedComponents =
                addressResponse.result.address.unconfirmedComponentTypes;
            let unconfirmedErrors = [];
            if (unconfirmedComponents) {
                unconfirmedComponents?.forEach((component) => {
                    if (component === "route") {
                    unconfirmedErrors.push("Street: Please provide a valid street name.");
                    } else if (component === "locality") {
                        unconfirmedErrors.push("City: Please provide a valid city.");
                    } else if (component === "postal_code") {
                        unconfirmedErrors.push("Zip Code: Please provide a valid Zip Code.");
                    } else if (component === "street_number") {
                        unconfirmedErrors.push("Street Number: Please provide a valid Street Number.");
                    } else if (component === "subpremise") {
                        unconfirmedErrors.push("Apt/Suite/Unit: Please provide a valid apt/suite/unit number.");
                    } else if (
                        component === "administrative_area_level_3" ||
                        component === "administrative_area_level_1" ||
                        component === "administratrive_area_level_2"
                    ) {
                        unconfirmedErrors.push("State: Please provide a valid state.");
                    }
                });
            }

            const missingComponents =
                addressResponse.result.address.missingComponentTypes;
            let missingErrors = [];
            if (missingComponents) {
                missingComponents?.forEach((component) => {
                    if (component === "route") {
                        missingErrors.push(
                            "Street: Please provide a valid street name."
                        );
                    } else if (component === "locality") {
                        missingErrors.push(
                            "City: Please provide a valid city."
                        );
                    } else if (component === "postal_code") {
                        missingErrors.push(
                            "Zip Code: Please provide a valid Zip Code."
                        );
                    } else if (component === "street_number") {
                        missingErrors.push(
                            "Street Number: Please provide a valid Street Number."
                        );
                    } else if (component === "subpremise") {
                        missingErrors.push(
                            "Apt/Suite/Unit: Please provide a valid apt/suite/unit number."
                        );
                    } else if (
                        component === "administrative_area_level_3" ||
                        component === "administrative_area_level_1" ||
                        component === "administratrive_area_level_2"
                    ) {
                        missingErrors.push(
                            "State: Please provide a valid Owner State."
                        );
                    }
                });
            }

            if (addressResponse.result.address.unresolvedTokens) {
                setErrors(["Invalid Input: Please provide a valid address."]);
            } else if (unconfirmedErrors[0] && missingErrors[0]) {
                setErrors([...unconfirmedErrors, ...missingErrors]);
            } else if (unconfirmedErrors[0]) {
                setErrors([...unconfirmedErrors]);
            } else if (missingErrors[0]) {
                setErrors([...missingErrors]);
            }
        }
    };

    const handleOwnerGoogleResponse = (addressResponse) => {
        if (addressResponse.result.verdict.hasReplacedComponents) {
            addressResponse.result.address.addressComponents.forEach(
                (component) => {
                    if (component.replaced === true) {
                        if (component.componentType === "locality") {
                            setOwnerCity(component.componentName.text);
                        } else if (component.componentType === "postal_code") {
                            setOwnerZipCode(component.componentName.text);
                        } else if (component.componentType === "subpremise") {
                            setOwnerSecondAddressLine(
                                component.componentName.text
                            );
                        }
                    }
                }
            );
        }

        if (addressResponse.result.verdict.hasInferredComponents) {
            addressResponse.result.address.addressComponents.forEach(
                (component) => {
                    if (component.inferred === true) {
                        if (component.componentType === "locality") {
                            setOwnerCity(component.componentName.text);
                        } else if (component.componentType === "postal_code") {
                            setOwnerZipCode(component.componentName.text);
                        } else if (component.componentType === "subpremise") {
                            setOwnerSecondAddressLine(
                                component.componentName.text
                            );
                        }
                    }
                }
            );
        }

        if (
            addressResponse.result.verdict.hasUnconfirmedComponents ||
            addressResponse.result.address.missingComponentTypes ||
            addressResponse.result.verdict.validationGranularity === "OTHER" ||
            addressResponse.result.address.unresolvedTokens
        ) {
            const unconfirmedComponents =
                addressResponse.result.address.unconfirmedComponentTypes;
            let unconfirmedErrors = [];
            if (unconfirmedComponents) {
                unconfirmedComponents.forEach((component) => {
                    if (component === "route") {
                        unconfirmedErrors.push(
                            "Owner Street: Please provide a valid Owner street name."
                        );
                    } else if (component === "locality") {
                        unconfirmedErrors.push(
                            "Owner City: Please provide a valid Owner city."
                        );
                    } else if (component === "postal_code") {
                        unconfirmedErrors.push(
                            "Owner Zip Code: Please provide a valid Owner Zip Code."
                        );
                    } else if (component === "street_number") {
                        unconfirmedErrors.push(
                            "Owner Street Number: Please provide a valid Owner Street Number."
                        );
                    } else if (component === "subpremise") {
                        unconfirmedErrors.push(
                            "Owner Apt/Suite/Unit: Please provide a valid Owner apt/suite/unit number."
                        );
                    } else if (
                        component === "administrative_area_level_3" ||
                        component === "administrative_area_level_1" ||
                        component === "administratrive_area_level_2"
                    ) {
                        unconfirmedErrors.push(
                            "State: Please provide a valid Owner State."
                        );
                    }
                });
            }

            const missingComponents =
                addressResponse.result.address.missingComponentTypes;
            let missingErrors = [];
            if (missingComponents) {
                missingComponents?.forEach((component) => {
                    if (component === "route") {
                        missingErrors.push(
                            "Owner Street: Please provide a valid Owner street name."
                        );
                    } else if (component === "locality") {
                        missingErrors.push(
                            "Owner City: Please provide a valid Owner city."
                        );
                    } else if (component === "postal_code") {
                        missingErrors.push(
                            "Owner Zip Code: Please provide a valid Owner Zip Code."
                        );
                    } else if (component === "street_number") {
                        missingErrors.push(
                            "Owner Street Number: Please provide a valid Owner Street Number."
                        );
                    } else if (component === "subpremise") {
                        missingErrors.push(
                            "Owner Apt/Suite/Unit: Please provide a valid Owner apt/suite/unit number."
                        );
                    } else if (component === "point_of_interest") {
                        missingErrors.push(
                            "Invalid Input: Please provide a valid Owner address."
                        );
                    }
                });
            }

            if (addressResponse.result.address.unresolvedTokens) {
                setOwnerErrors([
                    "Invalid Input: Please provide a valid Owner Address.",
                ]);
            } else if (unconfirmedErrors[0] && missingErrors[0]) {
                setOwnerErrors([...unconfirmedErrors, ...missingErrors]);
            } else if (unconfirmedErrors[0]) {
                setOwnerErrors([...unconfirmedErrors]);
            } else if (missingErrors[0]) {
                setOwnerErrors([...missingErrors]);
            }
        }

        setGoogleResponse(true);
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setOwnerErrors([]);
        setGoogleResponse(false);
        const response = await fetch(
            `https://addressvalidation.googleapis.com/v1:validateAddress?key=${api_key}`,
            {
                method: "POST",
                body: JSON.stringify({
                    address: {
                        revision: 0,
                        addressLines: [
                            firstAddressLine,
                            secondAddressLine,
                            `${city}, ${state} ${zipCode}`,
                        ],
                    },
                    previousResponseId: "",
                    enableUspsCass: true,
                }),
            }
        );
        if (response.ok) {
            const addressResponse = await response.json();

            setLat(addressResponse?.result?.geocode?.location?.latitude);
            setLng(addressResponse?.result?.geocode?.location?.longitude);

            await handleGoogleResponse(addressResponse);
        } else {
            setErrors(["Invalid Address: Please provide a valid address."]);
        }

        if (
            ownerFirstAddressLine ||
            ownerState ||
            ownerZipCode ||
            ownerSecondAddressLine ||
            ownerCity
        ) {
            const response = await fetch(
                `https://addressvalidation.googleapis.com/v1:validateAddress?key=${api_key}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        address: {
                            revision: 0,
                            addressLines: [
                                ownerFirstAddressLine,
                                ownerSecondAddressLine,
                                `${ownerCity}, ${ownerState} ${ownerZipCode}`,
                            ],
                        },
                        previousResponseId: "",
                        enableUspsCass: true,
                    }),
                }
            );
            if (response.ok) {
                const addressResponse = await response.json();

                await handleOwnerGoogleResponse(addressResponse);
            } else {
                setOwnerErrors([
                    "Invalid Owner Address: Please provide a valid Owner Address.",
                ]);
            }
        } else {
            setGoogleResponse(true);
        }
        document.getElementById('modal-content').scrollTop = 0
    };

    useEffect(() => {
        if (googleResponse) {
            if (!errors[0] && !ownerErrors[0]) {
                submitNewAddress();
            }
        }
        // eslint-disable-next-line
    }, [googleResponse, errors, ownerErrors]);

    const submitNewAddress = async () => {
        const data = await dispatch(
            addAddress({
                firstAddressLine,
                secondAddressLine,
                city,
                state,
                zipCode,
                ownerName,
                ownerEmail,
                ownerFirstAddressLine,
                ownerSecondAddressLine,
                ownerCity,
                ownerState,
                ownerZipCode,
                notes,
                nextInspectionDate,
                lat,
                lng,
            })
        );
        if (data.errors) {
            setErrors(data.errors);
        } else {
            await closeModal();
            history.push(`/address/${data.id}`);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="pad0t pad30lr fdcol w30vw ofhidden h100p">
            <h1 className="marlrauto mar10b">Add Address</h1>
            <form onSubmit={HandleSubmit}>
                {(errors.length > 0 || ownerErrors.length > 0) && (
                    <div className="errors-div" id='errors-div'>
                        {errors.length > 0 &&
                            errors.map((error, ind) => (
                                <div key={ind}>- {error.split(":")[1]}</div>
                            ))}
                        {ownerErrors.length > 0 &&
                            ownerErrors.map((error, ind) => (
                                <div key={ind}>- {error.split(":")[1]}</div>
                            ))}
                    </div>
                )}
                <div className="fdcol mar20b">
                    <label>Street Address *</label>
                    <input
                        type="text"
                        name="firstAddressLine"
                        placeholder="123 Streetname Ave"
                        onChange={(e) => setFirstAddressLine(e.target.value)}
                        value={firstAddressLine}
                        required={true}
                        className="iflight bnone h40px"
                    ></input>
                </div>
                <div className="fdcol mar20b">
                    <label>Apt, suite, or unit{'       '}<small>{'(required if applicable)'}</small></label>
                    <input
                        type="text"
                        name="secondAddressLine"
                        placeholder="apt, suite, or unit"
                        onChange={(e) => setSecondAddressLine(e.target.value)}
                        value={secondAddressLine}
                        className="iflight bnone h40px"
                    ></input>
                </div>
                <div className="fdcol mar20b">
                    <label>City *</label>
                    <input
                        type="text"
                        name="City"
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="city"
                        value={city}
                        required={true}
                        className="iflight bnone h40px"
                    ></input>
                </div>
                <div className="fdcol mar20b">
                    <label>State *</label>
                    <select
                        type="select"
                        name="state"
                        onChange={(e) => setState(e.target.value)}
                        required={true}
                        defaultValue=""
                        className="iflight bnone h40px state"
                    >
                        <option disabled value="">
                            {" "}
                            -- select a State --{" "}
                        </option>
                        {stateOptions}
                    </select>
                </div>
                <div className="fdcol mar20b">
                    <label>Zip Code *</label>
                    <input
                        type="text"
                        name="zipCode"
                        placeholder="zip code"
                        onChange={(e) => setZipCode(e.target.value)}
                        value={zipCode}
                        required={true}
                        className="iflight bnone h40px"
                    ></input>
                </div>
                <div className="fdcol mar20b">
                    <label>Owner Name</label>
                    <input
                        type="text"
                        name="ownerName"
                        placeholder="owner name"
                        onChange={(e) => setOwnerName(e.target.value)}
                        value={ownerName}
                        className="iflight bnone h40px"
                    ></input>
                </div>

                <div className="fdcol mar20b">
                    <label>Owner Email *</label>
                    <input
                        type="text"
                        name="ownerEmail"
                        placeholder="owner email"
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        value={ownerEmail}
                        className="iflight bnone h40px"
                        required
                    ></input>
                </div>
                <div className="fdcol mar20b">
                    <label>Owner Street Address{'       '}<small>{'(required if applicable)'}</small></label>
                    <input
                        type="text"
                        name="ownerFirstAddressLine"
                        placeholder="123 Streetname Ave"
                        onChange={(e) =>
                            setOwnerFirstAddressLine(e.target.value)
                        }
                        value={ownerFirstAddressLine}
                        className="iflight bnone h40px"
                    ></input>
                </div>
                <div className="fdcol mar20b">
                    <label>Owner apt, suite, or unit{'       '}<small>{'(required if applicable)'}</small></label>
                    <input
                        type="text"
                        name="ownerSecondAddressLine"
                        placeholder="apt, suite, or unit"
                        onChange={(e) =>
                            setOwnerSecondAddressLine(e.target.value)
                        }
                        value={ownerSecondAddressLine}
                        className="iflight bnone h40px"
                    ></input>
                </div>
                <div className="fdcol mar20b">
                    <label>Owner City{'       '}<small>{'(required if applicable)'}</small></label>
                    <input
                        type="text"
                        name="ownerCity"
                        placeholder="city"
                        onChange={(e) => setOwnerCity(e.target.value)}
                        value={ownerCity}
                        className="iflight bnone h40px"
                    ></input>
                </div>
                <div className="fdcol mar20b">
                    <label>Owner State{'       '}<small>{'(required if applicable)'}</small></label>
                    <select
                        type="select"
                        name="ownerState"
                        placeholder="state"
                        onChange={(e) => setOwnerState(e.target.value)}
                        defaultValue=""
                        className="iflight bnone h40px"
                    >
                        <option value=""> -- select a State -- </option>
                        {stateOptions}
                    </select>
                </div>
                <div className="fdcol mar20b">
                    <label>Owner Zip Code{'       '}<small>{'(required if applicable)'}</small></label>
                    <input
                        type="text"
                        name="ownerZipCode"
                        placeholder="zip code"
                        onChange={(e) => setOwnerZipCode(e.target.value)}
                        value={ownerZipCode}
                        className="iflight bnone h40px"
                    ></input>
                </div>
                <div className="fdcol mar20b">
                    <label>Notes:</label>
                    <input
                        type="text"
                        name="notes"
                        placeholder="notes"
                        onChange={(e) => setNotes(e.target.value)}
                        value={notes}
                        className="iflight bnone h40px"
                    ></input>
                </div>
                <div className="fdcol mar20b">
                    <label>Next Inspection Date:</label>
                    <input
                        type="date"
                        name="nextInspectionDate"
                        min={date}
                        onChange={(e) => setNextInspectionDate(e.target.value)}
                        value={nextInspectionDate}
                        className="iflight bnone h40px"
                    ></input>
                </div>
                <div className="jccen mar30t">
                    <button type="submit" className="w100p h50px btndark pad0">
                        Add Address
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAddressForm;
