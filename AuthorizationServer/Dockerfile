FROM openjdk:11
ADD /target/AuthorizationServer-1.0-SNAPSHOT-jar-with-dependencies.jar authorizationServer.jar

EXPOSE 9000
ENTRYPOINT ["java", "-jar", "authorizationServer.jar"]