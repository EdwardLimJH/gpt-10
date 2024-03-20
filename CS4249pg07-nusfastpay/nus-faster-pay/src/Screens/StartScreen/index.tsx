import React from "react";
import { useNavigate } from "react-router-dom";

function StartScreen() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/my-payments")}>Click to start!</button>
    </div>
  );
}

export default StartScreen;
