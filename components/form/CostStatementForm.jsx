import React, { useState } from "react";
import "./ApprovalForm.css";
import ModalSearch from "components/modal/ModalSearch";
function CostStatementForm({ title, children }) {
    const [stateTitle, setStateTitle] = useState("finished");

    const handleClose = () => {
        window.close();
    };

    //function getStateElement(stateTitle) {
    //    if (stateTitle === "before") {
    //        return (
    //            <div className="stateName stateNameB">
    //                <span className="dotPoint dotPointB">●</span>
    //                <span className="stateNameTitle stateNameTitleB">
    //                    시작 전
    //                </span>
    //            </div>
    //        );
    //    } else if (stateTitle === "working") {
    //        return (
    //            <div className="stateName stateNameW">
    //                <span className="dotPoint dotPointW">●</span>
    //                <span className="stateNameTitle stateNameTitleW">
    //                    진행 중
    //                </span>
    //            </div>
    //        );
    //    } else if (stateTitle === "finished") {
    //        return (
    //            <div className="stateName stateNameF">
    //                <span className="dotPoint dotPointF">●</span>
    //                <span className="stateNameTitle stateNameTitleF">완료</span>
    //            </div>
    //        );
    //    } else {
    //        // 기본값이 필요하다면 이곳에 추가해주세요.
    //        return (
    //            <div className="stateName stateNameDefault">
    //                <span className="dotPoint dotDefault">●</span>
    //                <span className="stateNameTitle Default">기본 상태</span>
    //            </div>
    //        );
    //    }
    //}

    return (
        <>
            <div className="CostForm-title">
                <h1>{title}</h1>
            </div>
            <div className="newBody">
                <h6 className="won">단위:₩(원)</h6>
                <div className="TableBucket">
                    <table className="tableMain" border={1}>
                        <tbody className="tableBody tableBodyBot">
                            <tr className="tableTr">
                                <td className="table8-1-1">프로젝트명</td>
                                <td className="table8-2-2">FMCS 그룹</td>
                                <td className="table8-1-1">프로젝트코드</td>
                                <td className="table8-2-2">10조 프로젝트</td>
                            </tr>
                            <tr className="tableTr">
                                <td className="table8-1">수주부서</td>
                                <td className="table8-2">FMCS 그룹</td>
                                <td className="table8-1">매출부서</td>
                                <td className="table8-2">FMCS 그룹</td>
                                <td className="table8-1">영업대표</td>
                                <td className="table8-2">이수형 부장</td>
                                <td className="table8-1">담장자</td>
                                <td className="table8-2">손영훈 부장</td>
                            </tr>
                            <tr className="tableTr">
                                <td className="table8-1">매출부서</td>
                                <td className="table8-2">FMCS 그룹</td>
                                <td className="table8-1">시작일</td>
                                <td className="table8-2">2022/10/04</td>
                                <td className="table8-1">종료일</td>
                                <td className="table8-2">2022/12/30</td>
                                <td className="table8-1">상태</td>
                                <td className="table8-2">
                                    <div>
                                        <button className="working">
                                            수주등록
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div id="content">{children}</div>
                </div>
            </div>
        </>
    );
}

export default CostStatementForm;
