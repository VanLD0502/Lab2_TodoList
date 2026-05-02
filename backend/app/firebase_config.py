import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import os

load_dotenv()

# Khởi tạo Firebase từ biến môi trường (.env)
def get_firebase_config():
    private_key = os.getenv("FIREBASE_PRIVATE_KEY")
    if private_key:
        # Thay thế \n thực sự nếu nó bị escape trong .env
        private_key = private_key.replace("\\n", "\n")
        
    return {
        "type": os.getenv("FIREBASE_TYPE", "service_account"),
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": private_key,
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.getenv("FIREBASE_CLIENT_ID"),
        "auth_uri": os.getenv("FIREBASE_AUTH_URI", "https://accounts.google.com/o/oauth2/auth"),
        "token_uri": os.getenv("FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"),
        "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL", "https://www.googleapis.com/oauth2/v1/certs"),
        "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
        "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN", "googleapis.com")
    }

# Trạng thái khởi tạo Firebase
is_firebase_initialized = False
firebase_error = None

if not firebase_admin._apps:
    try:
        config = get_firebase_config()
        if not config["private_key"] or not config["project_id"]:
            raise ValueError("Thiếu FIREBASE_PRIVATE_KEY hoặc FIREBASE_PROJECT_ID trong file .env")
            
        cred = credentials.Certificate(config)
        firebase_admin.initialize_app(cred)
        is_firebase_initialized = True
        print("✅ Firebase initialized successfully using environment variables.")
    except Exception as e:
        firebase_error = str(e)
        print(f"❌ Lỗi khởi tạo Firebase: {e}")

# Chỉ khởi tạo db nếu Firebase đã sẵn sàng, tránh treo app
db = None
if is_firebase_initialized:
    db = firestore.client()
