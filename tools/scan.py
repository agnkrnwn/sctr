import os

def scan_directory(directory):
    # List to hold all files and directories
    files_and_dirs = []

    # Walk through the directory
    for root, dirs, files in os.walk(directory):
        # Exclude directories starting with dot (.)
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for name in files:
            files_and_dirs.append(os.path.join(root, name))

    return files_and_dirs

# Get the current directory
current_directory = os.getcwd()

# Scan the current directory
scanned_items = scan_directory(current_directory)

# Define a function to format paths as needed
def format_path(path):
    # Replace backslashes with forward slashes
    formatted_path = path.replace(current_directory, "").replace("\\", "/")
    return f'"{formatted_path}",'

# Print the formatted results
for item in scanned_items:
    print(format_path(item))
