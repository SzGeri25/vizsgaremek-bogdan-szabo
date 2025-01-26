/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.controller;

import com.idopontfoglalo.gbmedicalbackend.service.ReviewService;
import javax.ws.rs.GET;
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

}
