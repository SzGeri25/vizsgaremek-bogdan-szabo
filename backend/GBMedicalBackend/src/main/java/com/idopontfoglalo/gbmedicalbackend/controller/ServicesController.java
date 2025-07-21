/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.controller;

import com.idopontfoglalo.gbmedicalbackend.service.ServicesService;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.json.JSONObject;

/**
 *
 * @author szabo
 */
@Path("services")
public class ServicesController {

    private final ServicesService layer = new ServicesService(); // vagy a megfelelő osztály, amely a service réteget képviseli

    @GET
    @Path("getAllServices")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllServices() {
        JSONObject obj = layer.getAllServices();
        System.out.println("Válasz a backendtől: " + obj.toString());
        return Response.status(obj.getInt("statusCode")).entity(obj.toString()).type(MediaType.APPLICATION_JSON).build();

    }
}
