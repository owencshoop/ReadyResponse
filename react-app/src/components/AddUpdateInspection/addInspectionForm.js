import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSingleInspection } from "../../store/inspections";
import QuestionCategory from "./questionCategory";
import { useParams, useHistory } from "react-router-dom";
import { updateInspection } from "../../store/inspections";
import './addInspectionForm.css'

const AddInspectionForm = () => {
    const { addressId, inspectionId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory()
    const inspection = useSelector(
        (state) => state.inspections.singleInspection
    );
    const inspectionType = useSelector(
        (state) => state.inspectionTypes.singleInspectionType
    );
    const [loaded, setLoaded] = useState(false);

    const inspectionQuestionCategories = inspectionType?.question_categories;

    const content = inspectionQuestionCategories?.map((category) => {
        return (
            <QuestionCategory key={category.id} category={category} inspection={inspection}/>
        )
    });

    const handleSubmitInspection = async (e) => {
        e.preventDefault()
        await dispatch(loadSingleInspection(inspectionId))
        let passing = true
        const failedQuestions = inspection.inspectionAnswers.filter(answer => answer.passing === false)
        if (failedQuestions.length){
            passing = false
        }
        await dispatch(updateInspection(inspection.id, {addressId, inspectionTypeId: inspectionType.id, inspectionNumber: inspection.inspectionNumber, passing: passing, notes: inspection.notes}))
        history.push(`/inspection/${inspectionId}`)
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        dispatch(loadSingleInspection(inspectionId)).then(() =>
            setLoaded(true)
        );
    }, [dispatch, inspectionId]);

    if (!loaded) {
        return null;
    }

    return (
        <>
            {loaded && (
                <div className="inspection-container">
                    <h1 className="inspection-header">{inspectionType.type} Inspection</h1>
                    <div className="inspection-content-container">{content}</div>
                    <div className="submit-inspection-button-container">
                        <button className="submit-inspection-button" onClick={handleSubmitInspection}>Submit Inspection</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddInspectionForm;
