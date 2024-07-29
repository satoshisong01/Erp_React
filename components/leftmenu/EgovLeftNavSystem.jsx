import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { selectSnb } from 'components/tabs/TabsActions';
import NavLinkTabs from "components/tabs/NavLinkTabs";
import store from "store/configureStore";

function EgovLeftNavSystem(props) {
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
        // {
        //     label: "메뉴관리",
        //     id: "MenuInfo",
        //     subMenus: [
        //         { label: "메뉴정보관리", id: "MenuInfo" },
        //         { label: "프로그램목록관리", id: "ProgramList" },
        //     ],
        // },
        // { label: "권한관리", id: "AuthorizationMgmt", subMenus: [] },
        //{
        //    label: "게시판관리",
        //    id: "",
        //    subMenus: [
        //        { label: "게시물관리", id: "" },
        //        { label: "게시판마스터관리", id: "" },
        //        { label: "게시판열람권한관리", id: "" },
        //        { label: "댓글관리", id: "" },
        //    ],
        //},
        {
            label: "코드관리",
            id: "GroupCode",
            subMenus: [
                { label: "그룹코드", id: "GroupCode" },
                { label: "공통코드", id: "CategoryCode" },
                { label: "상세코드", id: "DetailCode" },
            ],
        },
        // { label: "접속이력관리", subMenus: [] },
        {
            label: "사용자관리",
            id: "WorkMemberMgmt",
            subMenus: [
                { label: "업무회원", id: "WorkMemberMgmt" },
            ],
        },
    ];

    return (
        <div className="layout">
            <div className="nav">
                <div className="inner">
                    <h2>시스템관리</h2>
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
export default connect(mapStateToProps)(EgovLeftNavSystem);
