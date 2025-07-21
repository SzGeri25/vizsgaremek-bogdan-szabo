/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.service;

import com.idopontfoglalo.gbmedicalbackend.config.JWT;
import com.idopontfoglalo.gbmedicalbackend.model.Doctors;
import com.idopontfoglalo.gbmedicalbackend.model.Patients;
import static com.idopontfoglalo.gbmedicalbackend.service.PatientService.isValidEmail;
import static com.idopontfoglalo.gbmedicalbackend.service.PatientService.isValidPassword;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author szabo
 */
public class DoctorService {

    private Doctors layer = new Doctors();
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

    public JSONObject registerDoctor(Doctors d) {
        JSONObject toReturn = new JSONObject();
        String status = "success";
        int statusCode = 200;

        //Az email cím benne van-e a db-ben
        //valid-e az email cím
        //valid-e a jelszó
        if (isValidEmail(d.getEmail())) {
            if (isValidPassword(d.getPassword())) {
                boolean isDoctorExists = Doctors.isDoctorExists(d.getEmail());
                if (Doctors.isDoctorExists(d.getEmail()) == null) {
                    status = "ModelException";
                    statusCode = 500;
                } else if (isDoctorExists == true) {
                    status = "DoctorAlreadyExists";
                    statusCode = 417;
                } else {
                    boolean registerDoctor = layer.registerDoctor(d);
                    if (registerDoctor == false) {
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

    public JSONObject loginDoctor(String email, String password) {
        JSONObject toReturn = new JSONObject();
        String status = "success";
        int statusCode = 200;

        if (isValidEmail(email)) {
            Doctors modelResult = layer.loginDoctor(email, password);

            if (modelResult == null) {
                status = "modelException";
                statusCode = 500;
            } else {
                if (modelResult.getId() == null) {
                    status = "doctorNotFound";
                    statusCode = 417;
                } else {
                    JSONObject result = new JSONObject();
                    result.put("id", modelResult.getId());
                    result.put("name", modelResult.getName());
                    result.put("email", modelResult.getEmail());
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

    public JSONObject getAllDoctors() {
        JSONObject toReturn = new JSONObject();
        String status = "success";
        int statusCode = 200;
        List<Doctors> modelResult = layer.getAllDoctors();

        if (modelResult == null) {
            status = "ModelException";
            statusCode = 500;
        } else if (modelResult.isEmpty()) {
            status = "NoDoctorFound";
            statusCode = 417;
        } else {
            JSONArray result = new JSONArray();

            for (Doctors actualDoctor : modelResult) {
                JSONObject toAdd = new JSONObject();

                toAdd.put("id", actualDoctor.getId());
                toAdd.put("name", actualDoctor.getName());
                toAdd.put("email", actualDoctor.getEmail());
                toAdd.put("phoneNumber", actualDoctor.getPhoneNumber());
                toAdd.put("bio", actualDoctor.getBio());

                result.put(toAdd);
            }

            toReturn.put("result", result);
        }

        toReturn.put("status", status);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }
}
