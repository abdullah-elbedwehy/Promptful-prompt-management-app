import sqlite3
import json
import os
from pathlib import Path
from flask import current_app, g
from datetime import datetime
import logging
from flask_sqlalchemy import SQLAlchemy

logger = logging.getLogger(__name__)


class DatabaseError(Exception):
    """Custom exception for database errors."""

    pass


def get_db():
    """Connect to the application's configured database."""
    if "db" not in g:
        try:
            # Ensure the instance folder exists
            db_path = current_app.config["DATABASE"]
            os.makedirs(os.path.dirname(db_path), exist_ok=True)
            logger.debug(f"Using database at: {db_path}")

            g.db = sqlite3.connect(
                db_path,
                detect_types=sqlite3.PARSE_DECLTYPES,
                timeout=20,  # Increase timeout for busy database
            )
            g.db.row_factory = sqlite3.Row

            # Enable foreign keys
            g.db.execute("PRAGMA foreign_keys = ON")

            # Check if the database is initialized
            cursor = g.db.cursor()
            cursor.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='prompts'"
            )
            if not cursor.fetchone():
                logger.info("Database tables not found, initializing database...")
                init_db()
            else:
                logger.debug("Database tables already exist")

        except sqlite3.Error as e:
            logger.error(f"Database connection error: {e}")
            raise DatabaseError(f"Failed to connect to database: {e}")
        except Exception as e:
            logger.error(f"Unexpected error during database connection: {e}")
            raise DatabaseError(f"Unexpected error: {e}")

    return g.db


def close_db(e=None):
    """Close the database connection."""
    db = g.pop("db", None)

    if db is not None:
        try:
            db.close()
        except sqlite3.Error as e:
            logger.error(f"Error closing database: {e}")
            raise DatabaseError(f"Failed to close database connection: {e}")


def init_db():
    """Initialize the database."""
    db = get_db()

    try:
        # Get the absolute path to the schema file
        schema_path = Path(current_app.root_path) / "database" / "schema.sql"
        logger.debug(f"Loading schema from: {schema_path}")

        if not schema_path.exists():
            raise FileNotFoundError(f"Schema file not found at {schema_path}")

        with open(schema_path, "r") as f:
            schema_sql = f.read()

        db.executescript(schema_sql)
        db.commit()
        logger.info("Database initialized successfully")
    except sqlite3.Error as e:
        logger.error(f"Database initialization error: {e}")
        db.rollback()
        raise DatabaseError(f"Failed to initialize database: {e}")
    except Exception as e:
        logger.error(f"Unexpected error during database initialization: {e}")
        db.rollback()
        raise DatabaseError(f"Unexpected error during initialization: {e}")


def init_app(app):
    """Register database functions with the Flask app."""
    app.teardown_appcontext(close_db)

    # Ensure the database exists and is initialized
    with app.app_context():
        try:
            db = get_db()
            # Test the connection and check for required tables
            cursor = db.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row[0] for row in cursor.fetchall()]

            if "prompts" not in tables:
                logger.warning("Required tables missing, initializing database...")
                init_db()

            # Verify database functionality
            cursor.execute("SELECT 1")
            logger.info("Database connection verified successfully")

        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            raise DatabaseError(f"Database initialization failed: {e}")


# Prompt CRUD Operations


def create_prompt(prompt_name, ai_selection, prompt_content):
    """Create a new prompt."""
    if not prompt_name or not prompt_content:
        raise ValueError("Prompt name and content are required")

    if not isinstance(ai_selection, (list, dict)):
        raise ValueError("AI selection must be a list or dictionary")

    db = get_db()
    try:
        cursor = db.execute(
            "INSERT INTO prompts (prompt_name, ai_selection, prompt_content) VALUES (?, ?, ?)",
            (prompt_name, json.dumps(ai_selection), prompt_content),
        )
        db.commit()
        logger.debug(f"Created new prompt with ID: {cursor.lastrowid}")
        return cursor.lastrowid
    except sqlite3.IntegrityError as e:
        logger.error(f"Integrity error in create_prompt: {e}")
        db.rollback()
        raise DatabaseError(f"Failed to create prompt: {e}")
    except sqlite3.Error as e:
        logger.error(f"Database error in create_prompt: {e}")
        db.rollback()
        raise DatabaseError(f"Database error while creating prompt: {e}")


def get_prompt(id):
    """Get a prompt by ID."""
    if not isinstance(id, int):
        raise ValueError("Prompt ID must be an integer")

    try:
        prompt = (
            get_db().execute("SELECT * FROM prompts WHERE id = ?", (id,)).fetchone()
        )

        if prompt is None:
            return None

        return {
            "id": prompt["id"],
            "prompt_name": prompt["prompt_name"],
            "ai_selection": json.loads(prompt["ai_selection"]),
            "prompt_content": prompt["prompt_content"],
            "created_at": prompt["created_at"],
            "updated_at": prompt["updated_at"],
        }
    except sqlite3.Error as e:
        logger.error(f"Database error in get_prompt: {e}")
        raise DatabaseError(f"Failed to retrieve prompt: {e}")
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error in get_prompt: {e}")
        raise DatabaseError(f"Invalid AI selection data in database: {e}")


def get_all_prompts():
    """Get all prompts."""
    try:
        prompts = (
            get_db()
            .execute("SELECT * FROM prompts ORDER BY created_at DESC")
            .fetchall()
        )

        return [
            {
                "id": prompt["id"],
                "prompt_name": prompt["prompt_name"],
                "ai_selection": json.loads(prompt["ai_selection"]),
                "prompt_content": prompt["prompt_content"],
                "created_at": prompt["created_at"],
                "updated_at": prompt["updated_at"],
            }
            for prompt in prompts
        ]
    except sqlite3.Error as e:
        logger.error(f"Database error in get_all_prompts: {e}")
        raise DatabaseError(f"Failed to retrieve prompts: {e}")
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error in get_all_prompts: {e}")
        raise DatabaseError(f"Invalid AI selection data in database: {e}")


def update_prompt(id, prompt_name, ai_selection, prompt_content):
    """Update a prompt."""
    if not isinstance(id, int):
        raise ValueError("Prompt ID must be an integer")

    if not prompt_name or not prompt_content:
        raise ValueError("Prompt name and content are required")

    if not isinstance(ai_selection, (list, dict)):
        raise ValueError("AI selection must be a list or dictionary")

    db = get_db()
    try:
        cursor = db.execute(
            """UPDATE prompts 
               SET prompt_name = ?,
                   ai_selection = ?,
                   prompt_content = ?,
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = ?""",
            (prompt_name, json.dumps(ai_selection), prompt_content, id),
        )
        db.commit()

        if cursor.rowcount == 0:
            raise DatabaseError(f"No prompt found with ID {id}")

        return True
    except sqlite3.IntegrityError as e:
        logger.error(f"Integrity error in update_prompt: {e}")
        db.rollback()
        raise DatabaseError(f"Failed to update prompt: {e}")
    except sqlite3.Error as e:
        logger.error(f"Database error in update_prompt: {e}")
        db.rollback()
        raise DatabaseError(f"Database error while updating prompt: {e}")


def delete_prompt(id):
    """Delete a prompt."""
    if not isinstance(id, int):
        raise ValueError("Prompt ID must be an integer")

    db = get_db()
    try:
        cursor = db.execute("DELETE FROM prompts WHERE id = ?", (id,))
        db.commit()

        if cursor.rowcount == 0:
            raise DatabaseError(f"No prompt found with ID {id}")

        return True
    except sqlite3.Error as e:
        logger.error(f"Database error in delete_prompt: {e}")
        db.rollback()
        raise DatabaseError(f"Failed to delete prompt: {e}")


# Search and Filter Operations


def search_prompts(search_term=None, ai_filter=None):
    """Search prompts by name and/or AI selection."""
    db = get_db()
    query = "SELECT * FROM prompts"
    params = []
    conditions = []

    if search_term:
        conditions.append("prompt_name LIKE ?")
        params.append(f"%{search_term}%")

    if ai_filter:
        conditions.append("ai_selection LIKE ?")
        params.append(f"%{ai_filter}%")

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY created_at DESC"

    try:
        prompts = db.execute(query, params).fetchall()
        return [
            {
                "id": prompt["id"],
                "prompt_name": prompt["prompt_name"],
                "ai_selection": json.loads(prompt["ai_selection"]),
                "prompt_content": prompt["prompt_content"],
                "created_at": prompt["created_at"],
                "updated_at": prompt["updated_at"],
            }
            for prompt in prompts
        ]
    except sqlite3.Error as e:
        logger.error(f"Database error in search_prompts: {e}")
        raise DatabaseError(f"Failed to search prompts: {e}")
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error in search_prompts: {e}")
        raise DatabaseError(f"Invalid AI selection data in database: {e}")


# Task functions
def get_tasks(list_id=None, tag_id=None, due_date=None, due_after=None):
    """Get tasks with optional filters."""
    from database.models import Task, Tag

    try:
        query = Task.query

        if list_id is not None:
            query = query.filter(Task.list_id == list_id)
        elif list_id is None:  # Inbox view (tasks with no list)
            query = query.filter(Task.list_id.is_(None))

        if tag_id:
            query = query.join(Task.tags).filter(Tag.id == tag_id)

        if due_date:
            query = query.filter(db.func.date(Task.due_date) == due_date)

        if due_after:
            query = query.filter(db.func.date(Task.due_date) >= due_after)

        return [task.to_dict() for task in query.order_by(Task.created_at.desc()).all()]
    except Exception as e:
        logger.error(f"Error getting tasks: {e}")
        raise DatabaseError(str(e))


def create_task(
    title, description=None, due_date=None, list_id=None, priority=4, tags=None
):
    """Create a new task."""
    from database.models import Task, Tag

    try:
        task = Task(
            title=title,
            description=description,
            due_date=due_date,
            list_id=list_id,
            priority=priority,
        )

        if tags:
            for tag_name in tags:
                tag = Tag.query.filter_by(name=tag_name).first()
                if tag:
                    task.tags.append(tag)

        db.session.add(task)
        db.session.commit()
        return task.to_dict()
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating task: {e}")
        raise DatabaseError(str(e))


def update_task(id, **kwargs):
    """Update a task."""
    from database.models import Task, Tag

    try:
        task = Task.query.get(id)
        if not task:
            raise DatabaseError("Task not found")

        for key, value in kwargs.items():
            if key == "tags":
                task.tags = []
                for tag_name in value:
                    tag = Tag.query.filter_by(name=tag_name).first()
                    if tag:
                        task.tags.append(tag)
            else:
                setattr(task, key, value)

        db.session.commit()
        return task.to_dict()
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating task: {e}")
        raise DatabaseError(str(e))


def delete_task(id):
    """Delete a task."""
    from database.models import Task

    try:
        task = Task.query.get(id)
        if task:
            db.session.delete(task)
            db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting task: {e}")
        raise DatabaseError(str(e))


def toggle_task(id, completed=True):
    """Toggle task completion status."""
    from database.models import Task

    try:
        task = Task.query.get(id)
        if not task:
            raise DatabaseError("Task not found")

        task.completed = completed
        task.completed_at = datetime.utcnow() if completed else None
        db.session.commit()
        return task.to_dict()
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error toggling task: {e}")
        raise DatabaseError(str(e))


# List functions
def get_lists():
    """Get all lists."""
    from database.models import List

    try:
        return [
            list_obj.to_dict()
            for list_obj in List.query.order_by(List.created_at.desc()).all()
        ]
    except Exception as e:
        logger.error(f"Error getting lists: {e}")
        raise DatabaseError(str(e))


def get_list(id):
    """Get a specific list."""
    from database.models import List

    try:
        list_obj = List.query.get(id)
        return list_obj.to_dict() if list_obj else None
    except Exception as e:
        logger.error(f"Error getting list: {e}")
        raise DatabaseError(str(e))


def create_list(name, color="#4a90e2", icon="list"):
    """Create a new list."""
    from database.models import List

    try:
        list_obj = List(name=name, color=color, icon=icon)
        db.session.add(list_obj)
        db.session.commit()
        return list_obj.to_dict()
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating list: {e}")
        raise DatabaseError(str(e))


# Tag functions
def get_tags():
    """Get all tags."""
    from database.models import Tag

    try:
        return [tag.to_dict() for tag in Tag.query.order_by(Tag.name).all()]
    except Exception as e:
        logger.error(f"Error getting tags: {e}")
        raise DatabaseError(str(e))


def get_tag(id):
    """Get a specific tag."""
    from database.models import Tag

    try:
        tag = Tag.query.get(id)
        return tag.to_dict() if tag else None
    except Exception as e:
        logger.error(f"Error getting tag: {e}")
        raise DatabaseError(str(e))


def create_tag(name, color="#4a90e2"):
    """Create a new tag."""
    from database.models import Tag

    try:
        tag = Tag(name=name, color=color)
        db.session.add(tag)
        db.session.commit()
        return tag.to_dict()
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating tag: {e}")
        raise DatabaseError(str(e))
