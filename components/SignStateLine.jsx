import React from "react";

/** 결재선 목록 */
function SignStateLine(props) {
    const {
        children, //자식
        signStateData, //승인자목록
    } = props;

    const formattedDate = (date) => {
        const datePart = date.split(" ")[0];
        return datePart;
    };

    //최초 결재선은 서버에 데이터가 없기에 0번째(요청자 에만 "요청"을 추가해줬음)
    if (Array.isArray(signStateData) && signStateData.length > 0) {
        if (typeof signStateData[0] === "object" && signStateData[0] !== null) {
            if (!("sttApproverAt" in signStateData[0])) {
                signStateData[0].sttApproverAt = "요청";
            }
        }
    }

    return (
        <>
            <div className="form-style mg-t-10">
                <div className="flex-between mg-b-20" style={{ width: "100%" }}>
                    <div className="box-container">
                        {signStateData && signStateData.length > 0 && (
                            <div className="box box-3">
                                결<br />재<br />선
                            </div>
                        )}
                        {signStateData &&
                            signStateData.map((send, index) => (
                                <div key={index} className="box-group">
                                    <div className="box box-1">{send.posNm ? send.posNm : send.sttApproverPosNm}</div>
                                    <div className="box box-2">
                                        <p>{send.empNm ? send.empNm : send.sttApproverNm}</p>
                                        <p style={{ fontWeight: "bold" }}>{send.sttApproverAt}</p>
                                        {send.sttPaymentDate && <p style={{ fontSize: 10.5 }}>({formattedDate(send.sttPaymentDate)})</p>}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="form-children">{children}</div>
            </div>
        </>
    );
}

export default SignStateLine;
