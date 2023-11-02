import React from 'react'
import { Outlet ,Navigate} from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
function SecretaryLayout() {
  const { user, token,role ,setUser,_setToken,_setRole } = useStateContext();

  if (!token || role !== 0) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <h1>SecretaryLayout</h1>
      <Outlet/>
    </div>
  )
}

export default SecretaryLayout