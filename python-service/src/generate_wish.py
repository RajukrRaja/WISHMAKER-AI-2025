import openai

openai.api_key = 'YOUR_OPENAI_API_KEY'  # Replace with your API key

def generate_batch_wish():
    prompt = "Write an emotional, hopeful graduation wish for the Class of 2025, using tech metaphors."
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=100
    )
    return response.choices[0].text.strip()