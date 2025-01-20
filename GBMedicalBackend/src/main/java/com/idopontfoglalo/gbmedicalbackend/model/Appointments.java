/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.model;

import static com.idopontfoglalo.gbmedicalbackend.model.Patients.emf;
import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureQuery;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 *
 * @author szabo
 */
@Entity
@Table(name = "appointments")
@NamedQueries({
    @NamedQuery(name = "Appointments.findAll", query = "SELECT a FROM Appointments a"),
    @NamedQuery(name = "Appointments.findById", query = "SELECT a FROM Appointments a WHERE a.id = :id"),
    @NamedQuery(name = "Appointments.findByStartTime", query = "SELECT a FROM Appointments a WHERE a.startTime = :startTime"),
    @NamedQuery(name = "Appointments.findByEndTime", query = "SELECT a FROM Appointments a WHERE a.endTime = :endTime"),
    @NamedQuery(name = "Appointments.findByDuration", query = "SELECT a FROM Appointments a WHERE a.duration = :duration"),
    @NamedQuery(name = "Appointments.findByStatus", query = "SELECT a FROM Appointments a WHERE a.status = :status"),
    @NamedQuery(name = "Appointments.findByIsDeleted", query = "SELECT a FROM Appointments a WHERE a.isDeleted = :isDeleted"),
    @NamedQuery(name = "Appointments.findByCreatedAt", query = "SELECT a FROM Appointments a WHERE a.createdAt = :createdAt"),
    @NamedQuery(name = "Appointments.findByUpdatedAt", query = "SELECT a FROM Appointments a WHERE a.updatedAt = :updatedAt"),
    @NamedQuery(name = "Appointments.findByDeletedAt", query = "SELECT a FROM Appointments a WHERE a.deletedAt = :deletedAt")})
public class Appointments implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Column(name = "start_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;
    @Basic(optional = false)
    @NotNull
    @Column(name = "end_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endTime;
    @Basic(optional = false)
    @NotNull
    @Column(name = "duration")
    private int duration;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 9)
    @Column(name = "status")
    private String status;
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
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "appointmentId")
    private Collection<Reminders> remindersCollection;
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Doctors doctorId;
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Patients patientId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "appointmentId")
    private Collection<Payments> paymentsCollection;

    public Appointments() {
    }

    public Appointments(Integer id) {
        this.id = id;
    }

    public Appointments(Integer id, Date startTime, Date endTime, int duration, String status, boolean isDeleted, Date createdAt, Date updatedAt) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.status = status;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Appointments(Integer id, Integer doctorId, Integer patientId, Date startTime, Date endTime, String status, String doctorName, String patientName) {
        this.id = id;
        this.doctorId = new Doctors();
        this.doctorId.setId(doctorId);
        this.doctorId.setName(doctorName);
        this.patientId = new Patients(); // Same for Patients
        this.patientId.setId(patientId);
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        String[] names = patientName.split(" ");
        if (names.length >= 2) {
            this.patientId.setFirstName(names[0]);
            this.patientId.setLastName(names[1]);
        } else {
            this.patientId.setFirstName(patientName); // Ha csak egy név van
            this.patientId.setLastName(""); // Második részt üresen hagyjuk
        }
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public Collection<Reminders> getRemindersCollection() {
        return remindersCollection;
    }

    public void setRemindersCollection(Collection<Reminders> remindersCollection) {
        this.remindersCollection = remindersCollection;
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

    public Collection<Payments> getPaymentsCollection() {
        return paymentsCollection;
    }

    public void setPaymentsCollection(Collection<Payments> paymentsCollection) {
        this.paymentsCollection = paymentsCollection;
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
        if (!(object instanceof Appointments)) {
            return false;
        }
        Appointments other = (Appointments) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.idopontfoglalo.gbmedicalbackend.model.Appointments[ id=" + id + " ]";
    }

    public boolean addAppointmentWithNotification(int doctorId, int patientId, String startTime, String endTime, int duration, String status) {
        EntityManager em = emf.createEntityManager();

        try {
            // Tárolt eljárás meghívása
            StoredProcedureQuery spq = em.createStoredProcedureQuery("addAppointmentWithNotification");

            // Bemeneti paraméterek regisztrálása
            spq.registerStoredProcedureParameter("doctor_idIN", Integer.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("patient_idIN", Integer.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("start_timeIN", String.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("end_timeIN", String.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("durationIN", Integer.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("statusIN", String.class, ParameterMode.IN);

            // Paraméterek beállítása
            spq.setParameter("doctor_idIN", doctorId);
            spq.setParameter("patient_idIN", patientId);
            spq.setParameter("start_timeIN", startTime);
            spq.setParameter("end_timeIN", endTime);
            spq.setParameter("durationIN", duration);
            spq.setParameter("statusIN", status);

            // Tárolt eljárás futtatása
            spq.execute();

            return true; // Sikeres végrehajtás

        } catch (Exception e) {
            System.err.println("Hiba a `addAppointmentWithNotification` során: " + e.getMessage());
            return false; // Hiba esetén visszatérés
        } finally {
            em.clear();
            em.close();
        }
    }

    public List<Appointments> getBookedAppointments() {
        EntityManager em = emf.createEntityManager();

        try {
            StoredProcedureQuery spq = em.createStoredProcedureQuery("getBookedAppointments");

            spq.execute();

            List<Appointments> toReturn = new ArrayList();
            List<Object[]> resultList = spq.getResultList();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            for (Object[] record : resultList) {
                Appointments u = new Appointments(
                        Integer.valueOf(record[0].toString()), // appointment_id
                        Integer.valueOf(record[1].toString()), // doctor_id
                        Integer.valueOf(record[2].toString()), // patient_id
                        sdf.parse(record[3].toString()), // start_time
                        sdf.parse(record[4].toString()), // end_time
                        record[5].toString(), //status
                        record[6].toString(), // doctor_name
                        record[7].toString()); // patient_name
                toReturn.add(u);
            }
            return toReturn;

        } catch (NumberFormatException | ParseException e) {
            System.err.println("Hiba: " + e.getLocalizedMessage());
            return null;
        } finally {
            em.clear();
            em.close();
        }
    }

    public List<TimeSlotDTO> getAvailableSlots(int doctorId, String startDate, String endDate) {
        EntityManager em = emf.createEntityManager();
        List<TimeSlotDTO> slots = new ArrayList<>();

        try {
            StoredProcedureQuery spq = em.createStoredProcedureQuery("GetAvailableSlots");

            spq.registerStoredProcedureParameter("doctorIdIN", Integer.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("startDateIN", String.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("endDateIN", String.class, ParameterMode.IN);

            // Beállítjuk a paramétereket a stored procedure-hoz
            spq.setParameter("doctorIdIN", doctorId);
            spq.setParameter("startDateIN", startDate);
            spq.setParameter("endDateIN", endDate);

            spq.execute();

            List<Object[]> resultList = spq.getResultList();
            for (Object[] record : resultList) {
                TimeSlotDTO slot = new TimeSlotDTO();
                slot.setSlotStart(record[0].toString());
                slot.setSlotEnd(record[1].toString());
                slot.setDoctorId((int) record[2]);
                slots.add(slot);
            }

        } catch (Exception e) {
            System.err.println("Hiba: " + e.getLocalizedMessage());
        } finally {
            em.clear();
            em.close();
        }

        return slots;
    }

}
