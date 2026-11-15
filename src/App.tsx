import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import ContentPage from "./pages/ContentPage";

export default function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route element={<Layout />}>
        <Route path="sobre-rupit" element={<AboutPage />} />
        <Route path="servicios" element={<ServicesPage />} />
        <Route path="servicios/:category" element={<ServicesPage />} />
        <Route path="servicios/:category/:sub" element={<ServicesPage />} />
        <Route path="proyectos" element={<ProjectsPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path=":slug" element={<ContentPage />} />
      </Route>
    </Routes>
  );
}
