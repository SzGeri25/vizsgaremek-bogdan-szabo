/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.service;

import com.idopontfoglalo.gbmedicalbackend.model.PatientVerifications;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Persistence;
import jakarta.persistence.Query;
import java.util.Date;

public class VerificationService {

    private static EntityManagerFactory emf = Persistence.createEntityManagerFactory("com.idopontfoglalo_GBMedicalBackend_war_1.0-SNAPSHOTPU");

    public static boolean verifyToken(String token) {
        EntityManager em = emf.createEntityManager();
        try {
            Query query = em.createQuery("SELECT pv FROM PatientVerifications pv WHERE pv.token = :token");

            query.setParameter("token", token);
            PatientVerifications pv = (PatientVerifications) query.getSingleResult();

            // Ellenőrizd, hogy a token még érvényes és nem lett még felhasználva
            if (pv == null || pv.getVerified() || pv.getExpiresAt().before(new Date())) {
                return false;
            }

            // Frissítsük a verifikációs rekordot
            em.getTransaction().begin();
            pv.setVerified(true);
            pv.setVerifiedAt(new Date());
            em.merge(pv);
            em.getTransaction().commit();

            return true;
        } catch (NoResultException e) {
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            return false;
        } finally {
            em.close();
        }
    }

}
