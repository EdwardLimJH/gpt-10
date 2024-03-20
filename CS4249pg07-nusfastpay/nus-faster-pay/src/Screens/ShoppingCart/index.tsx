import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ShoppingCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { item, ivConfig } = location.state;

  return (
    <div>
      <p>
        Shopping Cart Screen for item: {item.title} - ${item.price}
      </p>
      <button
        onClick={() => navigate("/account-dashboard", { state: ivConfig })}
      >
        Back
      </button>
      <button onClick={() => navigate("/payment-options", { state: ivConfig })}>
        Next
      </button>
    </div>
  );
}

export default ShoppingCart;
