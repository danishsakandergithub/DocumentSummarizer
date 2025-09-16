from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from utils import extract_text
from summarizer import generate_summary

app = Flask(__name__)
CORS(app)  # Allow frontend (different origin) to access API

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/summarize", methods=["POST"])
def summarize():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Extract text
    try:
        text = extract_text(file_path)
    except Exception as e:
        return jsonify({"error": f"Failed to extract text: {str(e)}"}), 500

    if not text.strip():
        return jsonify({"error": "No text found in document"}), 400

    # Generate summary
    try:
        summary = generate_summary(text)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": f"Summarization failed: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
