import React, { useContext, useEffect, useState } from "react";
import "./ModalSearch.css";
import ModalPage from "./ModalPage";
import { PageContext } from "components/PageProvider";

export default function ModalSearch({}) {
    const { projectInfo, setProjectInfo } = useContext(PageContext);
    const [isOpenModal, setIsOpenModal] = useState(false)

    useEffect(() => {
        setProjectInfo({});
    }, []);

    return (
        <div>
            <input
                onClick={() => setIsOpenModal(true)}
                type="text"
                placeholder={projectInfo.poiNm ? projectInfo.poiNm : `프로젝트를 선택해 주세요.`}
                value={projectInfo.poiNm || ""}
                readOnly
            />
            {isOpenModal && (
                <ModalPage
                    onClose={() => {
                        setIsOpenModal(false);
                    }}
                />
            )}
        </div>
    );
}
