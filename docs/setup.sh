#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Supabase Message Board setup...${NC}\n"

# Check if project name is provided
if [ -z "$1" ]; then
    echo "Please provide a project name"
    echo "Usage: ./setup.sh <project-name>"
    exit 1
fi

PROJECT_NAME=$1

# Create Next.js project
echo -e "${GREEN}Creating Next.js project...${NC}"
npx create-next-app@latest $PROJECT_NAME --typescript --tailwind --eslint --app --import-alias "@/*"

# Navigate into project directory
cd $PROJECT_NAME

# Install Supabase client
echo -e "${GREEN}Installing Supabase client...${NC}"
npm install @supabase/supabase-js

# Create .env.local file
echo -e "${GREEN}Creating .env.local file...${NC}"
cat > .env.local << EOL
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EOL

# Create lib directory and Supabase client file
echo -e "${GREEN}Creating Supabase client configuration...${NC}"
mkdir -p lib
cat > lib/supabase.ts << EOL
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
EOL

# Initialize git repository
echo -e "${GREEN}Initializing git repository...${NC}"
git init
git add .
git commit -m "Initial project setup"

echo -e "\n${BLUE}Setup complete! Next steps:${NC}"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Create a GitHub repository and push your code"
echo "3. Set up your Supabase database using the SQL from the PRD"
echo "4. Run 'npm run dev' to start the development server" 