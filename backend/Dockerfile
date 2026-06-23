# Node.js 24 environment container image
FROM node:24-slim

# App directory set karein
WORKDIR /usr/src/app

# Package files copy karein dependency check ke liye
COPY package*.json ./

# Production dependencies install karein (Fast and clean build)
# RUN npm ci --only=production
RUN npm ci --only=production

# Baqi saara source code copy karein
COPY . .

# Hugging Face hamesha port 7860 use karta hai
ENV PORT=7860
EXPOSE 7860

CMD ["npm","run,"dev"]