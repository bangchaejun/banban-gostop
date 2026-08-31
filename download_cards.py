import os
import urllib.request

dest_dir = r"c:\AI_Coding\AgOS\gostop\assets\cards"
os.makedirs(dest_dir, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0'}

for i in range(48):
    url = f"https://raw.githubusercontent.com/C-W-Z/hanafuda/master/imgs/{i}.webp"
    filepath = os.path.join(dest_dir, f"{i}.webp")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(filepath, 'wb') as f:
            f.write(resp.read())
        print(f"Downloaded {i}.webp ({os.path.getsize(filepath)} bytes)")
    except Exception as e:
        print(f"Failed {i}: {e}")

print("Done! Total files:", len(os.listdir(dest_dir)))
