/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.service;

import com.idopontfoglalo.gbmedicalbackend.model.Appointments;
import java.util.List;
import org.json.JSONArray;
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

    public JSONObject getBookedAppointments() {
        JSONObject toReturn = new JSONObject();
        String responseStatus = "success";
        int statusCode = 200;

        try {
            List<Appointments> bookedAppointments = layer.getBookedAppointments();

            if (bookedAppointments == null || bookedAppointments.isEmpty()) {
                responseStatus = "noRecordsFound";
                statusCode = 404;
            } else {
                JSONArray appointmentsArray = new JSONArray();
                for (Appointments appointment : bookedAppointments) {
                    JSONObject appointmentObject = new JSONObject();
                    appointmentObject.put("id", appointment.getId());
                    appointmentObject.put("doctorId", appointment.getDoctorId().getId());
                    appointmentObject.put("patientId", appointment.getPatientId().getId());
                    appointmentObject.put("doctorName", appointment.getDoctorId().getName());
                    appointmentObject.put("patientName", appointment.getPatientId().getFirstName() + " " + appointment.getPatientId().getLastName());
                    appointmentObject.put("startTime", appointment.getStartTime().toString());
                    appointmentObject.put("endTime", appointment.getEndTime().toString());
                    appointmentObject.put("status", appointment.getStatus());

                    appointmentsArray.put(appointmentObject);
                }

                toReturn.put("appointments", appointmentsArray);
            }
        } catch (Exception e) {
            responseStatus = "error";
            statusCode = 500;
            toReturn.put("errorMessage", e.getLocalizedMessage());
        }

        toReturn.put("status", responseStatus);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }

}
