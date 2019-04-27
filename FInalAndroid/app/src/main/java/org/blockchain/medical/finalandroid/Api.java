package org.blockchain.medical.finalandroid;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;


public interface Api
{
    String BASE_URL = "https://a0b397be.ngrok.io";

    @POST("/api/userLogin")
    @FormUrlEncoded
    Call<List<LoginStatus>> postLogin(@Field("username") String name,
                                      @Field("password") String password,
                                      @Field("type") String type);

    @GET("/api/listPatientRecords")
    Call<List<RecordResponse>> getRecord(@Query(value = "patientId",encoded = true) String id , @Query(value = "listType") String type );

    @GET("/api/patientKey")
    Call<List<ContentResponse>> contentKey(@Query(value = "patientid",encoded = true) String id );
}
