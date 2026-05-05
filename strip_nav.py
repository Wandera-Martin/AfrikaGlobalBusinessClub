import os
import re

pages_dir = r"c:\Users\user\Desktop\django pr\frontend\client\src\pages"
pages = ["OpportunitiesPage.tsx", "NetworkPage.tsx", "ServicesPage.tsx", "EventsPage.tsx", "MessagesPage.tsx"]

for page in pages:
    filepath = os.path.join(pages_dir, page)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove the `<nav ...> ... </nav>` block. It's multi-line.
    # The nav usually starts with <nav className="fixed top-0
    content = re.sub(r'<nav className="fixed top-0.*?</nav>', '', content, flags=re.DOTALL)
    
    # 2. Remove the surrounding page wrapper container:
    # <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-6 text-center pt-24">
    # or similar
    # Actually, some pages have: `<div className="min-h-screen bg-gray-50 text-gray-800 pb-20">`
    # and `<div className="pt-24 px-10 max-w-6xl mx-auto">`
    
    # Let's do a more robust string replacement strategy since they are very similar
    content = content.replace('<div className="min-h-screen bg-gray-50 text-gray-800 pb-20">', '<>')
    content = content.replace('<div className="pt-24 px-10 max-w-6xl mx-auto">', '')
    
    # Same for event/messages if they differ slightly
    content = content.replace('<div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-6 text-center pt-24">', '<div className="h-full flex items-center justify-center p-6 text-center">')
    content = content.replace('<div className="min-h-screen flex items-center justify-center bg-gray-50">', '<div className="h-full flex items-center justify-center">')
    
    # Change the return statement wrapping if we missed it
    
    # Since we changed `<div className="min-h-screen...` to `<>`, we need to replace the last two `</div>` with `</>`
    # Find the last "    </div>\n    </div>"
    if "</div>\n    </div>\n  );\n};" in content:
        content = content.replace("</div>\n    </div>\n  );\n};", "</div>\n    </>\n  );\n};")
        
    # Some files might just have "</div>\n  );\n};"
    if "</div>\n  );\n};" in content and "<>" in content and "</>" not in content:
        content = content.replace("</div>\n  );\n};", "</>\n  );\n};")
        
    # Remove unused local imports
    content = re.sub(r"import NotificationDropdown from '[^']+';\n?", '', content)
    content = re.sub(r"import AccountDropdown from '[^']+';\n?", '', content)
    content = re.sub(r"import \{ LayoutDashboard.*?\} from 'lucide-react';\n?", '', content)

    # Let's save it
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Processed {page}")
