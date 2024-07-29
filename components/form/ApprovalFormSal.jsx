import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "components/PageProvider";
import ProjectModal from "components/modal/ProjectModal";
import { axiosFetch } from "api/axiosFetch";
import { v4 as uuidv4 } from "uuid";

/** 영업 폼 */
function ApprovalFormSal({ viewPageName, returnData }) {
    const { innerPageName, setInquiryConditions, inquiryConditions, currentPageName } = useContext(PageContext);
    const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);
    const [data, setData] = useState({ poiId: "", poiNm: "", versionId: "", option: [] });
    const [view, setView] = useState({}); //복사할 데이터의 버전 정보
    const [isInquiry, setIsInquiry] = useState(true); //연속 조회방지

    useEffect(() => {
        if (currentPageName?.id === viewPageName?.id || innerPageName?.id === viewPageName?.id) {
            //현재페이지일때
            if (inquiryConditions.poiId && inquiryConditions.versionId && isInquiry) {
                //전역정보 바뀔때
                getVersionList({ poiId: inquiryConditions.poiId }, "again");
            }
        } else {
            setIsInquiry(true); //페이지 바뀌면 다시 조회 가능하게 변경
        }
    }, [inquiryConditions, innerPageName, currentPageName]);

    useEffect(() => {
        if (currentPageName?.id === viewPageName?.id || innerPageName?.id === viewPageName?.id) {
            //현재페이지일때
            if (data.versionId) return;
            getVersionList({ poiId: data.poiId }, "first");
        }
    }, [data]);

    const getVersionList = async (requestData, type) => {
        if (type === "first") {
            //맨처음조회
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
            setView({
                ...data,
                versionId: emptyArr.find((info) => info.costAt === "Y")?.versionId || emptyArr[0]?.versionId,
                versionNum: emptyArr.find((info) => info.costAt === "Y")?.versionNum || emptyArr[0]?.versionNum,
                option: emptyArr,
            });
            setIsInquiry(false);
        } else if (type === "again") {
            //버전 재조회
            const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", requestData || {});
            const emptyArr = resultData && resultData.map(({ versionId, versionNum, versionDesc, costAt }) => ({ versionId, versionNum, versionDesc, costAt }));
            if (!resultData || resultData.length === 0) {
                alert("버전 정보가 없습니다.");
                return;
            }
            setData({
                ...inquiryConditions,
                option: emptyArr,
            });
            setView({
                ...inquiryConditions.view,
                option: emptyArr,
            });
        }
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

    const onSelectCopiedVersion = (e) => {
        const { name, value } = e.target;
        const versionNum = e.target.options[e.target.selectedIndex].text;
        if (value !== "default") {
            setView((prev) => ({
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
        if (currentPageName?.id === viewPageName?.id || innerPageName?.id === viewPageName?.id) {
            //현재페이지일때
            if (!data.versionId) {
                alert("버전을 생성하세요.");
                return;
            }
            setInquiryConditions({ ...data, view: view });
            returnData && returnData({ save: data, view: view });
        }
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
                            <th>기준연도</th>
                            <td>{data.poiMonth}</td>
                            <th>
                                <span className="cherry">*</span> 저장 버전
                            </th>
                            <td style={{ textAlign: "center" }}>
                                <select
                                    id={uuidv4()}
                                    className="basic-input select"
                                    name="versionId"
                                    onChange={onSelectChange}
                                    value={data.versionId ? data.versionId : "default"}
                                    style={{ marginRight: 10, height: 32 }}>
                                    {data.option?.length > 0 &&
                                        data.option.map((info, index) => (
                                            <option key={index} value={info.versionId}>
                                                {info.versionNum}
                                            </option>
                                        ))}
                                    {data.option?.length === 0 && <option value="default">버전을 생성하세요.</option>}
                                </select>
                            </td>
                            <th>조회 버전</th>
                            <td style={{ textAlign: "center" }}>
                                <select
                                    id={uuidv4()}
                                    className="basic-input select"
                                    name="versionId"
                                    onChange={onSelectCopiedVersion}
                                    value={view.versionId ? view.versionId : "default"}
                                    style={{ marginRight: 10, height: 32 }}>
                                    {view.option?.length > 0 &&
                                        view.option.map((info, index) => (
                                            <option key={index} value={info.versionId}>
                                                {info.versionNum}
                                            </option>
                                        ))}
                                    {view.option?.length === 0 && <option value="default">버전을 생성하세요.</option>}
                                </select>
                            </td>
                            <td width={100} style={{ textAlign: "center" }}>
                                {currentPageName.id === "OrderMgmt" || innerPageName.id === "proposal" ? (
                                    <button type="button" className="table-btn table-btn-default" onClick={onClick}>
                                        내용저장
                                    </button>
                                ) : (
                                    <button type="button" className="table-btn table-btn-default" onClick={onClick}>
                                        조회
                                    </button>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ApprovalFormSal;
