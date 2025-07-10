# 1. Használj egy JDK image-et alapnak
FROM openjdk:17-jdk

# 2. Másold be a WildFly-t a konténerbe
COPY programs/wildfly-preview-26.1.1.Final /opt/wildfly

# 3. Állítsd be a környezetet
ENV JBOSS_HOME=/opt/wildfly
ENV PATH=$PATH:$JBOSS_HOME/bin

# 4. Másold be a standalone.xml konfigurációt
COPY programs/wildfly-preview-26.1.1.Final/standalone/configuration/standalone.xml $JBOSS_HOME/standalone/configuration/standalone.xml

# 5. Másold be a backend WAR fájlt a WildFly deploy mappájába
COPY backend/GBMedicalBackend/target/GBMedicalBackend-1.0-SNAPSHOT.war $JBOSS_HOME/standalone/deployments/

# 6. Nyisd ki a 8080-as portot
EXPOSE 8080

# 7. Indítsd el a WildFly szervert
CMD ["sh", "-c", "$JBOSS_HOME/bin/standalone.sh -b 0.0.0.0"]
