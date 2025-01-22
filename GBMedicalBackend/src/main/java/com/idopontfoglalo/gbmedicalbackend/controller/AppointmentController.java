/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.controller;

import com.idopontfoglalo.gbmedicalbackend.model.TimeSlotDTO;
import com.idopontfoglalo.gbmedicalbackend.service.AppointmentService;
import com.idopontfoglalo.gbmedicalbackend.service.DoctorService;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import org.json.JSONObject;

/**
 *
 * @author szabo
 */
@Path("appointments")
public class AppointmentController {

    private final AppointmentService layer = new AppointmentService(); // vagy a megfelelő osztály, amely a service réteget képviseli

    @POST
    @Path("addAppointmentWithNotification")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addAppointmentWithNotification(String bodyString) {
        JSONObject body = new JSONObject(bodyString);

        int doctorId = body.getInt("doctorId");
        int patientId = body.getInt("patientId");
        String startTime = body.getString("startTime");
        String endTime = body.getString("endTime");
        int duration = body.getInt("duration");
        String status = body.getString("status");

        JSONObject obj = layer.addAppointmentWithNotification(doctorId, patientId, startTime, endTime, duration, status);
        return Response.status(obj.getInt("statusCode")).entity(obj.toString()).type(MediaType.APPLICATION_JSON).build();
    }

    @GET
    @Path("getBookedAppointments")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getBookedAppointments() {
        JSONObject obj = layer.getBookedAppointments();
        return Response.status(obj.getInt("statusCode")).entity(obj.toString()).type(MediaType.APPLICATION_JSON).build();
    }

    @DELETE
    @Path("cancelAppointment")
    @Produces(MediaType.APPLICATION_JSON)
    public Response cancelAppointment(@QueryParam("appointmentId") int appointmentId) {
        JSONObject obj = layer.cancelAppointment(appointmentId);
        return Response.status(obj.getInt("statusCode")).entity(obj.toString()).build();
    }

    @PUT
    @Path("updateAppointment")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateAppointment(String bodyString) {
        JSONObject body = new JSONObject(bodyString);

        int appointmentId = body.getInt("appointmentId");
        int doctorId = body.getInt("doctorId");
        int patientId = body.getInt("patientId");
        String startTime = body.getString("startTime");
        String endTime = body.getString("endTime");
        String status = body.getString("status");
        int duration = body.getInt("duration");

        JSONObject obj = layer.updateAppointment(appointmentId, doctorId, patientId, startTime, endTime, status, duration);
        return Response.status(obj.getInt("statusCode")).entity(obj.toString()).type(MediaType.APPLICATION_JSON).build();
    }

}
