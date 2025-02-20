package com.idopontfoglalo.gbmedicalbackend.service;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

public class EmailService {

    public static boolean sendEmail(String to, boolean ccMe, String content) {
        try {
            // Küldő email címe és jelszava (biztonsági okokból ezeket ne tárold nyílt szövegként!)
            final String from = "szabo.gergely25@gmail.com";
            final String password = "bequ fkqs xwto sprv";  // Példa jelszó

            // SMTP beállítások a Gmail esetében
            Properties properties = new Properties();
            properties.put("mail.smtp.host", "smtp.gmail.com");
            properties.put("mail.smtp.port", "465");
            properties.put("mail.smtp.ssl.enable", "true");
            properties.put("mail.smtp.auth", "true");

            Session session = Session.getInstance(properties, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(from, password);
                }
            });
            session.setDebug(true);

            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            if (ccMe) {
                message.setRecipients(Message.RecipientType.CC, InternetAddress.parse(from));
            }
            message.setSubject("Jelszó visszaállítás");
            message.setContent(content, "text/html;charset=utf-8");

            Transport.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
