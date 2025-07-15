# 1. fázis: Build Maven + JDK
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY GBMedicalBackend/pom.xml GBMedicalBackend/
COPY GBMedicalBackend/src GBMedicalBackend/src
WORKDIR /app/GBMedicalBackend
RUN mvn clean package -DskipTests

# 2. fázis: Futtató környezet (WildFly)
FROM quay.io/wildfly/wildfly:26.1.1.Final


# Másoljuk be a MySQL JDBC modult a megfelelő helyre
COPY mysql-module /opt/jboss/wildfly/modules/system/layers/base/com/mysql/main/

# Másoljuk be az egyedi standalone.xml-t is (ha módosítottad)
COPY standalone.xml /opt/jboss/wildfly/standalone/configuration/standalone.xml


# Deployoljuk a .war fájlt
COPY --from=build /app/GBMedicalBackend/target/*.war /opt/jboss/wildfly/standalone/deployments/

EXPOSE 8080
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]
