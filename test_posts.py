import requests
import json
import os

BASE_URL = "http://127.0.0.1:8000/api/v1"
EMAIL = "biz@test.com"
PASSWORD = "TestPass123!"

def run_tests():
    print("--- Starting Post API Tests ---")
    
    # 1. Login
    print("\n1. Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login/", json={
        "email": EMAIL,
        "password": PASSWORD
    })
    if resp.status_code != 200:
        print("Login failed:", resp.text)
        return
    token = resp.json().get("access")
    headers = {"Authorization": f"Bearer {token}"}
    print("Login OK. Token acquired.")

    # 2. Create Text Post
    print("\n2. Creating a Text Post...")
    resp = requests.post(f"{BASE_URL}/business/posts/", headers=headers, json={
        "post_type": "text",
        "content": "This is a test text post from our new implementation!"
    })
    print(f"Status: {resp.status_code}")
    print(json.dumps(resp.json(), indent=2))
    post_id = resp.json().get("id")

    # 3. Create Article Post
    print("\n3. Creating an Article Post...")
    resp = requests.post(f"{BASE_URL}/business/posts/", headers=headers, json={
        "post_type": "article",
        "title": "The Future of Trade in Africa",
        "content": "Full article body here..."
    })
    print(f"Status: {resp.status_code}")
    print(json.dumps(resp.json(), indent=2))

    # 4. List Posts
    print("\n4. Listing all Posts for user...")
    resp = requests.get(f"{BASE_URL}/business/posts/", headers=headers)
    print(f"Status: {resp.status_code}")
    posts = resp.json()
    print(f"Found {len(posts)} posts. IDs:", [p.get("id") for p in posts])

    # 5. Delete the first post
    if post_id:
        print(f"\n5. Deleting post ID {post_id}...")
        resp = requests.delete(f"{BASE_URL}/business/posts/{post_id}/", headers=headers)
        print(f"Status: {resp.status_code}")

    print("\n--- Tests Complete ---")

if __name__ == "__main__":
    run_tests()
