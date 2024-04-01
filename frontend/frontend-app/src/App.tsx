import React from "react";
import { Route, Routes } from "react-router-dom";
import StartScreen from "./Screens/StartScreen";
import "./App.css";
import LoadingPage from "./Screens/Loading";
import Review from "./Screens/Review";
import Confirmation from "./Screens/Confirmation";

import { NUSHeader } from "./Utils/SharedComponents";

function App() {  
  return (
    <div style={{padding: "20px 100px 20px 100px"}}>
      <NUSHeader></NUSHeader>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/review" element={<Review />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </div>
  );
}

export default App;
