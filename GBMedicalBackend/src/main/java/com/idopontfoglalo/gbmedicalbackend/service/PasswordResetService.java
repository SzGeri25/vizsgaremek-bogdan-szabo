package com.idopontfoglalo.gbmedicalbackend.service;

import com.idopontfoglalo.gbmedicalbackend.model.PasswordResetTokens;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import jakarta.persistence.Query;

@Stateless
public class PasswordResetService {

    @PersistenceContext(unitName = "com.idopontfoglalo_GBMedicalBackend_war_1.0-SNAPSHOTPU")
    private EntityManager em;

    /**
     * Létrehoz egy új jelszó-visszaállító tokent a megadott emailhez.
     */
    public PasswordResetTokens createPasswordResetToken(String email) {
        PasswordResetTokens tokenEntity = new PasswordResetTokens();
        tokenEntity.setEmail(email);
        tokenEntity.setToken(UUID.randomUUID().toString());

        // Token érvényességének beállítása: pl. 1 óra
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.HOUR, 1);
        tokenEntity.setExpiresAt(cal.getTime());

        tokenEntity.setUsed(false);
        tokenEntity.setCreatedAt(new Date());

        // Token entitás perzisztálása
        em.persist(tokenEntity);
        return tokenEntity;
    }

    /**
     * Elkészíti a reset linket és elküldi az emailt.
     */
    public boolean sendResetEmail(String email, String resetLink) {
        String emailContent = "<p>Kedves Felhasználó!</p>"
                + "<p>Kattints az alábbi linkre a jelszavad visszaállításához:</p>"
                + "<p><a href=\"" + resetLink + "\">Jelszó visszaállítása</a></p>"
                + "<p>A link 1 óráig érvényes.</p>";
        return EmailService.sendEmail(email, false, emailContent);
    }

    public void updatePatientPassword(String email, String newPassword) {
        String hashedPassword = hashPasswordSHA1(newPassword);

        // JPA frissítő lekérdezés
        Query query = em.createQuery("UPDATE Patients p SET p.password = :password WHERE p.email = :email");
        query.setParameter("password", hashedPassword);
        query.setParameter("email", email);

        int updatedRows = query.executeUpdate();

        if (updatedRows == 0) {
            throw new IllegalArgumentException("Nem található felhasználó ezzel az email címmel.");
        }
    }

    /**
     * SHA-1 hash-elési metódus
     */
    private String hashPasswordSHA1(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] hashedBytes = md.digest(password.getBytes(StandardCharsets.UTF_8));

            // Byte array konvertálása hexadecimális stringgé
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hiba történt a jelszó hashelése során", e);
        }
    }

    public boolean validateToken(String email, String token) {
        try {
            PasswordResetTokens tokenEntity = em.createQuery(
                    "SELECT t FROM PasswordResetTokens t WHERE t.email = :email AND t.token = :token AND t.used = false AND t.expiresAt > CURRENT_TIMESTAMP",
                    PasswordResetTokens.class)
                    .setParameter("email", email)
                    .setParameter("token", token)
                    .getSingleResult();

            if (tokenEntity != null) {
                // Token felhasználtnak jelölése
                tokenEntity.setUsed(true);
                em.merge(tokenEntity);
                return true;
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

}
