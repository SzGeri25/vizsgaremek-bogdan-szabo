/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.controller;

import com.idopontfoglalo.gbmedicalbackend.model.PasswordResetTokens;
import com.idopontfoglalo.gbmedicalbackend.service.PasswordResetService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.json.JSONObject;
import java.net.URLEncoder;

@Path("password")
public class PasswordResetController {

    @Inject
    private PasswordResetService passwordResetService;

    /**
     * Endpoint a jelszó-visszaállítási kérelemhez. Várja az email címet
     * JSON-ben, majd létrehozza a token-t és elküldi a reset linket.
     */
    @POST
    @Path("forgotPassword")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response forgotPassword(String body) {
        try {
            JSONObject json = new JSONObject(body);
            String email = json.getString("email");

            // Token generálása és adatbázisba mentése
            PasswordResetTokens tokenEntity = passwordResetService.createPasswordResetToken(email);

            // Összeállítjuk a visszaállító linket
            String resetLink = "https://yourdomain.com/resetPasswordPage?token="
                    + tokenEntity.getToken() + "&email=" + URLEncoder.encode(email, "UTF-8");

            // Email küldése a visszaállító linkkel
            boolean emailSent = passwordResetService.sendResetEmail(email, resetLink);

            JSONObject responseJson = new JSONObject();
            responseJson.put("message", emailSent ? "A visszaállító email elküldve." : "Hiba történt az email küldése során.");
            return Response.ok(responseJson.toString()).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            JSONObject responseJson = new JSONObject();
            responseJson.put("message", "Belső hiba történt a jelszó visszaállítás kérése során.");
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(responseJson.toString()).build();
        }
    }
}
