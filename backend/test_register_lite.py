import http.client
import json

def test_register():
    conn = http.client.HTTPConnection("127.0.0.1", 4000)
    payload = {
        "full_name": "Test User",
        "email": "test@test.com",
        "phone": "9876543210",
        "password": "Password123",
        "role": "customer"
    }
    headers = {"Content-Type": "application/json"}
    try:
        conn.request("POST", "/api/auth/register", body=json.dumps(payload), headers=headers)
        response = conn.getresponse()
        print(f"Status: {response.status}")
        print(f"Data: {response.read().decode()}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    test_register()
