import React from "react";
import { Provider } from "react-redux";

import RootRoutes from "./routes";
import store from "./store/configureStore";

import "./css/egov-base.css";
import "./css/egov-layout.css";
import "./css/egov-component.css";
import "./css/egov-page.css";
import "./css/egov-response.css";
import "./css/custom-style.scss";
import { PageProvider } from "components/PageProvider";
import Modal from "react-modal";

function App() {
    return (
        <PageProvider>
            <div className="wrap">
                <Provider store={store}>
                    <RootRoutes />
                </Provider>
            </div>
        </PageProvider>
    );
}

Modal.setAppElement("#root");

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.REACT_APP_EGOV_CONTEXT_URL", process.env.REACT_APP_EGOV_CONTEXT_URL);

export default App;
