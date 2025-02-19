from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    ForeignKey,
    Table,
)
from sqlalchemy.orm import relationship
from database import db

# Association tables for many-to-many relationships
task_tags = Table(
    "task_tags",
    db.Model.metadata,
    Column("task_id", Integer, ForeignKey("tasks.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True),
)


class Task(db.Model):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    due_date = Column(DateTime)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime)
    priority = Column(Integer, default=4)  # 1=Highest, 4=Lowest

    # Relationships
    list_id = Column(Integer, ForeignKey("lists.id"))
    list = relationship("List", back_populates="tasks")
    parent_id = Column(Integer, ForeignKey("tasks.id"))
    subtasks = relationship("Task", backref=db.backref("parent", remote_side=[id]))
    tags = relationship("Tag", secondary=task_tags, back_populates="tasks")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "completed": self.completed,
            "completed_at": (
                self.completed_at.isoformat() if self.completed_at else None
            ),
            "priority": self.priority,
            "list_id": self.list_id,
            "parent_id": self.parent_id,
            "tags": [tag.to_dict() for tag in self.tags],
            "subtasks": [task.to_dict() for task in self.subtasks],
        }


class List(db.Model):
    __tablename__ = "lists"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    color = Column(String(7), default="#4a90e2")  # Hex color code
    icon = Column(String(50), default="list")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    tasks = relationship("Task", back_populates="list")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "color": self.color,
            "icon": self.icon,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "task_count": len(self.tasks),
        }


class Tag(db.Model):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    color = Column(String(7), default="#4a90e2")  # Hex color code
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    tasks = relationship("Task", secondary=task_tags, back_populates="tags")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "color": self.color,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "task_count": len(self.tasks),
        }
