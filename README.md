# BlogifyHub

BlogifyHub is a web application that allows users to write, read, publish, and share blogs.
## Features
- Rich text editing with Editor.js
- Image storage and management using Amazon S3
- RESTful APIs for blog operations (create, read, update, delete)
- User authentication and authorization
- Responsive design for various devices

## Technologies Used
- **Frontend:** React
- **Backend:** Express
- **Database:** MongoDB
- **Rich Text Editor:** Editor.js
- **Image Storage:** Amazon S3

## Installation

### Prerequisites
- Node.js and npm
- MongoDB
- AWS account with S3 setup

### Steps
1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/BlogifyHub.git
    cd BlogifyHub
    ```

2. **Install dependencies:**
    ```bash
       cd backend
       npm install (install all the dependencies mentioned in package.json file) 
      
       similarly for frontend part
       cd frontend
       npm install

    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret_key
    S3_BUCKET_NAME=your_s3_bucket_name
    ```

4. **Start the development server:**
    ```bash
    npm run dev
    ```

## Usage
1. Navigate to `http://localhost:3000` in your browser.
2. Register for an account or log in.
3. Create, read, update, or delete blogs using the rich text editor and manage images with Amazon S3.
Live Link: https://prismatic-hotteok-057e36.netlify.app
