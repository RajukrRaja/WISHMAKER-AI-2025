import openai

openai.api_key = 'YOUR_OPENAI_API_KEY'  # Replace with your API key

def generate_tribute(friend_name, memory):
    prompt = f"Write a heartfelt friendship tribute for {friend_name} based on this memory: {memory}. Use tech metaphors."
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=80
    )
    return response.choices[0].text.strip()