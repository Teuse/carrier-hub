# ======================================================
# 1) Build Stage
# ======================================================
FROM gradle:9.2.1-jdk21 AS builder

WORKDIR /app

COPY gradlew .
COPY gradle/ ./gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src/ ./src

RUN chmod +x ./gradlew

#RUN ./gradlew dependencies --no-daemon || true

RUN ./gradlew build --info

# ======================================================
# 2) Runtime Stage
# ======================================================
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

# Non-root user (Security Best Practice)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
