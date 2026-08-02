import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const ProtectedRoute = ({children}) => {
  const { User, Loading } = useAuth();

  if (Loading) {
    return <h1>loading</h1>;
  }
  if (!User) {
    return <Navigate to='/login' />
  }
  return children
};

export default ProtectedRoute;
