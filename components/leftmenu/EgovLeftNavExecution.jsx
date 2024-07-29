import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectSnb } from "components/tabs/TabsActions";
import NavLinkTabs from "components/tabs/NavLinkTabs";
import store from "store/configureStore";

/* 실행관리 네비게이션 */
function EgovLeftNavExecution(props) {
    const { lnbId, snbId } = props;
    const [activeSub, setActiveSub] = useState("");
    const [activeLabel, setActiveLabel] = useState("");

    const sessionUser = sessionStorage.getItem("loginUser");
    const authorCode = JSON.parse(sessionUser)?.authorCode;

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
            label: "원가조회",
            id: "ExecutionCost",
            subMenus: [],
            role: ["ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"]
        },
        {
            label: "계획관리",
            id: "LaborCostMgmtPlan",
            subMenus: [
                { label: "인건비", id: "LaborCostMgmtPlan" },
                { label: "구매(재료비)", id: "PurchasingMgmtPlan" },
                { label: "경비", id: "ExpenseMgmtPlan" },
            ],
            role: ["ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"]
        },
        {
            label: "실행관리",
            id: "LaborCostMgmtExe",
            subMenus: [
                { label: "인건비", id: "LaborCostMgmtExe" },
                { label: "구매(재료비)", id: "PurchasingMgmtExe" },
                { label: "경비", id: "ExpenseMgmtExe" },
            ],
            role: ["ROLE_USER", "ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"]
        },
        {
            label: "완료보고",
            id: "CompletionReport",
            subMenus: [],
            role: ["ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"]
        },
    ];

    return (
        <div className="layout">
            <div className="nav">
                <div className="inner">
                    <h2>실행관리</h2>
                    <ul className="menu4">
                        {menuItems.map((menuItem) => (
                            menuItem.role.includes(authorCode) &&
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

const mapStateToProps = (data) => data.tabs;
export default connect(mapStateToProps)(EgovLeftNavExecution);
