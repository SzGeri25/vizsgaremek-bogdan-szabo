package com.idopontfoglalo.gbmedicalbackend.service;

import com.idopontfoglalo.gbmedicalbackend.model.PasswordResetTokens;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

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
}
