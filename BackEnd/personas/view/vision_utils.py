import os
import numpy as np
import onnxruntime as ort
from PIL import Image
from django.conf import settings 

#cargar el modelo ONNX usando ruta absoluta
model_path = os.path.join(settings.BASE_DIR, 'models', 'arc3.onnx')
session = ort.InferenceSession(model_path)

def get_embedding(img_path):
    #abrir imagen y convertir a RGB
    img = Image.open(img_path).convert("RGB").resize((112, 112))
    x = np.array(img).astype(np.float32) / 255.0
    x = (x - 0.5) / 0.5  
    x = np.expand_dims(x, axis=0)
    input_name = session.get_inputs()[0].name
    emb = session.run(None, {input_name: x})[0]
    return emb / np.linalg.norm(emb)
