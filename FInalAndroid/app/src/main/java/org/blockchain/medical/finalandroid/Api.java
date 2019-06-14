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
    String BASE_URL = "https://0926241f.ngrok.io";

    @POST("/api/userLogin")
    @FormUrlEncoded
    Call<List<LoginStatus>> postLogin(@Field("username") String name,
                                      @Field("password") String password,
                                      @Field("type") String type);

    @GET("/api/listPatientRecords")
    Call<List<RecordResponse>> getRecord(@Query(value = "patientId",encoded = true) String id , @Query(value = "listType") String type );

    @GET("/api/patientKey")
    Call<List<ContentResponse>> contentKey(@Query(value = "patientid",encoded = true) String id );

    @GET("/api/patientReadRecord")
    Call<List<ViewResponse>> viewRecord(@Query(value = "recordHash",encoded = true) String recordHash );

    @GET("/recordVerification")
    Call<List<VerificationResponse>>  getVerified(@Query(value = "recordid",encoded = true) String recordid , @Query(value = "username" , encoded = true) String username);

    @GET("/api/listDoctors")
    Call<List<DoctorResponse>> getDoctors();

    @GET("/api/shareDoctor")
    Call<List<ShareDoctorResponse>> setDoctor(@Query(value = "recordid", encoded = true) String recordid , @Query(value = "doctorid",encoded = true) String doctorid);

    @GET("/api/patientRecordCount")
    Call<List<CountResponse>> getCount(@Query(value = "patientid",encoded = true) String patientid , @Query(value = "type" , encoded = true) String type);
}


