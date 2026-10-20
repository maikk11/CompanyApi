# BUILD STAGE
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

# npm ci (not "npm install"):
# - requires package-lock.json
# - installs exactly the locked versions
# - never modifies package-lock.json
RUN npm ci

COPY . ./

RUN npm run build

# RUNTIME
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]