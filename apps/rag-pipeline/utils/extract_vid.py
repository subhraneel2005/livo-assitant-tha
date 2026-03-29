from urllib.parse import urlparse, parse_qs

def extract_video_id(url: str) -> str | None:
    parsed = urlparse(url)

    # case: youtube.com/watch?v=ID
    if parsed.hostname in ["www.youtube.com", "youtube.com"]:
        qs = parse_qs(parsed.query)
        return qs.get("v", [None])[0]

    # case: youtu.be/ID
    if parsed.hostname == "youtu.be":
        return parsed.path.lstrip("/")

    return None


# # example
# url = "https://youtube.com/watch?v=C6YtPJxNULA"
# video_id = extract_video_id(url)

# print(video_id)  # C6YtPJxNULA