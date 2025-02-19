#!/usr/bin/env python3

import os
import sqlite3
import sys
from pathlib import Path

# Get the project root directory
ROOT_DIR = Path(__file__).resolve().parent.parent
INSTANCE_DIR = ROOT_DIR / "instance"
SCHEMA_FILE = ROOT_DIR / "database" / "schema.sql"
DB_FILE = INSTANCE_DIR / "promptful.sqlite"


def init_db():
    """Initialize the database."""
    print("Initializing database...")

    # Create instance directory if it doesn't exist
    INSTANCE_DIR.mkdir(exist_ok=True)

    # Read schema
    with open(SCHEMA_FILE, "r") as f:
        schema = f.read()

    # Connect to database and create schema
    try:
        with sqlite3.connect(DB_FILE) as conn:
            conn.executescript(schema)
            print(f"Database initialized successfully at {DB_FILE}")
    except Exception as e:
        print(f"Error initializing database: {e}", file=sys.stderr)
        sys.exit(1)


def reset_db():
    """Reset the database by deleting and reinitializing it."""
    if DB_FILE.exists():
        try:
            print("Removing existing database...")
            DB_FILE.unlink()
        except Exception as e:
            print(f"Error removing database: {e}", file=sys.stderr)
            sys.exit(1)

    init_db()


def main():
    """Main entry point."""
    if len(sys.argv) != 2 or sys.argv[1] not in ["init", "reset"]:
        print("Usage: python db_init.py [init|reset]")
        sys.exit(1)

    command = sys.argv[1]

    if command == "init":
        if not DB_FILE.exists():
            init_db()
        else:
            print("Database already exists. Use 'reset' to recreate it.")
    elif command == "reset":
        reset_db()


if __name__ == "__main__":
    main()
