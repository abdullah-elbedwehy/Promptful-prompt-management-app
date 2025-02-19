from flask import jsonify, request, render_template
from run import app
from database import db
from database.db import DatabaseError
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


@app.route("/")
def index():
    """Main task view."""
    tasks = db.get_tasks(list_id=None)  # Get inbox tasks
    return render_template("index.html", tasks=tasks)


@app.route("/today")
def today():
    """Today's tasks view."""
    today = datetime.now().date()
    tasks = db.get_tasks(due_date=today)
    return render_template("index.html", tasks=tasks, view="today")


@app.route("/upcoming")
def upcoming():
    """Upcoming tasks view."""
    tasks = db.get_tasks(due_after=datetime.now().date())
    return render_template("index.html", tasks=tasks, view="upcoming")


@app.route("/lists")
def lists():
    """Lists view."""
    lists = db.get_lists()
    return render_template("lists.html", lists=lists)


@app.route("/list/<int:id>")
def list_view(id):
    """Single list view."""
    tasks = db.get_tasks(list_id=id)
    list_info = db.get_list(id)
    return render_template("index.html", tasks=tasks, list=list_info)


@app.route("/tags")
def tags():
    """Tags view."""
    tags = db.get_tags()
    return render_template("tags.html", tags=tags)


@app.route("/tag/<int:id>")
def tag_view(id):
    """Single tag view."""
    tasks = db.get_tasks(tag_id=id)
    tag_info = db.get_tag(id)
    return render_template("index.html", tasks=tasks, tag=tag_info)


# API Routes


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    """Get tasks with optional filters."""
    try:
        list_id = request.args.get("list_id", type=int)
        tag_id = request.args.get("tag_id", type=int)
        due_date = request.args.get("due_date")
        if due_date:
            due_date = datetime.strptime(due_date, "%Y-%m-%d").date()

        tasks = db.get_tasks(list_id=list_id, tag_id=tag_id, due_date=due_date)
        return jsonify({"status": "success", "data": tasks})
    except Exception as e:
        logger.error(f"Error getting tasks: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/tasks", methods=["POST"])
def create_task():
    """Create a new task."""
    try:
        data = request.get_json()
        required = ["title"]
        if not all(field in data for field in required):
            return (
                jsonify({"status": "error", "message": "Missing required fields"}),
                400,
            )

        task = db.create_task(
            title=data["title"],
            description=data.get("description"),
            due_date=data.get("due_date"),
            list_id=data.get("list_id"),
            priority=data.get("priority", 4),
            tags=data.get("tags", []),
        )
        return jsonify({"status": "success", "data": task}), 201
    except Exception as e:
        logger.error(f"Error creating task: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    """Update a task."""
    try:
        data = request.get_json()
        task = db.update_task(id, **data)
        return jsonify({"status": "success", "data": task})
    except Exception as e:
        logger.error(f"Error updating task: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    """Delete a task."""
    try:
        db.delete_task(id)
        return jsonify({"status": "success"})
    except Exception as e:
        logger.error(f"Error deleting task: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/tasks/<int:id>/toggle", methods=["POST"])
def toggle_task(id):
    """Toggle task completion."""
    try:
        completed = request.json.get("completed", True)
        task = db.toggle_task(id, completed)
        return jsonify({"status": "success", "data": task})
    except Exception as e:
        logger.error(f"Error toggling task: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


# List management
@app.route("/api/lists", methods=["GET"])
def get_lists():
    """Get all lists."""
    try:
        lists = db.get_lists()
        return jsonify({"status": "success", "data": lists})
    except Exception as e:
        logger.error(f"Error getting lists: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/lists", methods=["POST"])
def create_list():
    """Create a new list."""
    try:
        data = request.get_json()
        if "name" not in data:
            return jsonify({"status": "error", "message": "Name is required"}), 400

        list_obj = db.create_list(
            name=data["name"],
            color=data.get("color", "#4a90e2"),
            icon=data.get("icon", "list"),
        )
        return jsonify({"status": "success", "data": list_obj}), 201
    except Exception as e:
        logger.error(f"Error creating list: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


# Tag management
@app.route("/api/tags", methods=["GET"])
def get_tags():
    """Get all tags."""
    try:
        tags = db.get_tags()
        return jsonify({"status": "success", "data": tags})
    except Exception as e:
        logger.error(f"Error getting tags: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/tags", methods=["POST"])
def create_tag():
    """Create a new tag."""
    try:
        data = request.get_json()
        if "name" not in data:
            return jsonify({"status": "error", "message": "Name is required"}), 400

        tag = db.create_tag(name=data["name"], color=data.get("color", "#4a90e2"))
        return jsonify({"status": "success", "data": tag}), 201
    except Exception as e:
        logger.error(f"Error creating tag: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
