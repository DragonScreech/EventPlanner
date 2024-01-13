import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, doc, getDoc, onSnapshot, runTransaction, setDoc, updateDoc } from "firebase/firestore";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CreateEvents from './components/CreateEvents'
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { AuthContext } from "./context/AuthContext";
import EventPage from "./components/EventPage";


function App() {

  const { currentUser } = useContext(AuthContext)

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/signin" />;
    }

    return children
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<ProtectedRoute>
            <CreateEvents></CreateEvents></ProtectedRoute>} />
          <Route path="signup" element={<SignUp></SignUp>} />
          <Route path="signin" element={<SignIn></SignIn>} />
          <Route path="event" element={<EventPage></EventPage>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
