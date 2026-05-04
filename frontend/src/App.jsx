import React, { useState, useEffect } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./services/firebase";
import api from "./services/api";

import LoginPage from "./components/LoginPage";

import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";
import { Loader2 } from "lucide-react";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // Đảm bảo hiện loading khi đang đồng bộ
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          console.log("Syncing with backend...");
          const res = await api.post("/auth/login", { token });
          console.log("Backend sync success:", res.data);
          setUser(firebaseUser);
        } catch (err) {
          console.error("Backend sync failed!", err.response?.data || err.message);
          // Nếu backend lỗi, chúng ta đăng xuất luôn để tránh trạng thái lấp lửng
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="mt-4 font-bold font-heading tracking-widest uppercase text-sm">
          Master To Do
        </p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/" replace />} 
        />

        <Route 
          path="/profile" 
          element={user ? <ProfilePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/" 
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
