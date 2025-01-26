/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.service;

import com.idopontfoglalo.gbmedicalbackend.model.Reviews;
import java.util.List;
import org.json.JSONObject;

/**
 *
 * @author szabo
 */
public class ReviewService {

    private final Reviews layer = new Reviews();

    public JSONObject getReviewsByDoctorId(int doctorId) {
        JSONObject response = new JSONObject();
        String responseStatus = "success";
        int statusCode = 200;

        if (doctorId <= 0) {
            responseStatus = "invalidInput";
            statusCode = 400;
        } else {
            List<JSONObject> reviews = layer.getReviewsByDoctorId(doctorId);

            if (reviews.isEmpty()) {
                responseStatus = "notFound";
                statusCode = 404;
            } else {
                response.put("reviews", reviews);
            }
        }

        response.put("status", responseStatus);
        response.put("statusCode", statusCode);
        return response;
    }

}
