/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.controller;

import com.idopontfoglalo.gbmedicalbackend.service.VerificationService;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.json.JSONObject;

@Path("/verification")
public class VerificationController {

    @POST
    @Path("/verify") // Ez a végpont, amelyet a kérésnek meg kell céloznia
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response verifyToken(String bodyString) {
        JSONObject responseJson = new JSONObject();
        try {
            JSONObject body = new JSONObject(bodyString);
            String token = body.optString("token", "");

            if (token.isEmpty()) {
                responseJson.put("status", "fail");
                responseJson.put("message", "Token hiányzik");
                responseJson.put("status_code", 400); // 400 státuszkód
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(responseJson.toString())
                        .build();
            }

            System.out.println("Received token: " + token);

            // Hívjuk meg a verifikációs logikát kezelő szolgáltatást
            boolean verified = VerificationService.verifyToken(token);

            if (verified) {
                responseJson.put("status", "success");
                responseJson.put("message", "A regisztráció sikeresen megerősítve!");
                responseJson.put("status_code", 200); // 200 státuszkód
                return Response.status(Response.Status.OK)
                        .entity(responseJson.toString())
                        .build();
            } else {
                responseJson.put("status", "fail");
                responseJson.put("message", "A token érvénytelen, lejárt, vagy már felhasználták");
                responseJson.put("status_code", 400); // 400 státuszkód
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(responseJson.toString())
                        .build();
            }

        } catch (Exception e) {
            responseJson.put("status", "error");
            responseJson.put("message", "Hiba történt: " + e.getMessage());
            responseJson.put("status_code", 500); // 500 státuszkód
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(responseJson.toString())
                    .build();
        }
    }
}
