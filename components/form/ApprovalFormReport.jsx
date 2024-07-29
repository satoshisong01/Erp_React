import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "components/PageProvider";
import ProjectModal from "components/modal/ProjectModal";
import { axiosFetch } from "api/axiosFetch";
import { v4 as uuidv4 } from "uuid";

/** 조회 보고서용 */
function ApprovalFormReport({ returnData, type, viewPageName }) {
    const { innerPageName, currentPageName, inquiryConditions } = useContext(PageContext);
    const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);
    const [data, setData] = useState({ poiId: "", poiNm: "", versionId: "", option: [] });

    useEffect(() => {
        if(innerPageName?.id === viewPageName?.id || currentPageName?.id === viewPageName?.id) { //현재페이지일때
            if(inquiryConditions.poiId) { //전역정보 바뀔때
                getVersionList({ poiId: inquiryConditions.poiId })
            }
        }
    }, [inquiryConditions, innerPageName, currentPageName]);


    useEffect(() => {
        if(type === "수주보고서" || type === "견적품의서") { //영업
            if (data.poiId && !data.versionId) {
                //선택된 버전정보가 없다면
                getVersionList({ poiId: data.poiId });
            } else if (data.versionId) {
                returnData && returnData(data); //부모로 보내기
            }
        } else if(type === "완료보고서") { //실행
            returnData && returnData(data);
        }
    }, [data]);

    const getVersionList = async (requestData) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", requestData || {});
        const emptyArr = resultData && resultData.map(({ versionId, versionNum, versionDesc, costAt }) => ({ versionId, versionNum, versionDesc, costAt }));
        if (emptyArr?.length > 0) {
            setData((prev) => ({
                ...prev,
                ...inquiryConditions,
                versionId: inquiryConditions.versionId ? inquiryConditions.versionId : emptyArr.find((info) => info.costAt === "Y")?.versionId || emptyArr[0]?.versionId,
                versionNum: emptyArr.find((info) => info.costAt === "Y")?.versionNum || emptyArr[0]?.versionNum,
                option: emptyArr,
            }));
        }
    };

    const onSelectChange = (e) => {
        const { name, value, innerText } = e.target;
        const versionNum = innerText.split('\n')[0];
        if (value !== "default") {
            setData((prev) => ({
                ...prev,
                [name]: value,
                ["versionNum"]: versionNum
            }));
        }
    };

    const onChangeProject = (value) => { //프로젝트변경
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
                                    {data.option?.length > 0 && data.option.map((info, index) => (
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ApprovalFormReport;
