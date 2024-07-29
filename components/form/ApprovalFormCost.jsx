import React from "react";

/** 결재선 목록 */
function ApprovalFormCost(props) {
    const {
        children, //자식
        sendInfo, //발신부서(결재선)
    } = props;

    console.log(sendInfo, "sendInfo");

    return (
        <>
            <div className="form-style mg-t-10">
                <div className="flex-between mg-b-20" style={{ width: "100%" }}>
                    {/* <div className="box-container">
                        {receiveInfo && receiveInfo.length > 0 && <div className="box box-3">주<br/>관<br/>부<br/>서</div>}
                        {receiveInfo && receiveInfo.map((rec, index) => (
                            <div key={index} className="box-group">
                                <div className="box box-1">
                                    {rec.posNm}
                                </div>
                                <div className="box box-2">
                                    <p>{rec.empNm}</p>
                                    <p>{rec.state}</p>
                                </div>
                            </div>
                        ))}
                    </div> */}
                    <div className="box-container">
                        {sendInfo && sendInfo.length > 0 && (
                            <div className="box box-3">
                                발<br />신<br />부<br />서
                            </div>
                        )}
                        {sendInfo &&
                            sendInfo.map((send, index) => (
                                <div key={index} className="box-group">
                                    <div className="box box-1">{send.posNm}</div>
                                    <div className="box box-2">
                                        <p>{send.empNm}</p>
                                        <p>{send.state}</p>
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

export default ApprovalFormCost;
