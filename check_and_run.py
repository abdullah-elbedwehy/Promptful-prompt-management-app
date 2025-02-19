#!/usr/bin/env python3

import os
import sys
import subprocess
import venv
import time
from pathlib import Path
from tqdm import tqdm


def run_command(command, error_msg=None):
    try:
        subprocess.run(command, check=True, shell=True, capture_output=True, text=True)
        return True
    except subprocess.CalledProcessError as e:
        if error_msg:
            print(f"❌ {error_msg}")
        return False


def get_venv_python():
    if sys.platform == "win32":
        return os.path.join("venv", "Scripts", "python")
    return os.path.join("venv", "bin", "python")


def get_venv_pip():
    if sys.platform == "win32":
        return os.path.join("venv", "Scripts", "pip")
    return os.path.join("venv", "bin", "pip")


def check_venv():
    if not os.path.exists("venv"):
        print("🔧 Setting up virtual environment...")
        venv.create("venv", with_pip=True)

    python_path = get_venv_python()
    if not os.path.exists(python_path):
        print("❌ Virtual environment setup failed")
        sys.exit(1)


def check_requirements():
    if not os.path.exists("requirements.txt"):
        print("❌ requirements.txt not found")
        sys.exit(1)

    print("📦 Installing packages...")
    pip_path = get_venv_pip()
    if not run_command(
        f"{pip_path} install -r requirements.txt", "Package installation failed"
    ):
        sys.exit(1)


def check_database():
    print("🗄️  Setting up database...")
    python_path = get_venv_python()
    if not run_command(
        f"{python_path} scripts/db_init.py init", "Database setup failed"
    ):
        sys.exit(1)


def run_checks():
    steps = ["Running tests", "Checking code style", "Formatting code"]
    python_path = get_venv_python()
    commands = [
        f"{python_path} -m pytest",
        f"{python_path} -m flake8",
        f"{python_path} -m black .",
    ]

    for step, cmd in zip(steps, commands):
        with tqdm(
            total=100,
            desc=f"⚡ {step}",
            bar_format="{desc:<30} |{bar:50}| {percentage:3.0f}% [{elapsed}<{remaining}]",
            colour="red",
        ) as pbar:
            run_command(cmd)
            for i in range(100):
                time.sleep(0.01)
                pbar.update(1)


def main():
    print("🎯 Starting Promptful...")

    tasks = ["Setting up environment", "Installing dependencies", "Preparing database"]
    for task in tasks:
        with tqdm(
            total=100,
            desc=f"🔄 {task}",
            bar_format="{desc:<30} |{bar:50}| {percentage:3.0f}% [{elapsed}<{remaining}]",
            colour="blue",
        ) as pbar:
            if "environment" in task:
                check_venv()
            elif "dependencies" in task:
                check_requirements()
            else:
                check_database()
            for i in range(100):
                time.sleep(0.02)
                pbar.update(1)

    run_checks()

    print("\n🚀 Launching application...")
    os.environ["FLASK_ENV"] = "development"
    python_path = get_venv_python()

    # Start Flask server in background
    flask_process = subprocess.Popen([python_path, "run.py"])

    print("\n🌐 Starting frontend...")
    if not run_command("cd promptful-v2 && npm run dev", "Frontend startup failed"):
        flask_process.terminate()
        sys.exit(1)

    try:
        flask_process.wait()
    except KeyboardInterrupt:
        print("\n👋 Shutting down...")
        flask_process.terminate()
        sys.exit(0)


if __name__ == "__main__":
    main()
