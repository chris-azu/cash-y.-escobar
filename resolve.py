import psycopg2

ipv6_addr = "2600:1f14:271:c002:a53e:431f:5447:93fb"
url = f"postgresql://postgres:Escobar2026$.1@[{ipv6_addr}]:5432/postgres"

print(f"Connecting to {ipv6_addr}...")
try:
    conn = psycopg2.connect(url, connect_timeout=5)
    print("Connection successful!")
    with conn.cursor() as cur:
        cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public';")
        tables = [row[0] for row in cur.fetchall()]
        print("Tables in public schema:", tables)
    conn.close()
except Exception as e:
    print("Connection failed:", e)
