FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

# Copy pre-built files and dependencies
COPY package*.json ./
RUN npm install --only=production

COPY dist ./dist
COPY prisma ./prisma
COPY .env .

EXPOSE 4000
CMD ["npm", "run", "start:prod"]