import os
import re

pages_dir = r"c:\Users\user\Desktop\django pr\frontend\client\src\pages"
pages = ["ServicesPage.tsx", "EventsPage.tsx", "NetworkPage.tsx", "MessagesPage.tsx"]

for page in pages:
    filepath = os.path.join(pages_dir, page)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match interface definitions like:
    # interface NetworkPageProps {
    #   onLogout: () => void;
    # }
    content = re.sub(r'interface\s+\w+PageProps\s*\{\s*onLogout\s*:.*?\}', '', content, flags=re.DOTALL)
    
    # Match the React component declaration:
    # const NetworkPage: React.FC<NetworkPageProps> = ({ onLogout }) => {
    # Replace with:
    # const NetworkPage: React.FC = () => {
    content = re.sub(r'const\s+(\w+Page)\s*:\s*React\.FC<\w+PageProps>\s*=\s*\(\{\s*onLogout\s*\}\)\s*=>\s*\{', r'const \1: React.FC = () => {', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Processed {page}")
