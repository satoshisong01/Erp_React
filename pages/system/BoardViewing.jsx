import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { selectLnb } from "components/tabs/TabsActions";
import BoardViewings from "./Board/BoardViewing/BoardViewings";

/** 시스템관리-게시판관리-게시판열람권한관리 */
function BoardViewing() {
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
                    <li>게시판열람권한관리</li>
                </ul>
            </div>
            <BoardViewings />
        </>
    );
}

export default BoardViewing;
