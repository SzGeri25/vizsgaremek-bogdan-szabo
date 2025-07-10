# 1. Build fázis (Maven + JDK környezet)
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY GBMedicalBackend/pom.xml .
COPY GBMedicalBackend/src ./src
RUN mvn clean package -DskipTests

# 2. Futtató fázis (WildFly image)
FROM quay.io/wildfly/wildfly:latest

COPY GBMedicalBackend/target/*.war /opt/jboss/wildfly/standalone/deployments/

EXPOSE 8080

CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]
