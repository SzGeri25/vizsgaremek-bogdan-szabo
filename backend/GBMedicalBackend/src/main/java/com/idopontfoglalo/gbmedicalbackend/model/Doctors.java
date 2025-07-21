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
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
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
import javax.persistence.EntityManagerFactory;
import javax.persistence.ParameterMode;
import javax.persistence.Persistence;
import javax.persistence.StoredProcedureQuery;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 *
 * @author szabo
 */
@Entity
@Table(name = "doctors")
@NamedQueries({
    @NamedQuery(name = "Doctors.findAll", query = "SELECT d FROM Doctors d"),
    @NamedQuery(name = "Doctors.findById", query = "SELECT d FROM Doctors d WHERE d.id = :id"),
    @NamedQuery(name = "Doctors.findByName", query = "SELECT d FROM Doctors d WHERE d.name = :name"),
    @NamedQuery(name = "Doctors.findByEmail", query = "SELECT d FROM Doctors d WHERE d.email = :email"),
    @NamedQuery(name = "Doctors.findByPhoneNumber", query = "SELECT d FROM Doctors d WHERE d.phoneNumber = :phoneNumber"),
    @NamedQuery(name = "Doctors.findByPassword", query = "SELECT d FROM Doctors d WHERE d.password = :password"),
    @NamedQuery(name = "Doctors.findByIsDeleted", query = "SELECT d FROM Doctors d WHERE d.isDeleted = :isDeleted"),
    @NamedQuery(name = "Doctors.findByCreatedAt", query = "SELECT d FROM Doctors d WHERE d.createdAt = :createdAt"),
    @NamedQuery(name = "Doctors.findByUpdatedAt", query = "SELECT d FROM Doctors d WHERE d.updatedAt = :updatedAt"),
    @NamedQuery(name = "Doctors.findByDeletedAt", query = "SELECT d FROM Doctors d WHERE d.deletedAt = :deletedAt")})
public class Doctors implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "name")
    private String name;
    @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "Invalid email")//if the field contains email address consider using this annotation to enforce field validation
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "email")
    private String email;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 15)
    @Column(name = "phone_number")
    private String phoneNumber;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "password")
    private String password;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "bio")
    private String bio;
    @Basic(optional = false)
    @NotNull
    @Column(name = "isAdmin")
    private boolean isAdmin;
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
    @JoinTable(name = "doctors_x_services", joinColumns = {
        @JoinColumn(name = "doctor_id", referencedColumnName = "id")}, inverseJoinColumns = {
        @JoinColumn(name = "service_id", referencedColumnName = "id")})
    @ManyToMany
    private Collection<Services> servicesCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "doctorId")
    private Collection<Appointments> appointmentsCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "doctorId")
    private Collection<Reviews> reviewsCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "doctorId")
    private Collection<Schedules> schedulesCollection;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "doctors_x_services",
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id"))
    private List<Services> services;

    static EntityManagerFactory emf = Persistence.createEntityManagerFactory("com.idopontfoglalo_GBMedicalBackend_war_1.0-SNAPSHOTPU");

    public Doctors() {
    }

    public Doctors(Integer id) {
        EntityManager em = emf.createEntityManager();

        try {
            Doctors d = em.find(Doctors.class, id);

            this.id = d.getId();
            this.name = d.getName();
            this.email = d.getEmail();
            this.phoneNumber = d.getPhoneNumber();
            this.password = d.getPassword();
            this.bio = d.getBio();
            this.isAdmin = d.getIsAdmin();
            this.isDeleted = d.getIsDeleted();
            this.createdAt = d.getCreatedAt();
        } catch (Exception ex) {
            System.err.println("Hiba: " + ex.getLocalizedMessage());
        } finally {
            em.clear();
            em.close();
        }
    }

    public Doctors(Integer id, String name, String email, String phoneNumber, String password, String bio, boolean isAdmin, boolean isDeleted, Date createdAt, Date updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.bio = bio;
        this.isAdmin = isAdmin;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Doctors(Integer id, String name, String email, String phoneNumber, String bio) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.bio = bio;
    }

    public Doctors(String name, String email, String phoneNumber, String password, String bio) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.bio = bio;
    }

    ;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public boolean getIsAdmin() {
        return isAdmin;
    }

    public boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
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

    public Collection<Services> getServicesCollection() {
        return servicesCollection;
    }

    public void setServicesCollection(Collection<Services> servicesCollection) {
        this.servicesCollection = servicesCollection;
    }

    public Collection<Appointments> getAppointmentsCollection() {
        return appointmentsCollection;
    }

    public void setAppointmentsCollection(Collection<Appointments> appointmentsCollection) {
        this.appointmentsCollection = appointmentsCollection;
    }

    public Collection<Reviews> getReviewsCollection() {
        return reviewsCollection;
    }

    public void setReviewsCollection(Collection<Reviews> reviewsCollection) {
        this.reviewsCollection = reviewsCollection;
    }

    public Collection<Schedules> getSchedulesCollection() {
        return schedulesCollection;
    }

    public void setSchedulesCollection(Collection<Schedules> schedulesCollection) {
        this.schedulesCollection = schedulesCollection;
    }

    public String getServiceName() {
        if (services != null && !services.isEmpty()) {
            // Ha több szolgáltatás is van, például az elsőt adjuk vissza
            return services.get(0).getName();
        }
        return "";
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
        if (!(object instanceof Doctors)) {
            return false;
        }
        Doctors other = (Doctors) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.idopontfoglalo.gbmedicalbackend.model.Doctors[ id=" + id + " ]";
    }

    public static Boolean isDoctorExists(String email) {
        EntityManager em = emf.createEntityManager();

        try {
            StoredProcedureQuery spq = em.createStoredProcedureQuery("isDoctorExists");

            spq.registerStoredProcedureParameter("emailIN", String.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("resultOUT", Boolean.class, ParameterMode.OUT);

            spq.setParameter("emailIN", email);

            spq.execute();

            Boolean result = Boolean.valueOf(spq.getOutputParameterValue("resultOUT").toString());

            return result;
        } catch (Exception e) {
            System.err.println("Hiba: " + e.getLocalizedMessage());
            return null;
        } finally {
            em.clear();
            em.close();
        }
    }

    public Boolean registerDoctor(Doctors d) {
        EntityManager em = emf.createEntityManager();

        try {
            StoredProcedureQuery spq = em.createStoredProcedureQuery("registerDoctor");

            spq.registerStoredProcedureParameter("nameIN", String.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("emailIN", String.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("phoneNumberIN", String.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("passwordIN", String.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("bioIN", String.class, ParameterMode.IN);

            spq.setParameter("nameIN", d.getName());
            spq.setParameter("emailIN", d.getEmail());
            spq.setParameter("phoneNumberIN", d.getPhoneNumber());
            spq.setParameter("passwordIN", d.getPassword());
            spq.setParameter("bioIN", d.getBio());

            spq.execute();

            return true;
        } catch (Exception e) {
            System.err.println("Hiba: " + e.getLocalizedMessage());
            return false;
        } finally {
            em.clear();
            em.close();
        }
    }

    public Doctors loginDoctor(String email, String password) {
        EntityManager em = emf.createEntityManager();

        try {
            StoredProcedureQuery spq = em.createStoredProcedureQuery("loginDoctor");

            spq.registerStoredProcedureParameter("emailIN", String.class, ParameterMode.IN);
            spq.registerStoredProcedureParameter("passwordIN", String.class, ParameterMode.IN);

            spq.setParameter("emailIN", email);
            spq.setParameter("passwordIN", password);

            spq.execute();

            List<Object[]> resultList = spq.getResultList();
            Doctors toReturn = new Doctors();
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            for (Object[] o : resultList) {
                Doctors d = new Doctors(
                        Integer.valueOf(o[0].toString()),
                        o[1].toString(),
                        o[2].toString(),
                        o[3].toString(),
                        o[4].toString(),
                        o[5].toString(),
                        Boolean.parseBoolean(o[6].toString()),
                        false, // Alapértelmezett érték az isDeleted mezőhöz
                        formatter.parse(o[8].toString()),
                        o[9] == null ? null : formatter.parse(o[9].toString())
                );

                toReturn = d;
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

    public List<Doctors> getAllDoctors() {
        EntityManager em = emf.createEntityManager();

        try {
            StoredProcedureQuery spq = em.createStoredProcedureQuery("getAllDoctors");
            spq.execute();

            List<Doctors> toReturn = new ArrayList();
            List<Object[]> resultList = spq.getResultList();
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            for (Object[] record : resultList) {
                Doctors u = new Doctors(
                        Integer.valueOf(record[0].toString()),
                        record[1].toString(),
                        record[2].toString(),
                        record[3].toString(),
                        record[4].toString()
                );

                toReturn.add(u);
            }

            return toReturn;

        } catch (Exception e) {
            System.err.println("Hiba: " + e.getLocalizedMessage());
            return null;
        } finally {
            em.clear();
            em.close();
        }
    }
}
