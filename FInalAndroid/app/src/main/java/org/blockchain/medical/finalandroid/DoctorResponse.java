package org.blockchain.medical.finalandroid;

import com.google.gson.annotations.SerializedName;

public class DoctorResponse {

    @SerializedName("$class")
    String classs;

    @SerializedName("doctorId")
    String doctorId;

    @SerializedName("hospital")
    String hospital;

    @SerializedName("firstName")
    String firstName;

    @SerializedName("lastName")
    String lastName;

}
