# Master To Do - Todo List Application

## Thông tin sinh viên
- **Họ và tên**: Nguyễn Hữu Tường Vân
- **MSSV**: 24120489
- **Trường**: Đại học Khoa học Tự nhiên, TP.HCM
- **Khoa**: Công nghệ Thông tin
- **Môn học**: Tư Duy Tính Toán

Ứng dụng quản lý công việc (Todo List) được xây dựng với **React** (frontend) và **FastAPI** (backend), tích hợp **Firebase Authentication** và **Firestore Database**.

## 🏗️ Cấu trúc dự án

```
Lab2/
├── frontend/          # React app (Vite + Tailwind CSS)
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── main.py              # Entry point
│   │   ├── firebase_config.py   # Firebase Admin SDK
│   │   ├── routers/             # API endpoints
│   │   ├── schemas/             # Pydantic models
│   │   └── services/            # Business logic
│   └── .env
├── requirements.txt
├── .gitignore
└── README.md
```

## ⚙️ Cài đặt Environment

### Yêu cầu
- **Python** >= 3.10
- **Node.js** >= 18
- **Firebase Project** (đã bật Authentication + Firestore)

### 1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới
3. Bật **Authentication** → Sign-in method → Enable **Email/Password** và **Google**
4. Tạo **Firestore Database** (Start in test mode)
5. Vào **Project Settings** → **General** → **Your apps** → Thêm **Web app** → Copy config
6. Vào **Project Settings** → **Service Accounts** → **Generate New Private Key** → Tải JSON

### 2. Cấu hình Frontend

Tạo file `frontend/.env` và điền cấu hình Firebase:

```env
VITE_FIREBASE_API_KEY="YOUR_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_PROJECT_ID.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_PROJECT_ID.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_APP_ID"
```

### 3. Cấu hình Backend

Tạo file `backend/.env` và thêm cấu hình Service Account:
```env
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
```

## 🚀 Hướng dẫn chạy

### Chạy Backend

```bash
# Tạo virtual environment
cd backend
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Cài đặt dependencies
pip install -r ../requirements.txt

# Chạy server
uvicorn app.main:app --reload --port 8000
```

Backend sẽ chạy tại: `http://localhost:8000`

### Chạy Frontend

```bash
# Cài đặt dependencies
cd frontend
npm install

# Chạy dev server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5174`

## 🔗 API Endpoints

| Method | Path | Mô tả |
|--------|------|--------|
| `GET` | `/` | API info |
| `GET` | `/health` | Health check |
| `POST` | `/auth/login` | Verify Firebase token |
| `POST` | `/auth/register`| Đăng ký bằng Email/Password |
| `GET` | `/auth/me` | Lấy thông tin user hiện tại |
| `PUT` | `/auth/profile`| Cập nhật hồ sơ (tên, avatar) |
| `POST` | `/auth/set-password` | Đổi hoặc tạo mật khẩu mới |
| `POST` | `/tasks` | Tạo task mới |
| `GET` | `/tasks` | Lấy danh sách tasks |
| `PUT` | `/tasks/{id}` | Cập nhật task |
| `DELETE` | `/tasks/{id}` | Xóa task |

## ✨ Tính năng

- ✅ Đăng nhập / Đăng ký bằng Firebase (Email/Password + Google)
- ✅ Thêm, sửa, xóa task
- ✅ Đánh dấu completed / uncompleted
- ✅ Tìm kiếm và lọc tasks
- ✅ Hiển thị thống kê (completed / in progress)
- ✅ Phân trang
- ✅ Giao diện minimalist, responsive

## 🎥 Video Demo

[Link video demo](YOUR_VIDEO_LINK_HERE)

## 📦 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Backend**: FastAPI (Python)
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore
