import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta
from run import app
from database.db import db, create_list, create_tag, create_task


def init_sample_data():
    """Initialize the database with sample data."""
    with app.app_context():
        # Create sample lists
        work_list = create_list("Work", color="#4a90e2", icon="briefcase")
        personal_list = create_list("Personal", color="#50e3c2", icon="user")
        shopping_list = create_list("Shopping", color="#f5a623", icon="shopping-cart")

        # Create sample tags
        urgent_tag = create_tag("Urgent", color="#e74c3c")
        important_tag = create_tag("Important", color="#f5a623")
        meeting_tag = create_tag("Meeting", color="#4a90e2")
        idea_tag = create_tag("Idea", color="#50e3c2")

        # Create sample tasks
        today = datetime.now().date()

        # Work tasks
        create_task(
            "Prepare presentation for client meeting",
            description="Create slides and gather metrics for Q1 review",
            due_date=datetime.now() + timedelta(days=2),
            list_id=work_list["id"],
            priority=1,
            tags=["Urgent", "Meeting"],
        )

        create_task(
            "Review team's code submissions",
            description="Go through PRs and provide feedback",
            due_date=datetime.now() + timedelta(days=1),
            list_id=work_list["id"],
            priority=2,
            tags=["Important"],
        )

        create_task(
            "Weekly team sync",
            description="Discuss project progress and blockers",
            due_date=datetime.now(),
            list_id=work_list["id"],
            priority=2,
            tags=["Meeting"],
        )

        # Personal tasks
        create_task(
            "Gym workout",
            description="30 min cardio + strength training",
            due_date=datetime.now(),
            list_id=personal_list["id"],
            priority=3,
        )

        create_task(
            "Read 'Deep Work' book",
            description="Complete chapters 3-4",
            list_id=personal_list["id"],
            priority=4,
        )

        create_task(
            "Plan weekend trip",
            description="Book accommodations and plan activities",
            due_date=datetime.now() + timedelta(days=5),
            list_id=personal_list["id"],
            priority=3,
            tags=["Important"],
        )

        # Shopping tasks
        create_task(
            "Buy groceries",
            description="Milk, eggs, bread, fruits",
            due_date=datetime.now(),
            list_id=shopping_list["id"],
            priority=2,
            tags=["Urgent"],
        )

        create_task(
            "Get new running shoes",
            description="Check Nike and Adidas stores",
            list_id=shopping_list["id"],
            priority=4,
        )

        # Tasks without a list (Inbox)
        create_task(
            "Schedule dentist appointment",
            due_date=datetime.now() + timedelta(days=7),
            priority=3,
        )

        create_task(
            "New app idea",
            description="Create a meal planning app with AI suggestions",
            tags=["Idea"],
        )


if __name__ == "__main__":
    init_sample_data()
    print("Sample data initialized successfully!")
