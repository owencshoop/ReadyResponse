const ALL_INSPECTIONS = 'inspections/ALL_INSPECTIONS'
const SINGLE_INSPECTION = 'inspections/SINGLE_INSPECTION';
const DELETE_INSPECTION = 'inspections/DELETE_INSPECTION'

const allInspections = (inspections) => ({
    type: ALL_INSPECTIONS,
    payload: inspections
})

const singleInspection = (inspection) => ({
    type: SINGLE_INSPECTION,
    payload: inspection,
})

const deleteSingleInspection = (id) => ({
    type: DELETE_INSPECTION,
    payload: id,
})

export const loadAllInspections = () => async (dispatch) => {
    const response = await fetch('/api/inspection/')

    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return
        }
        dispatch(allInspections(data))
        return
    }
}

export const loadSingleInspection = (id) => async (dispatch) => {
    const response = await fetch(`/api/inspection/${id}`)

    if (response.ok) {
        const data = await response.json()
        if (data.errors) {
            return
        }
        dispatch(singleInspection(data))
        return;
    }
}

export const deleteInspection = (id) => async (dispatch) => {
    const response = await fetch(`/api/inspection/${id}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const data = await response.json()
        if (data.errors) {
            return
        }
        dispatch(deleteSingleInspection(id))
        return
    }
}

export const addInspection = (inspection) => async (dispatch) => {
    const response = await fetch(`/api/inspection/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inspection),
    })

    if (response.ok) {
        const data = await response.json()
        await dispatch(singleInspection(data))
        return data
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
            return data;
        }
    } else {
        return ["An error occurred. Please try again."];
    }
}

export const updateInspection = (id, inspection) => async (dispatch) => {
    const response = await fetch(`/api/inspection/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inspection),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(singleInspection(data));
        return null;
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ["An error occurred. Please try again."];
    }
};

export const updateInspectionAnswer = (id, inspectionAnswer) => async (dispatch) => {
    const response = await fetch(`/api/inspection/${id}/answer`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inspectionAnswer)
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(singleInspection(data))
        return null
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ["An error occurred. Please try again."];
    }
}

const initialState = {allInspections: null, singleInspection: null}

export default function reducer(state = initialState, action) {
    let newState = {};
    switch(action.type) {
        case ALL_INSPECTIONS:
            newState = {
                ...state,
                allInspections: {...action.payload},
                singleInspection: {...state.singleAddress}
            }
            return newState
        case SINGLE_INSPECTION:
            newState = {
                ...state,
                singleInspection: {...action.payload},
                allInspections: {...state.allInspections}
            }
            return newState
        case DELETE_INSPECTION:
            newState = {
                ...state,
                singleInspection: null,
                allInspections: {...state.allInspections}
            }
            delete newState.allInspections[action.payload]
            return newState
        default:
            return state;
    }
}