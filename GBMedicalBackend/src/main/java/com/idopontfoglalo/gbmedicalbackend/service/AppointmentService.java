/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.service;

import com.idopontfoglalo.gbmedicalbackend.model.Appointments;
import com.idopontfoglalo.gbmedicalbackend.model.TimeSlotDTO;
import java.text.SimpleDateFormat;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author szabo
 */
public class AppointmentService {

    private final Appointments layer = new Appointments(); // vagy a megfelelő osztály, amely a model réteget képviseli

    public JSONObject addAppointmentWithNotification(int doctorId, int patientId, String startTime, String endTime) {
        JSONObject toReturn = new JSONObject();
        String responseStatus = "success";
        int statusCode = 200;

        if (doctorId <= 0 || patientId <= 0 || startTime == null || endTime == null) {
            responseStatus = "invalidInput";
            statusCode = 400;
        } else {
            boolean modelResult = layer.addAppointmentWithNotification(doctorId, patientId, startTime, endTime);

            if (!modelResult) {
                responseStatus = "modelException";
                statusCode = 500;
            } else {

                // Sikeres foglalás esetén lekérjük a szükséges adatokat
                String patientName = layer.getPatientFullName(patientId);
                String patientEmail = layer.getPatientEmail(patientId); // Itt kapjuk meg a páciens email címét
                String doctorName = layer.getDoctorName(doctorId);
                String serviceType = layer.getServiceName(doctorId);

                // Email HTML tartalom összeállítása
                String emailContent = "<p>Kedves " + patientName + ",</p>"
                        + "<p>Az időpontfoglalás sikeresen rögzítésre került. A foglalás részletei:</p>"
                        + "<p>"
                        + "Időtartam: " + startTime + " - " + endTime + "<br>"
                        + "Szolgáltatás: " + serviceType + "<br>"
                        + "Orvos: " + doctorName
                        + "</p>";

                // Email elküldése a meglévő EmailService segítségével
                EmailService.sendEmail(patientEmail, EmailService.EmailType.APPOINTMENT_CONFIRMATION, emailContent);

                JSONObject result = new JSONObject();
                result.put("message", "Appointment successfully created with notification");
                result.put("doctorId", doctorId);
                result.put("patientId", patientId);
                result.put("startTime", startTime);
                result.put("endTime", endTime);

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

                // ISO 8601 formátum: például "2025-01-22T10:00:00+01:00"
                SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");

                for (Appointments appointment : bookedAppointments) {
                    JSONObject appointmentObject = new JSONObject();
                    appointmentObject.put("id", appointment.getId());
                    appointmentObject.put("doctorId", appointment.getDoctorId().getId());
                    appointmentObject.put("patientId", appointment.getPatientId().getId());

                    // Dátumok ISO formátumra alakítása
                    appointmentObject.put("startTime", isoFormat.format(appointment.getStartTime()));
                    appointmentObject.put("endTime", isoFormat.format(appointment.getEndTime()));

                    appointmentObject.put("status", appointment.getStatus());
                    appointmentObject.put("doctorName", appointment.getDoctorId().getName());
                    appointmentObject.put("patientName", appointment.getPatientId().getFirstName() + " " + appointment.getPatientId().getLastName());

                    appointmentObject.put("serviceName", appointment.getServiceName());

                    appointmentsArray.put(appointmentObject);
                }

                toReturn.put("appointments", appointmentsArray);

            }
        } catch (JSONException e) {
            responseStatus = "error";
            statusCode = 500;
            toReturn.put("errorMessage", e.getLocalizedMessage());
        }

        toReturn.put("status", responseStatus);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }

    public JSONObject getAvailableSlotsByDoctor(int doctorId) {
        JSONObject toReturn = new JSONObject();
        String responseStatus = "success";
        int statusCode = 200;

        try {
            List<TimeSlotDTO> availableSlots = layer.getAvailableSlotsByDoctor(doctorId);

            if (availableSlots == null || availableSlots.isEmpty()) {
                responseStatus = "noRecordsFound";
                statusCode = 404;
            } else {
                JSONArray slotsArray = new JSONArray();
                for (TimeSlotDTO slot : availableSlots) {
                    JSONObject slotObject = new JSONObject();
                    slotObject.put("slotStart", slot.getSlotStart());
                    slotObject.put("slotEnd", slot.getSlotEnd());
                    slotObject.put("doctorId", slot.getDoctorId());
                    slotsArray.put(slotObject);
                }

                toReturn.put("slots", slotsArray);
            }
        } catch (JSONException e) {
            responseStatus = "error";
            statusCode = 500;
            toReturn.put("errorMessage", e.getLocalizedMessage());
        }

        toReturn.put("status", responseStatus);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }

    public JSONObject getAvailableSlotsByService(int serviceId) {
        JSONObject toReturn = new JSONObject();
        String responseStatus = "success";
        int statusCode = 200;

        try {
            List<TimeSlotDTO> availableSlots = layer.getAvailableSlotsByService(serviceId);

            if (availableSlots == null || availableSlots.isEmpty()) {
                responseStatus = "noRecordsFound";
                statusCode = 404;
            } else {
                JSONArray slotsArray = new JSONArray();
                for (TimeSlotDTO slot : availableSlots) {
                    JSONObject slotObject = new JSONObject();
                    slotObject.put("slotStart", slot.getSlotStart());
                    slotObject.put("slotEnd", slot.getSlotEnd());
                    slotObject.put("doctorId", slot.getDoctorId());
                    slotsArray.put(slotObject);
                }
                toReturn.put("slots", slotsArray);
            }
        } catch (JSONException e) {
            responseStatus = "error";
            statusCode = 500;
            toReturn.put("errorMessage", e.getLocalizedMessage());
        }

        toReturn.put("status", responseStatus);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }

    public JSONObject cancelAppointment(int id) {
        JSONObject toReturn = new JSONObject();
        String responseStatus = "success";
        int statusCode = 200;

        try {
            if (id <= 0) {
                responseStatus = "invalidInput";
                statusCode = 400;
                throw new IllegalArgumentException("Invalid appointment ID provided.");
            } else {
                boolean modelResult = layer.cancelAppointment(id);

                if (!modelResult) {
                    responseStatus = "modelException";
                    statusCode = 500;
                }
                if (modelResult == false) {
                    responseStatus = "notFound";
                    statusCode = 404;
                    throw new Exception("Appointment not found or cannot be cancelled.");
                } else {
                    JSONObject result = new JSONObject();
                    result.put("message", "Appointment successfully cancelled");
                    result.put("appointmentId", layer.getId());
                    result.put("doctorId", layer.getDoctorId());
                    result.put("patientId", layer.getPatientId());
                    result.put("startTime", layer.getStartTime());
                    result.put("endTime", layer.getEndTime());
                    result.put("status", layer.getStatus());

                    toReturn.put("result", result);
                }
            }
        } catch (IllegalArgumentException e) {
            // Rossz bemeneti adatok kezelése
            toReturn.put("error", e.getMessage());
        } catch (Exception e) {
            // Egyéb hibák kezelése
            responseStatus = "error";
            statusCode = statusCode == 200 ? 500 : statusCode; // Ha nem volt más specifikus hiba
            toReturn.put("error", e.getMessage());
        }

        toReturn.put("status", responseStatus);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }

    public JSONObject updateAppointment(int appointmentId, Integer doctorId, Integer patientId, String startTime, String endTime, String status, Integer duration) {
        JSONObject toReturn = new JSONObject();
        String responseStatus = "success";
        int statusCode = 200;

        try {
            // Validate inputs
            if (appointmentId <= 0) {
                responseStatus = "invalidInput";
                statusCode = 400;
            } else {
                // Call the DAO or database layer to execute the update
                boolean modelResult = layer.updateAppointment(
                        appointmentId, doctorId, patientId, startTime, endTime, status, duration
                );

                if (!modelResult) {
                    responseStatus = "modelException";
                    statusCode = 500;
                } else {
                    toReturn.put("message", "Appointment successfully updated");
                }
            }
        } catch (Exception e) {
            responseStatus = "exception";
            statusCode = 500;
            toReturn.put("error", e.getMessage());
        }

        toReturn.put("status", responseStatus);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }

}
