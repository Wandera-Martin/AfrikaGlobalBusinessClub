import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"
EMAIL = "biz@test.com"
PASSWORD = "TestPass123!"

def debug_profile():
    # Login
    resp = requests.post(f"{BASE_URL}/auth/login/", json={
        "email": EMAIL,
        "password": PASSWORD
    })
    token = resp.json().get("access")
    
    # Fetch Profile
    resp = requests.get(f"{BASE_URL}/business/profile/", headers={"Authorization": f"Bearer {token}"})
    print(f"Status: {resp.status_code}")
    print("Response:", resp.text)

if __name__ == "__main__":
    debug_profile()
