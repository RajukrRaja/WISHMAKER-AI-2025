from PIL import Image
import io
import base64

def create_collage(image_data):
    images = [Image.open(io.BytesIO(base64.b64decode(img.split(',')[1]))) for img in image_data]
    widths, heights = zip(*(img.size for img in images))
    
    max_width = max(widths)
    max_height = max(heights)
    collage_width = max_width * 2
    collage_height = max_height * 2
    
    collage = Image.new('RGB', (collage_width, collage_height), (255, 255, 255))
    
    for i, img in enumerate(images[:4]):
        img = img.resize((max_width, max_height), Image.LANCZOS)
        x = (i % 2) * max_width
        y = (i // 2) * max_height
        collage.paste(img, (x, y))
    
    buffer = io.BytesIO()
    collage.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode('utf-8')