/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.service;

import com.idopontfoglalo.gbmedicalbackend.model.Appointments;
import org.json.JSONObject;

/**
 *
 * @author szabo
 */
public class AppointmentService {

    private Appointments layer = new Appointments(); // vagy a megfelelő osztály, amely a model réteget képviseli

    public JSONObject addAppointmentWithNotification(int doctorId, int patientId, String startTime, String endTime, int duration, String status) {
        JSONObject toReturn = new JSONObject();
        String responseStatus = "success";
        int statusCode = 200;

        if (doctorId <= 0 || patientId <= 0 || startTime == null || endTime == null || duration <= 0 || status == null) {
            responseStatus = "invalidInput";
            statusCode = 400;
        } else {
            boolean modelResult = layer.addAppointmentWithNotification(doctorId, patientId, startTime, endTime, duration, status);

            if (!modelResult) {
                responseStatus = "modelException";
                statusCode = 500;
            } else {
                JSONObject result = new JSONObject();
                result.put("message", "Appointment successfully created with notification");
                result.put("doctorId", doctorId);
                result.put("patientId", patientId);
                result.put("startTime", startTime);
                result.put("endTime", endTime);
                result.put("duration", duration);
                result.put("status", status);

                toReturn.put("result", result);
            }
        }

        toReturn.put("status", responseStatus);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }
}
