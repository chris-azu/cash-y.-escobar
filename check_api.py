import urllib.request
import urllib.error
import json

supabase_url = "https://wjzgxrqintzzfjhvhstm.supabase.co"
anon_key = "sb_publishable_I6tsOKsEXbogDU0uqPdl6w_11kVP5ZD"

endpoints = [
    "/rest/v1/products?select=*",
    "/rest/v1/categories?select=*",
    "/rest/v1/config?select=*"
]

for ep in endpoints:
    url = f"{supabase_url}{ep}"
    print(f"GET {url}")
    req = urllib.request.Request(url)
    req.add_header("apikey", anon_key)
    req.add_header("Authorization", f"Bearer {anon_key}")
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.status
            print("Status code:", status)
            body = response.read().decode('utf-8')
            data = json.loads(body)
            print("Row count:", len(data))
            if len(data) > 0:
                print("First row:", json.dumps(data[0], indent=2))
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code, e.reason)
        try:
            print("Body:", e.read().decode('utf-8'))
        except:
            pass
    except Exception as e:
        print("Request failed:", e)
    print("-" * 50)
