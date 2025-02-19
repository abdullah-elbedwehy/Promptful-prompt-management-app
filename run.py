from flask import Flask
from flask_cors import CORS
from database import db
import logging
import os
from flask_sqlalchemy import SQLAlchemy
from database.db import init_db

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# More permissive CORS for development
CORS(
    app,
    resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"],
        }
    },
)

# Configure the app
app.config.update(DATABASE="instance/promptful.sqlite", DEBUG=True)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", "sqlite:///database/tasks.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
try:
    with app.app_context():
        db.init_app(app)
        # Ensure the database exists
        db.get_db()
        logger.info("Database initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize database: {e}")
    raise

# Import and register routes
import routes

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
