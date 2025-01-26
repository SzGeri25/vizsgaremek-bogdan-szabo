/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.controller;

import java.util.Set;
import javax.ws.rs.core.Application;

/**
 *
 * @author szabo
 */
@javax.ws.rs.ApplicationPath("webresources")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    /**
     * Do not modify addRestResourceClasses() method.
     * It is automatically populated with
     * all resources defined in the project.
     * If required, comment out calling this method in getClasses().
     */
    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(com.idopontfoglalo.gbmedicalbackend.controller.AppointmentController.class);
        resources.add(com.idopontfoglalo.gbmedicalbackend.controller.DoctorController.class);
        resources.add(com.idopontfoglalo.gbmedicalbackend.controller.PatientController.class);
        resources.add(com.idopontfoglalo.gbmedicalbackend.controller.ReviewController.class);
    }

}
