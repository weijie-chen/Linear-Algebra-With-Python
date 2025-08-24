import os
import re
from datetime import datetime
from urllib.parse import quote

# Directory where notebooks are stored
notebooks_dir = 'notebooks'

# Read the README.md file
with open('README.md', 'r') as file:
    content = file.read()

# Update the date
updated_date = datetime.now().strftime("<font color='purple' size=2.5><i>Updated on %b %Y</i></font>")
content = re.sub(r"<font color='purple' size=2.5><i>Updated on .*</i></font>", updated_date, content)

# Define the new base URL for nbviewer links
new_base_url = "https://www.weijiechen.com/linear-algebra-with-python-book/qmd/"

# Function to generate new lecture link
def generate_lecture_link(filename):
    lecture_name = filename.replace('.ipynb', '')
    encoded_filename = quote(filename)
    return f"[{lecture_name}]({new_base_url}/{encoded_filename})"

# Get list of notebook files and sort them numerically by chapter
notebook_files = sorted(
    [f for f in os.listdir(notebooks_dir) if f.endswith('.ipynb')],
    key=lambda x: int(re.search(r'\d+', x).group())
)

# Create a new content section for the lectures
lectures_section = "\n".join([generate_lecture_link(file) + "<br>" for file in notebook_files])

# Update the lectures section in the README content
content = re.sub(r'## Contents(.|\n)*?(?=##)', f'## Contents\n\n{lectures_section}\n\n', content, flags=re.DOTALL)

# Write the updated content back to the README.md file
with open('README.md', 'w') as file:
    file.write(content)
