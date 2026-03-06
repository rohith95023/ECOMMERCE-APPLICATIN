import http.client
import json

def test_api():
    conn = http.client.HTTPConnection("127.0.0.1", 4000)
    try:
        conn.request("GET", "/api/categories")
        response = conn.getresponse()
        print(f"Status: {response.status}")
        print(f"Headers: {response.getheaders()}")
        data = response.read()
        print(f"Data: {data.decode()}")
        try:
            print(f"JSON: {json.loads(data)}")
        except:
            print("Not valid JSON")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    test_api()
