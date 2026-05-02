import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "./Header";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Image,
  Save,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  KeyRound,
} from "lucide-react";

export default function ProfilePage({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [displayName, setDisplayName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [providers, setProviders] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  const hasPasswordProvider = providers.includes("password");

  // Fetch user detail from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setDisplayName(res.data.name || "");
        setPhotoUrl(res.data.picture || "");
        setProviders(res.data.providers || []);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setProfileSaving(true);
    try {
      const res = await api.put("/auth/profile", {
        display_name: displayName,
        photo_url: photoUrl || null,
      });
      setProviders(res.data.providers || []);
      setProfileMsg({ type: "success", text: "Cập nhật hồ sơ thành công!" });
    } catch (err) {
      setProfileMsg({
        type: "error",
        text: err.response?.data?.detail || "Cập nhật thất bại.",
      });
    } finally {
      setProfileSaving(false);
    }
  };

  // Set or change password
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (newPassword.length < 6) {
      setPasswordMsg({
        type: "error",
        text: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({
        type: "error",
        text: "Mật khẩu xác nhận không khớp.",
      });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await api.post("/auth/set-password", {
        new_password: newPassword,
      });
      setProviders(res.data.providers || []);
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMsg({
        type: "success",
        text: hasPasswordProvider
          ? "Đổi mật khẩu thành công!"
          : "Thiết lập mật khẩu thành công! Từ giờ bạn có thể đăng nhập bằng Email/Mật khẩu.",
      });
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err.response?.data?.detail || "Thao tác thất bại.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const initial = (
    user.displayName ||
    user.email ||
    "U"
  )
    .charAt(0)
    .toUpperCase();

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={onLogout} />
        <div className="flex flex-col items-center justify-center py-32 text-primary">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="mt-4 font-medium text-outline">
            Đang tải thông tin...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <Header user={user} onLogout={onLogout} />

      <main className="max-w-2xl mx-auto px-6 mt-8 pb-20">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-semibold text-outline hover:text-on-surface transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Dashboard
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-surface-container overflow-hidden animate-fade-in">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary/10 via-pink-100/60 to-primary-container/40 px-8 py-8">
            <div className="flex items-center gap-5">
              {/* Large Avatar */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center bg-pink-100 border-2 border-pink-200 shadow-lg shrink-0">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-pink-600 font-bold text-3xl">
                    {initial}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading text-on-surface">
                  {displayName || user.email}
                </h2>
                <p className="text-sm text-outline mt-0.5">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  {providers.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] font-bold uppercase tracking-wider bg-white/80 text-outline px-2.5 py-1 rounded-full border border-surface-container"
                    >
                      {p === "google.com" ? "Google" : p === "password" ? "Email/Password" : p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-surface-container">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all border-b-2 ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-outline hover:text-on-surface"
              }`}
            >
              <User className="w-4 h-4" />
              Hồ sơ cá nhân
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all border-b-2 ${
                activeTab === "password"
                  ? "border-primary text-primary"
                  : "border-transparent text-outline hover:text-on-surface"
              }`}
            >
              <KeyRound className="w-4 h-4" />
              {hasPasswordProvider ? "Đổi mật khẩu" : "Thiết lập mật khẩu"}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {/* ── Profile Tab ── */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-5 animate-fade-in">
                {profileMsg.text && (
                  <MessageBanner type={profileMsg.type} text={profileMsg.text} />
                )}

                {/* Email (read-only) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] ml-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/40" />
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full bg-surface-container-low border border-surface-container rounded-2xl pl-11 pr-4 py-3 text-outline text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] ml-1">
                    Tên hiển thị
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/40" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-surface-container-low border border-surface-container rounded-2xl pl-11 pr-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Photo URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] ml-1">
                    Ảnh đại diện (URL)
                  </label>
                  <div className="relative">
                    <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/40" />
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full bg-surface-container-low border border-surface-container rounded-2xl pl-11 pr-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  {photoUrl && (
                    <div className="flex items-center gap-3 mt-2 p-3 bg-surface-container-low rounded-xl">
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-10 h-10 rounded-full object-cover border border-surface-container"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <span className="text-xs text-outline">Xem trước ảnh đại diện</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {profileSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Lưu thay đổi
                </button>
              </form>
            )}

            {/* ── Password Tab ── */}
            {activeTab === "password" && (
              <form onSubmit={handleSetPassword} className="space-y-5 animate-fade-in">
                {/* Info Banner */}
                <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl border border-surface-container">
                  <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      {hasPasswordProvider
                        ? "Bạn đã có mật khẩu"
                        : "Chưa có mật khẩu"}
                    </p>
                    <p className="text-xs text-outline mt-1">
                      {hasPasswordProvider
                        ? "Nhập mật khẩu mới để thay đổi mật khẩu hiện tại."
                        : "Thiết lập mật khẩu để có thể đăng nhập bằng Email/Mật khẩu ngoài Google."}
                    </p>
                  </div>
                </div>

                {passwordMsg.text && (
                  <MessageBanner type={passwordMsg.type} text={passwordMsg.text} />
                )}

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] ml-1">
                    {hasPasswordProvider ? "Mật khẩu mới" : "Tạo mật khẩu"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/40" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-container-low border border-surface-container rounded-2xl pl-11 pr-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em] ml-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/40" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-container-low border border-surface-container rounded-2xl pl-11 pr-4 py-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {passwordSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <KeyRound className="w-5 h-5" />
                  )}
                  {hasPasswordProvider ? "Đổi mật khẩu" : "Thiết lập mật khẩu"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Reusable Message Banner ──
function MessageBanner({ type, text }) {
  const isSuccess = type === "success";
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-semibold animate-fade-in border ${
        isSuccess
          ? "bg-tertiary-container/30 text-tertiary border-tertiary/20"
          : "bg-error-container/50 text-error border-error/20"
      }`}
    >
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 shrink-0" />
      )}
      {text}
    </div>
  );
}
