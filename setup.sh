#!/bin/zsh
export PATH="/Users/roshanpreetsinghdhiman/.nvm/versions/node/v20.20.0/bin:$PATH"

cd /Users/roshanpreetsinghdhiman/Roshan/projects/leadengine-website
rm -rf frontend
npx create-vite@latest frontend --template react --yes
cd frontend
npm install
npm install lucide-react react-router-dom axios clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

cd ../backend
npm init -y
npm install express cors sqlite3 jsonwebtoken dotenv
