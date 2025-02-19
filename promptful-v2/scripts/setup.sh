#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Promptful development environment...${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Create environment file
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from example...${NC}"
    cp .env.example .env
else
    echo -e "${YELLOW}.env file already exists, skipping...${NC}"
fi

# Build the project
echo -e "${YELLOW}Building the project...${NC}"
npm run build

# Type check
echo -e "${YELLOW}Running type check...${NC}"
npm run type-check

# Lint the project
echo -e "${YELLOW}Running linter...${NC}"
npm run lint

echo -e "\n${GREEN}Setup complete! You can now run:${NC}"
echo -e "${YELLOW}npm run dev${NC} - to start the development server"
echo -e "${YELLOW}npm run build${NC} - to create a production build"
echo -e "${YELLOW}npm run preview${NC} - to preview the production build"

# Make the script executable
chmod +x scripts/setup.sh

echo -e "\n${GREEN}Happy coding! 🚀${NC}"