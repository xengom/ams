import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import styled from "styled-components";
import { client } from "./apollo/client";
import Navigation from "./components/common/Navigation";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolios";
import Dividend from "./pages/Dividend";
import History from "./pages/History";
import Income from "./pages/Income";
import Plan from "./pages/Plan";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navigation />
        <MainContent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/dividend" element={<Dividend />} />
            <Route path="/history" element={<History />} />
            <Route path="/income" element={<Income />} />
            <Route path="/plan" element={<Plan />} />
          </Routes>
        </MainContent>
        <ToastContainer position="bottom-right" />
        <Toaster position="bottom-right" />
      </Router>
    </ApolloProvider>
  );
};

const MainContent = styled.main`
  padding-top: 46px;
  min-height: 100vh;
`;

export default App;
