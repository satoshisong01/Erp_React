import React, { useContext, useEffect, useState } from "react";
import "./ModalSearch.css";
import { PageContext } from "components/PageProvider";
import ModalPageCompany from "./ModalPageCompany";

export default function ModalSearchCompany({ stableData, tableData }) {
    const { companyInfo, setIsOpenModalPgNm, isOpenModalPgNm, setSaveCompany } = useContext(PageContext);

    const [newData, setNewData] = useState([]);
    const [saveCount, setSaveCount] = useState([]);

    useEffect(() => {
        setSaveCompany({});
    }, []);

    useEffect(() => {
        if (stableData > -1) {
            setSaveCount(stableData);
        }
    }, [stableData]);

    useEffect(() => {
        // tableData가 빈 값이 아닌 경우에만 newData를 업데이트합니다.
        if (tableData.length > 0) {
            const updatedData = Array.from({ length: tableData.length }, (_, index) => ({
                [index]: "aaa",
            }));
            setNewData(updatedData);
        }
    }, [tableData]);

    return (
        <div>
            <input
                onClick={() => setIsOpenModalPgNm(true)}
                type="text"
                placeholder={`협력사명을 선택해 주세요.`}
                value={companyInfo.cltNm}
                readOnly
            />
            {isOpenModalPgNm && (
                <ModalPageCompany
                    onClose={() => {
                        setIsOpenModalPgNm(false);
                    }}
                />
            )}
        </div>
    );
}
