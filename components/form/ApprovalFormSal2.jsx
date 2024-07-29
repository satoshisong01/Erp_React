import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "components/PageProvider";
import ProjectModal from "components/modal/ProjectModal";
import { axiosFetch } from "api/axiosFetch";
import { v4 as uuidv4 } from "uuid";

/** 영업 폼 */
function ApprovalFormSal2({ returnData, projectInfo }) {
    const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);
    const [data, setData] = useState({
        poiId: projectInfo.poiId,
        poiNm: projectInfo.poiNm,
        versionId: "",
        versionNum: "",
        option: [],
    });

    useEffect(() => {
        setData({ poiId: projectInfo.poiId, poiNm: projectInfo.poiNm });
    }, []);

    useEffect(() => {
        if (data.versionId) return;
        getVersionList({ poiId: data.poiId }, "first");
    }, [data]);

    const getVersionList = async (requestData, type) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", requestData || {});
        const emptyArr = resultData && resultData.map(({ versionId, versionNum, versionDesc, costAt }) => ({ versionId, versionNum, versionDesc, costAt }));
        if (!resultData || resultData.length === 0) {
            alert("버전 정보가 없습니다.");
            return;
        }
        setData((prev) => ({
            ...prev, //onChangeProject() 데이터 유지
            versionId: emptyArr.find((info) => info.costAt === "Y")?.versionId || emptyArr[0]?.versionId,
            versionNum: emptyArr.find((info) => info.costAt === "Y")?.versionNum || emptyArr[0]?.versionNum,
            option: emptyArr,
        }));
    };

    const onSelectChange = (e) => {
        const { name, value } = e.target;
        const versionNum = e.target.options[e.target.selectedIndex].text;
        if (value !== "default") {
            setData((prev) => ({
                ...prev,
                [name]: value,
                versionNum: versionNum,
            }));
        }
    };

    const onChangeProject = (value) => {
        //프로젝트변경
        setData({
            poiId: value.poiId,
            poiNm: value.poiNm,
            poiDesc: value.poiDesc,
            poiMonth: value.poiMonth,
            poiBeginDt: value.poiBeginDt,
            poiManagerId: value.poiManagerId,
            poiSalmanagerId: value.poiSalmanagerId,
        });
    };

    const onClick = () => {
        if (!data.versionId) {
            alert("버전을 생성하세요.");
            return;
        }
        console.log(data, "돌려주는것좀보자");
        returnData && returnData({ ...data });
    };

    return (
        <>
            <div className="approval-form mg-b-40">
                <table className="table-styled header-width" style={{ border: "solid 1px #ddd" }}>
                    <tbody>
                        <tr>
                            <th>
                                <span className="cherry">*</span> 프로젝트명
                            </th>
                            <td colSpan={2}>
                                <input
                                    id={uuidv4()}
                                    className="basic-input"
                                    name="poiNm"
                                    onClick={() => setIsOpenProjectModal(true)}
                                    value={data.poiNm || ""}
                                    placeholder="프로젝트를 선택하세요."
                                    readOnly
                                />
                                {isOpenProjectModal && (
                                    <ProjectModal
                                        width={500}
                                        height={710}
                                        onClose={() => setIsOpenProjectModal(false)}
                                        title="프로젝트 목록"
                                        returnInfo={onChangeProject}
                                    />
                                )}
                            </td>
                            <th>
                                <span className="cherry">*</span> 사전원가 버전
                            </th>
                            <td>
                                <select
                                    id={uuidv4()}
                                    className="basic-input select"
                                    name="versionId"
                                    onChange={onSelectChange}
                                    value={data.versionId ? data.versionId : "default"}>
                                    {data.option?.length > 0 &&
                                        data.option.map((info, index) => (
                                            <option key={index} value={info.versionId}>
                                                {info.versionNum}
                                            </option>
                                        ))}
                                    {data.option?.length === 0 && <option value="default">버전을 생성하세요.</option>}
                                </select>
                            </td>
                            <th>기준연도</th>
                            <td>{data.poiMonth}</td>
                            <th>최종 수정일</th>
                            <td>{data.lastModifyDate}</td>
                            <td width={80} style={{ textAlign: "center" }}>
                                <button type="button" className="table-btn table-btn-default" onClick={onClick}>
                                    내용저장
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ApprovalFormSal2;
