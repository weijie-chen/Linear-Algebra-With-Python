import re
import sys
from pathlib import Path

# Define the base URL for the chapters
base_url = "https://www.weijiechen.com/linear-algebra-with-python-book/qmd/"

# Function to generate the correct URL for each chapter
def generate_url(chapter_name):
    chapter_slug = chapter_name.replace(" ", "%20").replace(",", "%2C")
    return f"{base_url}{chapter_slug}.html"

# Function to update links in the Markdown file
def update_links_in_markdown(file_path):
    # Ensure the file path is a Path object
    file_path = Path(file_path)
    
    if not file_path.is_file():
        print(f"Error: The file {file_path} does not exist.")
        return

    # Read the original file
    with file_path.open('r', encoding='utf-8') as file:
        content = file.read()

    # Regular expression to find all links with chapters
    pattern = re.compile(r'\[([^\]]+)\]\((https://nbviewer\.org/github/weijie-chen/Linear-Algebra-With-Python/blob/master/notebooks/[^)]+)\)')
    
    def replace_link(match):
        chapter_name = match.group(1)
        return f"[{chapter_name}]({generate_url(chapter_name)})"

    # Replace the links with the correct format
    updated_content = pattern.sub(replace_link, content)

    # Write the updated content back to the file
    with file_path.open('w', encoding='utf-8') as file:
        file.write(updated_content)

    print(f"Links in {file_path} have been updated.")

# Main function to handle command-line arguments
if __name__ == "__main__":
    # Path to README.md, assuming script is in 'scripts' directory
    script_dir = Path(__file__).parent
    markdown_file_path = script_dir.parent / 'README.md'

    # Debug print to confirm path
    print(f"Processing file: {markdown_file_path}")

    update_links_in_markdown(markdown_file_path)
