import React from "react"
import logo from './logo.svg';
import './App.css';

import {BrowserRouter, Routes, Route} from "react-router-dom"
import TopPage from './pages/TopPage';
import SelectQuizPage from './pages/SelectQuizPage';
import AddQuizPage from "./pages/AddQuizPage";
import EditQuizPage from "./pages/EditQuizPage";
import SearchQuizPage from "./pages/SearchQuizPage";
import DeleteQuizPage from "./pages/DeleteQuizPage";
import AccuracyRateGraphPage from "./pages/AccuracyRateGraphPage";
import ImageUploadPage from "./pages/ImageUploadPage";

class App extends React.Component {
  render(){
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/top" element={<TopPage />} />

          <Route path="/selectquiz" element={<SelectQuizPage />} />

          <Route path="/addquiz" element={<AddQuizPage />} />

          <Route path="/editquiz" element={<EditQuizPage />} />

          <Route path="/searchquiz" element={<SearchQuizPage />} />

          <Route path="/deletequiz" element={<DeleteQuizPage />} />

          <Route path="/accuracyrategraph" element={<AccuracyRateGraphPage />} />

          <Route path="/imageupload" element={<ImageUploadPage />} />

          <Route path="/" element={
            <TopPage />
          } />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
