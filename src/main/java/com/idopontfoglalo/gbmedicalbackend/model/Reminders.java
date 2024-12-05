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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author szabo
 */
@Entity
@Table(name = "reminders")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Reminders.findAll", query = "SELECT r FROM Reminders r"),
    @NamedQuery(name = "Reminders.findById", query = "SELECT r FROM Reminders r WHERE r.id = :id"),
    @NamedQuery(name = "Reminders.findByReminderTime", query = "SELECT r FROM Reminders r WHERE r.reminderTime = :reminderTime"),
    @NamedQuery(name = "Reminders.findByReminderMethod", query = "SELECT r FROM Reminders r WHERE r.reminderMethod = :reminderMethod"),
    @NamedQuery(name = "Reminders.findBySent", query = "SELECT r FROM Reminders r WHERE r.sent = :sent"),
    @NamedQuery(name = "Reminders.findByIsDeleted", query = "SELECT r FROM Reminders r WHERE r.isDeleted = :isDeleted"),
    @NamedQuery(name = "Reminders.findByCreatedAt", query = "SELECT r FROM Reminders r WHERE r.createdAt = :createdAt"),
    @NamedQuery(name = "Reminders.findByUpdatedAt", query = "SELECT r FROM Reminders r WHERE r.updatedAt = :updatedAt"),
    @NamedQuery(name = "Reminders.findByDeletedAt", query = "SELECT r FROM Reminders r WHERE r.deletedAt = :deletedAt")})
public class Reminders implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Column(name = "reminder_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date reminderTime;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 5)
    @Column(name = "reminder_method")
    private String reminderMethod;
    @Basic(optional = false)
    @NotNull
    @Column(name = "sent")
    private boolean sent;
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
    @JoinColumn(name = "appointment_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Appointments appointmentId;

    public Reminders() {
    }

    public Reminders(Integer id) {
        this.id = id;
    }

    public Reminders(Integer id, Date reminderTime, String reminderMethod, boolean sent, boolean isDeleted, Date createdAt, Date updatedAt) {
        this.id = id;
        this.reminderTime = reminderTime;
        this.reminderMethod = reminderMethod;
        this.sent = sent;
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

    public Date getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(Date reminderTime) {
        this.reminderTime = reminderTime;
    }

    public String getReminderMethod() {
        return reminderMethod;
    }

    public void setReminderMethod(String reminderMethod) {
        this.reminderMethod = reminderMethod;
    }

    public boolean getSent() {
        return sent;
    }

    public void setSent(boolean sent) {
        this.sent = sent;
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

    public Appointments getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Appointments appointmentId) {
        this.appointmentId = appointmentId;
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
        if (!(object instanceof Reminders)) {
            return false;
        }
        Reminders other = (Reminders) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.idopontfoglalo.gbmedicalbackend.model.Reminders[ id=" + id + " ]";
    }

}
