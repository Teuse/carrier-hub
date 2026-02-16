# ======================================================
# 1) Build Stage
# ======================================================
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

ARG SPRING_PROFILES_ACTIVE=prod
ENV SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE}

# Copy wrapper files first
COPY gradlew .
COPY gradle/ ./gradle/

# Make wrapper executable
RUN chmod +x ./gradlew

# Copy build files
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src/ ./src/

# Use wrapper for build
RUN ./gradlew clean build -x test

# ======================================================
# 2) Runtime Stage
# ======================================================
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]