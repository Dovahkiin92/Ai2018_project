FROM openjdk:11
ADD /target/ResourceServer-1.0-SNAPSHOT-jar-with-dependencies.jar resourceServer.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "resourceServer.jar"]