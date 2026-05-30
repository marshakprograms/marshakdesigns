from PIL import Image
import os

images = [
    'static/images/Delegate.png',
    'static/images/EH.png',
    'static/images/Lux.png',
    'static/images/MarshaK.png',
    'static/images/ogImage.png'
]

for path in images:
    img = Image.open(path)
    webp_path = path.replace('.png', '.webp')
    img.save(webp_path, 'WEBP', quality=80, optimize=True)
    orig = os.path.getsize(path)//1024
    new = os.path.getsize(webp_path)//1024
    print(f'{path}: {orig}KB -> {new}KB')
    
    