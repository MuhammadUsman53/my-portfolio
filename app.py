import streamlit as st
import tensorflow as tf
from PIL import Image, ImageOps
import numpy as np
import cv2

# Set page configuration
st.set_page_config(
    page_title="Brain Tumor Detection System",
    page_icon="🧠",
    layout="centered",
    initial_sidebar_state="expanded"
)

# Custom CSS for styling
st.markdown("""
    <style>
    .main {
        background-color: #f0f2f6;
    }
    .stButton>button {
        color: white;
        background-color: #4CAF50;
        border: none;
        padding: 10px 24px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 8px;
        width: 100%;
    }
    .stButton>button:hover {
        background-color: #45a049;
    }
    .reportview-container .main .block-container{
        padding-top: 2rem;
    }
    h1 {
        color: #2c3e50;
        text-align: center;
        margin-bottom: 2rem;
    }
    .prediction-box {
        padding: 20px;
        border-radius: 10px;
        margin-top: 20px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .tumor {
        background-color: #ffebee;
        color: #c62828;
        border: 2px solid #c62828;
    }
    .no-tumor {
        background-color: #e8f5e9;
        color: #2e7d32;
        border: 2px solid #2e7d32;
    }
    </style>
    """, unsafe_allow_html=True)

@st.cache_resource
def load_model():
    try:
        model = tf.keras.models.load_model('brain_tumor_model.h5')
        return model
    except Exception as e:
        return None

def import_and_predict(image_data, model):
    size = (224, 224)    
    image = ImageOps.fit(image_data, size, Image.Resampling.LANCZOS)
    img = np.asarray(image)
    img = img / 255.0
    img_reshape = np.expand_dims(img, axis=0)
    
    prediction = model.predict(img_reshape)
    return prediction

# Sidebar for additional info
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/2964/2964063.png", width=100)
    st.title("Brain Tumor Detector")
    st.info("This application uses a deep learning model to detect brain tumors from MRI scans.")
    st.markdown("---")
    st.markdown("### Instructions")
    st.markdown("1. Upload a brain MRI image (JPG, PNG, JPEG).")
    st.markdown("2. The system will analyze the image.")
    st.markdown("3. View the prediction result.")
    st.markdown("---")
    st.markdown("Created by Antigravity")

# Main Page Content
st.markdown("<h1>Brain Tumor Detection System (AI Powered)</h1>", unsafe_allow_html=True)

model = load_model()

if model is None:
    st.error("⚠️ Model not found! Please train the model first by running `python train_model.py`.")
    st.stop()

file = st.file_uploader("Upload an MRI Scan", type=["jpg", "png", "jpeg"])

if file is None:
    st.markdown(
        """
        <div style="text-align: center; color: #7f8c8d; padding: 50px;">
            <p>Please upload an image to get started.</p>
        </div>
        """,
        unsafe_allow_html=True
    )
else:
    image = Image.open(file)
    st.image(image, use_column_width=True, caption="Uploaded MRI Scan")
    
    detect_btn = st.button("Detect Tumor")
    
    if detect_btn:
        with st.spinner("Analyzing image..."):
            try:
                predictions = import_and_predict(image, model)
                class_names = ['No Tumor', 'Tumor']
                
                # Depending on how the generator loads classes, 'no' usually comes before 'yes' alphabetically.
                # In train_model.py: categories are potentially sorted. 
                # ImageDataGenerator uses sorted alphanumeric order.
                # So if folders are 'no' and 'yes':
                # 0 -> no
                # 1 -> yes (Tumor)
                
                # Let's double check this logic in training effectively, but standard is alphanumeric.
                
                predicted_class = class_names[np.argmax(predictions)]
                confidence = np.max(predictions) * 100
                
                if predicted_class == 'Tumor':
                    st.markdown(
                        f"""
                        <div class="prediction-box tumor">
                            ⚠️ Prediction: Tumor<br>
                            <span style="font-size: 20px; font-weight: normal;">Confidence: <strong>{confidence:.1f}%</strong></span>
                        </div>
                        """, 
                        unsafe_allow_html=True
                    )
                else:
                    st.markdown(
                        f"""
                        <div class="prediction-box no-tumor">
                            ✅ Prediction: No Tumor<br>
                            <span style="font-size: 20px; font-weight: normal;">Confidence: <strong>{confidence:.1f}%</strong></span>
                        </div>
                        """, 
                        unsafe_allow_html=True
                    )
                
                # Dynamic Progress Bar Color
                st.write("---")
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("Model Confidence", f"{confidence:.1f}%")
                with col2:
                    if confidence > 80:
                         st.success("High Confidence Analysis")
                    else:
                         st.warning("Low Confidence Analysis")
                
                st.progress(int(confidence))
                
            except Exception as e:
                st.error(f"Error processing image: {e}")
                st.write("Make sure the image is a valid RGB image.")

