/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.controller;

import com.idopontfoglalo.gbmedicalbackend.service.ReviewService;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.json.JSONObject;

/**
 *
 * @author szabo
 */
@Path("reviews")
public class ReviewController {

    private final ReviewService layer = new ReviewService();

    @GET
    @Path("getReviewsByDoctorId/{doctorId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReviewsByDoctorId(@PathParam("doctorId") int doctorId) {
        JSONObject result = layer.getReviewsByDoctorId(doctorId);
        return Response.status(result.getInt("statusCode")).entity(result.toString()).build();
    }

    @POST
    @Path("addReview")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addReview(String requestBody) {
        try {
            // JSON bemenet feldolgozása
            JSONObject request = new JSONObject(requestBody);

            int doctorId = request.optInt("doctorId", -1);
            int patientId = request.optInt("patientId", -1);
            int rating = request.optInt("rating", -1);
            String reviewText = request.optString("reviewText", null);

            // Szerviz meghívása
            JSONObject response = layer.addReview(doctorId, patientId, rating, reviewText);

            return Response.status(response.getInt("statusCode")).entity(response.toString()).build();

        } catch (Exception e) {
            System.err.println("Hiba az addReview controllerben: " + e.getMessage());
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Invalid request format or server error");
            errorResponse.put("statusCode", 500);

            return Response.status(500).entity(errorResponse.toString()).build();
        }
    }

}
