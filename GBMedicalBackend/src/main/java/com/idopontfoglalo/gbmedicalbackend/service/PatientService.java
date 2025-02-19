/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.service;

import com.idopontfoglalo.gbmedicalbackend.config.JWT;
import com.idopontfoglalo.gbmedicalbackend.model.Patients;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.json.JSONObject;

/**
 *
 * @author szabo
 */
public class PatientService {

    private Patients layer = new Patients();
    private static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";

    public static boolean isValidEmail(String email) {
        Pattern pattern = Pattern.compile(EMAIL_REGEX);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public static boolean isValidPassword(String password) {
        if (password.length() < 8) {
            return false;
        }

        boolean hasNumber = false;
        boolean hasUpperCase = false;
        boolean hasLowerCase = false;
        boolean hasSpecialChar = false;

        for (char c : password.toCharArray()) {
            if (Character.isDigit(c)) {
                hasNumber = true;
            } else if (Character.isUpperCase(c)) {
                hasUpperCase = true;
            } else if (Character.isLowerCase(c)) {
                hasLowerCase = true;
            } else if ("!@#$%^&*()_+-=[]{}|;':,.<>?/`~".indexOf(c) != -1) {
                hasSpecialChar = true;
            }
        }

        return hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar;
    }

    public JSONObject registerPatient(Patients p) {
        JSONObject toReturn = new JSONObject();
        String status = "success";
        int statusCode = 200;

        //Az email cím benne van-e a db-ben
        //valid-e az email cím
        //valid-e a jelszó
        if (isValidEmail(p.getEmail())) {
            if (isValidPassword(p.getPassword())) {
                boolean isPatientExists = Patients.isPatientExists(p.getEmail());
                if (Patients.isPatientExists(p.getEmail()) == null) {
                    status = "ModelException";
                    statusCode = 500;
                } else if (isPatientExists == true) {
                    status = "PatientAlreadyExists";
                    statusCode = 417;
                } else {
                    boolean registerPatient = layer.registerPatient(p);
                    if (registerPatient == false) {
                        status = "fail";
                        statusCode = 417;
                    }
                }
            } else {
                status = "InvalidPassword";
                statusCode = 417;
            }
        } else {
            status = "InvalidEmail";
            statusCode = 417;
        }

        toReturn.put("status", status);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }

    public JSONObject loginPatient(String email, String password) {
        JSONObject toReturn = new JSONObject();
        String status = "success";
        int statusCode = 200;

        if (isValidEmail(email)) {
            Patients modelResult = layer.loginPatient(email, password);

            if (modelResult == null) {
                status = "modelException";
                statusCode = 500;
            } else {
                if (modelResult.getId() == null) {
                    status = "patientNotFound";
                    statusCode = 417;
                } else {
                    JSONObject result = new JSONObject();
                    result.put("id", modelResult.getId());
                    result.put("email", modelResult.getEmail());
                    result.put("firstName", modelResult.getFirstName());
                    result.put("lastName", modelResult.getLastName());
                    result.put("isAdmin", modelResult.getIsAdmin());
                    result.put("isDeleted", modelResult.getIsDeleted());
                    result.put("jwt", JWT.createJWT(modelResult));

                    toReturn.put("result", result);
                }
            }

        } else {
            status = "invalidEmail";
            statusCode = 417;
        }

        toReturn.put("status", status);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }

    public JSONObject deletePatient(int id) {
        JSONObject toReturn = new JSONObject();
        String responseStatus = "success";
        int statusCode = 200;

        try {
            if (id <= 0) {
                responseStatus = "invalidInput";
                statusCode = 400;
                throw new IllegalArgumentException("Invalid patient ID provided.");
            } else {
                boolean modelResult = layer.deletePatient(id);

                if (!modelResult) {
                    responseStatus = "modelException";
                    statusCode = 500;
                }
                if (modelResult == false) {
                    responseStatus = "notFound";
                    statusCode = 404;
                    throw new Exception("Patient not found or cannot be deleted.");
                } else {
                    JSONObject result = new JSONObject();
                    result.put("message", "Patient successfully deleted");
                    result.put("patientId", layer.getId());
                    result.put("firstName", layer.getFirstName());
                    result.put("lastName", layer.getLastName());
                    result.put("email", layer.getEmail());
                    result.put("phoneNumber", layer.getPhoneNumber());

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

    public JSONObject changePassword(Integer patientId, String newPassword, Integer creator) {
        JSONObject toReturn = new JSONObject();
        String status = "success";
        int statusCode = 200;

        if (patientId.equals(creator)) {
            Boolean modelResult = layer.changePassword(patientId, newPassword, creator);
            if (!modelResult) {
                status = "ModelException";
                statusCode = 500;
            }
        } else {
            status = "PermissionError";
            statusCode = 417;
        }

        toReturn.put("status", status);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }

    public JSONObject getPatientById(Integer id) {
        JSONObject toReturn = new JSONObject();
        String status = "success";
        int statusCode = 200;
        Patients modelResult = new Patients(id);

        if (modelResult.getEmail() == null) {
            status = "PatientNotFound";
            statusCode = 417;
        } else {
            JSONObject patient = new JSONObject();

            patient.put("id", modelResult.getId());
            patient.put("firstName", modelResult.getFirstName());
            patient.put("lastName", modelResult.getLastName());
            patient.put("email", modelResult.getEmail());
            patient.put("phoneNumber", modelResult.getPhoneNumber());
            patient.put("isAdmin", modelResult.getIsAdmin());
            patient.put("isDeleted", modelResult.getIsDeleted());
            patient.put("createdAt", modelResult.getCreatedAt());

            toReturn.put("result", patient);
        }
        toReturn.put("status", status);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }
}
