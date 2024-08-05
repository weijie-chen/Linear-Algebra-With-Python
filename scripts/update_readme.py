import re
from datetime import datetime

# Read the README.md file
with open('README.md', 'r') as file:
    content = file.read()

# Update the date
updated_date = datetime.now().strftime("<font color='purple' size=2.5><i>Updated on %b %Y</i></font>")
content = re.sub(r"<font color='purple' size=2.5><i>Updated on .*</i></font>", updated_date, content)

# Define the new base URL for nbviewer links
new_base_url = "https://nbviewer.org/github/weijie-chen/Linear-Algebra-With-Python/blob/master/notebooks/Chapter"

# Update nbviewer links
content = re.sub(r"https://nbviewer.jupyter.org/github/[^/]+/[^/]+/blob/[^/]+/Chapter[^\s]+", lambda match: re.sub(r"https://nbviewer.jupyter.org/github/[^/]+/[^/]+/blob/[^/]+/Chapter", new_base_url, match.group(0)), content)

# Write the updated content back to the README.md file
with open('README.md', 'w') as file:
    file.write(content)
