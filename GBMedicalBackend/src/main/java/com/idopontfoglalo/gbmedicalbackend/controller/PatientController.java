/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.controller;

import com.idopontfoglalo.gbmedicalbackend.model.Patients;
import com.idopontfoglalo.gbmedicalbackend.service.PatientService;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import org.json.JSONObject;

/**
 *
 * @author szabo
 */
@Path("patients")
public class PatientController {

    @Context
    private UriInfo context;
    private PatientService layer = new PatientService();

    public PatientController() {

    }

    /**
     * Retrieves representation of an instance of
     * com.iakk.backendvizsga.controller.UserController
     *
     * @return an instance of java.lang.String
     */
    @GET
    @Produces(MediaType.APPLICATION_XML)
    public String getXml() {
        //TODO return proper representation object
        throw new UnsupportedOperationException();
    }

    /**
     * PUT method for updating or creating an instance of UserController
     *
     * @param content representation for the resource
     */
    @PUT
    @Consumes(MediaType.APPLICATION_XML)
    public void putXml(String content) {
    }

    @POST
    @Path("registerPatient")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerPatient(String bodyString) {
        JSONObject body = new JSONObject(bodyString);

        Patients p = new Patients(
                body.getString("firstName"),
                body.getString("lastName"),
                body.getString("email"),
                body.getString("phoneNumber"),
                body.getString("password")
        );

        JSONObject obj = layer.registerPatient(p);
        return Response.status(obj.getInt("statusCode")).entity(obj.toString()).type(MediaType.APPLICATION_JSON).build();
    }

}
