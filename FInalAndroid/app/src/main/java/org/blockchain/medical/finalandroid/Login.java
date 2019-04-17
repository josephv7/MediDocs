package org.blockchain.medical.finalandroid;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class Login extends AppCompatActivity {

    EditText name;
    EditText password;
    Button login;
    String loginStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        name = findViewById(R.id.name);
        password = findViewById(R.id.password);
        login = findViewById(R.id.login);

        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(name.getText().toString().equals("") || password.getText().toString().equals("")){
                    Toast.makeText(Login.this, "Enter Required Fields", Toast.LENGTH_SHORT).show();
                }else{

                    postLogin();

                }
            }
        });

    }

    void postLogin(){

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(Api.BASE_URL)
                .addConverterFactory(GsonConverterFactory.create()) //Here we are using the GsonConverterFactory to directly convert json data to object
                .build();

        Api api = retrofit.create(Api.class);

        Call<List<LoginStatus>> call = api.postLogin(name.getText().toString(),password.getText().toString(),"patient");

        call.enqueue(new Callback<List<LoginStatus>>() {
            @Override
            public void onResponse(Call<List<LoginStatus>> call, Response<List<LoginStatus>> response) {

                List<LoginStatus> docs = response.body();

                loginStatus = docs.get(0).status;
                if (loginStatus.equalsIgnoreCase("ok")){
                    Toast.makeText(Login.this, "Success", Toast.LENGTH_SHORT).show();
                }else if(loginStatus.equalsIgnoreCase("incorrect")){
                    Toast.makeText(Login.this, "Incorrect Password", Toast.LENGTH_SHORT).show();
                }else if(loginStatus.equalsIgnoreCase("error")){
                    Toast.makeText(Login.this, "Server Error", Toast.LENGTH_SHORT).show();
                }


            }

            @Override
            public void onFailure(Call<List<LoginStatus>> call, Throwable t) {

                Toast.makeText(getApplicationContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });



    }
}
