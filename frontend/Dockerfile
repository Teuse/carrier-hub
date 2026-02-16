# ======================================================
# 1) Build Stage
# ======================================================
FROM node:20-alpine AS builder

WORKDIR /app

# env-variables are not acessible at build-time. So I need to set it manually
ARG VITE_API_BASE_URL
ARG VITE_SECURITY_USER_NAME
ARG VITE_SECURITY_USER_PASSWORD
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SECURITY_USER_NAME=$VITE_SECURITY_USER_NAME
ENV VITE_SECURITY_USER_PASSWORD=$VITE_SECURITY_USER_PASSWORD

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ======================================================
# 2) Runtime Stage
# ======================================================
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]