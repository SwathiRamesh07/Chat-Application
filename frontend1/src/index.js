import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./stores/store.js";
import { BrowserRouter } from "react-router-dom";
import { Providers } from "./Components/ui/provider.jsx";
import ChatProvider from "./Context/ChatProvider.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChatProvider>
      <Providers>
        <Provider store={store}>
          <App />
        </Provider>
      </Providers>
    </ChatProvider>
  </BrowserRouter>
);
