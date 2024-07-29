import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { selectLnb } from "components/tabs/TabsActions";
import Comments from "./Board/Comment/Comments";

/** 시스템관리-게시판관리-댓글관리 */
function Comment() {
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
                    <li>댓글관리</li>
                </ul>
            </div>
            <Comments />
        </>
    );
}

export default Comment;
