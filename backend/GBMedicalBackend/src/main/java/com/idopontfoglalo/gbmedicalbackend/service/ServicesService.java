/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.service;

import com.idopontfoglalo.gbmedicalbackend.model.Services;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author szabo
 */
public class ServicesService {

    private final Services layer = new Services(); // vagy a megfelelő osztály, amely a model réteget képviseli

    public JSONObject getAllServices() {
        JSONObject toReturn = new JSONObject();
        String responseStatus = "success";
        int statusCode = 200;

        try {
            List<Services> servicesList = layer.getAllServices();

            if (servicesList == null || servicesList.isEmpty()) {
                responseStatus = "noRecordsFound";
                statusCode = 200;
            } else {
                JSONArray servicesArray = new JSONArray();
                for (Services service : servicesList) {
                    JSONObject serviceObject = new JSONObject();
                    serviceObject.put("id", service.getId());
                    serviceObject.put("name", service.getName());
                    serviceObject.put("description", service.getDescription());
                    serviceObject.put("price", service.getPrice());
                    serviceObject.put("duration", service.getDuration());
                    serviceObject.put("doctor_names", service.getDoctorNames());

                    // Ha deletedAt nem null, akkor adjuk hozzá a JSON-hoz
                    if (service.getDeletedAt() != null) {
                        serviceObject.put("deletedAt", service.getDeletedAt().toString());
                    }

                    servicesArray.put(serviceObject);
                }

                toReturn.put("services", servicesArray);

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

}
