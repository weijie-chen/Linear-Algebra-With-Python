import os
import re
from datetime import datetime

# Directory where notebooks are stored
notebooks_dir = 'notebooks'

# Read the README.md file
with open('README.md', 'r') as file:
    content = file.read()

# Update the date
updated_date = datetime.now().strftime("<font color='purple' size=2.5><i>Updated on %b %Y</i></font>")
content = re.sub(r"<font color='purple' size=2.5><i>Updated on .*</i></font>", updated_date, content)

# Define the new base URL for nbviewer links
new_base_url = "https://nbviewer.org/github/weijie-chen/Linear-Algebra-With-Python/blob/master/notebooks"

# Function to generate new lecture link
def generate_chapter_link(filename):
    chapter_name = filename.replace('.ipynb', '')
    return f"[{chapter_name}]({new_base_url}/{filename})"

# Get list of notebook files
notebook_files = [f for f in os.listdir(notebooks_dir) if f.endswith('.ipynb')]

# Create a new content section for the lectures
lectures_section = "\n".join([generate_chapter_link(file) + "<br>" for file in sorted(notebook_files)])

# Update the lectures section in the README content
content = re.sub(r'## Contents(.|\n)*?(?=##)', f'## Contents\n\n{lectures_section}\n\n', content, flags=re.DOTALL)

# Write the updated content back to the README.md file
with open('README.md', 'w') as file:
    file.write(content)
