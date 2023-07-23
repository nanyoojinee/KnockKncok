import { Route, Routes, useLocation } from "react-router-dom";
import { ROUTE_ARR } from "./routes";
import Header from "../components/sections/Header";
import Footer from "../components/sections/Footer";
const Router = () => {
  const location = useLocation();

  const isRegisterPage = location.pathname === "/register";
  const shouldShowFooter = !isRegisterPage;

  return (
    <>
      <Header />
      <Routes>
        {ROUTE_ARR.map((route, index) => {
          return (
            <Route path={route.path} element={<route.element />} key={index} />
          );
        })}
      </Routes>
      {shouldShowFooter && <Footer />}
    </>
  );
};
export default Router;
