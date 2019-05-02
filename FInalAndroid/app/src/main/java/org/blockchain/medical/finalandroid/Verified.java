package org.blockchain.medical.finalandroid;

import java.util.Arrays;

public class Verified {
    private String classs, recordId, owner;
    private String[] value,doctorId;
    private String verified;

    public Verified() {
    }

    public Verified(String classs, String recordId, String owner, String[] value, String[] doctorId,String verified) {
        this.classs = classs;
        this.recordId = recordId;
        this.owner = owner;
        this.value = value;
        this.doctorId = doctorId;
        this.verified = verified;
    }

    public String getClasss() {
        return classs;
    }

//    public void setTitle(String name) {
//        this.title = name;
//    }

    public String getRecordId() {
        return recordId;
    }


    public String getOwner() {
        return owner;
    }

    public String getValuev() {
        return Arrays.toString(value);
    }

    public String getDoctorId() {
        return Arrays.toString(doctorId);
    }

    public  String getVerified(){
        return verified;
    }

}