package com.idopontfoglalo.gbmedicalbackend.service;

import com.idopontfoglalo.gbmedicalbackend.model.Doctors;
import com.idopontfoglalo.gbmedicalbackend.model.Patients;
import com.idopontfoglalo.gbmedicalbackend.service.JwtUtil;
import org.json.JSONObject;

public class LoginService {

    private static final String STATUS_SUCCESS = "success";
    private static final String STATUS_FAIL = "fail";
    private static final String STATUS_INVALID_EMAIL = "InvalidEmail";
    private static final String STATUS_INVALID_PASSWORD = "InvalidPassword";
    private static final String STATUS_USER_NOT_FOUND = "UserNotFound";
    private static final String STATUS_SERVER_ERROR = "ServerError";
    private static final String STATUS_INVALID_CREDENTIALS = "InvalidCredentials";

    public JSONObject login(String email, String password) {
        JSONObject toReturn = new JSONObject();
        String status = STATUS_SUCCESS;
        int statusCode = 200;

        // Validate email format
        if (isValidEmail(email)) {

            // Try to find the user in both Patients and Doctors tables
            JSONObject user = getUserFromDb(email, password);

            if (user != null) {
                // If user exists, generate JWT token
                String token = JwtUtil.generateToken(user.getString("userType"), user.getInt("id"), email);
                toReturn.put("token", token);
                toReturn.put("userType", user.getString("userType"));
            } else {
                status = STATUS_USER_NOT_FOUND;
                statusCode = 417;
            }

        } else {
            status = STATUS_INVALID_EMAIL;
            statusCode = 417;
        }

        toReturn.put("status", status);
        toReturn.put("statusCode", statusCode);
        return toReturn;
    }

    private JSONObject getUserFromDb(String email, String password) {
        // Try to find the user in Patients and Doctors tables by calling stored procedure
        JSONObject user = null;

        try {
            // Query the Patients table first
            user = Patients.getUserByEmailAndPassword(email, password);

            // If not found in Patients, try Doctors
            if (user == null) {
                user = Doctors.getUserByEmailAndPassword(email, password);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return user;
    }

    // Method to validate email format (you can modify the regex if needed)
    public static boolean isValidEmail(String email) {
        String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";
        return email.matches(EMAIL_REGEX);
    }
}
