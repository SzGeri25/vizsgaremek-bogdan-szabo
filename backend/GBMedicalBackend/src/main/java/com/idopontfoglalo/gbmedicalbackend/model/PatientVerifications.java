/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.model;

import static com.idopontfoglalo.gbmedicalbackend.model.Patients.emf;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author szabo
 */
@Entity
@Table(name = "patient_verifications")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "PatientVerifications.findAll", query = "SELECT p FROM PatientVerifications p"),
    @NamedQuery(name = "PatientVerifications.findById", query = "SELECT p FROM PatientVerifications p WHERE p.id = :id"),
    @NamedQuery(name = "PatientVerifications.findByToken", query = "SELECT p FROM PatientVerifications p WHERE p.token = :token"),
    @NamedQuery(name = "PatientVerifications.findByVerified", query = "SELECT p FROM PatientVerifications p WHERE p.verified = :verified"),
    @NamedQuery(name = "PatientVerifications.findByCreatedAt", query = "SELECT p FROM PatientVerifications p WHERE p.createdAt = :createdAt"),
    @NamedQuery(name = "PatientVerifications.findByExpiresAt", query = "SELECT p FROM PatientVerifications p WHERE p.expiresAt = :expiresAt"),
    @NamedQuery(name = "PatientVerifications.findByVerifiedAt", query = "SELECT p FROM PatientVerifications p WHERE p.verifiedAt = :verifiedAt")})
public class PatientVerifications implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "token")
    private String token;
    @Basic(optional = false)
    @NotNull
    @Column(name = "verified")
    private boolean verified;
    @Basic(optional = false)
    @NotNull
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @Basic(optional = false)
    @NotNull
    @Column(name = "expires_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiresAt;
    @Column(name = "verified_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date verifiedAt;

    public PatientVerifications() {
    }

    public PatientVerifications(Integer id) {
        this.id = id;
    }

    public PatientVerifications(Integer id, String token, boolean verified, Date createdAt, Date expiresAt) {
        this.id = id;
        this.token = token;
        this.verified = verified;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean getVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Date expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Date getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(Date verifiedAt) {
        this.verifiedAt = verifiedAt;
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
        if (!(object instanceof PatientVerifications)) {
            return false;
        }
        PatientVerifications other = (PatientVerifications) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.idopontfoglalo.gbmedicalbackend.model.PatientVerifications[ id=" + id + " ]";
    }

    public boolean insertVerificationToken(int patientId, String token, Timestamp expiresAt) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            Query query = em.createNativeQuery(
                    "INSERT INTO patient_verifications (patient_id, token, expires_at) VALUES (?, ?, ?)"
            );
            query.setParameter(1, patientId);
            query.setParameter(2, token);
            query.setParameter(3, expiresAt);
            query.executeUpdate();
            em.getTransaction().commit();
            return true;
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
