import React from 'react';

function EgovFooter() {
    return (
        <div className="footer">
            <div className="inner">
                <div className="info" style={{textAlign: 'center'}}>
                    <p>
                        대표문의메일 : MASTER@meccatech.co.kr  <span className="m_hide">|</span><br className="m_show" />  대표전화 : 031-376-7567
                    </p>
                    <p className="copy"> 18467 경기도 화성시 동탄대로 636-3 메가비즈타워 C동 13층</p>
                </div>
            </div>
        </div>
    );
}

export default EgovFooter;