import subprocess, sys

with open("migrations_err.txt", "w") as f:
    result = subprocess.run(
        [sys.executable, 'manage.py', 'makemigrations'],
        capture_output=True, text=True, cwd=r'c:\Users\user\Desktop\django pr'
    )
    f.write(f"STDOUT:\n{result.stdout}\n\nSTDERR:\n{result.stderr}")
