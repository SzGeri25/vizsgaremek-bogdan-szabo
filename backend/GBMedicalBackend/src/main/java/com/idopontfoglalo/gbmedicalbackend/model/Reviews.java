/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.model;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.ParameterMode;
import javax.persistence.Persistence;
import javax.persistence.StoredProcedureQuery;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.json.JSONObject;

/**
 *
 * @author szabo
 */
@Entity
@Table(name = "reviews")
@NamedQueries({
    @NamedQuery(name = "Reviews.findAll", query = "SELECT r FROM Reviews r"),
    @NamedQuery(name = "Reviews.findById", query = "SELECT r FROM Reviews r WHERE r.id = :id"),
    @NamedQuery(name = "Reviews.findByRating", query = "SELECT r FROM Reviews r WHERE r.rating = :rating"),
    @NamedQuery(name = "Reviews.findByIsDeleted", query = "SELECT r FROM Reviews r WHERE r.isDeleted = :isDeleted"),
    @NamedQuery(name = "Reviews.findByCreatedAt", query = "SELECT r FROM Reviews r WHERE r.createdAt = :createdAt"),
    @NamedQuery(name = "Reviews.findByUpdatedAt", query = "SELECT r FROM Reviews r WHERE r.updatedAt = :updatedAt"),
    @NamedQuery(name = "Reviews.findByDeletedAt", query = "SELECT r FROM Reviews r WHERE r.deletedAt = :deletedAt")})
public class Reviews implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Column(name = "rating")
    private boolean rating;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "review_text")
    private String reviewText;
    @Basic(optional = false)
    @NotNull
    @Column(name = "is_deleted")
    private boolean isDeleted;
    @Basic(optional = false)
    @NotNull
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @Basic(optional = false)
    @NotNull
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    @Column(name = "deleted_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date deletedAt;
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Doctors doctorId;
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Patients patientId;

    static EntityManagerFactory emf = Persistence.createEntityManagerFactory("com.idopontfoglalo_GBMedicalBackend_war_1.0-SNAPSHOTPU");

    public Reviews() {
    }

    public Reviews(Integer id) {
        this.id = id;
    }

    public Reviews(Integer id, boolean rating, String reviewText, boolean isDeleted, Date createdAt, Date updatedAt) {
        this.id = id;
        this.rating = rating;
        this.reviewText = reviewText;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public boolean getRating() {
        return rating;
    }

    public void setRating(boolean rating) {
        this.rating = rating;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Date getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Date deletedAt) {
        this.deletedAt = deletedAt;
    }

    public Doctors getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Doctors doctorId) {
        this.doctorId = doctorId;
    }

    public Patients getPatientId() {
        return patientId;
    }

    public void setPatientId(Patients patientId) {
        this.patientId = patientId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Reviews)) {
            return false;
        }
        Reviews other = (Reviews) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.idopontfoglalo.gbmedicalbackend.model.Reviews[ id=" + id + " ]";
    }

    public List<JSONObject> getReviewsByDoctorId(int doctorId) {
        EntityManager em = emf.createEntityManager();
        List<JSONObject> reviews = new ArrayList<>();

        try {
            // Tárolt eljárás meghívása
            StoredProcedureQuery spq = em.createStoredProcedureQuery("getReviewsByDoctorId");

            // Paraméter regisztrálása és beállítása
            spq.registerStoredProcedureParameter("doctorIdIN", Integer.class, ParameterMode.IN);
            spq.setParameter("doctorIdIN", doctorId);

            // Tárolt eljárás futtatása
            List<Object[]> result = spq.getResultList();

            // Eredmény feldolgozása
            for (Object[] row : result) {
                JSONObject review = new JSONObject();
                review.put("id", row[0]);
                review.put("doctorId", row[1]);
                review.put("patientId", row[2]);
                review.put("rating", row[3]);
                review.put("reviewText", row[4]);
                review.put("createdAt", row[5]);
                review.put("doctorName", row[6]);
                review.put("patientName", row[7]);

                reviews.add(review);
            }
        } catch (Exception e) {
            System.err.println("Hiba a `getReviewsByDoctorId` során: " + e.getMessage());
        } finally {
            em.clear();
            em.close();
        }

        return reviews;
    }

    public boolean addReview(int doctorId, int patientId, int rating, String reviewText) {
        EntityManager em = emf.createEntityManager();

        try {
            // Tárolt eljárás meghívása
            StoredProcedureQuery spq = em.createStoredProcedureQuery("addReview");

            // Paraméterek regisztrálása
            spq.registerStoredProcedureParameter("doctorIdIN", Integer.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("patientIdIN", Integer.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("ratingIN", Integer.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("reviewTextIN", String.class, ParameterMode.IN);

            // Paraméterek átadása
            spq.setParameter("doctorIdIN", doctorId);
            spq.setParameter("patientIdIN", patientId);
            spq.setParameter("ratingIN", rating);
            spq.setParameter("reviewTextIN", reviewText);

            // Tárolt eljárás futtatása
            spq.execute();

            return true; // Sikeres futtatás

        } catch (Exception e) {
            System.err.println("Hiba az addReview eljárás során: " + e.getMessage());
            return false; // Hiba esetén false
        } finally {
            em.clear();
            em.close();
        }
    }

}
