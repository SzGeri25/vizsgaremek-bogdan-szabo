# 1. fázis: Build Maven + JDK
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY GBMedicalBackend/pom.xml GBMedicalBackend/
COPY GBMedicalBackend/src GBMedicalBackend/src
WORKDIR /app/GBMedicalBackend
RUN mvn clean package -DskipTests

# 2. fázis: Futtató környezet (WildFly)
FROM quay.io/wildfly/wildfly:26.1.1.Final

# 2.1. Másoljuk be a MySQL JDBC modult
COPY mysql-module /opt/jboss/wildfly/modules/system/layers/base/com/mysql/main/

# 2.2. Másoljuk be az egyedi standalone.xml-t
COPY standalone.xml /opt/jboss/wildfly/standalone/configuration/standalone.xml

# Váltás root-ra, hogy másolhassunk és chmod-olhassunk
USER root

# 2.3. Másoljuk be a wait-for-it scriptet, és tegyük futtathatóvá
COPY wait-for-it.sh /opt/jboss/wait-for-it.sh
RUN chmod +x /opt/jboss/wait-for-it.sh

# Majd vissza a jboss user-re
USER jboss

# 2.4. Deploy .war
COPY --from=build /app/GBMedicalBackend/target/*.war /opt/jboss/wildfly/standalone/deployments/

EXPOSE 8080

# 2.5. Végeredmény: előbb várakozás a MySQL-re, aztán WildFly indítása
ENTRYPOINT ["/opt/jboss/wait-for-it.sh", "gbmed-mysql:3306", "--strict", "--timeout=60", "--", "/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]
