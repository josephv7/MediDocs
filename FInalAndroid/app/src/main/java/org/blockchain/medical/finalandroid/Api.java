package org.blockchain.medical.finalandroid;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;


public interface Api
{
    String BASE_URL = "https://25130d4f.ngrok.io";

    @POST("/api/patientLogin")
    @FormUrlEncoded
    Call<List<LoginStatus>> postLogin(@Field("username") String name,
                                      @Field("password") String password,
                                      @Field("type") String type);

}
