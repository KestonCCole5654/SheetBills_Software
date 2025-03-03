import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ onLogout }: { onLogout: () => void }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    onLogout();
    setLoading(false);
    navigate("/login");
  }, [onLogout, navigate]);

  return loading ? <div>Logging out...</div> : <div>You have been logged out!</div>;
};

export default Logout