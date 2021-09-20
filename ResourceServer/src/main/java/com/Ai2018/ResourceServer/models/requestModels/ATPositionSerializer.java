package com.Ai2018.ResourceServer.models.requestModels;

import com.Ai2018.ResourceServer.models.Position;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class ATPositionSerializer extends StdSerializer<ApproximatedTimePosition> {

    public ATPositionSerializer() {
        this(null);
    }

    public ATPositionSerializer(Class<ApproximatedTimePosition> m) {
        super(m);
    }

    @Override
    public void serialize(
            ApproximatedTimePosition m, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {
        jgen.writeStartObject();
        jgen.writeStringField("owner" ,m.getUserId());
        jgen.writeNumberField("timestamp", m.getTimestamp());
        jgen.writeEndObject();
    }
}