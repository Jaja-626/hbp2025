import requests

# Replace this with your actual API key
PEXELS_API_KEY = "bjSeINMYEcow7WlfCPpye44FXQOmBaUxpSoHJKlaWWSpVzJFy37KmTNL"
PEXELS_API_URL = "https://api.pexels.com/v1/search"

def fetch_pexels_images(query, per_page=10):
    headers = {
        "Authorization": PEXELS_API_KEY
    }
    params = {
        "query": query,
        "per_page": per_page
    }
    
    response = requests.get(PEXELS_API_URL, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        return data["photos"]
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return None

def print_results(photos):
    if photos:
        for i, photo in enumerate(photos, start=1):
            print(f"{i}. Photographer: {photo['photographer']}")
            print(f"   URL: {photo['url']}")
            print(f"   Image: {photo['src']['medium']}")
            print("-" * 50)
    else:
        print("No results found.")

if __name__ == "__main__":
    search_query = input("Enter search term: ")
    photos = fetch_pexels_images(search_query)
    print_results(photos)