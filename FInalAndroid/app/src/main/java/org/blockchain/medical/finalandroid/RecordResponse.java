package org.blockchain.medical.finalandroid;

import com.google.gson.annotations.SerializedName;

public class RecordResponse {

    @SerializedName("$class")
    String classs;

    @SerializedName("recordId")
    String recordId;

    @SerializedName("owner")
    String owner;

    @SerializedName("value")
    String[] value;

    @SerializedName("doctorId")
    String[] doctorId;

    @SerializedName("verified")
    String verified;




}
