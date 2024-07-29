import React, { useRef, useState } from "react";
import AntTree from "components/antTree/AntTree";
import { reference, sales, execution, system } from "./menuTreeData.js";
import MenuForm from "components/form/MenuForm.jsx";
import { Resizable } from "re-resizable";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { selectLnb } from "components/tabs/TabsActions";

/** 시스템관리-메뉴관리-메뉴정보관리 */
const MenuInfo = () => {
    const [treeData, setTreeData] = useState(reference);

    const [node, setNode] = useState({});

    const selectData = (data) => {
        setNode(data);
    };

    const containerRef = useRef(null);
    const resizableRef = useRef(null);
    const [leftWidth, setLeftWidth] = useState("50%");
    const [rightWidth, setRightWidth] = useState("50%");

    const handleResize = (event, direction, ref, delta) => {
        const containerWidth = containerRef.current.offsetWidth;
        const resizableWidth = resizableRef.current.offsetWidth;
        const newLeftWidth = `${(resizableWidth / containerWidth) * 100}%`;
        const newRightWidth = `${
            ((containerWidth - resizableWidth) / containerWidth) * 100
        }%`;
        setLeftWidth(newLeftWidth);
        setRightWidth(newRightWidth);
    };

    const selectChange = (e) => {
        const value = e.target.value;
        let newData;
        switch (value) {
            case "reference":
                newData = reference;
                break;
            case "sales":
                newData = sales;
                break;
            case "execution":
                newData = execution;
                break;
            case "system":
                newData = system;
                break;
            default:
                newData = reference;
                break;
        }
        setTreeData(newData);
    };

    return (
        <>
            <div className="location">
                <ul>
                    <li>
                        <Link to="/" className="home">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to=""
                            onClick={(e) =>
                                store.dispatch(selectLnb("권한관리"))
                            }>
                            시스템관리
                        </Link>
                    </li>
                    <li>메뉴정보관리</li>
                </ul>
            </div>

            <div className="row">
                <select
                    defaultValue={"reference"}
                    name="select-basic"
                    id="search_select"
                    className="b-select mg-b-20"
                    onChange={selectChange}>
                    <option value="reference">기준정보관리</option>
                    <option value="sales">영업관리</option>
                    <option value="execution">실행관리</option>
                    <option value="system">시스템관리</option>
                </select>
            </div>

            <div
                ref={containerRef}
                style={{
                    display: "flex",
                    height: "100vh",
                    position: "relative",
                }}>
                {/* 왼쪽 영역 */}
                <Resizable
                    ref={resizableRef}
                    style={{
                        backgroundColor: "white",
                        overflow: "hidden",
                        paddingRight: 10,
                        width: leftWidth,
                    }}
                    onResize={handleResize}
                    minWidth={280}>
                    <AntTree treeData={treeData} selectData={selectData} />
                </Resizable>

                {/* 오른쪽 영역 */}
                <div
                    style={{
                        backgroundColor: "white",
                        overflow: "hidden",
                        position: "relative",
                        flex: "1",
                        minWidth: 0,
                        padding: "0px 20px",
                        borderLeft: "1px solid #ccc",
                        width: rightWidth,
                    }}>
                    <MenuForm selectNode={node} />
                    {/* <InnerForm treeNode={treeNode} /> */}
                </div>
            </div>
        </>
    );
};

export default MenuInfo;
