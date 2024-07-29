import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { selectSnb } from 'components/tabs/TabsActions';
import NavLinkTabs from "components/tabs/NavLinkTabs";
import store from "store/configureStore";

/* 기준정보관리 네비게이션 */
function EgovLeftNavReference(props) {
    const { lnbId, snbId } = props;
    const [activeSub, setActiveSub] = useState("");
    const [activeLabel, setActiveLabel] = useState("");

    /* header 또는 tabs에서 선택된 라벨을 저장  */
    useEffect(() => {
        const propsId = lnbId || snbId;
        let parentId = "";

        for (const item of menuItems) {
            if (item.id === propsId) {
                parentId = item.id;
                break;
            }

            for (const subMenu of item.subMenus) {
                if (subMenu.id === propsId) {
                    parentId = item.id;
                    break;
                }
            }
        }
        setActiveSub(lnbId || snbId);
        if (activeLabel !== parentId) setActiveLabel(parentId);
    }, [lnbId, snbId]);

    const clickHandle = (menuItem, subMenu) => {
        if(subMenu === null || subMenu === undefined) { //하위 없을때
            const label = menuItem.subMenus && menuItem.subMenus.length > 0 ? menuItem.subMenus[0].label : menuItem.label;
            const id = menuItem.subMenus && menuItem.subMenus.length > 0 ? menuItem.subMenus[0].id : menuItem.id;
            setActiveLabel(id);
            setActiveSub(id);
            store.dispatch(selectSnb(label, menuItem.id));
        } else if(subMenu !== null || subMenu !== undefined) {
            setActiveSub(subMenu.id);
            store.dispatch(selectSnb(subMenu.label, subMenu.id));
        }
    };

    const menuItems = [
        {
            label: "품목관리",
            id: "ItemGroupMgmt", 
            subMenus: [
                { label: "품목그룹", id: "ItemGroupMgmt" },
                { label: "품목상세", id: "ItemDetailMgmt" }
            ],
        },
        {
            label: "거래처관리",
            id: "CustomerMgmt", 
            subMenus: [
                { label: "고객사", id: "CustomerMgmt" },
                { label: "협력사", id: "PartnerMgmt" }
            ],
        },
        {
            label: "원가기준관리",
            id: "LaborRate",
            subMenus: [
                { label: "외주사인건비", id: "LaborRate" },
                { label: "급별단가(인건비)", id: "GradeWageLaborCost" },
                { label: "급별단가(경비)", id: "GradeWageExpense" },
                { label: "사전원가지표", id: "CostIndex" },
            ],
        },
    ];

    return (
        <div className="layout">
            <div className="nav">
                <div className="inner">
                    <h2>기준정보관리</h2>
                    <ul className="menu4">
                        {menuItems.map((menuItem) => (
                            <li key={menuItem.label}>
                                <NavLinkTabs
                                    to="#"
                                    onClick={(e) => clickHandle(menuItem) }
                                    activeName={activeLabel === menuItem.id ? menuItem.label : null}
                                    styled={`padding-x ${menuItem.subMenus.length > 0 ? '' : 'libg'}`}
                                >
                                    {menuItem.label}
                                </NavLinkTabs>

                                {menuItem.subMenus.length > 0 && (
                                    <ul className="menu7">
                                        {menuItem.subMenus.map((subMenu) => (
                                            <li key={subMenu.label}>
                                                <NavLinkTabs
                                                    to="#"
                                                    onClick={(e) => clickHandle( menuItem, subMenu ) }
                                                    activeName={activeSub === subMenu.id ? subMenu.label : null}
                                                    styled="padding-x libg"
                                                >
                                                    {subMenu.label}
                                                </NavLinkTabs>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = data => data.tabs
export default connect(mapStateToProps)(EgovLeftNavReference);
