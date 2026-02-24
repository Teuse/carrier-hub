# ======================================================
# 1) Build Stage
# ======================================================
FROM node:20-alpine AS builder

WORKDIR /app

# env-variables are not acessible at build-time. So I need to set it manually
ARG VITE_API_BASE_URL
ARG VITE_KC_FRONTEND_CLIENT_ID
ARG VITE_KC_HTTP_PORT
ARG VITE_KC_BACKEND_CLIENT_ID
ARG VITE_REDIRECT_URI

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_KC_FRONTEND_CLIENT_ID=$VITE_KC_FRONTEND_CLIENT_ID
ENV VITE_KC_HTTP_PORT=$VITE_KC_HTTP_PORT
ENV VITE_KC_BACKEND_CLIENT_ID=$VITE_KC_BACKEND_CLIENT_ID
ENV VITE_REDIRECT_URI=$VITE_REDIRECT_URI

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ======================================================
# 2) Runtime Stage
# ======================================================
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]