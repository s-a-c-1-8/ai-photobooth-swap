# AI Photobooth Swap - Python Backend

This repository contains the Python backend for the AI Photobooth Swap project. The backend is responsible for handling requests, processing images, and integrating AI-based functionalities for swapping and editing photos.

## Features

- **Image Upload**: Accepts image uploads for processing.
- **AI-Powered Swapping**: Utilizes AI models to perform photo swaps.
- **REST API**: Provides endpoints for interacting with the backend.
- **Error Handling**: Includes robust error handling for invalid inputs and server issues.

## Requirements

- Python 3.x
- Required Python libraries (listed in `requirements.txt`)

## Installation

1. Clone the repository:
   `bash
    git clone https://github.com/your-username/ai-photobooth-swap-backend.git
    cd ai-photobooth-swap-backend
    `

2. Install dependencies:
   `bash
    pip install -r requirements.txt
    `

3. Run the backend server:
   `bash
    python app.py
    `

## API Endpoints

- `POST /upload`: Upload an image for processing.
- `GET /status`: Check the server status.
- `POST /swap`: Perform the AI-based photo swap.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
