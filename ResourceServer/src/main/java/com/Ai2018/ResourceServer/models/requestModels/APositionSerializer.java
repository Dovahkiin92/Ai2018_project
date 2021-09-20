package com.Ai2018.ResourceServer.models.requestModels;


import com.Ai2018.ResourceServer.models.Position;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class APositionSerializer extends StdSerializer<ApproximatedPosition> {

    public APositionSerializer() {
        this(null);
    }

    public APositionSerializer(Class<ApproximatedPosition> m) {
        super(m);
    }

    @Override
    public void serialize(
            ApproximatedPosition m, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {
        jgen.writeStartObject();
        jgen.writeStringField("owner" ,m.getUserId());
        jgen.writeNumberField("longitude", m.getLongitude());
        jgen.writeNumberField("latitude", m.getLatitude());
        jgen.writeEndObject();
    }
}