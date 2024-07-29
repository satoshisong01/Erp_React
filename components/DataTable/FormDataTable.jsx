import { PageContext } from "components/PageProvider";
import Status from "components/button/Status";
import DayPicker from "components/input/DayPicker";
import React, { useContext, useEffect, useRef, useState } from "react";
import "react-calendar/dist/Calendar.css";

export default function FormDataTable({ formTableColumns, onAddRow, title, useStatus }) {
    const { setNewRowData, setIsOpenModalCompany } = useContext(PageContext);
    
    const [initialFormData, setInitialFormData] = useState({})
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isUse, setIsUse] = useState(useStatus);


    const handleDateClick = (date, colName) => {
        setFormData((prevData) => ({
            ...prevData,
            [colName]: date,
        }));
        setErrors((prevErrors) => ({
            //에러 초기화
            ...prevErrors,
            [colName]: "",
        }));
    };

    useEffect(() => {
        formTableColumns.forEach((row) => {
            row.forEach(({ key }) => {
                setInitialFormData(prevData => {
                    return {
                        ...prevData,
                        [key]: ""
                    };
                });
            });
        });
        setFormData({...initialFormData});
    }, []);


    useEffect(() => {
        // 버튼 사용 여부
        setIsUse(useStatus);
    }, [useStatus]);

    const inputChange = (fieldName, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
        setErrors((prevErrors) => ({
            //에러 초기화
            ...prevErrors,
            [fieldName]: "",
        }));
    };


    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        formTableColumns.forEach((row) => {
            row.forEach(({ key, require }) => {
                if (require && !formData[key]) {
                    newErrors[key] = "This field is required.";
                    isValid = false;
                }
            });
        });

        setErrors(newErrors);
        return isValid;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if(title) {
                const updatedFormData = { ...formData, poiStatus: "작성완료", cltId: 77720230828004  }; // state 속성 변경
                setNewRowData(updatedFormData);
            } else {
                setNewRowData(...formData);
            }
            setFormData(initialFormData); // 초기화
        }
    };

    const onReset = () => {
        setFormData(initialFormData); // 초기화
        setErrors({});
    };

    return (
        <>
            {isUse && (
                <div className="flex-between mg-b-10">
                    <span className="table-title">{title}</span>
                    <span>
                        <button onClick={onReset} className="btn-outline mg-r-10" type="submit">
                            초기화
                        </button>
                        <button onClick={onSubmit} className="btn-outline" type="submit">
                            등록
                        </button>
                    </span>
                </div>
            )}
            <div className="table-Container">
                <form onSubmit={onSubmit}>
                    <table className="table-styled">
                        <tbody>
                            {formTableColumns.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map(({ label, key, type, colSpan, option, require, value }, colIndex) => {
                                        return (
                                            <React.Fragment key={colIndex}>
                                                <th>
                                                    <span>{label}</span>
                                                    {require && <span className="text-danger mg-l-5">*</span>}
                                                </th>
                                                {type === "input" ? (
                                                    <td colSpan={colSpan || "1"}>
                                                        <input
                                                            id={key}
                                                            type="text"
                                                            value={formData[key]}
                                                            onChange={(e) => inputChange(key, e.target.value)}
                                                        />
                                                        {errors[key] && <div className="text-error-color">{errors[key]}</div>}
                                                    </td>
                                                ) : type === "select" ? (
                                                    <td colSpan={colSpan || "1"}>
                                                        <select
                                                            id={key}
                                                            value={formData[key]}
                                                            onChange={(e) => inputChange(key, e.target.value)}
                                                        >
                                                            <option value="">선택</option>
                                                            {option.map((op) => (
                                                                <option key={op} value={op}>
                                                                    {op}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors[key] && <div className="text-error-color">{errors[key]}</div>}
                                                    </td>
                                                ) : type === "daypicker" ? (
                                                    <td colSpan={colSpan || "1"}>
                                                        <DayPicker
                                                            name={key}
                                                            value={formData[key] || ""}
                                                            onClick={(date) => handleDateClick(date, key)}
                                                        />
                                                    </td>
                                                ) : type === "buttonCompany" ? (
                                                    <div>
                                                        <input
                                                            className="buttonSelect"
                                                            id={key + rowIndex}
                                                            name={key}
                                                            onClick={() => setIsOpenModalCompany(true)}
                                                            type="text"
                                                            placeholder={`거래처명을 선택해 주세요.`}
                                                            value={formData[key] || ""}
                                                            // onChange={(e) => handleChange(e, column)}
                                                            readOnly
                                                        />
                                                    </div>
                                                ) : label === "상태" ? (
                                                    <td colSpan={colSpan || "1"}>
                                                        <span>
                                                            <Status status={formData[key]="작성중"} />
                                                        </span>
                                                    </td>
                                                ) : type === "data" ? (
                                                    <td colSpan={colSpan || "1"}>
                                                        <span>{value}</span>
                                                    </td>
                                                ) : null}
                                            </React.Fragment>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
            </div>
        </>
    );
}
